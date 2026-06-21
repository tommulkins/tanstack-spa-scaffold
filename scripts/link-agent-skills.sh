#!/usr/bin/env sh
# Link harness skill dirs to canonical .agents/skills (see WORKFLOW.md carry-forward).
set -eu

root="$(cd "$(dirname "$0")/.." && pwd)"
target="$root/.agents/skills"

for dir in .cursor .claude; do
  mkdir -p "$root/$dir"
  ln -sfn ../.agents/skills "$root/$dir/skills"
  echo "Linked $dir/skills → .agents/skills"
done
