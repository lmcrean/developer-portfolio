# Test hook - writes timestamp to file
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path ".claude\hooks\hook-test.log" -Value "Hook triggered at: $timestamp"
