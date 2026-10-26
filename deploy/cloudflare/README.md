# Cloudflare in front of ganeshunnam.com

Cloudflare handles DNS, TLS at the edge, caching, the WAF, and login protection for wp-admin. The server
only accepts traffic that comes through Cloudflare.

```
visitor ──HTTPS──▶ Cloudflare edge (cache, WAF, Access) ──HTTPS (Origin CA)──▶ Nginx on your server
GitHub Actions ──SSH──▶ origin IP / ssh.ganeshunnam.com (DNS-only)
```

## 1. Add the zone

1. Cloudflare dashboard → **Add a domain** → `ganeshunnam.com` → Free plan is enough.
2. At your registrar, replace the nameservers with the two Cloudflare gives you. Wait for "Active".

## 2. DNS records

| Type | Name                                 | Content     | Proxy               | Why                               |
| ---- | ------------------------------------ | ----------- | ------------------- | --------------------------------- |
| A    | `@`                                  | server IPv4 | Proxied (orange)    | the site                          |
| A    | `www`                                | server IPv4 | Proxied             | redirected to apex by Nginx       |
| A    | `cms`                                | server IPv4 | Proxied             | WordPress (Access protects admin) |
| A    | `ssh`                                | server IPv4 | **DNS only** (grey) | `DEPLOY_HOST` for GitHub Actions  |
| AAAA | same as above if the server has IPv6 |

Keep any existing MX/TXT (email) records exactly as they are.

## 3. TLS (SSL/TLS menu)

1. **Overview** → encryption mode **Full (strict)**.
2. **Origin Server** → **Create certificate** → hostnames `ganeshunnam.com, *.ganeshunnam.com`, RSA, 15 years.
   On the server:
   ```bash
   sudo install -d -m 700 /etc/ssl/cloudflare
   sudo nano /etc/ssl/cloudflare/ganeshunnam.com.pem   # paste "Origin Certificate"
   sudo nano /etc/ssl/cloudflare/ganeshunnam.com.key   # paste "Private key"
   sudo chmod 600 /etc/ssl/cloudflare/ganeshunnam.com.key
   ```
3. **Edge Certificates** → Always Use HTTPS **on**, Minimum TLS **1.2**, TLS 1.3 **on**,
   HSTS: leave it off until the site has been live and stable for a week, then enable it with `includeSubDomains`.
4. Optional, strongest lock-down: **Origin Server** → **Authenticated Origin Pulls** on, download the CA to
   `/etc/ssl/cloudflare/authenticated_origin_pull_ca.pem`, and uncomment the two `ssl_*client*` lines in
   `deploy/nginx/ganeshunnam.conf`.

## 4. Lock the origin to Cloudflare and restore real IPs

```bash
sudo cp deploy/cloudflare/update-ips.sh /usr/local/bin/cloudflare-update-ips.sh
sudo /usr/local/bin/cloudflare-update-ips.sh                   # writes the two snippets, reloads nginx
echo '17 4 * * 1 root /usr/local/bin/cloudflare-update-ips.sh' | sudo tee /etc/cron.d/cloudflare-ips
```

Then also close 80/443 to everyone except Cloudflare at the firewall if your provider has one. Leave SSH open
(or limited to your IP plus GitHub Actions' ranges).

## 5. Speed settings

| Where                     | Setting                                    | Value                                                          |
| ------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Speed → Optimization      | Brotli, Early Hints, HTTP/2, HTTP/3 (QUIC) | On                                                             |
| Speed → Optimization      | **Rocket Loader**                          | **Off** (rewrites `type="module"` scripts and breaks the site) |
| Speed → Optimization      | Auto Minify / Mirage / Polish              | Off (Vite already minifies; images are WebP)                   |
| Scrape Shield             | **Email Address Obfuscation**              | **Off** (rewrites the copy-email button and injects a script)  |
| Analytics → Web Analytics | Automatic setup                            | Off (the privacy page promises no analytics)                   |
| Caching → Configuration   | Browser Cache TTL                          | Respect Existing Headers                                       |

**Cache rule** (Caching → Cache Rules → Create), to serve HTML from the edge:

- If: `Hostname equals ganeshunnam.com`
- Then: **Eligible for cache**. Edge TTL: **ignore cache-control, 1 day**. Browser TTL: **respect origin**.

Browsers still revalidate HTML every visit (`no-cache` from Nginx), but Cloudflare answers from the nearest
data centre. The deploy workflow purges the cache on every release, so new content shows within seconds.

## 6. Protect WordPress admin with Cloudflare Access (free, up to 50 users)

Zero Trust → Access → Applications → **Add → Self-hosted**:

- Application domain: `cms.ganeshunnam.com`, paths `/wp-admin` and `/wp-login.php` (two entries)
- Policy: **Allow**, Include → Emails → `gane2506@gmail.com`
- Login method: One-time PIN (email) or Google

Leave `/wp-json/*` public. GitHub Actions reads published case studies there at build time, and published
posts are already public. Admin-only REST routes still need a WordPress login.

**WAF** → Custom rules → **Skip** (all remaining custom rules, Bot Fight Mode, Super Bot Fight Mode) when
`Hostname eq "cms.ganeshunnam.com" and starts_with(http.request.uri.path, "/wp-json/wp/v2/casestudy")`.
Without this, a bot challenge can block the GitHub Actions build.

## 7. GitHub secrets for the deploy

| Secret                 | Value                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- |
| `DEPLOY_HOST`          | `ssh.ganeshunnam.com` (the DNS-only record) or the raw server IP                 |
| `CLOUDFLARE_ZONE_ID`   | Zone overview page, right sidebar                                                |
| `CLOUDFLARE_API_TOKEN` | My Profile → API Tokens → Custom: **Zone → Cache Purge → Purge**, this zone only |

## Check it

```bash
curl -sI https://ganeshunnam.com | grep -iE 'server|cf-cache-status|cache-control'
# server: cloudflare, cf-cache-status: HIT (after the second request, with the cache rule)
curl -sk --resolve ganeshunnam.com:443:<origin-ip> https://ganeshunnam.com -o /dev/null -w '%{http_code}\n'
# 403 from anywhere but Cloudflare means the origin lock works
```
