--[[
    FSD PRO - Authorized Server Agent (Server-side)
    Sends authorized, non-sensitive resource telemetry to FSD web application.
    NEVER sends code, keys, passwords, database credentials or player IDs.
]]

local function isResourceHidden(name)
    for _, hiddenName in ipairs(Config.HiddenResources or {}) do
        if string.lower(hiddenName) == string.lower(name) then
            return true
        end
    end
    return false
end

local function gatherSafePayload()
    local payload = {
        agentVersion = "1.0.0",
        timestamp = os.time(),
        hostname = GetConvar("sv_hostname", "Unknown FiveM Server"),
        maxClients = GetConvarInt("sv_maxclients", 32),
        clients = #GetPlayers(),
        resources = {},
        framework = nil,
        convarTags = GetConvar("tags", ""),
    }

    if Config.ExportOptions.exportResourceList then
        local numResources = GetNumResources()
        for i = 0, numResources - 1 do
            local resName = GetResourceByFindIndex(i)
            if resName and GetResourceState(resName) == "started" then
                if not isResourceHidden(resName) then
                    table.insert(payload.resources, resName)
                end
            end
        end
    end

    -- Framework identification helper
    if GetResourceState("es_extended") == "started" then
        payload.framework = "ESX Legacy"
    elseif GetResourceState("qb-core") == "started" then
        payload.framework = "QBCore"
    elseif GetResourceState("qbx_core") == "started" then
        payload.framework = "Qbox"
    elseif GetResourceState("vrp") == "started" then
        payload.framework = "vRP"
    else
        payload.framework = "Custom / Standalone"
    end

    return payload
end

local function sendReport()
    if not Config.ApiKey or Config.ApiKey == "REPLACE_WITH_YOUR_FSD_TOKEN" then
        print("^1[FSD-Agent] Upozornění: Není nastaven platný Config.ApiKey v config.lua! Synchronizace přeskočena.^7")
        return
    end

    local data = gatherSafePayload()
    local jsonBody = json.encode(data)

    PerformHttpRequest(Config.EndpointUrl, function(statusCode, responseText, headers)
        if statusCode == 200 or statusCode == 201 then
            print("^2[FSD-Agent] Úspěšně odeslána autorizovaná telemetrie serveru do FSD PRO.^7")
        elseif statusCode == 401 or statusCode == 403 then
            print("^1[FSD-Agent] Chyba autorizace: Neplatný nebo zneplatněný API token!^7")
        else
            print(string.format("^3[FSD-Agent] Chyba komunikace (HTTP %s): %s^7", tostring(statusCode), tostring(responseText)))
        end
    end, 'POST', jsonBody, {
        ['Content-Type'] = 'application/json',
        ['Authorization'] = 'Bearer ' .. Config.ApiKey,
        ['User-Agent'] = 'FSD-FiveM-Agent/1.0.0'
    })
end

-- Synchronize on server start after resources boot
CreateThread(function()
    Wait(15000)
    print("^5[FSD-Agent] Inicializován autorizovaný FiveM telemetrický agent.^7")
    sendReport()

    local intervalMs = (Config.SyncIntervalMinutes or 15) * 60 * 1000
    while true do
        Wait(intervalMs)
        sendReport()
    end
end)

-- Command for manual test sync (console only)
RegisterCommand("fsd_sync", function(source, args, rawCommand)
    if source == 0 then
        print("^5[FSD-Agent] Manuálně vyvolána synchronizace...^7")
        sendReport()
    else
        print("Tento příkaz lze spustit pouze ze serverové konzole.")
    end
end, true)
