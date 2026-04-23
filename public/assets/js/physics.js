/**
 * 🏺 SandBottle Physics Engine
 * Kern-Logik für Partikel-Simulation und Input-Handling
 */

const canvas = document.getElementById('sand-canvas');
const ctx = canvas.getContext('2d', { alpha: false });

const physics = {
    width: 200,   // Interne Auflösung (unabhängig von CSS-Größe)
    height: 300,
    grid: [],
    colors: [0, "#E2C799", "#C08261", "#9A4444", "#5C8374", "#1B4242"], // Slot 0 ist leer
    
    setup(w, h) {
        this.width = w;
        this.height = h;
        canvas.width = w;
        canvas.height = h;
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(0));
    },

    setParticle(x, y, colorIndex) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Nur setzen, wenn das Pixel noch leer ist
            if (this.grid[x][y] === 0) {
                this.grid[x][y] = colorIndex;
            }
        }
    },

    update() {
        // Wir iterieren von unten nach oben, damit Partikel nicht 
        // in einem einzigen Frame durch den ganzen Schirm fallen (Teleport-Effekt)
        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                let p = this.grid[x][y];
                if (p > 0) {
                    // 1. Direkt darunter frei?
                    if (this.grid[x][y + 1] === 0) {
                        this.grid[x][y + 1] = p;
                        this.grid[x][y] = 0;
                    } 
                    // 2. Diagonal links unten frei?
                    else if (x > 0 && this.grid[x - 1][y + 1] === 0) {
                        this.grid[x - 1][y + 1] = p;
                        this.grid[x][y] = 0;
                    }
                    // 3. Diagonal rechts unten frei?
                    else if (x < this.width - 1 && this.grid[x + 1][y + 1] === 0) {
                        this.grid[x + 1][y + 1] = p;
                        this.grid[x][y] = 0;
                    }
                }
            }
        }
    },

    render() {
        // Canvas leeren (Schwarz oder Hintergrundfarbe)
        ctx.fillStyle = "#000"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Partikel zeichnen
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let colorIdx = this.grid[x][y];
                if (colorIdx > 0) {
                    ctx.fillStyle = this.colors[colorIdx];
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
};

// --- INPUT HANDLING ---

let isDrawing = false;
let mouseX = 0;
let mouseY = 0;
let currentColor = 1; // Standardfarbe: Sand

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Präzise Umrechnung der Maus-Koordinaten auf die interne Grid-Auflösung
    mouseX = Math.floor((clientX - rect.left) / (rect.width / canvas.width));
    mouseY = Math.floor((clientY - rect.top) / (rect.height / canvas.height));
}

// Events für Maus und Touch
const startDraw = (e) => { isDrawing = true; getMousePos(e); };
const stopDraw = () => { isDrawing = false; };
const moveDraw = (e) => { getMousePos(e); };

canvas.addEventListener('mousedown', startDraw);
window.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mousemove', moveDraw);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, {passive: false});
window.addEventListener('touchend', stopDraw);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); moveDraw(e); }, {passive: false});

// --- MAIN LOOP ---

physics.setup(200, 300); // Initialisierung der Flasche

function loop() {
    if (isDrawing) {
        // Erzeugt einen "Sprüh-Effekt" mit Radius 2 für schöneres Rieseln
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (Math.random() > 0.6) { // Dichte des Sandes
                    physics.setParticle(mouseX + dx, mouseY + dy, currentColor);
                }
            }
        }
    }

    physics.update();
    physics.render();
    requestAnimationFrame(loop);
}

// Start der Engine
requestAnimationFrame(loop);