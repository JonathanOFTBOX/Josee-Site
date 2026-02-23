# Deployment Workflow

## Branch Strategy
- Work on `develop` branch locally
- **Only push to `main` for production** — no separate dev pushes needed
- Cloudflare auto-deploys from `main`

## Rules
1. Make all code changes on `develop` branch
2. When ready to deploy: merge develop → main, push main
3. Do NOT push develop separately — it wastes time
4. Always bump version before pushing

## Deploy Commands (production only)
```bash
git add -A
git commit -m "fix: description (vX.X.X.XXX)"
git checkout main
git merge develop
git push origin main
git checkout develop
```
