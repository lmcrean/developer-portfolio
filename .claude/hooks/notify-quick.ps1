# Quick Notification for Stop Hook
# Plays just 1-3 short sounds based on mode

param(
    [string]$hookData
)

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Read the notification mode from file
$modeFile = Join-Path $scriptDir "notification-mode.txt"
$mode = 1

if (Test-Path $modeFile) {
    try {
        $modeContent = Get-Content $modeFile -Raw
        $mode = [int]($modeContent.Trim())
        if ($mode -lt 0 -or $mode -gt 2) {
            $mode = 1
        }
    }
    catch {
        $mode = 1
    }
}

# Execute based on mode
switch ($mode) {
    0 {
        # No notification
        exit 0
    }
    1 {
        # Light notification - single quick ding
        $sound = New-Object System.Media.SoundPlayer
        $sound.SoundLocation = "C:\Windows\Media\Windows Ding.wav"
        $sound.Load()
        $sound.PlaySync()
        exit 0
    }
    2 {
        # Heavy notification - alarm for ~6 seconds
        $sound = New-Object System.Media.SoundPlayer
        $sound.SoundLocation = "C:\Windows\Media\Alarm01.wav"

        # Play alarm 3 times to fill ~6 seconds (each alarm is ~2 seconds)
        for ($i = 0; $i -lt 1; $i++) {
            $sound.Load()
            $sound.PlaySync()
            # Small pause between repetitions
            if ($i -lt 2) {
                Start-Sleep -Milliseconds 100
            }
        }
        exit 0
    }
}
