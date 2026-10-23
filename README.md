# FSD PRO – FiveM Script Detector & Architecture Inspector

> **„Odhal technologie, které pohánějí FiveM servery.“**  
> *„Discover the technology behind FiveM servers.“*

🚀 **Živý web (Live App):** [https://mentystv.github.io/FSA/?v=20261023_v5](https://mentystv.github.io/FSA/?v=20261023_v5)

FSD PRO je pokročilá full-stack webová aplikace navržená pro FiveM komunitu, vývojáře, administrátory a majitele GTA V Roleplay serverů. Aplikace analyzuje veřejně dostupná metadata herních serverů, identifikuje používané frameworky a skripty a vytváří detailní analytické reporty podložené nezávislými důkazy.

---

## ⚡ Klíčové funkce

- 🔍 **Veřejný skener (Public Scan):** Zadejte `IP:port` (např. `185.100.200.45:30120`) nebo kód Cfx.re (např. `994ldb`, `bzbveb` nebo `cfx.re/join/xxxxxx`) a získejte okamžitou analýzu.
- 🛡️ **Detektor veškerých anticheatů:** Pokročilá detekce 18+ anticheatů (FiveGuard, Phoenix AC, WaveShield, Badger AC, Reaper AC, FireAC, Matrix, ChocoHax, Echo, Fidelis, Tgiann, KS atd.) včetně heuristického scanneru.
- 🗺️ **100% soupis všech scriptů & MLO interiérů:** Kompletní zobrazení všech položek na serveru rozdělených do kategorií (MLO mapy, vozidla a zvuky, EUP oděvy, framework jádro, inventáře, telefony, frakce a MDT) s živým full-text vyhledáváním a exportem.
- 💬 **Automatický nález Discord serveru:** Extrakce platné pozvánky na Discord komunitu z proměnných, hostname a allowlist pokynů s přímým tlačítkem pro připojení.
- 📊 **Živý stav serveru & Obsazenost:** Zobrazení online stavu, počtu hráčů a maximálních slotů, grafu zaplnění v %, herní mapy a přímého F8 connect příkazu i FiveM protokolu.
- 🚀 **GitHub Pages Ready (`/docs`):** Plně statická single-page webová aplikace ve složce `/docs` pro okamžité nasazení na GitHub Pages bez nutnosti serveru.
- 🛡️ **Neprůstřelná SSRF ochrana:** Blokování loopbacků (`127.0.0.0/8`, `::1`), privátních rozsahů (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), cloudových metadat (`169.254.169.254`), IPv4-mapped IPv6 a prevence DNS rebindingu.
- 🧩 **Evidence Engine:** Každé tvrzení v reportu odkazuje na konkrétní nezávisle ověřitelný důkaz (např. záznam v `resources[]`, serverovou proměnnou `vars.qb_version` nebo hlavičku).
- 📊 **Confidence Engine:** Deterministický výpočet míry jistoty (0–100 %) se štítky: *Potvrzeno*, *Silné důkazy*, *Slabé důkazy*, *Neověřeno* a *Nezjištěno*.
- 🎮 **Autorizovaný FiveM Agent (`fsd_agent`):** Samostatný serverový Lua skript v `server-resource/fsd_agent/` pro majitele serverů. Zajišťuje 100% potvrzenou synchronizaci manifestů bez sdílení citlivých dat, kódů či hesel.
- ⚖️ **Srovnávač serverů (`/compare`):** Porovnání 2 až 4 serverů vedle sebe v přehledné matici technologií.
- 📚 **Katalog resources (`/resources`):** Databáze ověřených FiveM frameworků a knihoven (ESX, QBCore, Qbox, ox_lib, ox_inventory, ps-mdt, lb-phone atd.).
- 📑 **Export reportů:** Okamžitý export do formátu **JSON**, **TXT** a tisk/generování **PDF**.
- 🔐 **Autentizace a role:** Bezpečný přihlašovací systém (bcrypt, HTTP-only JWT cookies) s rolemi `user` a `admin`.
- 🛠️ **Administrační konzole (`/admin`):** Správa uživatelů, auditní log bezpečnostních událostí a přehled všech provedených skenů.


---

## 🏗️ Technologický Stack

- **Frontend & Backend:** Next.js 16 (App Router), React 19, TypeScript (strict mode).
- **Styling & UI:** Tailwind CSS, Lucide React ikony, glassmorphism prvky a dark tech estetika (`#08090D` / `#0E1118` / `#131722` / `#8B5CF6` / `#38BDF8`).
- **Databáze:** SQLite (výchozí pro zero-config lokální běh) / PostgreSQL s Prisma 6 ORM.
- **Export:** jsPDF & nativní JSON downloader.
- **Validace:** Zod & přísné regulární výrazy pro IP/porty.

---

## 🚀 Rychlé spuštění

### 1. Klonování a instalace závislostí
```bash
npm install
```

### 2. Konfigurace prostředí
Vytvořte soubor `.env` (nebo použijte předpřipravený):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="fsd_super_secret_jwt_key_development_2026_change_in_prod"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SCANNER_TIMEOUT_MS=6000
SCANNER_MAX_RESPONSE_BYTES=2097152
```

### 3. Příprava databáze a seed
```bash
# Vytvoření databázových tabulek
npx prisma db push

# Naplnění katalogu a demonstračních účtů
npm run seed
```

### 4. Spuštění testovacího balíčku
```bash
npm run test
```
*Spustí 21 automatizovaných unit a integračních testů (SSRF ochrana, validace portů, detekce frameworků a confidence engine).*

### 5. Spuštění vývojového serveru
```bash
npm run dev
```
Aplikace běží na: [http://localhost:3000](http://localhost:3000)

---

## 👥 Předpřipravené uživatelské účty (Seed)

| Účet | E-mail | Heslo | Role |
|---|---|---|---|
| **Administrátor** | `admin@fsd.local` | `AdminFSD2026!` | `admin` |
| **Běžný vývojář** | `demo@fsd.local` | `DemoUser2026!` | `user` |

---

## 📁 Struktura projektu

```text
├── prisma/
│   ├── schema.prisma        # Relační databázové schéma (User, Scan, Target, Evidence, Catalog...)
│   └── seed.ts              # Vstupní bod pro seed databáze
├── scripts/
│   └── test-runner.ts       # Automatizovaný testovací balíček (SSRF, detektory, validace)
├── server-resource/
│   └── fsd_agent/           # FiveM serverový resource pro autorizované skenování (Lua)
│       ├── fxmanifest.lua
│       ├── config.lua
│       ├── server.lua
│       └── README.md
├── src/
│   ├── app/
│   │   ├── api/             # Next.js Route Handlers (/api/scans, /api/health, /api/auth...)
│   │   ├── scanner/         # Hlavní skenovací rozhraní
│   │   ├── reports/[id]/    # Detail výsledkového reportu
│   │   ├── servers/         # Seznam analyzovaných serverů
│   │   ├── compare/         # Porovnávač 2-4 serverů
│   │   ├── resources/       # Katalog známých FiveM resources
│   │   ├── history/         # Historie skenů přihlášeného uživatele
│   │   ├── settings/        # Správa API klíčů a autorizovaných serverů
│   │   ├── admin/           # Administrátorský dashboard
│   │   ├── terms/           # Podmínky použití
│   │   └── privacy/         # Zásady ochrany osobních údajů
│   ├── components/          # Opakovaně použitelné komponenty (Navbar, Footer, ConfidenceBadge...)
│   └── lib/
│       ├── auth.ts          # Autentizace, JWT, bcrypt, cookies
│       ├── prisma.ts        # Singleton Prisma klient
│       └── scanner/         # Modulární skenovací engine
│           ├── ssrf-guard.ts
│           ├── input-validator.ts
│           ├── endpoint-client.ts
│           ├── evidence-engine.ts
│           ├── confidence-engine.ts
│           ├── framework-detector.ts
│           ├── resource-detector.ts
│           ├── scanner-service.ts
│           └── types.ts
```
