#!/usr/bin/env bash
# One-time setup of the Contabo (or any Ubuntu/Debian) server for ganeshunnam.com.
# Safe to re-run. After this, every push to main deploys through GitHub Actions (.github/workflows/deploy.yml).
#
#   scp -r deploy root@SERVER:/root/gu-deploy
#   ssh root@SERVER 'bash /root/gu-deploy/server/bootstrap.sh --tls letsencrypt --email you@example.com \
#        --deploy-key "ssh-ed25519 AAAA... github-actions"'
#
# --tls letsencrypt  certificate from Let's Encrypt; DNS for the domain and www must already point at this server
# --tls cloudflare   Cloudflare proxied DNS + Origin CA certificate already saved in /etc/ssl/cloudflare/
#                    (see deploy/cloudflare/README.md); the origin will only accept Cloudflare's IPs
# --replace          take over ganeshunnam.com even if another enabled nginx site already serves it
set -euo pipefail

DOMAIN=ganeshunnam.com
TLS=""
EMAIL=""
KEY=""
REPLACE=0
WITH_CMS=0
while [ $# -gt 0 ]; do
  case "$1" in
    --tls) TLS="$2"; shift 2 ;;
    --email) EMAIL="$2"; shift 2 ;;
    --deploy-key) KEY="$2"; shift 2 ;;
    --replace) REPLACE=1; shift ;;
    --with-cms) WITH_CMS=1; shift ;;
    *) echo "unknown option $1" >&2; exit 2 ;;
  esac
