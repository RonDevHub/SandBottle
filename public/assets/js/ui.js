const physics = new SandPhysics('sand-canvas');
const colorSlots = ['#f0e68c', '#e2725b', '#85bb65', '#4682b4', '#9370db'];

function initUI() {
    physics.setup('S');

    // Farbfelder generieren
    const container = document.getElementById('color-slots');
    colorSlots.forEach((color, i) => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = color;
        input.className = "w-10 h-10 rounded cursor-pointer border-2 border-slate-700";
        input.onchange = (e) => {
            colorSlots[i] = e.target.value;
            physics.currentColor = e.target.value;
        };
        input.onclick = () => physics.currentColor = colorSlots[i];
        container.appendChild(input);
    });

    // Event Listener für Maus/Touch
    const handleInput = (e) => {
        if (e.buttons === 1 || e.type === 'touchstart' || e.type === 'touchmove') {
            const rect = physics.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            physics.addSand(clientX - rect.left, clientY - rect.top);
        }
    };

    physics.canvas.addEventListener('mousemove', handleInput);
    physics.canvas.addEventListener('mousedown', handleInput);
    physics.canvas.addEventListener('touchstart', handleInput);
    physics.canvas.addEventListener('touchmove', handleInput);

    document.getElementById('select-size').onchange = (e) => physics.setup(e.target.value);
    document.getElementById('btn-reset').onclick = () => physics.clear();

    // PNG Export
    document.getElementById('btn-save-png').onclick = () => {
        const link = document.createElement('a');
        link.download = 'sand-art.png';
        link.href = physics.canvas.toDataURL();
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
    };

    // Game Loop
    function loop() {
        physics.update();
        physics.draw();
        requestAnimationFrame(loop);
    }
    loop();
}

document.addEventListener('DOMContentLoaded', initUI);