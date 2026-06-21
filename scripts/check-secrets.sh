#!/usr/bin/env bash
# Fail if likely secrets appear in staged source files.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PATTERNS=(
  'BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY'
  'ghp_[A-Za-z0-9]{20,}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'AKIA[0-9A-Z]{16}'
  'sk-[A-Za-z0-9]{20,}'
)

is_allowlisted() {
  local file="$1"
  local rel="${file#"$ROOT"/}"
  rel="${rel#./}"
  case "$rel" in
    .env.example | docs/* | *.md | pnpm-lock.yaml) return 0 ;;
    *) return 1 ;;
  esac
}

check_file() {
  local file="$1"
  is_allowlisted "$file" && return 0
  [[ -f "$file" ]] || return 0

  local pattern hits
  for pattern in "${PATTERNS[@]}"; do
    hits="$(grep -nE "$pattern" "$file" 2>/dev/null || true)"
    if [[ -n "$hits" ]]; then
      echo "Possible secret in $file (pattern: $pattern):"
      echo "$hits"
      echo ""
      return 1
    fi
  done
  return 0
}

collect_files() {
  if [[ "${1:-}" == '--staged' ]]; then
    git diff --cached --name-only --diff-filter=ACMR
    return
  fi
  if [[ "${1:-}" == '--repo' ]]; then
    git ls-files
    return
  fi
  printf '%s\n' "$@"
}

main() {
  local failed=0
  local file
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    if [[ "$file" != /* ]]; then
      file="$ROOT/$file"
    fi
    if ! check_file "$file"; then
      failed=1
    fi
  done < <(collect_files "${@}")

  if git diff --cached --name-only | grep -qE '^\.env(\.|$)|\.env\.local$'; then
    echo "Refusing to commit .env files — use .env.example for templates."
    failed=1
  fi

  if [[ "$failed" -ne 0 ]]; then
    echo "See docs/security-protocol.md"
    exit 1
  fi
}

main "$@"
