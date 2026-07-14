<?php

namespace App\Console\Commands;

use App\Models\Film;
use Illuminate\Console\Command;

class DownloadFilmImages extends Command
{
    protected $signature = 'films:download-images';
    protected $description = 'Download poster and banner images for films from known URLs';

    public function handle(): int
    {
        $films = [
            'pujar-sarki' => [
                'poster' => 'https://upload.wikimedia.org/wikipedia/en/9/9a/Pujar_Sarki.jpg',
            ],
        ];

        foreach ($films as $slug => $urls) {
            $film = Film::where('slug', $slug)->first();
            if (!$film) {
                $this->warn("Film '$slug' not found");
                continue;
            }

            foreach (['poster', 'banner'] as $type) {
                $url = $urls[$type] ?? null;
                if (!$url) {
                    continue;
                }

                if ($film->getFirstMedia($type)) {
                    $this->info("$slug $type already exists");
                    continue;
                }

                try {
                    $imageData = @file_get_contents($url, false, stream_context_create([
                        'http' => ['timeout' => 30, 'user_agent' => 'Mozilla/5.0'],
                        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
                    ]));

                    if ($imageData === false) {
                        $this->warn("Failed to download $slug $type");
                        continue;
                    }

                    $tempPath = tempnam(sys_get_temp_dir(), 'film_');
                    file_put_contents($tempPath, $imageData);

                    $extension = 'jpg';
                    $parsed = parse_url($url, PHP_URL_PATH);
                    if ($parsed) {
                        $ext = pathinfo($parsed, PATHINFO_EXTENSION);
                        if ($ext) { $extension = $ext; }
                    }

                    $media = $film->addMedia($tempPath)
                        ->usingFileName("{$slug}-{$type}.{$extension}")
                        ->toMediaCollection($type);

                    unlink($tempPath);
                    $this->info("Downloaded $slug $type: {$media->getUrl()}");
                } catch (\Exception $e) {
                    $this->error("Error on {$slug} {$type}: {$e->getMessage()}");
                }
            }
        }

        return Command::SUCCESS;
    }
}