done
[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
[ "$TLS" = letsencrypt ] || [ "$TLS" = cloudflare ] || { echo "--tls letsencrypt|cloudflare is required" >&2; exit 2; }
[ -n "$KEY" ] || { echo "--deploy-key '<public key>' is required" >&2; exit 2; }
[ "$TLS" = cloudflare ] || [ -n "$EMAIL" ] || { echo "--email is required for Let's Encrypt" >&2; exit 2; }

HERE="$(cd "$(dirname "$0")/.." && pwd)"   # the copied deploy/ folder
BASE=/var/www/ganeshunnam
say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

say "Packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx rsync curl >/dev/null
[ "$TLS" = letsencrypt ] && apt-get install -y -qq certbot >/dev/null

say "Conflicts"
others=$(grep -lE "server_name[^;]*\b${DOMAIN//./\\.}\b" /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf 2>/dev/null | grep -v 'ganeshunnam.conf$' || true)
if [ -n "$others" ]; then
  echo "These enabled nginx files already serve $DOMAIN:"; echo "$others"
  if [ "$REPLACE" = 1 ]; then
    for f in $others; do mv "$f" "$f.disabled-by-ganeshunnam"; echo "disabled $f"; done
  else
    echo "Re-run with --replace to disable them (the old site stops being served)." >&2; exit 1
  fi
fi

say "Deploy user and release folders"
id deploy >/dev/null 2>&1 || useradd --create-home --shell /bin/bash deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
grep -qxF "$KEY" /home/deploy/.ssh/authorized_keys || echo "$KEY" >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys
install -d -o deploy -g deploy "$BASE" "$BASE/releases"
install -d /var/www/letsencrypt
if [ ! -e "$BASE/current" ]; then
  # placeholder until the first GitHub deploy lands
  install -d -o deploy -g deploy "$BASE/releases/placeholder"
  echo '<!doctype html><meta charset="utf-8"><title>Ganesh Unnam</title><p style="font:16px system-ui;padding:2rem">Deploying…</p>' > "$BASE/releases/placeholder/index.html"
  cp "$BASE/releases/placeholder/index.html" "$BASE/releases/placeholder/404.html"
  chown -R deploy:deploy "$BASE/releases/placeholder"
  ln -sfn releases/placeholder "$BASE/current"
  chown -h deploy:deploy "$BASE/current"
fi

# nginx compatibility: http2 directive (>= 1.25.1) and IPv6 listeners
adapt() {
  local f="$1" v
  v=$(nginx -v 2>&1 | sed -E 's/.*nginx\/([0-9.]+).*/\1/')
  if [ "$(printf '%s\n1.25.1\n' "$v" | sort -V | head -1)" != "1.25.1" ]; then
    sed -i -E '/^\s*http2 on;/d; s/listen (\[::\]:)?443 ssl;/listen \1443 ssl http2;/' "$f"
  fi
  [ -f /proc/net/if_inet6 ] || sed -i -E '/listen \[::\]/d' "$f"
}

CONF=/etc/nginx/sites-available/ganeshunnam.conf
if [ "$TLS" = cloudflare ]; then
  say "Cloudflare mode"
  [ -s /etc/ssl/cloudflare/$DOMAIN.pem ] && [ -s /etc/ssl/cloudflare/$DOMAIN.key ] || {
    echo "Save the Cloudflare Origin CA certificate to /etc/ssl/cloudflare/$DOMAIN.pem and .key first." >&2; exit 1; }
  install -m 755 "$HERE/cloudflare/update-ips.sh" /usr/local/bin/cloudflare-update-ips.sh
  install -m 644 "$HERE/cloudflare/cloudflare-realip.conf" /etc/nginx/snippets/cloudflare-realip.conf
  install -m 644 "$HERE/cloudflare/cloudflare-allow.conf" /etc/nginx/snippets/cloudflare-allow.conf
  echo '17 4 * * 1 root /usr/local/bin/cloudflare-update-ips.sh >/dev/null' > /etc/cron.d/cloudflare-ips
  cp "$HERE/nginx/ganeshunnam.conf" "$CONF"
else
  say "Let's Encrypt certificate for $DOMAIN and www.$DOMAIN"
  if [ ! -s /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
    # temporary HTTP-only site so the ACME challenge can be answered
    cat > "$CONF" <<NGX
server { listen 80; server_name $DOMAIN www.$DOMAIN; location /.well-known/acme-challenge/ { root /var/www/letsencrypt; } location / { return 404; } }
NGX
    ln -sfn "$CONF" /etc/nginx/sites-enabled/ganeshunnam.conf
    nginx -t && systemctl reload nginx
    certbot certonly --webroot -w /var/www/letsencrypt -d "$DOMAIN" -d "www.$DOMAIN" \
      --email "$EMAIL" --agree-tos -n --deploy-hook "systemctl reload nginx"
  fi
  # same config, Let's Encrypt paths, no Cloudflare snippets
  sed -e '/include snippets\/cloudflare-/d' \
      -e "s#/etc/ssl/cloudflare/$DOMAIN.pem#/etc/letsencrypt/live/$DOMAIN/fullchain.pem#" \
      -e "s#/etc/ssl/cloudflare/$DOMAIN.key#/etc/letsencrypt/live/$DOMAIN/privkey.pem#" \
      "$HERE/nginx/ganeshunnam.conf" > "$CONF"
fi
adapt "$CONF"
ln -sfn "$CONF" /etc/nginx/sites-enabled/ganeshunnam.conf

if [ "$WITH_CMS" = 1 ]; then
  say "CMS site (cms.$DOMAIN)"
  CMS=/etc/nginx/sites-available/cms.ganeshunnam.conf
  if [ "$TLS" = cloudflare ]; then cp "$HERE/nginx/cms.ganeshunnam.conf" "$CMS"; else
    [ -s /etc/letsencrypt/live/cms.$DOMAIN/fullchain.pem ] || certbot certonly --webroot -w /var/www/letsencrypt -d "cms.$DOMAIN" \
      --email "$EMAIL" --agree-tos -n --deploy-hook "systemctl reload nginx"
    sed -e '/include snippets\/cloudflare-/d' \
        -e "s#/etc/ssl/cloudflare/$DOMAIN.pem#/etc/letsencrypt/live/cms.$DOMAIN/fullchain.pem#" \
        -e "s#/etc/ssl/cloudflare/$DOMAIN.key#/etc/letsencrypt/live/cms.$DOMAIN/privkey.pem#" \
        "$HERE/nginx/cms.ganeshunnam.conf" > "$CMS"
  fi
  adapt "$CMS"
  ln -sfn "$CMS" /etc/nginx/sites-enabled/cms.ganeshunnam.conf
fi

say "Reload nginx"
nginx -t
systemctl reload nginx

say "Done. Add these to GitHub → Settings → Environments → production:"
cat <<OUT
  DEPLOY_HOST         $(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
  DEPLOY_USER         deploy
  DEPLOY_PATH         $BASE
  DEPLOY_SSH_KEY      (the private half of the key you passed with --deploy-key)
  DEPLOY_KNOWN_HOSTS  (paste the lines below)
$(ssh-keyscan -t ed25519 localhost 2>/dev/null | sed "s/^localhost/$(curl -fsS -4 https://ifconfig.me 2>/dev/null || echo SERVER_IP)/")
OUT
