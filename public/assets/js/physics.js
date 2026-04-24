class SandPhysics {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.width = 0;
        this.height = 0;
        this.grid = [];
        this.cellSize = 2; 
        this.currentColor = '#f0e68c';
        
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this.frameCounter = 0;
        this.physicsSpeed = 2; 
        this.loopRunning = false;
        
        // NEU: Sperre, damit pro Frame nur einmal Sand hinzugefügt wird
        this.lastSandFrame = -1;

        this._initInputHandlers();
    }

    setup(sizeKey) {
        const config = window.SandConfig.sizes[sizeKey];
        const container = this.canvas.parentElement;

        if (sizeKey === 'FULL') {
            container.classList.add('fullscreen-mode');
            this.width = Math.floor(window.innerWidth / this.cellSize);
            this.height = Math.floor((window.innerHeight - 180) / this.cellSize);
        } else {
            container.classList.remove('fullscreen-mode');
            let targetWidth = config ? config.width : 200;
            let targetHeight = config ? config.height : 300;
            this.width = targetWidth;
            this.height = targetHeight;
        }

        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        this.clear();
        
        if (!this.loopRunning) {
            this._startLoop();
            this.loopRunning = true;
        }
    }

    _initInputHandlers() {
        // Vereinheitlichte Funktion für alle Eingaben
        const handleInput = (e) => {
            if (!this.isMouseDown) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            // Präzise Berechnung der Grid-Koordinaten
            this.mouseX = (clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouseY = (clientY - rect.top) * (this.canvas.height / rect.height);
        };

        // MAUS EVENTS
        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            handleInput(e);
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        this.canvas.addEventListener('mousemove', handleInput);

        // TOUCH EVENTS (mit passive: false um Scrollen zu verhindern)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Verhindert zusätzliche Maus-Emulation
            this.isMouseDown = true;
            handleInput(e);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleInput(e);
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isMouseDown = false;
        });
    }

    clear() {
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(0));
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        // Sand-Logik: Nur einmal pro Frame ausführen
        if (this.isMouseDown && this.frameCounter !== this.lastSandFrame) {
            this.addSand(this.mouseX, this.mouseY);
            this.lastSandFrame = this.frameCounter;
        }

        this.frameCounter++;
        if (this.frameCounter % this.physicsSpeed !== 0) return;

        // Sand-Physik (von unten nach oben berechnen)
        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                const color = this.grid[x][y];
                if (color) {
                    if (!this.grid[x][y + 1]) { 
                        this.grid[x][y + 1] = color;
                        this.grid[x][y] = 0;
                    } else {
                        let dir = Math.random() < 0.5 ? -1 : 1;
                        if (x + dir >= 0 && x + dir < this.width && !this.grid[x + dir][y + 1]) {
                            this.grid[x + dir][y + 1] = color;
                            this.grid[x][y] = 0;
                        } else if (x - dir >= 0 && x - dir < this.width && !this.grid[x - dir][y + 1]) {
                            this.grid[x - dir][y + 1] = color;
                            this.grid[x][y] = 0;
                        }
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.grid[x][y]) {
                    this.ctx.fillStyle = this.grid[x][y];
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }

    addSand(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        const radius = 2;

        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                if(Math.random() > 0.4 && (i*i + j*j <= radius*radius)) {
                    let nx = gridX + i;
                    let ny = gridY + j;
                    if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                        if (!this.grid[nx][ny]) {
                            this.grid[nx][ny] = this.currentColor;
                        }
                    }
                }
            }
        }
    }

    _startLoop() {
        const tick = () => {
            this.update();
            this.draw();
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}