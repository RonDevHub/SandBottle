<?php

namespace SandBottle\Sanity;

use SandBottle\Config;

class BackupValidator {
    public static function validate(string $jsonData): ?array {
        $data = json_decode($jsonData, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        // Grundstruktur prüfen
        if (!isset($data['version'], $data['size'], $data['grid_rle'])) {
            return null;
        }

        // Größe validieren
        if (!isset(Config::BOTTLE_SIZES[$data['size']])) {
            return null;
        }

        // RLE-Daten auf Integrität prüfen (einfacher Typcheck)
        if (!is_array($data['grid_rle'])) {
            return null;
        }

        return $data;
    }
}