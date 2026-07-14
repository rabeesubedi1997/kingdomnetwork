<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DemoFilmImagesSeeder extends Seeder
{
    public function run(): void
    {
        $posterColors = [
            'chhadke' => ['bg' => [41, 51, 63], 'text' => [255, 205, 87]],
            'farki-herana' => ['bg' => [81, 111, 120], 'text' => [255, 255, 255]],
            'kathmandu-stories' => ['bg' => [127, 160, 161], 'text' => [255, 255, 255]],
        ];

        foreach ($posterColors as $slug => $colors) {
            $film = Film::where('slug', $slug)->first();
            if (!$film) {
                continue;
            }

            if ($film->getFirstMedia('poster')) {
                continue;
            }

            $posterFile = $this->generatePlaceholderImage(
                $film->title,
                $colors['bg'],
                $colors['text'],
                800,
                1200
            );

            $bannerFile = $this->generatePlaceholderImage(
                $film->title,
                $colors['bg'],
                $colors['text'],
                1920,
                600
            );

            $film->addMedia($posterFile)
                ->toMediaCollection('poster');

            $film->addMedia($bannerFile)
                ->toMediaCollection('banner');

            @unlink($posterFile);
            @unlink($bannerFile);

            $this->command?->info("Added placeholder images for {$film->title}");
        }
    }

    private function generatePlaceholderImage(string $title, array $bg, array $fg, int $width, int $height): string
    {
        $img = imagecreatetruecolor($width, $height);
        $bgColor = imagecolorallocate($img, $bg[0], $bg[1], $bg[2]);
        $fgColor = imagecolorallocate($img, $fg[0], $fg[1], $fg[2]);

        imagefill($img, 0, 0, $bgColor);

        $fontSize = max(16, min(48, intval($width / 20)));
        $x = intval($width / 2);
        $y = intval($height / 2);

        try {
            $fontFile = 'C:\\Windows\\Fonts\\arial.ttf';
            if (file_exists($fontFile)) {
                $bbox = imagettfbbox($fontSize, 0, $fontFile, $title);
                $textWidth = $bbox[2] - $bbox[0];
                $textHeight = $bbox[1] - $bbox[7];
                $x = intval(($width - $textWidth) / 2);
                $y = intval(($height - $textHeight) / 2 + $textHeight);
                imagettftext($img, $fontSize, 0, $x, $y, $fgColor, $fontFile, $title);
            } else {
                $textX = intval($width / 2) - intval(strlen($title) * 5);
                $textY = intval($height / 2);
                imagestring($img, 5, $textX, $textY, $title, $fgColor);
            }
        } catch (\Exception $e) {
            $textX = intval($width / 2) - intval(strlen($title) * 5);
            $textY = intval($height / 2);
            imagestring($img, 5, $textX, $textY, $title, $fgColor);
        }

        $path = tempnam(sys_get_temp_dir(), 'film_') . '.jpg';
        imagejpeg($img, $path, 85);
        imagedestroy($img);

        return $path;
    }
}
