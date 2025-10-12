# Light Notification - Single beep
# Triggered when Claude Code needs user attention

param(
    [string]$hookData
)

# Parse the hook data (optional - for logging/debugging)
# Write-Host "Hook triggered: $hookData"

# Play a single system beep (frequency: 800Hz, duration: 200ms)
[Console]::Beep(800, 200)

# Exit successfully
exit 0
