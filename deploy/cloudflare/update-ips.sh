#!/usr/bin/env bash
# Regenerates the two Nginx snippets that depend on Cloudflare's edge IP ranges:
#   /etc/nginx/snippets/cloudflare-realip.conf : restore the visitor IP from CF-Connecting-IP
#   /etc/nginx/snippets/cloudflare-allow.conf  : only Cloudflare may reach the origin on 443
# Run once at setup, then weekly from cron:
#   17 4 * * 1  root  /usr/local/bin/cloudflare-update-ips.sh
set -euo pipefail

DIR=/etc/nginx/snippets
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

curl -fsS --retry 3 https://www.cloudflare.com/ips-v4 -o "$tmp/v4"
curl -fsS --retry 3 https://www.cloudflare.com/ips-v6 -o "$tmp/v6"
# refuse to write an empty allow-list (that would take the site offline)
[ "$(cat "$tmp/v4" "$tmp/v6" | grep -c /)" -ge 10 ] || { echo "IP list looks wrong; keeping current snippets" >&2; exit 1; }

{
  echo "# generated $(date -u +%FT%TZ) by cloudflare-update-ips.sh"
  for ip in $(cat "$tmp/v4" "$tmp/v6"); do echo "set_real_ip_from $ip;"; done
  echo "real_ip_header CF-Connecting-IP;"
} > "$tmp/realip.conf"

{
  echo "# generated $(date -u +%FT%TZ) by cloudflare-update-ips.sh"
  for ip in $(cat "$tmp/v4" "$tmp/v6"); do echo "allow $ip;"; done
  echo "allow 127.0.0.1;"
  echo "deny all;"
} > "$tmp/allow.conf"

install -m 644 "$tmp/realip.conf" "$DIR/cloudflare-realip.conf"
install -m 644 "$tmp/allow.conf" "$DIR/cloudflare-allow.conf"
nginx -t && systemctl reload nginx
echo "Cloudflare IP snippets updated."
