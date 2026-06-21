#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHECK="$ROOT/scripts/check-agent-suppressions.sh"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

bad="$tmpdir/bad.ts"
good="$tmpdir/good.ts"
echo '// @ts-expect-error nope' >"$bad"
echo 'export const ok = 1;' >"$good"

if "$CHECK" "$good"; then
  :
else
  echo "expected good file to pass"
  exit 1
fi

if "$CHECK" "$bad"; then
  echo "expected bad file to fail"
  exit 1
fi

if "$CHECK" "$ROOT/apps/web/src/routeTree.gen.ts"; then
  :
else
  echo "expected allowlisted routeTree.gen.ts to pass"
  exit 1
fi

echo "check-agent-suppressions: ok"
