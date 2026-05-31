#!/usr/bin/env bash
# code-refiner — opt-in proactive nudge.
#
# Fires after Write/Edit/MultiEdit. SILENT by default: does nothing unless
# CODE_REFINER_AUTO is set to a non-empty value. When enabled, it only
# *suggests* running /refine on the edited source file — it never reads,
# rewrites, or touches your code. Safe autonomous channel, zero surprises.
set -eu

# Opt-in gate. Default behavior is to do nothing at all.
if [ -z "${CODE_REFINER_AUTO:-}" ]; then
  exit 0
fi

# The PostToolUse payload arrives as JSON on stdin.
payload="$(cat)"

# Best-effort, dependency-free extraction of the edited file path.
file_path="$(printf '%s' "$payload" \
  | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -n1 \
  | sed -E 's/.*:[[:space:]]*"([^"]*)"/\1/')"

# Only nudge for source code; skip docs, config, lockfiles, data, etc.
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.py|*.rs|*.go|*.java|*.kt|*.rb|*.php|*.c|*.h|*.cpp|*.hpp|*.cc|*.cs|*.swift|*.scala) ;;
  *) exit 0 ;;
esac

base="$(basename "$file_path")"
msg="code-refiner: \`${base}\` changed. Run /refine for a fast safe tidy-up, or /refine-deep for a verified refactor."

# Advisory only — additionalContext is non-blocking and never edits anything.
printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"%s"}}\n' "$msg"
exit 0
