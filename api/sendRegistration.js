// Vercel Serverless Function für Kandidaten-Registrierungen
// Diese Funktion empfängt Formulardaten (inkl. File-Upload) und sendet eine E-Mail via Resend

const { Resend } = require('resend');

// Resend-Client initialisieren
const resend = new Resend(process.env.RESEND_API_KEY);

// Hauptfunktion für die Serverless Function
module.exports = async (req, res) => {
    // CORS-Header setzen
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
            region,
            nachricht,
            projektliste // Base64-encoded file data
        } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!vorname || !nachname || !email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Bitte füllen Sie alle Pflichtfelder aus.' 
            });
        }

        // E-Mail-Betreff
        const subject = 'Neue Kandidaten-Registrierung von der CloudStaff Consulting Website';

        // E-Mail-Body als HTML formatieren
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
                    .file-info { background-color: #e8f4f8; padding: 10px; border-radius: 5px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Neue Kandidaten-Registrierung</h1>
                    
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
                        <span class="label">Region:</span> 
                        <span class="value">${region || 'Nicht angegeben'}</span>
                    </div>
                    
                    ${projektliste ? `
                    <h2>Projektliste</h2>
                    <div class="file-info">
                        <strong>Datei:</strong> ${projektliste.filename}<br>
                        <strong>Größe:</strong> ${(projektliste.size / 1024).toFixed(2)} KB<br>
                        <em>Die Projektliste ist als Anhang dieser E-Mail beigefügt.</em>
                    </div>
                    ` : ''}
                    
                    ${nachricht ? `
                    <h2>Nachricht</h2>
                    <div class="description">
                        ${nachricht.replace(/\n/g, '<br>')}
                    </div>
                    ` : ''}
                    
                    <div class="footer">
                        Diese E-Mail wurde automatisch von der CloudStaff Consulting Website generiert.
                    </div>
                </div>
            </body>
            </html>
        `;

        // Plain-Text Version als Fallback
        const textBody = `
Neue Kandidaten-Registrierung von der CloudStaff Consulting Website

Persönliche Daten:
- Vorname: ${vorname}
- Nachname: ${nachname}
- E-Mail: ${email}
- Telefon: ${telefon || 'Nicht angegeben'}
- Region: ${region || 'Nicht angegeben'}

${projektliste ? `Projektliste: ${projektliste.filename} (siehe Anhang)` : 'Keine Projektliste hochgeladen'}

${nachricht ? `Nachricht:\n${nachricht}` : ''}

---
Diese E-Mail wurde automatisch von der CloudStaff Consulting Website generiert.
        `.trim();

        // E-Mail-Optionen vorbereiten
        const emailOptions = {
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.RESEND_TO_EMAIL || 'r.pilis@cloudstaffconsulting.com',
            subject: subject,
            html: htmlBody,
            text: textBody,
            reply_to: email
        };

        // Wenn eine Datei hochgeladen wurde, als Attachment hinzufügen
        if (projektliste && projektliste.content) {
            emailOptions.attachments = [
                {
                    filename: projektliste.filename,
                    content: projektliste.content // Base64-encoded content
                }
            ];
        }

        // E-Mail via Resend senden
        const data = await resend.emails.send(emailOptions);

        // Erfolgreiche Antwort zurückgeben
        return res.status(200).json({ 
            success: true, 
            message: 'Registrierung erfolgreich versendet!',
            id: data.id 
        });

    } catch (error) {
        // Fehlerbehandlung
        console.error('Fehler beim E-Mail-Versand:', error);
        
        return res.status(500).json({ 
            success: false, 
            error: 'Registrierung konnte nicht versendet werden. Bitte versuchen Sie es später erneut.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


