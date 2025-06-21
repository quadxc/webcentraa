-- Centra Roleplay Web Integration Script
-- Author: expect
-- Version: 1.0

local WEBSITE_URL = get("website_url") or "https://centraroleplay.netlify.app"
local UPDATE_INTERVAL = tonumber(get("update_interval")) or 30000 -- 30 seconds

-- Function to update player count on website
function updatePlayerCount()
    local playerCount = getPlayerCount()
    local postData = string.format('{"count": %d}', playerCount)
    
    fetchRemote(WEBSITE_URL .. "/api/players", {
        method = "POST",
        postData = postData,
        headers = {
            ["Content-Type"] = "application/json"
        }
    }, function(responseData, info)
        if info.success then
            outputDebugString("[Web Integration] Player count updated: " .. playerCount .. " players online", 3)
        else
            outputDebugString("[Web Integration] Failed to update player count: " .. tostring(info.statusCode), 1)
        end
    end)
end

-- Update player count when script starts
addEventHandler("onResourceStart", resourceRoot, function()
    outputDebugString("[Web Integration] Centra Roleplay web integration started", 3)
    updatePlayerCount()
    
    -- Set timer to update player count periodically
    setTimer(updatePlayerCount, UPDATE_INTERVAL, 0)
end)

-- Update player count when players join/leave
addEventHandler("onPlayerJoin", root, function()
    setTimer(updatePlayerCount, 1000, 1) -- Wait 1 second then update
end)

addEventHandler("onPlayerQuit", root, function()
    setTimer(updatePlayerCount, 1000, 1) -- Wait 1 second then update
end)

-- Admin command to manually update player count
addCommandHandler("updateweb", function(player)
    if hasObjectPermissionTo(player, "general.adminpanel") then
        updatePlayerCount()
        outputChatBox("Web sitesi oyuncu sayısı güncellendi.", player, 0, 255, 0)
    else
        outputChatBox("Bu komutu kullanma yetkiniz yok.", player, 255, 0, 0)
    end
end)

-- Function to get current server info
function getServerInfo()
    return {
        playerCount = getPlayerCount(),
        maxPlayers = getMaxPlayers(),
        serverName = getServerName(),
        gameType = getGameType() or "Roleplay",
        mapName = getMapName() or "San Andreas"
    }
end

-- Export function for other resources
function getWebsiteURL()
    return WEBSITE_URL
end