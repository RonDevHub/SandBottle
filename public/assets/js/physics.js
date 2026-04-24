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

        this._initInputHandlers();
    }

    setup(sizeKey) {
        const config = window.SandConfig.sizes[sizeKey];
        const container = this.canvas.parentElement;

        const maxAvailableWidth = window.innerWidth - 40;
        const maxAvailableHeight = window.innerHeight - 220; 

        if (sizeKey === 'FULL') {
            container.classList.add('fullscreen-mode');
            // Fix: Exakte Viewport-Berechnung ohne CSS-Verzerrung
            this.width = Math.floor(window.innerWidth / this.cellSize);
            this.height = Math.floor((window.innerHeight - 180) / this.cellSize);
        } else {
            container.classList.remove('fullscreen-mode');
            
            let targetWidth = config ? config.width : 200;
            let targetHeight = config ? config.height : 300;

            let pixelHeight = targetHeight * this.cellSize;
            if (pixelHeight > maxAvailableHeight) {
                const ratio = maxAvailableHeight / pixelHeight;
                targetHeight = Math.floor(targetHeight * ratio);
                targetWidth = Math.floor(targetWidth * ratio);
            }

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
        const updateCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Nutze clientX/Y und ziehe rect-Position ab für absolute Genauigkeit
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            // WICHTIG: Die Skalierung muss exakt auf die Grid-Koordinaten gemappt werden
            this.mouseX = (clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouseY = (clientY - rect.top) * (this.canvas.height / rect.height);
        };

        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            updateCoords(e);
        });

        window.addEventListener('mouseup', () => this.isMouseDown = false);
        
        // Fix: Mousemove aktualisiert nur die Position, addSand passiert im Loop
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) {
                updateCoords(e);
            }
        });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            updateCoords(e);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            updateCoords(e);
        }, { passive: false });

        window.addEventListener('touchend', () => this.isMouseDown = false);
    }

    clear() {
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(0));
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        // Sand nur hier hinzufügen, nicht in den Event-Listenern!
        if (this.isMouseDown) {
            this.addSand(this.mouseX, this.mouseY);
        }

        this.frameCounter++;
        if (this.frameCounter % this.physicsSpeed !== 0) return;

        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y]) {
                    const color = this.grid[x][y];
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
                    this.ctx.fillRect(
                        Math.floor(x * this.cellSize), 
                        Math.floor(y * this.cellSize), 
                        this.cellSize, 
                        this.cellSize
                    );
                }
            }
        }
    }

    addSand(x, y) {
        // Grid-Position berechnen
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        const radius = 2;
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                // Ein kleiner Zufallsfaktor sorgt für einen natürlicheren Strahl
                if(Math.random() > 0.3 && (i*i + j*j <= radius*radius)) {
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

    getExportData() {
        const flatGrid = this.grid.flat();
        const rle = [];
        if (flatGrid.length === 0) return rle;
        let count = 1;
        let current = flatGrid[0];
        for (let i = 1; i <= flatGrid.length; i++) {
            if (flatGrid[i] === current && i < flatGrid.length) {
                count++;
            } else {
                rle.push([count, current]);
                count = 1;
                current = flatGrid[i];
            }
        }
        return rle;
    }
}