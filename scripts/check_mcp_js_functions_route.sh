#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${OFAPI_BASE_URL:-http://localhost:3000}"
MCP_PATH="${OFAPI_MCP_PATH:-/api/system/mcp/server/prd}"
NEW_ROUTE_PATH="${OFAPI_NEW_ROUTE_PATH:-/api/system/system/handler/js/functions/prd}"
OLD_ROUTE_PATH="${OFAPI_OLD_ROUTE_PATH:-/api/system/system/handler/js/funtions/prd}"

# Auth can be supplied either as a full header value (recommended) or raw token.
# OFAPI_AUTH_HEADER example: Bearer OFAPI_KEY@...
AUTH_HEADER="${OFAPI_AUTH_HEADER:-}"
RAW_TOKEN="${OFAPI_TOKEN:-}"

if [[ -z "$AUTH_HEADER" && -n "$RAW_TOKEN" ]]; then
  AUTH_HEADER="Bearer ${RAW_TOKEN}"
fi

if [[ -z "$AUTH_HEADER" ]]; then
  cat <<'USAGE'
Usage:
  OFAPI_AUTH_HEADER='Bearer <token>' ./scripts/check_mcp_js_functions_route.sh

Optional env vars:
  OFAPI_BASE_URL       (default: http://localhost:3000)
  OFAPI_MCP_PATH       (default: /api/system/mcp/server/prd)
  OFAPI_NEW_ROUTE_PATH (default: /api/system/system/handler/js/functions/prd)
  OFAPI_OLD_ROUTE_PATH (default: /api/system/system/handler/js/funtions/prd)

Alternative auth input:
  OFAPI_TOKEN='<token_without_bearer_prefix>'
USAGE
  exit 2
fi

tmp_doc="$(mktemp)"
trap 'rm -f "$tmp_doc"' EXIT

echo "Running MCP route validation against ${BASE_URL}"

# Check 1: MCP docs should include new path and avoid old typo path.
curl -sS "${BASE_URL}${MCP_PATH}" \
  -H "Authorization: ${AUTH_HEADER}" > "$tmp_doc"

has_tool=0
has_new_path=0
has_old_path=0

grep -q "available_functions_modules" "$tmp_doc" && has_tool=1 || true
grep -q "/api/system/system/handler/js/functions/prd" "$tmp_doc" && has_new_path=1 || true
grep -q "/api/system/system/handler/js/funtions/prd" "$tmp_doc" && has_old_path=1 || true

check1_pass=0
if [[ $has_tool -eq 1 && $has_new_path -eq 1 && $has_old_path -eq 0 ]]; then
  check1_pass=1
fi

# Check 2: corrected route must return 200.
status_new="$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: ${AUTH_HEADER}" \
  "${BASE_URL}${NEW_ROUTE_PATH}")"

check2_pass=0
if [[ "$status_new" == "200" ]]; then
  check2_pass=1
fi

# Check 3: legacy typo route should return 404.
status_old="$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: ${AUTH_HEADER}" \
  "${BASE_URL}${OLD_ROUTE_PATH}")"

check3_pass=0
if [[ "$status_old" == "404" ]]; then
  check3_pass=1
fi

print_result() {
  local name="$1"
  local pass="$2"
  local detail="$3"
  if [[ "$pass" -eq 1 ]]; then
    echo "[PASS] ${name} -> ${detail}"
  else
    echo "[FAIL] ${name} -> ${detail}"
  fi
}

print_result "Docs export" "$check1_pass" "tool=${has_tool}, new_path=${has_new_path}, old_path=${has_old_path}"
print_result "New route" "$check2_pass" "HTTP ${status_new} (expected 200)"
print_result "Legacy route" "$check3_pass" "HTTP ${status_old} (expected 404)"

if [[ $check1_pass -eq 1 && $check2_pass -eq 1 && $check3_pass -eq 1 ]]; then
  echo "Overall: PASS"
  exit 0
fi

echo "Overall: FAIL"
exit 1
