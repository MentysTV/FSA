# FSD PRO - Authorized Server Agent

Oficiální FiveM serverový resource pro bezpečné a autorizované ověřování technologií serveru v aplikaci **FSD PRO**.

## 🛡️ Bezpečnostní záruky
- **ŽÁDNÝ kód ani skripty se neodesílají.** Odesílají se pouze názvy spuštěných resources, které sami schválíte.
- **ŽÁDNÁ hesla, SSH klíče, databázové údaje ani tokeny se nikdy nečtou.**
- Citlivé interní resources můžete skrýt v `Config.HiddenResources`.
- Kdykoliv můžete token zneplatnit ve webové administraci FSD PRO nebo resource jednoduše smazat.

## 🚀 Instalace
1. Zkopírujte složku `fsd_agent` do vaší FiveM složky `resources/[fsd]/fsd_agent`.
2. Otevřete soubor `config.lua`.
3. Vložte váš vygenerovaný API klíč z FSD PRO do `Config.ApiKey = "vas_token"`.
4. Ve vašem `server.cfg` přidejte:
   ```cfg
   ensure fsd_agent
   ```
5. Restartujte server nebo spusťte v serverové konzoli:
   ```cfg
   refresh
   start fsd_agent
   ```
6. Otestujte synchronizaci v konzoli příkazem:
   ```cfg
   fsd_sync
   ```

## ❌ Odinstalace
Pro kompletní odstranění stačí odstranit `ensure fsd_agent` ze `server.cfg` a smazat složku `fsd_agent`.
Ve webové aplikaci FSD PRO klikněte v nastavení na **Zneplatnit integraci (Revoke Token)**.
