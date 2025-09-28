// Global variables
let qrUpdateInterval;
let currentQRData = '';

// Navigation function
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate corresponding nav item
    const navMap = {
        'explore-page': 0,
        'buy-page': 1,
        'tickets-page': 2,
        'vehicles-page': 3,
        'profile-page': 4
    };
    
    if (navMap[pageId] !== undefined) {
        navItems[navMap[pageId]].classList.add('active');
    }
    
    // Start QR generation if on QR page
    if (pageId === 'qr-page') {
        startQRGeneration();
    } else {
        stopQRGeneration();
    }
}

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

// Generate and display QR code
function generateQR() {
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;
    
    // Try to use server API first, fallback to client-side generation
    fetch('/api/qr')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                qrContainer.innerHTML = `<img src="${data.qrImage}" alt="QR Code" style="max-width: 200px; height: auto;">`;
                currentQRData = data.qrData;
                console.log('Generated QR Data:', currentQRData);
            } else {
                throw new Error('Server QR generation failed');
            }
        })
        .catch(error => {
            console.log('Using client-side QR generation');
            generateClientQR();
        });
    
    // Update time display
    updateTimeDisplay();
}

// Client-side QR generation
function generateClientQR() {
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;
    
    currentQRData = generateQRData();
    
    try {
        // Create QR code using qrcode-generator library
        const qr = qrcode(0, 'M');
        qr.addData(currentQRData);
        qr.make();
        
        // Generate HTML table for QR code
        const qrHTML = qr.createTableTag(4, 8);
        qrContainer.innerHTML = qrHTML;
        
        // Style the QR code
        const table = qrContainer.querySelector('table');
        if (table) {
            table.style.borderCollapse = 'collapse';
            table.style.margin = '0 auto';
            
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.width = '4px';
                cell.style.height = '4px';
                cell.style.padding = '0';
                cell.style.margin = '0';
                
                if (cell.style.backgroundColor === 'rgb(0, 0, 0)' || cell.className === 'black') {
                    cell.style.backgroundColor = '#000';
                } else {
                    cell.style.backgroundColor = '#fff';
                }
            });
        }
        
    } catch (error) {
        console.error('QR Generation Error:', error);
        // Fallback: create a simple QR-like pattern
        createFallbackQR(qrContainer);
    }
    
    console.log('Generated QR Data:', currentQRData);
}

// Fallback QR code generator
function createFallbackQR(container) {
    const size = 25;
    let html = '<table style="border-collapse: collapse; margin: 0 auto;">';
    
    for (let i = 0; i < size; i++) {
        html += '<tr>';
        for (let j = 0; j < size; j++) {
            const isBlack = Math.random() > 0.5;
            const color = isBlack ? '#000' : '#fff';
            html += `<td style="width: 4px; height: 4px; background-color: ${color}; padding: 0; margin: 0;"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    
    container.innerHTML = html;
}

// Update time display
function updateTimeDisplay() {
    const timeElement = document.getElementById('current-time');
    const ticketIdElement = document.getElementById('ticket-id');
    
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
    
    if (ticketIdElement) {
        // Generate random ticket number
        const ticketNum = Math.floor(Math.random() * 1000) + 100;
        ticketIdElement.textContent = ticketNum;
    }
}

// Start QR generation with 10-minute intervals
function startQRGeneration() {
    // Generate initial QR
    generateQR();
    
    // Set up interval for every 10 minutes (600000 ms)
    qrUpdateInterval = setInterval(() => {
        generateQR();
        console.log('QR Code updated at:', new Date().toLocaleTimeString());
    }, 600000); // 10 minutes
    
    // Also update time display every second
    const timeInterval = setInterval(() => {
        if (document.getElementById('qr-page').classList.contains('active')) {
            updateTimeDisplay();
        } else {
            clearInterval(timeInterval);
        }
    }, 1000);
}

// Stop QR generation
function stopQRGeneration() {
    if (qrUpdateInterval) {
        clearInterval(qrUpdateInterval);
        qrUpdateInterval = null;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show default page (explore)
    showPage('explore-page');
    
    // Add click handlers for all buttons and links
    document.addEventListener('click', function(e) {
        // Handle navigation clicks
        if (e.target.closest('.nav-item')) {
            const navItems = document.querySelectorAll('.nav-item');
            const clickedIndex = Array.from(navItems).indexOf(e.target.closest('.nav-item'));
            const pages = ['explore-page', 'buy-page', 'tickets-page', 'vehicles-page', 'profile-page'];
            if (pages[clickedIndex]) {
                showPage(pages[clickedIndex]);
            }
        }
        
        // Handle other clickable elements
        if (e.target.matches('button, a, .ticket-item, .menu-item')) {
            e.preventDefault();
            // Add visual feedback
            e.target.style.opacity = '0.7';
            setTimeout(() => {
                e.target.style.opacity = '1';
            }, 150);
        }
    });
    
    // Update status bar time
    function updateStatusTime() {
        const timeElement = document.querySelector('.time');
        if (timeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = timeString;
        }
    }
    
    updateStatusTime();
    setInterval(updateStatusTime, 60000); // Update every minute
});

// Handle page visibility change to manage QR updates
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopQRGeneration();
    } else if (document.getElementById('qr-page').classList.contains('active')) {
        startQRGeneration();
    }
});

// Utility function to simulate button interactions
function simulateButtonPress(element) {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0.8';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 150);
}