#!/usr/bin/env bash
# Fail if TypeScript/ESLint suppressions appear in source files.
# Agents use these to fake green gates — fix the underlying issue instead.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ALLOWLIST=(
  'apps/web/src/routeTree.gen.ts'
)

is_allowlisted() {
  local file="$1"
  local rel="${file#"$ROOT"/}"
  rel="${rel#./}"
  local allowed
  for allowed in "${ALLOWLIST[@]}"; do
    if [[ "$rel" == "$allowed" ]]; then
      return 0
    fi
  done
  return 1
}

is_source_file() {
  local file="$1"
  case "$file" in
    *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs) return 0 ;;
    *) return 1 ;;
  esac
}

check_file() {
  local file="$1"
  is_source_file "$file" || return 0
  is_allowlisted "$file" && return 0
  [[ -f "$file" ]] || return 0

  local hits
  hits="$(
    grep -nE '@ts-expect-error|@ts-ignore|@ts-nocheck|eslint-disable' "$file" 2>/dev/null || true
  )"
  if [[ -n "$hits" ]]; then
    echo "Agent suppression banned in $file:"
    echo "$hits"
    echo ""
    echo "Fix the type or lint issue — do not add @ts-expect-error, @ts-ignore, @ts-nocheck, or eslint-disable."
    echo "See docs/hooks-protocol.md"
    return 1
  fi
  return 0
}

collect_files() {
  if [[ "${1:-}" == '--staged' ]]; then
    git diff --cached --name-only --diff-filter=ACMR
    return
  fi
  if [[ "${1:-}" == '--repo' ]]; then
    git ls-files '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs'
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

  if [[ "$failed" -ne 0 ]]; then
    exit 1
  fi
}

main "$@"
