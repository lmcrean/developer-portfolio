#!/bin/bash
# Notification Wrapper Script
# Reads notification-mode.txt and executes the appropriate notification
# Mode 0 = No notification
# Mode 1 = Light notification (single beep)
# Mode 2 = Heavy notification (repeating alarm)

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Read the notification mode from file
MODE_FILE="$SCRIPT_DIR/notification-mode.txt"

# Default to mode 1 (light) if file doesn't exist
MODE=1

if [ -f "$MODE_FILE" ]; then
    MODE=$(cat "$MODE_FILE" | tr -d '[:space:]')

    # Validate mode is 0, 1, or 2
    if ! [[ "$MODE" =~ ^[0-2]$ ]]; then
        echo "Invalid notification mode: $MODE. Using default (1 - light)." >&2
        MODE=1
    fi
else
    echo "Notification mode file not found. Using default (1 - light)." >&2
fi

# Execute based on mode
case $MODE in
    0)
        # No notification
        exit 0
        ;;
    1)
        # Light notification - single beep
        printf '\a'
        exit 0
        ;;
    2)
        # Heavy notification - repeating alarm
        HEAVY_SCRIPT="$SCRIPT_DIR/heavy-notification.sh"
        if [ -f "$HEAVY_SCRIPT" ]; then
            "$HEAVY_SCRIPT"
        else
            echo "Heavy notification script not found. Playing light notification instead." >&2
            printf '\a'
        fi
        exit 0
        ;;
esac
