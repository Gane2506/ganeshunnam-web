# Go live on the Contabo server

About 20 minutes. Afterwards every push to `main` (and every WordPress publish) deploys on its own.

You need: SSH access to the server as root, the domain's DNS, and this repo on GitHub (`Gane2506/ganeshunnam-web`).
WordPress is not needed to launch; builds use the seed case studies until `WP_API_URL` is set.

## 1. Make a deploy key (on your computer)

```bash
ssh-keygen -t ed25519 -f gu_deploy -N "" -C "github-actions@ganeshunnam.com"
```

`gu_deploy.pub` goes to the server (step 3); `gu_deploy` (private) goes to GitHub (step 4).

## 2. Point DNS at the server

Pick one:

- **Let's Encrypt (simplest):** at your DNS host, set `A @` and `A www` to the Contabo IP (and `AAAA` if the
  server has IPv6). Wait until `dig +short ganeshunnam.com` shows the IP.
- **Cloudflare:** follow `deploy/cloudflare/README.md` steps 1–3 (zone, proxied records, Origin CA certificate
  saved on the server). Add a DNS-only `A ssh` record for deploys.

If the current ganeshunnam.com already runs on this server, the script stops and lists the nginx file that
serves it. Re-run with `--replace` to switch it off. The script disables it but doesn't delete it.

## 3. Prepare the server (once)

**Server already running Nginx Proxy Manager (the Contabo box):** don't use `bootstrap.sh`, its nginx would fight NPM
for ports 80/443. Use `bootstrap-npm.sh` instead. It installs no system nginx and leaves other sites alone. It
creates the `deploy` user and `/var/www/ganeshunnam`, then runs the site in a small `nginx:alpine` container
(`ganeshunnam-web`, config in `deploy/docker/`) on NPM's `web` network:

```bash
scp -r deploy root@SERVER_IP:/root/gu-deploy
ssh root@SERVER_IP "bash /root/gu-deploy/server/bootstrap-npm.sh --deploy-key '$(cat gu_deploy.pub)'"
```

Then in NPM → Hosts → Proxy Hosts → Add: domains `ganeshunnam.com`, `www.ganeshunnam.com`; scheme `http`,
forward host `ganeshunnam-web`, port `80`; Block Common Exploits on. SSL tab: request a Let's Encrypt certificate,
Force SSL, HTTP/2. The certificate can only be issued once DNS (step 2) points at the server. The container
handles www → apex, caching and security headers itself. Skip Cloudflare's Origin CA steps in this setup.

**Empty server:**

```bash
scp -r deploy root@SERVER_IP:/root/gu-deploy
ssh root@SERVER_IP
bash /root/gu-deploy/server/bootstrap.sh --tls letsencrypt --email gane2506@gmail.com \
  --deploy-key "$(cat gu_deploy.pub)"   # paste the .pub contents if you're already on the server
# or: --tls cloudflare   (no --email needed)
```

It installs nginx and rsync (plus certbot for Let's Encrypt), creates an unprivileged `deploy` user (no sudo) that owns
`/var/www/ganeshunnam`, gets the certificate, installs `deploy/nginx/ganeshunnam.conf`, puts up a "Deploying…"
placeholder, and prints the values for step 4. Safe to re-run.

## 4. GitHub settings

Repo → Settings → Environments → **production**:

| Kind     | Name                                         | Value                                                               |
| -------- | -------------------------------------------- | ------------------------------------------------------------------- |
| Secret   | `DEPLOY_HOST`                                | server IP (or `ssh.ganeshunnam.com` with Cloudflare)                |
| Secret   | `DEPLOY_USER`                                | `deploy`                                                            |
| Secret   | `DEPLOY_PATH`                                | `/var/www/ganeshunnam`                                              |
| Secret   | `DEPLOY_SSH_KEY`                             | contents of `gu_deploy` (private key)                               |
| Secret   | `DEPLOY_KNOWN_HOSTS`                         | the line the script printed (or `ssh-keyscan -t ed25519 SERVER_IP`) |
| Secret   | `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN` | only with Cloudflare                                                |
| Variable | `WP_API_URL`                                 | only once WordPress is live                                         |

## 5. Deploy

Push to `main`, or Actions → Deploy → Run workflow. The run builds, uploads to `releases/<sha>-<run>/`, swaps
the `current` symlink and checks that the server itself serves the new `index.html`. The public check only warns,
so deploys work before DNS moves.

Check: `curl -sI https://ganeshunnam.com | head -1` shows `200`, and the site shows the new hero.

**Roll back:** `ssh deploy@SERVER_IP 'cd /var/www/ganeshunnam && ls releases'`, then
`ln -sfn releases/<older> current` (instant, no rebuild).

**After a week of stable running:** raise `Strict-Transport-Security` in the nginx file from `max-age=86400` to
`31536000`, and turn on HSTS in Cloudflare if you use it.
