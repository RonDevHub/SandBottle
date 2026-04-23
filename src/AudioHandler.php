<?php

namespace SandBottle;

class AudioHandler {
    private string $audioPath;

    public function __construct(string $audioPath) {
        $this->audioPath = $audioPath;
    }

    public function getPlaylist(): array {
        if (!is_dir($this->audioPath)) {
            return [];
        }

        $files = scandir($this->audioPath);
        $playlist = [];

        foreach ($files as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, Config::ALLOWED_AUDIO_EXTENSIONS)) {
                $playlist[] = [
                    'name' => pathinfo($file, PATHINFO_FILENAME),
                    'url'  => '/assets/audio/' . $file
                ];
            }
        }

        return $playlist;
    }
}