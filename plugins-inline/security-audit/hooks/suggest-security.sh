#!/usr/bin/env bash
# security-audit — opt-in proactive nudge.
#
# Fires after Write/Edit/MultiEdit. SILENT by default: does nothing unless
# SECURITY_AUDIT_AUTO is set to a non-empty value. When enabled, it only
# *suggests* running /security on the edited source file. Read-only: it
# never reads, scans, or modifies your code — it just prints a suggestion.
set -eu

# Opt-in gate. Default behavior is to do nothing at all.
if [ -z "${SECURITY_AUDIT_AUTO:-}" ]; then
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
msg="security-audit: \`${base}\` changed. Run /security for a fast CWE/OWASP scan, or /security-deep for a dataflow audit."

# Advisory only — additionalContext is non-blocking and never edits anything.
printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"%s"}}\n' "$msg"
exit 0
