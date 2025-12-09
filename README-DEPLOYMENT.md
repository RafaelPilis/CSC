# CloudStaff Consulting Website - Deployment Anleitung

## Übersicht

Diese Website nutzt **Vercel Serverless Functions**, um Projektanfragen per E-Mail zu versenden. Der E-Mail-Versand erfolgt über **Resend**, einen modernen E-Mail-Service, der speziell für Vercel optimiert ist.

---

## 📁 Projektstruktur

```
RecruitingWebseite/
├── api/
│   └── sendProjectRequest.js    # Vercel Serverless Function für E-Mail-Versand
├── fuer-unternehmen.html         # Seite mit Projektanfrage-Formular
├── package.json                  # Node.js Dependencies (Resend)
└── README-DEPLOYMENT.md          # Diese Datei
```

---

## 🚀 Deployment auf Vercel

### 1. Resend Account erstellen

1. Gehe zu [resend.com](https://resend.com)
2. Erstelle einen kostenlosen Account
3. Verifiziere deine Domain (oder nutze die Test-Domain `onboarding@resend.dev`)
4. Erstelle einen API-Key:
   - Gehe zu **API Keys** im Dashboard
   - Klicke auf **Create API Key**
   - Kopiere den generierten Key (z.B. `re_123abc...`)

### 2. Projekt auf Vercel deployen

#### Option A: Via Vercel Dashboard (empfohlen)

1. Gehe zu [vercel.com](https://vercel.com) und logge dich ein
2. Klicke auf **Add New** → **Project**
3. Importiere dein Git-Repository (GitHub, GitLab, Bitbucket)
4. Vercel erkennt automatisch, dass es sich um eine statische Website handelt
5. Klicke auf **Deploy**

#### Option B: Via Vercel CLI

```bash
# Vercel CLI installieren (falls noch nicht vorhanden)
npm install -g vercel

# Im Projektverzeichnis ausführen
cd RecruitingWebseite
vercel

# Folge den Anweisungen im Terminal
```

### 3. Umgebungsvariablen in Vercel setzen

Nach dem Deployment musst du folgende **Environment Variables** in Vercel konfigurieren:

1. Gehe zu deinem Projekt im Vercel Dashboard
2. Klicke auf **Settings** → **Environment Variables**
3. Füge folgende Variablen hinzu:

| Variable Name        | Wert                                    | Beschreibung                                    |
|---------------------|-----------------------------------------|-------------------------------------------------|
| `RESEND_API_KEY`    | `re_123abc...`                          | Dein Resend API-Key                             |
| `RESEND_TO_EMAIL`   | `r.pilis@cloudstaffconsulting.com`      | Empfänger-E-Mail für Projektanfragen            |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` ODER deine Domain | Absender-E-Mail (muss in Resend verifiziert sein) |

**Wichtig:** 
- Setze die Variablen für **Production**, **Preview** und **Development**
- Nach dem Hinzufügen der Variablen: **Redeploy** auslösen

### 4. Domain in Resend verifizieren (optional, aber empfohlen)

Für professionelle E-Mails solltest du deine eigene Domain verifizieren:

1. Gehe zu **Domains** im Resend Dashboard
2. Klicke auf **Add Domain**
3. Gib deine Domain ein (z.B. `cloudstaffconsulting.com`)
4. Füge die DNS-Records hinzu (SPF, DKIM, DMARC)
5. Warte auf die Verifizierung (kann bis zu 48h dauern)
6. Ändere `RESEND_FROM_EMAIL` zu `noreply@cloudstaffconsulting.com` oder ähnlich

---

## 🧪 Lokales Testen

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen lokal setzen

Erstelle eine `.env` Datei im Projektverzeichnis:

```env
RESEND_API_KEY=re_dein_api_key_hier
RESEND_TO_EMAIL=r.pilis@cloudstaffconsulting.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Wichtig:** Füge `.env` zu `.gitignore` hinzu, damit Secrets nicht ins Repository kommen!

### 3. Vercel Dev Server starten

```bash
npx vercel dev
```

Der Server läuft dann auf `http://localhost:3000`

### 4. Formular testen

1. Öffne `http://localhost:3000/fuer-unternehmen.html`
2. Scrolle zum Formular "Teilen Sie Ihr Projekt mit uns"
3. Fülle alle Pflichtfelder aus
4. Klicke auf **Abschicken**
5. Prüfe, ob:
   - Der Button "Wird gesendet..." anzeigt
   - Das "Vielen Dank!" Modal erscheint
   - Die E-Mail in deinem Posteingang ankommt

---

## 🔧 Troubleshooting

### Problem: E-Mail wird nicht versendet

**Lösung:**
1. Prüfe die Browser-Konsole auf Fehler (F12 → Console)
2. Prüfe die Vercel Function Logs:
   - Gehe zu deinem Projekt → **Deployments**
   - Klicke auf das aktuelle Deployment → **Functions**
   - Klicke auf `sendProjectRequest` → **Logs**
3. Stelle sicher, dass alle Environment Variables korrekt gesetzt sind
4. Prüfe, ob der Resend API-Key gültig ist

### Problem: CORS-Fehler

**Lösung:**
Die Serverless Function hat bereits CORS-Header gesetzt. Falls trotzdem Fehler auftreten:
- Stelle sicher, dass die Function unter `/api/sendProjectRequest` erreichbar ist
- Prüfe, ob die Domain in Vercel korrekt konfiguriert ist

### Problem: "Resend is not defined"

**Lösung:**
- Stelle sicher, dass `package.json` im Root-Verzeichnis liegt
- Führe `npm install` aus
- Redeploy das Projekt auf Vercel

### Problem: E-Mails landen im Spam

**Lösung:**
- Verifiziere deine Domain in Resend
- Konfiguriere SPF, DKIM und DMARC DNS-Records
- Nutze eine professionelle Absender-Adresse (nicht `onboarding@resend.dev`)

---

## 📊 Resend Limits (Free Plan)

- **100 E-Mails pro Tag**
- **3.000 E-Mails pro Monat**
- Für mehr: Upgrade auf einen bezahlten Plan

---

## 🔐 Sicherheit

- **API-Keys niemals im Code speichern** → Nur über Environment Variables
- `.env` Datei zu `.gitignore` hinzufügen
- Resend API-Keys regelmäßig rotieren
- Rate Limiting in der Serverless Function implementieren (optional)

---

## 📝 Änderungen am Formular

Falls du weitere Felder zum Formular hinzufügen möchtest:

1. **HTML:** Füge das Feld in `fuer-unternehmen.html` hinzu
2. **JavaScript:** Ergänze das Feld im `formData` Objekt (Zeile ~2641)
3. **Serverless Function:** Füge das Feld im E-Mail-Body hinzu (`api/sendProjectRequest.js`, Zeile ~100)

---

## 🆘 Support

Bei Fragen oder Problemen:
- Resend Dokumentation: [resend.com/docs](https://resend.com/docs)
- Vercel Dokumentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Functions: [vercel.com/docs/functions](https://vercel.com/docs/functions)

---

## ✅ Checkliste für Go-Live

- [ ] Resend Account erstellt
- [ ] API-Key generiert
- [ ] Domain in Resend verifiziert (optional)
- [ ] Projekt auf Vercel deployed
- [ ] Environment Variables gesetzt
- [ ] Formular lokal getestet
- [ ] Formular auf Production getestet
- [ ] E-Mail-Empfang bestätigt
- [ ] Spam-Ordner geprüft
- [ ] Mobile Ansicht getestet

---

**Viel Erfolg mit dem Deployment! 🚀**

