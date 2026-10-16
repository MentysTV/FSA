# FSD PRO – GitHub Pages Web Edition

Tato složka `/docs` obsahuje plně statickou webovou aplikaci **FSD PRO (FiveM Script Detector & Anticheat Inspector)** připravenou pro okamžité nasazení na **GitHub Pages**.

---

## 🚀 Jak nasadit na GitHub Pages (za 30 sekund)

### Varianta A: Nasazení přímo ze složky `/docs` (Nejjednodušší)
1. Nahrajte tento repozitář na svůj **GitHub** účet.
2. V repozitáři přejděte do **Settings** (Nastavení) -> v levém menu zvolte **Pages**.
3. V sekci **Build and deployment**:
   - **Source**: vyberte `Deploy from a branch`
   - **Branch**: vyberte `main` (nebo `master`)
   - **Folder**: vyberte `/docs`
4. Klikněte na **Save**.
5. Během cca 1 minuty je váš skener živě na adrese:  
   `https://<vases-jmeno>.github.io/<nazev-repozitare>/`

### Varianta B: Automatické nasazení přes GitHub Actions
V repozitáři je již vytvořen workflow soubor [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml).
1. V **Settings** -> **Pages** vyberte **Source**: `GitHub Actions`.
2. Při každém pushi do větve `main` se web automaticky publikuje.

---

## ⚡ Funkce GitHub Pages edice

1. 🛡️ **Kompletní detekce anticheatů:**
   - Rozpoznává více než 18 známých FiveM anticheat systémů:
     - **FiveGuard** (Komerční cloudový anticheat)
     - **Phoenix AntiCheat** (Detekce Lua injekce & noclip)
     - **WaveShield** (Tokenový heartbeat event shield)
     - **Badger AntiCheat** (Blacklist zbraní & vozidel)
     - **FireAC / FireShield** (Rate-limiting eventů)
     - **Reaper AntiCheat** (Anti-dump ochrana)
     - **Matrix AntiCheat** (Ochrana proti spawnům modelů)
     - **ChocoHax** (Blokátor cheatovacích menu)
     - **Echo AC**, **Nexus AC**, **Fidelis AC**, **Tgiann AC**, **KS AC**, **Lunar AC**, **Castiglione** a další.
   - Heuristická analýza pro odhalení vlastních přejmenovaných anticheat skriptů.

2. 🗺️ **100% soupis všech skriptů & MLO interiérů:**
   - **Žádný skript není vynechán ani skryt.**
   - Automatické třídění do přehledných kategorií:
     - 🛡️ **Anticheaty**
     - 🗺️ **MLO & Mapy** (Gabz, Patoche, K4MB1, UncleJust, YMAPs, interiéry)
     - 🚗 **Vozidla & Zvuky** (Car packy, engine sounds, handlingy, sirény)
     - 👔 **Oblečení & EUP** (Uniformy, vlasy, tetování, pedy)
     - ⚙️ **Jádro & Framework** (ESX, QBCore, Qbox, vRP, ox_lib)
     - 📦 **Inventáře** (ox_inventory, qb-inventory, qs-inventory atd.)
     - 📱 **Telefony & Hlas** (lb-phone, qs-smartphone, pma-voice)
     - 👮 **Práce & Frakce** (Policie, EMS, MDT, Dispatch)
     - 🎮 **Herní skripty** (Bankovnictví, HUDy, garáže, vykrádačky)
   - Okamžité full-text vyhledávání přímo při psaní.
   - Hromadný export do schránky, **TXT** a **JSON**.

3. 💬 **Automatické vyhledání Discord serveru:**
   - Prohledává serverové proměnné (`vars.Discord`, `vars.discord`, `vars.connect_discord`, `vars.sv_allowlistInstructions`, `vars.sv_projectName`) i `hostname`.
   - Vytváří přímé tlačítko **Připojit se na Discord** (`discord.gg/...`) a tlačítko pro zkopírování odkazu.

4. 📊 **Živý stav serveru v reálném čase:**
   - Indikátor **ONLINE / OFFLINE** s pulzující animací.
   - Počet aktuálně připojených hráčů a maximální kapacita slotů (např. `84 / 128`).
   - Barevně odstupňovaný graf zaplnění kapacity.
   - Název serveru, herní režim, mapa, OneSync stav a ikona/banner.
   - Tlačítko pro přímé spuštění hry přes FiveM protokol (`fivem://connect/...`) a F8 příkaz (`connect cfx.re/join/...`).

5. 🌐 **Multi-Proxy CORS odolnost:**
   - Automaticky využívá kaskádu proxy (AllOrigins, CodeTabs, přímé Cfx.re API).
   - Možnost vložit vlastní Cloudflare Worker proxy přímo v nastavení aplikace.
   - Podpora offline importu libovolného `info.json` nebo server JSON dumpu.
