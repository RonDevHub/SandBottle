class SandPhysics {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.width = 0;
        this.height = 0;
        this.grid = [];
        this.cellSize = 2; // Ein Sandkorn = 2x2 Pixel für bessere Performance
        this.currentColor = '#f0e68c';
        this.isRaining = false;
    }

    setup(sizeKey) {
        const config = window.SandConfig.sizes[sizeKey];
        this.width = config.width || Math.floor(window.innerWidth / this.cellSize);
        this.height = config.height || Math.floor((window.innerHeight - 200) / this.cellSize);
        
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
        
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(null));
        this.clear();
    }

    clear() {
        this.grid = Array(this.width).fill().map(() => Array(this.height).fill(null));
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update() {
        // Wir iterieren von unten nach oben, damit Sand korrekt fällt
        for (let y = this.height - 2; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y]) {
                    const color = this.grid[x][y];
                    
                    if (!this.grid[x][y + 1]) { // Direkt untere Zelle frei
                        this.grid[x][y + 1] = color;
                        this.grid[x][y] = null;
                    } else {
                        // Diagonal checken
                        let dir = Math.random() < 0.5 ? -1 : 1;
                        if (x + dir >= 0 && x + dir < this.width && !this.grid[x + dir][y + 1]) {
                            this.grid[x + dir][y + 1] = color;
                            this.grid[x][y] = null;
                        }
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
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
        
        // Kleiner Radius für mehr "Rieseln"
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(Math.random() > 0.3) {
                    let nx = gridX + i;
                    let ny = gridY + j;
                    if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                        if (!this.grid[nx][ny]) this.grid[nx][ny] = this.currentColor;
                    }
                }
            }
        }
    }

    // RLE Export Logik
    getExportData() {
        const flatGrid = this.grid.flat();
        const rle = [];
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