Config = {}

-- FSD Dashboard Web Endpoint
Config.EndpointUrl = "http://localhost:3000/api/integrations/report"

-- Your unique secret token generated in FSD Dashboard (/settings or /admin)
-- KEEP THIS SECRET! Never share this token publicly or commit it to GitHub.
Config.ApiKey = "REPLACE_WITH_YOUR_FSD_TOKEN"

-- Synchronisation interval in minutes (default: every 15 minutes)
Config.SyncIntervalMinutes = 15

-- Allowed export fields: choose what metadata to share with FSD
Config.ExportOptions = {
    exportFrameworkVersion = true,
    exportResourceList = true,
    exportPlayerCount = true,
    exportServerTags = true,
    exportUptime = true
}

-- Blacklist of sensitive resource names that will NEVER be shared
Config.HiddenResources = {
    "server_secrets",
    "private_anticheat_keys",
    "discord_tokens",
    "db_backup",
    "admin_passwords"
}
