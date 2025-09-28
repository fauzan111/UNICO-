const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Generate QR data with LINE BREAKS - each component on new line
function generateQRData() {
    const now = new Date();
    const expiry = new Date('2026-07-31T23:59:00');
    
    // Format dates exactly as in original
    const issueDate = now.toISOString().slice(0, 16); // 2025-09-16T23:27
    const expiryDate = '2026-07-31T23:59'; // Fixed expiry date - always the same
    const scanTime = now.toISOString().slice(0, 19) + '+02:00'; // 2025-09-28T00:31:51+02:00
    
    // Generate ticket components exactly as in original
    const ticketPrefix = 'XNJFXZDHE9'; // Fixed ticket ID - always the same
    const num1 = '37'; // Fixed as 37
    const num2 = '2';  // Fixed as 2
    const num3 = '0';  // Fixed as 0
    
    // Fixed hash exactly as in original (always the same)
    const hash = '021a340f1cbbb1d03089175ccae61b0e9ff5de1c4bdab4998f15bdb245'; // Fixed hash - always the same
    
    // Construct QR data with LINE BREAKS (each component on new line)
    const qrData = `STUDRC\nTIC\n${issueDate}\n${expiryDate}\n${ticketPrefix}\n${num1}\n${num2}\n${num3}\n${hash}\n${scanTime}`;
    
    return qrData;
}

// Generate random ID
function generateRandomId(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate random hash
function generateRandomHash(length) {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// API endpoint to generate QR code
app.get('/api/qr', async (req, res) => {
    try {
        const qrData = generateQRData();
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        res.json({
            success: true,
            qrData: qrData,
            qrImage: qrCodeDataURL,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Metro Transport App running on http://localhost:${PORT}`);
    console.log('QR codes will be generated every 10 minutes');
});