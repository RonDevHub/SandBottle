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
        #sand-canvas { cursor: crosshair; }
        
        /* Modal Animation */
        .modal-active { opacity: 1 !important; pointer-events: auto !important; }
        .modal-content { transform: scale(0.9); transition: all 0.3s ease-out; }
        .modal-active .modal-content { transform: scale(1); }
    </style>
</head>
<body class="text-slate-200 font-sans flex flex-col h-screen">

    <header class="p-4 bg-slate-900 shadow-md flex justify-between items-center z-10">
        <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold tracking-widest uppercase">Sand<span class="text-amber-400">Bottle</span></h1>
            <button id="btn-info" class="text-slate-400 hover:text-amber-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
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

    <div id="info-modal" class="fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 bg-black/80 backdrop-blur-sm">
        <div class="modal-content bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-lg w-full m-4">
            <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-amber-400">Über SandBottle</h2>
                <button id="modal-close" class="text-slate-400 hover:text-white">&times;</button>
            </div>
            
            <div class="space-y-6 text-slate-300">
                <section>
                    <h3 class="text-white font-semibold mb-2">Das Projekt</h3>
                    <p class="text-sm leading-relaxed">
                        SandBottle ist eine interaktive Kunst-App, die die beruhigende Wirkung von fallendem Sand mit Zen-Klängen kombiniert. Erschaffe deine eigenen Landschaften in virtuellen Glasflaschen.
                    </p>
                </section>

                <section>
                    <h3 class="text-white font-semibold mb-2">Hintergrundmusik</h3>
                    <p class="text-sm">
                        Die atmosphärischen Klänge stammen von <a href="https://pixabay.com/music/" target="_blank" class="text-amber-400 hover:underline">Pixabay</a>.
                    </p>
                    <ul class="mt-2 text-xs space-y-1 text-slate-400">
                        <li>• Lizenziert unter der Pixabay Content License.</li>
                        <li>• <a href="https://pixabay.com/service/license-summary/" target="_blank" class="underline">Lizenz-Zusammenfassung ansehen</a></li>
                    </ul>
                </section>

                <div class="pt-6 border-t border-slate-700 flex justify-between items-center">
                    <a href="https://github.com/rondevhub/sandbottle" target="_blank" class="flex items-center gap-2 text-sm hover:text-white transition">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        GitHub Projekt
                    </a>
                    <span class="text-[10px] text-slate-500 uppercase tracking-widest">v1.0.0</span>
                </div>
            </div>
        </div>
    </div>

    <footer class="p-6 bg-slate-900 border-t border-slate-800 z-10">
        <div class="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center items-end">
            
            <div class="flex flex-col gap-2">
                <span class="text-xs uppercase text-slate-400 font-semibold">Farben</span>
                <div id="color-slots" class="flex gap-2"></div>
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

        // Modal Logic
        const modal = document.getElementById('info-modal');
        const infoBtn = document.getElementById('btn-info');
        const closeBtn = document.getElementById('modal-close');

        const toggleModal = () => modal.classList.toggle('modal-active');

        infoBtn.addEventListener('click', toggleModal);
        closeBtn.addEventListener('click', toggleModal);
        
        // Close modal on click outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleModal();
        });
    </script>
    <script src="/assets/js/audio.js"></script>
    <script src="/assets/js/physics.js"></script>
    <script src="/assets/js/ui.js"></script>
</body>
</html>