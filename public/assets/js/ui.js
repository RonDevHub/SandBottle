const physics = new SandPhysics('sand-canvas');
const colorSlots = ['#f0e68c', '#e2725b', '#85bb65', '#4682b4', '#9370db'];

function initUI() {
    // Initialisierung der Engine (startet internen Loop und Input-Handler)
    physics.setup(document.getElementById('select-size').value);

    // --- Import Logik ---
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    document.body.appendChild(importInput);

    // Rechtsklick auf Backup = Import
    document.getElementById('btn-backup').oncontextmenu = (e) => {
        e.preventDefault();
        importInput.click();
    };

    importInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                physics.setup(data.size);
                
                // Grid wiederherstellen
                let flatIndex = 0;
                data.grid_rle.forEach(([count, color]) => {
                    for (let i = 0; i < count; i++) {
                        const x = Math.floor(flatIndex / physics.height);
                        const y = flatIndex % physics.height;
                        if (x < physics.width && y < physics.height) {
                            physics.grid[x][y] = color;
                        }
                        flatIndex++;
                    }
                });
            } catch (err) {
                alert("Fehler beim Laden des Backups");
            }
        };
        reader.readAsText(file);
    };

    // --- Farbfelder generieren ---
    const container = document.getElementById('color-slots');
    colorSlots.forEach((color, i) => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = color;
        input.className = "w-10 h-10 rounded cursor-pointer border-2 border-slate-700 bg-transparent";
        
        input.onchange = (e) => {
            colorSlots[i] = e.target.value;
            physics.currentColor = e.target.value;
        };
        
        input.onclick = () => {
            physics.currentColor = colorSlots[i];
            // Visuelles Feedback: Alle Rahmen zurücksetzen, diesen markieren
            container.querySelectorAll('input').forEach(inp => inp.classList.replace('border-amber-400', 'border-slate-700'));
            input.classList.replace('border-slate-700', 'border-amber-400');
        };
        container.appendChild(input);
    });

    // --- UI Controls ---
    document.getElementById('select-size').onchange = (e) => physics.setup(e.target.value);
    document.getElementById('btn-reset').onclick = () => physics.clear();

    // PNG Export
    document.getElementById('btn-save-png').onclick = () => {
        const link = document.createElement('a');
        link.download = 'sandkunst.png';
        link.href = physics.canvas.toDataURL('image/png');
        link.click();
    };

    // Backup Download (Local)
    document.getElementById('btn-backup').onclick = () => {
        const data = {
            version: "1.0",
            size: document.getElementById('select-size').value,
            grid_rle: physics.getExportData()
        };
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sand-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
}

document.addEventListener('DOMContentLoaded', initUI);