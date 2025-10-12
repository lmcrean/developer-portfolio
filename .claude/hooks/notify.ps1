# Notification Wrapper Script
# Reads notification-mode.txt and executes the appropriate notification
# Mode 0 = No notification
# Mode 1 = Light notification (single beep)
# Mode 2 = Heavy notification (repeating alarm)

param(
    [string]$hookData
)

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Read the notification mode from file
$modeFile = Join-Path $scriptDir "notification-mode.txt"

# Default to mode 1 (light) if file doesn't exist
$mode = 1

if (Test-Path $modeFile) {
    try {
        $modeContent = Get-Content $modeFile -Raw
        $mode = [int]($modeContent.Trim())

        # Validate mode is 0, 1, or 2
        if ($mode -lt 0 -or $mode -gt 2) {
            Write-Host "Invalid notification mode: $mode. Using default (1 - light)." -ForegroundColor Yellow
            $mode = 1
        }
    }
    catch {
        Write-Host "Error reading notification mode file. Using default (1 - light)." -ForegroundColor Yellow
        $mode = 1
    }
}
else {
    Write-Host "Notification mode file not found. Using default (1 - light)." -ForegroundColor Yellow
}

# Execute based on mode
switch ($mode) {
    0 {
        # No notification
        exit 0
    }
    1 {
        # Light notification - single short sound
        $sound = New-Object System.Media.SoundPlayer
        $sound.SoundLocation = "C:\Windows\Media\Windows Notify System Generic.wav"
        $sound.Load()
        $sound.Play()
        Start-Sleep -Milliseconds 500
        exit 0
    }
    2 {
        # Heavy notification - play alarm sound for up to 5 minutes (about 50 times)
        $sound = New-Object System.Media.SoundPlayer
        $sound.SoundLocation = "C:\Windows\Media\Alarm01.wav"

        $maxIterations = 50  # About 5 minutes of alarms
        for ($i = 0; $i -lt $maxIterations; $i++) {
            $sound.Load()
            $sound.PlaySync()  # PlaySync waits for sound to finish
            Start-Sleep -Milliseconds 500  # Brief pause between alarms
        }
        exit 0
    }
}
