class SandPhysics {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.width = 0;
        this.height = 0;
        this.grid = [];
        this.cellSize = 2; 
        this.currentColor = '#f0e68c';
        
        // Neu: Status für Dauerklick und Mausposition
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;

        this._initInputHandlers();
    }

    setup(sizeKey) {
        const config = window.SandConfig.sizes[sizeKey];
        // Sicherstellen, dass config existiert, sonst Fallback
        const cfgWidth = config ? config.width : 200;
        const cfgHeight = config ? config.height : 300;

        this.width = Math.floor(cfgWidth / this.cellSize);
        this.height = Math.floor(cfgHeight / this.cellSize);
        
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        
        this.clear();
        this._startLoop();
    }

    _initInputHandlers() {
        const updateCoords = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            // Wichtig: Umrechnung unter Berücksichtigung der tatsächlichen Canvas-Größe im Browser
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            this.mouseX = (clientX - rect.left) * scaleX;
            this.mouseY = (clientY - rect.top) * scaleY;
        };

        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            updateCoords(e);
        });

        window.addEventListener('mouseup', () => this.isMouseDown = false);
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isMouseDown) updateCoords(e);
        });

        // Touch Support
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
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(null));
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        // Falls Maus gedrückt, kontinuierlich Sand hinzufügen
        if (this.isMouseDown) {
            this.addSand(this.mouseX, this.mouseY);
        }

        // Physik-Berechnung (Falling Sand)
        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y]) {
                    const color = this.grid[x][y];
                    
                    if (!this.grid[x][y + 1]) { 
                        this.grid[x][y + 1] = color;
                        this.grid[x][y] = null;
                    } else {
                        // Diagonal checken für Haufenbildung
                        let dir = Math.random() < 0.5 ? -1 : 1;
                        if (x + dir >= 0 && x + dir < this.width && !this.grid[x + dir][y + 1]) {
                            this.grid[x + dir][y + 1] = color;
                            this.grid[x][y] = null;
                        } else if (x - dir >= 0 && x - dir < this.width && !this.grid[x - dir][y + 1]) {
                            // Auch die andere Diagonale prüfen, falls die erste besetzt war
                            this.grid[x - dir][y + 1] = color;
                            this.grid[x][y] = null;
                        }
                    }
                }
            }
        }
    }

    draw() {
        // Hintergrund zeichnen
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Sand zeichnen
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.grid[x][y]) {
                    this.ctx.fillStyle = this.grid[x][y];
                    this.ctx.fillRect(
                        x * this.cellSize, 
                        y * this.cellSize, 
                        this.cellSize, 
                        this.cellSize
                    );
                }
            }
        }
    }

    addSand(x, y) {
        const gridX = Math.floor(x / this.cellSize);
        const gridY = Math.floor(y / this.cellSize);
        
        // Radius auf 2 erhöht für satteres Rieseln
        const radius = 2;
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                // Erzeugt eine kreisförmige Verteilung statt eines Quadrats
                if(Math.random() > 0.4 && (i*i + j*j <= radius*radius)) {
                    let nx = gridX + i;
                    let ny = gridY + j;
                    if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                        if (!this.grid[nx][ny]) this.grid[nx][ny] = this.currentColor;
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