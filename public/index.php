<?php
require_once __DIR__ . '/../src/Config.php';
require_once __DIR__ . '/../src/AudioHandler.php';

use SandBottle\Config;
use SandBottle\AudioHandler;

$audioHandler = new AudioHandler(__DIR__ . '/assets/audio');
$playlist = $audioHandler->getPlaylist();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SandBottle - Digitale Sandkunst</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <style>
        body { background-color: #1a1a1a; touch-action: none; overflow: hidden; }
        /* Cursor-Fix direkt hier belassen */
        #sand-canvas { cursor: crosshair; }
    </style>
</head>
<body class="text-slate-200 font-sans flex flex-col h-screen">

    <header class="p-4 bg-slate-900 shadow-md flex justify-between items-center z-10">
        <h1 class="text-xl font-bold tracking-widest uppercase">Sand<span class="text-amber-400">Bottle</span></h1>
        <div class="flex gap-4">
            <button id="btn-save-png" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm transition">PNG Export</button>
            <button id="btn-backup" class="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm transition">Backup (Local)</button>
            <button id="btn-reset" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm transition">Leeren</button>
        </div>
    </header>

   <main class="flex-1 relative flex items-center justify-center overflow-hidden bg-[#0f0f0f]">
    <div class="canvas-container">
        <canvas id="sand-canvas"></canvas>
    </div>
   </main>

    <footer class="p-6 bg-slate-900 border-t border-slate-800 z-10">
        <div class="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center items-end">
            
            <div class="flex flex-col gap-2">
                <span class="text-xs uppercase text-slate-400 font-semibold">Farben</span>
                <div id="color-slots" class="flex gap-2">
                    </div>
            </div>

            <div class="flex flex-col gap-2">
                <span class="text-xs uppercase text-slate-400 font-semibold">Flasche</span>
                <select id="select-size" class="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-amber-400 text-white">
                    <?php foreach (Config::BOTTLE_SIZES as $key => $config): ?>
                        <option value="<?= $key ?>"><?= $config['label'] ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="flex flex-col gap-2">
                <span class="text-xs uppercase text-slate-400 font-semibold">Zen-Sound</span>
                <div class="flex items-center gap-3 bg-slate-800 rounded px-3 py-2">
                    <select id="select-audio" class="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-amber-400 text-white">
                        <option value="">Aus</option>
                        <?php foreach ($playlist as $track): ?>
                            <option value="<?= htmlspecialchars($track['url']) ?>"><?= htmlspecialchars($track['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input id="volume-slider" type="range" min="0" max="1" step="0.1" value="0.5" class="w-20 accent-amber-400">
                </div>
            </div>

        </div>
    </footer>

    <script>
        window.SandConfig = {
            sizes: <?= json_encode(Config::BOTTLE_SIZES) ?>,
            playlist: <?= json_encode($playlist) ?>
        };
    </script>
    <script src="/assets/js/audio.js"></script>
    <script src="/assets/js/physics.js"></script>
    <script src="/assets/js/ui.js"></script>
</body>
</html>