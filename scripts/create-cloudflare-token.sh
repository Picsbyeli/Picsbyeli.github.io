#!/usr/bin/env bash
set -euo pipefail

# create-cloudflare-token.sh
# Usage: ./scripts/create-cloudflare-token.sh
# This script creates a zone-scoped Cloudflare API token for Cache Purge via Cloudflare API.
# It requires your Cloudflare account email and Global API Key for token creation.
# Optionally, if `gh` CLI is logged in and you supply --gh-repo owner/repo, the new token
# and zone id will be stored as GitHub Actions secrets automatically.

usage(){
  cat <<EOF
Usage: $0 [--gh-repo OWNER/REPO]

Prompts for: CF_EMAIL, CF_GLOBAL_KEY, ZONE_ID
Will create a token scoped to Zone.Cache Purge and print the token.
If --gh-repo is provided and you have 'gh' authenticated, the script will set
GitHub secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID for that repo.
EOF
}

GH_REPO=""
while [[ ${1:-} != "" ]]; do
  case "$1" in
    --gh-repo) GH_REPO=$2; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

read -rp "Cloudflare account email: " CF_EMAIL
read -rsp "Cloudflare Global API Key (input hidden): " CF_GLOBAL_KEY
echo
read -rp "Zone ID (for the site you want to purge): " ZONE_ID
read -rp "Token name (default: github-actions-purge-zone): " TOKEN_NAME
TOKEN_NAME=${TOKEN_NAME:-github-actions-purge-zone}

echo "Creating zone-scoped token..."

RESP=$(curl -s -X POST "https://api.cloudflare.com/client/v4/user/tokens" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_GLOBAL_KEY" \
  -H "Content-Type: application/json" \
  --data @- <<JSON
{
  "name": "${TOKEN_NAME}",
  "policies": [
    {
      "effect": "allow",
      "resources": { "com.cloudflare.api.account.zone": [ "${ZONE_ID}" ] },
      "permission_groups": [ { "name": "Zone.Cache Purge (edit)" } ]
    }
  ]
}
JSON
)

if echo "$RESP" | jq -e '.success' >/dev/null 2>&1; then
  TOKEN=$(echo "$RESP" | jq -r '.result.token')
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "\nToken created successfully."
    echo "Token (copy this now):"
    echo "$TOKEN"
    if [ -n "$GH_REPO" ]; then
      if command -v gh >/dev/null 2>&1; then
        read -rp "Set GitHub secret CLOUDFLARE_API_TOKEN for $GH_REPO? (y/N): " yn
        if [[ "$yn" =~ ^[Yy]$ ]]; then
          printf "%s" "$TOKEN" | gh secret set CLOUDFLARE_API_TOKEN --repo "$GH_REPO"
          gh secret set CLOUDFLARE_ZONE_ID --body "$ZONE_ID" --repo "$GH_REPO"
          echo "Secrets set in GitHub repo $GH_REPO"
        fi
      else
        echo "gh CLI not found; install and authenticate to use automatic secret set."
      fi
    fi
  else
    echo "Token creation response did not include a token. Response:" >&2
    echo "$RESP" >&2
    exit 1
  fi
else
  echo "Cloudflare API reported failure:" >&2
  echo "$RESP" | jq >&2
  exit 1
fi
