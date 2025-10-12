# Claude Code Sound Notifications

This directory contains scripts to enable audio notifications when Claude Code needs your attention.

## Features

- **Light Notification**: Single Windows notification sound for quick attention when you're nearby
- **Heavy Notification**: Repeating alarm sound (~50 times over 5 minutes) for when you're in another room
- **Quick Mode Switching**: Change notification mode by editing a single number (0, 1, or 2)
- **Uses Windows System Sounds**: Plays actual WAV files through your speakers/headphones

## How It Works

The `notify.ps1` script uses Windows Media's SoundPlayer to play actual WAV files from `C:\Windows\Media\`:
- **Mode 1 (Light)**: Plays "Windows Notify System Generic.wav" once
- **Mode 2 (Heavy)**: Plays "Alarm01.wav" repeatedly for ~5 minutes (~50 times)

## Files

### Core Scripts
- `notify.ps1` - Smart wrapper script that reads mode and plays appropriate notification (Windows)
- `notify.sh` - Smart wrapper script that reads mode and plays appropriate notification (Linux/Mac/Git Bash)
- `notification-mode.txt` - **Edit this file to change notification mode: 0=none, 1=light, 2=heavy**

### Individual Notification Scripts
- `light-notification.ps1` - PowerShell script for single beep (Windows)
- `heavy-notification.ps1` - PowerShell script for repeating alarm (Windows)
- `light-notification.sh` - Bash script for single beep (Linux/Mac/Git Bash)
- `heavy-notification.sh` - Bash script for repeating alarm (Linux/Mac/Git Bash)

### Configuration Examples
- `notification-config-simple.json` - **RECOMMENDED: One-time setup with mode switching**
- `notification-config-example.json` - Light notification only (manual)
- `notification-config-heavy-example.json` - Heavy notification only (manual)

## Quick Start (Recommended Method)

This is the easiest way to set up notifications with the ability to quickly switch modes!

### Step 1: One-Time VSCode Configuration

Add this to your VSCode User Settings JSON **once**:

**Windows:**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \".claude/hooks/notify.ps1\"",
            "timeout": 310
          }
        ]
      }
    ]
  }
}
```

**Linux/Mac/Git Bash:**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/notify.sh",
            "timeout": 310
          }
        ]
      }
    ]
  }
}
```

### Step 2: Switch Notification Modes Anytime

Simply edit `.claude/hooks/notification-mode.txt` and change the number:

- **0** = No notifications (silent)
- **1** = Light notification (single sound) - **DEFAULT**
- **2** = Heavy notification (repeating alarm for ~5 min, ~50 alarms)

**Example:** To switch to heavy notifications, just change the file content from `1` to `2`. That's it!

The mode change takes effect immediately on the next notification.

### Step 3: Test It

The notification will trigger when:
- Claude Code needs permission to use a tool
- The prompt input has been idle for 60+ seconds

---

## Manual Setup (Advanced)

If you prefer to manually configure specific notification types without mode switching:

### Advanced Step 1: Choose Your Notification Type

**Option A: Light Notification (Single Beep)**
- Best for when you're working at your computer
- Just a quick beep to get your attention

**Option B: Heavy Notification (Repeating Alarm)**
- Best for when you might be away from your computer
- Repeats for up to 5 minutes
- Press any key to dismiss

### Advanced Step 2: Configure VSCode Settings

1. Open your VSCode settings:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Preferences: Open User Settings (JSON)"
   - Or edit `.vscode/settings.json` in your project

2. Add the hook configuration:

**For Light Notification (Windows):**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \".claude/hooks/light-notification.ps1\""
          }
        ]
      }
    ]
  }
}
```

**For Heavy Notification (Windows):**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \".claude/hooks/heavy-notification.ps1\"",
            "timeout": 310
          }
        ]
      }
    ]
  }
}
```

