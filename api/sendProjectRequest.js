// Vercel Serverless Function für Projektanfragen
// Diese Funktion empfängt Formulardaten und sendet eine E-Mail via Resend

// Resend SDK importieren
// Installiere Resend mit: npm install resend
const { Resend } = require('resend');

// Resend-Client mit API-Key aus Umgebungsvariablen initialisieren
const resend = new Resend(process.env.RESEND_API_KEY);

// Hilfsfunktion: Datum in deutsches Format umwandeln
function formatGermanDate(dateString) {
    if (!dateString) return 'Nicht angegeben';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Hauptfunktion für die Serverless Function
module.exports = async (req, res) => {
    // CORS-Header setzen (wichtig für Frontend-Anfragen)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS-Request für CORS Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Nur POST-Requests erlauben
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Methode nicht erlaubt. Bitte POST verwenden.' 
        });
    }

    try {
        // Formulardaten aus Request-Body extrahieren
        const {
            vorname,
            nachname,
            email,
            telefon,
            unternehmensname,
            einsatzort,
            praesenzrate,
            startdatum,
            enddatum,
            auslastung,
            projektsprache,
            nachricht
        } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!vorname || !nachname || !email || !einsatzort || !startdatum || !enddatum || !auslastung || !projektsprache || !nachricht) {
            return res.status(400).json({ 
                success: false, 
                error: 'Bitte füllen Sie alle Pflichtfelder aus.' 
            });
        }

        // E-Mail-Betreff
        const subject = 'Neue Projektanfrage von der CloudStaff Consulting Website';

        // E-Mail-Body als HTML formatieren (sieht professioneller aus)
        const htmlBody = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1e3a5f; border-bottom: 3px solid #1e3a5f; padding-bottom: 10px; }
                    h2 { color: #1e3a5f; margin-top: 25px; margin-bottom: 15px; }
                    .info-row { margin: 8px 0; }
                    .label { font-weight: bold; color: #555; }
                    .value { color: #333; }
                    .description { background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-top: 10px; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Neue Projektanfrage</h1>
                    
                    <h2>Persönliche Daten</h2>
                    <div class="info-row">
                        <span class="label">Vorname:</span> 
                        <span class="value">${vorname}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Nachname:</span> 
                        <span class="value">${nachname}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">E-Mail:</span> 
                        <span class="value"><a href="mailto:${email}">${email}</a></span>
                    </div>
                    <div class="info-row">
                        <span class="label">Telefon:</span> 
                        <span class="value">${telefon || 'Nicht angegeben'}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Unternehmen:</span> 
                        <span class="value">${unternehmensname || 'Nicht angegeben'}</span>
                    </div>
                    
                    <h2>Projektdetails</h2>
                    <div class="info-row">
                        <span class="label">Einsatzort:</span> 
                        <span class="value">${einsatzort}${einsatzort === 'Hybrid' && praesenzrate ? ` (Präsenzrate: ${praesenzrate}%)` : ''}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Startdatum:</span> 
                        <span class="value">${formatGermanDate(startdatum)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Enddatum:</span> 
                        <span class="value">${formatGermanDate(enddatum)}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Auslastung:</span> 
                        <span class="value">${auslastung}%</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Projektsprache:</span> 
                        <span class="value">${projektsprache}</span>
                    </div>
                    
                    <h2>Projektbeschreibung</h2>
                    <div class="description">
                        ${nachricht.replace(/\n/g, '<br>')}
                    </div>
                    
                    <div class="footer">
                        Diese E-Mail wurde automatisch von der CloudStaff Consulting Website generiert.
                    </div>
                </div>
            </body>
            </html>
        `;

        // Plain-Text Version als Fallback
        const textBody = `
Neue Projektanfrage von der CloudStaff Consulting Website

Persönliche Daten:
- Vorname: ${vorname}
- Nachname: ${nachname}
- E-Mail: ${email}
- Telefon: ${telefon || 'Nicht angegeben'}
- Unternehmen: ${unternehmensname || 'Nicht angegeben'}

Projektdetails:
- Einsatzort: ${einsatzort}${einsatzort === 'Hybrid' && praesenzrate ? ` (Präsenzrate: ${praesenzrate}%)` : ''}
- Startdatum: ${formatGermanDate(startdatum)}
- Enddatum: ${formatGermanDate(enddatum)}
- Auslastung: ${auslastung}%
- Projektsprache: ${projektsprache}

Projektbeschreibung:
${nachricht}
        `.trim();

        // E-Mail via Resend senden
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.RESEND_TO_EMAIL || 'r.pilis@cloudstaffconsulting.com',
            subject: subject,
            html: htmlBody,
            text: textBody,
            // Optional: Reply-To auf die E-Mail des Absenders setzen
            reply_to: email
        });

        // Erfolgreiche Antwort zurückgeben
        return res.status(200).json({ 
            success: true, 
            message: 'E-Mail erfolgreich versendet!',
            id: data.id 
        });

    } catch (error) {
        // Fehlerbehandlung
        console.error('Fehler beim E-Mail-Versand:', error);
        
        return res.status(500).json({ 
            success: false, 
            error: 'E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

