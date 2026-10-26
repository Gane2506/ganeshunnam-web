#!/usr/bin/env bash
# One-time setup for a server where Nginx Proxy Manager (Docker) already owns ports 80/443, like the Contabo box.
# Use bootstrap.sh instead on an empty server. Safe to re-run. Installs no system nginx and touches no other site.
#
#   scp -r deploy root@SERVER:/root/gu-deploy
#   ssh root@SERVER 'bash /root/gu-deploy/server/bootstrap-npm.sh --deploy-key "ssh-ed25519 AAAA... github-actions"'
#
# --network NAME   Docker network NPM is on (default: web)
#
# Afterwards add a proxy host in NPM: ganeshunnam.com + www.ganeshunnam.com → http://ganeshunnam-web:80 (docs/GO-LIVE.md).
set -euo pipefail

KEY=""
NETWORK=web
while [ $# -gt 0 ]; do
  case "$1" in
    --deploy-key) KEY="$2"; shift 2 ;;
    --network) NETWORK="$2"; shift 2 ;;
    *) echo "unknown option $1" >&2; exit 2 ;;
  esac
done
[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
[ -n "$KEY" ] || { echo "--deploy-key '<public key>' is required" >&2; exit 2; }
command -v docker >/dev/null || { echo "docker is not installed" >&2; exit 1; }
docker network inspect "$NETWORK" >/dev/null 2>&1 || { echo "docker network '$NETWORK' not found (see --network)" >&2; exit 1; }

HERE="$(cd "$(dirname "$0")/.." && pwd)"   # the copied deploy/ folder
BASE=/var/www/ganeshunnam
APP=/opt/ganeshunnam
say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

say "Packages"
command -v rsync >/dev/null || { export DEBIAN_FRONTEND=noninteractive; apt-get update -qq; apt-get install -y -qq rsync >/dev/null; }

say "Deploy user and release folders"
id deploy >/dev/null 2>&1 || useradd --create-home --shell /bin/bash deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
grep -qxF "$KEY" /home/deploy/.ssh/authorized_keys || echo "$KEY" >> /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys
install -d -m 755 -o deploy -g deploy "$BASE" "$BASE/releases"
if [ ! -e "$BASE/current" ]; then
  # placeholder until the first GitHub deploy lands
  install -d -o deploy -g deploy "$BASE/releases/placeholder"
  echo '<!doctype html><meta charset="utf-8"><title>Ganesh Unnam</title><p style="font:16px system-ui;padding:2rem">Deploying…</p>' > "$BASE/releases/placeholder/index.html"
  cp "$BASE/releases/placeholder/index.html" "$BASE/releases/placeholder/404.html"
  chown -R deploy:deploy "$BASE/releases/placeholder"
  ln -sfn releases/placeholder "$BASE/current"
  chown -h deploy:deploy "$BASE/current"
fi

say "Site container ($APP)"
install -d "$APP"
sed "s/^    external: true .*/    external: true/; s/^  web:$/  $NETWORK:/; s/^      - web$/      - $NETWORK/" \
  "$HERE/docker/compose.yml" > "$APP/compose.yml"
install -m 644 "$HERE/docker/site.conf" "$APP/site.conf"
docker compose -f "$APP/compose.yml" up -d
docker exec ganeshunnam-web nginx -t
docker exec ganeshunnam-web nginx -s reload   # picks up a changed site.conf on re-runs

say "Check"
for i in 1 2 3 4 5; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: ganeshunnam.com' http://127.0.0.1:8088/ || true)
  [ "$code" = 200 ] && break; sleep 2
done
echo "http://127.0.0.1:8088/ → $code"
[ "$code" = 200 ] || { echo "site container is not answering" >&2; exit 1; }

say "Done. Next: add the NPM proxy host, then these to GitHub → Settings → Environments → production:"
cat <<OUT
  DEPLOY_HOST         $(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
  DEPLOY_USER         deploy
  DEPLOY_PATH         $BASE
  DEPLOY_SSH_KEY      (the private half of the key you passed with --deploy-key)
  DEPLOY_KNOWN_HOSTS  (paste the lines below)
$(ssh-keyscan -t ed25519 localhost 2>/dev/null | sed "s/^localhost/$(curl -fsS -4 https://ifconfig.me 2>/dev/null || echo SERVER_IP)/")
OUT
