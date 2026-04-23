<?php

namespace SandBottle;

class Config {
    // Definierte Flaschengrößen (Breite x Höhe in Partikel-Einheiten)
    public const BOTTLE_SIZES = [
        'S' => ['width' => 100, 'height' => 150, 'label' => 'Klein'],
        'M' => ['width' => 200, 'height' => 300, 'label' => 'Mittel'],
        'L' => ['width' => 350, 'height' => 500, 'label' => 'Groß'],
        'FULL' => ['width' => 0, 'height' => 0, 'label' => 'Vollbild'] // 0 = Dynamisch
    ];

    public const ALLOWED_AUDIO_EXTENSIONS = ['mp3', 'ogg', 'wav'];
    public const MAX_BACKUP_SIZE = 2 * 1024 * 1024; // 2MB
}