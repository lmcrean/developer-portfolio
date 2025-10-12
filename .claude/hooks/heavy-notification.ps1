# Heavy Notification - Repeating alarm
# Triggered when Claude Code needs user attention
# Plays 10 beeps over ~10 seconds

param(
    [string]$hookData
)

# Configuration
$beepFrequency = 1000      # Hz
$beepDuration = 300        # milliseconds per beep
$pauseBetweenBeeps = 700   # milliseconds between beeps
$totalBeeps = 10           # Play 10 beeps then stop

# Play repeating beeps
for ($i = 0; $i -lt $totalBeeps; $i++) {
    try {
        [Console]::Beep($beepFrequency, $beepDuration)
    }
    catch {
        # Silently fail if beep not supported
    }

    # Don't pause after the last beep
    if ($i -lt ($totalBeeps - 1)) {
        Start-Sleep -Milliseconds $pauseBetweenBeeps
    }
}

exit 0
