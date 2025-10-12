#!/bin/bash
# Light Notification - Single beep
# Triggered when Claude Code needs user attention

# Play a single system beep
# On Linux/Mac: use printf '\a' for terminal bell
# On Windows Git Bash: same approach works
printf '\a'

# Alternative: use 'tput bel' if available
# tput bel 2>/dev/null || printf '\a'

exit 0