**For Light Notification (Linux/Mac/Git Bash):**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/light-notification.sh"
          }
        ]
      }
    ]
  }
}
```

**For Heavy Notification (Linux/Mac/Git Bash):**
```json
{
  "claude-code.hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/heavy-notification.sh",
            "timeout": 310
          }
        ]
      }
    ]
  }
}
```

### Advanced Step 3: Test the Notification

The notification will trigger when:
- Claude Code needs permission to use a tool
- The prompt input has been idle for 60+ seconds

To test:
1. Ask Claude Code a question that requires tool permission
2. Or wait 60 seconds without interacting with the prompt

### Advanced Step 4: Stopping Heavy Notifications

When the heavy notification alarm is running:
- Press **ANY KEY** on your keyboard to stop it
- The alarm will automatically stop after 5 minutes

---

## Common Usage Scenarios

### Working at Your Desk
Set mode to **1** (light notification) - you'll get a quick beep when Claude needs you

### Stepping Away Briefly
Set mode to **2** (heavy notification) - you'll hear the repeating alarm even from another room

### Running Long Tasks Overnight
Set mode to **0** (no notifications) - run unattended without beeps

### Quick Mode Switching
Keep the `notification-mode.txt` file open in a tab and just change the number as needed!

---

## Customization

### Adjust Beep Sound (PowerShell)

Edit the `heavy-notification.ps1` or the beep in `notify.ps1` files and modify these parameters:

```powershell
$beepFrequency = 1000      # Hz (higher = higher pitch)
$beepDuration = 300        # milliseconds per beep
$pauseBetweenBeeps = 700   # milliseconds between beeps
```

### Adjust Maximum Duration

Edit the heavy notification script and change:

```powershell
$maxDurationSeconds = 300  # Change to desired seconds
```

Don't forget to update the `timeout` in your hook configuration to match (add ~10 seconds buffer).

### Adjust Beep Interval (Bash)

Edit the `.sh` files and modify:

```bash
BEEP_INTERVAL=1   # seconds between beeps
```

## Troubleshooting

### No Sound on Windows
- **Check your system volume** - Make sure speakers/headphones are not muted
- **Test your audio** - Play a YouTube video to confirm audio is working
- **System beeps don't work?** - The script uses actual WAV files, not console beeps, so it should work even if system beeps are disabled
- **Still no sound?** - Try testing manually: `powershell.exe -ExecutionPolicy Bypass -File ".claude/hooks/notify.ps1"`

### No Sound on Linux/Mac
- Check if terminal bell is enabled in your terminal settings
- Try running `printf '\a'` in terminal to test
- Some terminals have bell sounds muted by default

### Script Not Running
- Check file permissions (should be executable)
- Verify the path in your VSCode settings is correct
- Check VSCode Developer Console for error messages: `Help > Toggle Developer Tools`

### Heavy Notification Won't Stop
- **Note**: When run from Claude Code hooks, keyboard detection doesn't work (no console available)
- Heavy mode will automatically stop after playing ~50 alarms (~5 minutes)
- To customize duration, edit `$maxIterations` in `notify.ps1` (line 60)

## Platform-Specific Notes

### Windows
- Uses `System.Media.SoundPlayer` to play WAV files from `C:\Windows\Media\`
- Plays through your default audio device (speakers/headphones)
- Requires PowerShell 5.1 or higher (built into Windows 10/11)
- **Light mode**: Uses "Windows Notify System Generic.wav"
- **Heavy mode**: Uses "Alarm01.wav" (repeats ~50 times)

### Linux/Mac/Git Bash
- Uses terminal bell character (`\a`)
- Sound depends on terminal emulator settings
- May need to enable bell in terminal preferences

## Advanced: Project-Specific Configuration

You can also add the hook configuration to `.claude/settings.json` in your project:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -ExecutionPolicy Bypass -File \".claude/hooks/light-notification.ps1\""
          }
        ]
      }
    ]
  }
}
```

This makes the notification system work only for that specific project.

## References

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [Claude Code Settings Guide](https://docs.claude.com/en/docs/claude-code/settings)
