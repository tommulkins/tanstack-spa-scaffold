#!/usr/bin/env bash
set -euo pipefail
input="$(cat)"
if echo "$input" | grep -q 'routeTree\.gen\.ts'; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi
if echo "$input" | grep -qE 'docs/|\.md"|hooks-protocol|hooks\.json'; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi
if ! echo "$input" | grep -qE '\.(ts|tsx|js|jsx|mjs|cjs)"'; then
  printf '%s\n' '{"permission":"allow"}'
  exit 0
fi
if echo "$input" | grep -qE '@ts-expect-error|@ts-ignore|@ts-nocheck|eslint-disable'; then
  printf '%s\n' '{"permission":"deny","user_message":"Suppression banned in source.","agent_message":"Fix the type or lint error. See docs/hooks-protocol.md."}'
  exit 0
fi
printf '%s\n' '{"permission":"allow"}'
exit 0
