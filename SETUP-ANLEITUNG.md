# 🚀 Quick Setup Anleitung

## Was wurde geändert?

### ✅ Neue Dateien erstellt:

1. **`api/sendProjectRequest.js`** - Vercel Serverless Function für E-Mail-Versand
2. **`package.json`** - Node.js Dependencies (Resend SDK)
3. **`vercel.json`** - Vercel Konfiguration
4. **`README-DEPLOYMENT.md`** - Ausführliche Deployment-Dokumentation
5. **`.gitignore`** - Git Ignore-Datei für Secrets

### ✏️ Geänderte Dateien:

1. **`fuer-unternehmen.html`** - Formular nutzt jetzt API statt mailto

---

## 🎯 Was macht das System jetzt?

**VORHER:**
- Formular öffnete Outlook/Mail-Programm des Nutzers ❌

**NACHHER:**
- Formular sendet Daten an Serverless Function ✅
- Function sendet professionelle HTML-E-Mail via Resend ✅
- Nutzer sieht "Vielen Dank!" Popup ✅
- Bei Fehler: Sinnvolle Fehlermeldung ✅

---

## 📋 Setup in 5 Schritten

### 1️⃣ Resend Account erstellen
```
→ Gehe zu https://resend.com
→ Registriere dich (kostenlos)
→ Erstelle einen API-Key
→ Kopiere den Key (z.B. re_abc123...)
```

### 2️⃣ Projekt auf Vercel deployen
```bash
# Option A: Via Dashboard
→ Gehe zu vercel.com
→ Importiere dein Git-Repo
→ Klicke auf "Deploy"

# Option B: Via CLI
npm install -g vercel
vercel
```

### 3️⃣ Environment Variables setzen

Gehe zu **Vercel Dashboard → Settings → Environment Variables**

Füge hinzu:
```
RESEND_API_KEY = re_abc123...
RESEND_TO_EMAIL = r.pilis@cloudstaffconsulting.com
RESEND_FROM_EMAIL = onboarding@resend.dev
```

**Wichtig:** Setze für **Production**, **Preview** UND **Development**!

### 4️⃣ Redeploy auslösen

Nach dem Setzen der Variablen:
```
→ Vercel Dashboard → Deployments
→ Klicke auf "..." beim letzten Deployment
→ Klicke auf "Redeploy"
```

### 5️⃣ Testen

```
→ Öffne deine Website
→ Gehe zu "Für Unternehmen"
→ Scrolle zum Formular
→ Fülle es aus und sende ab
→ Prüfe dein E-Mail-Postfach
```

---

## 🧪 Lokal testen (optional)

```bash
# 1. Dependencies installieren
npm install

# 2. .env Datei erstellen
# Kopiere .env.example zu .env und füge deine Werte ein

# 3. Dev Server starten
npx vercel dev

# 4. Öffne http://localhost:3000/fuer-unternehmen.html
```

---

## ❓ Häufige Probleme

### E-Mail kommt nicht an?
- Prüfe Spam-Ordner
- Prüfe Vercel Function Logs (Dashboard → Functions → Logs)
- Prüfe ob Environment Variables gesetzt sind

### "Resend is not defined" Fehler?
- Führe `npm install` aus
- Redeploy auf Vercel

### CORS-Fehler?
- Sollte nicht passieren (bereits konfiguriert)
- Prüfe Browser-Konsole (F12)

---

## 📊 Resend Limits (Free Plan)

- ✅ 100 E-Mails / Tag
- ✅ 3.000 E-Mails / Monat
- ✅ Völlig ausreichend für den Start!

---

## 🎉 Fertig!

Nach diesen Schritten funktioniert das Formular ohne mailto!

**Bei Fragen:** Siehe `README-DEPLOYMENT.md` für Details


