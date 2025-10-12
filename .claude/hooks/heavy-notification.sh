#!/bin/bash
# Heavy Notification - Repeating alarm (max 5 minutes)
# Triggered when Claude Code needs user attention
# Press ANY KEY to stop the alarm

MAX_DURATION=300  # 5 minutes in seconds
BEEP_INTERVAL=1   # seconds between beeps

echo "=================================="
echo "CLAUDE CODE NOTIFICATION ALARM"
echo "Press ANY KEY to stop the alarm"
echo "=================================="

# Store terminal settings
old_tty_settings=$(stty -g)

# Set terminal to raw mode (non-blocking input)
stty -icanon -echo time 0 min 0

start_time=$(date +%s)
end_time=$((start_time + MAX_DURATION))

# Alarm loop
while [ "$(date +%s)" -lt "$end_time" ]; do
    # Check if a key has been pressed
    key_pressed=$(dd bs=1 count=1 2>/dev/null)
    if [ -n "$key_pressed" ]; then
        # Restore terminal settings
        stty "$old_tty_settings"
        echo -e "\nAlarm stopped by user."
        exit 0
    fi

    # Play beep
    printf '\a'

    # Wait before next beep
    sleep "$BEEP_INTERVAL"
done

# Restore terminal settings
stty "$old_tty_settings"
echo -e "\nAlarm stopped after 5 minutes (maximum duration)."
exit 0
