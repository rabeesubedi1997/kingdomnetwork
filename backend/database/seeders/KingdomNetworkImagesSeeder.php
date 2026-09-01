<?php

namespace Database\Seeders;

use App\Models\Film;
use App\Models\Media;
use App\Models\Person;
use App\Models\Post;
use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class KingdomNetworkImagesSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFilmImages();
        $this->seedPersonImages();
        $this->seedPostImages();
        $this->seedTeamMemberImages();
    }

    private function seedFilmImages(): void
    {
        $config = [
            'pujar-sarki' => ['bg' => [9, 51, 63], 'fg' => [255, 205, 87]],
            'fracture' => ['bg' => [26, 26, 46], 'fg' => [200, 50, 50]],
            'shirjara-song-of-grandmother' => ['bg' => [81, 111, 120], 'fg' => [255, 255, 255]],
        ];

        foreach ($config as $slug => $c) {
            $film = Film::where('slug', $slug)->first();
            if (!$film || $film->getFirstMedia('poster')) continue;

            $poster = $this->generateImage($film->title, $c['bg'], $c['fg'], 800, 1200, true);
            $banner = $this->generateImage($film->title, $c['bg'], $c['fg'], 1920, 600, false);

            $film->addMedia($poster)->toMediaCollection('poster');
            $film->addMedia($banner)->toMediaCollection('banner');
            @unlink($poster); @unlink($banner);
            $this->command?->info("Film images: {$film->title}");
        }
    }

    private function seedPersonImages(): void
    {
        $people = Person::all();
        foreach ($people as $person) {
            if ($person->getFirstMedia('photo')) continue;

            $colors = $this->nameToColor($person->name);
            $file = $this->generatePersonImage($person->name, $colors['bg'], $colors['fg'], 400, 500);
            $person->addMedia($file)->toMediaCollection('photo');
            @unlink($file);
            $this->command?->info("Person image: {$person->name}");
        }
    }

    private function seedPostImages(): void
    {
        $posts = Post::all();
        foreach ($posts as $post) {
            if ($post->getFirstMedia('featured_image')) continue;

            $colors = $this->nameToColor($post->title);
            $file = $this->generateImage($post->title, $colors['bg'], $colors['fg'], 1200, 675, true);
            $post->addMedia($file)->toMediaCollection('featured_image');
            @unlink($file);
            $this->command?->info("Post image: {$post->title}");
        }
    }

    private function seedTeamMemberImages(): void
    {
        $film = Film::first();
        $members = TeamMember::all();
        foreach ($members as $member) {
            if ($member->photo_id || !$film) continue;

            $colors = $this->nameToColor($member->name);
            $file = $this->generatePersonImage($member->name, $colors['bg'], $colors['fg'], 400, 500);

            $media = $film->addMedia($file)->toMediaCollection('team-temp');
            $member->update(['photo_id' => $media->id]);

            @unlink($file);
            $this->command?->info("Team image: {$member->name}");
        }
    }

    private function nameToColor(string $name): array
    {
        $hash = crc32($name);
        $h = abs($hash) % 360;
        $bg = $this->hslToRgb($h, 40, 20);
        $fg = $this->hslToRgb($h, 60, 80);
        return compact('bg', 'fg');
    }

    private function hslToRgb(int $h, int $s, int $l): array
    {
        $s /= 100; $l /= 100;
        $c = (1 - abs(2 * $l - 1)) * $s;
        $x = $c * (1 - abs(fmod($h / 60, 2) - 1));
        $m = $l - $c / 2;
        $rgb = match (true) {
            $h < 60 => [$c, $x, 0],
            $h < 120 => [$x, $c, 0],
            $h < 180 => [0, $c, $x],
            $h < 240 => [0, $x, $c],
            $h < 300 => [$x, 0, $c],
            default => [$c, 0, $x],
        };
        return array_map(fn($v) => intval(($v + $m) * 255), $rgb);
    }

    private function generateImage(string $title, array $bg, array $fg, int $w, int $h, bool $showSubtitle): string
    {
        $img = imagecreatetruecolor($w, $h);
        $bgC = imagecolorallocate($img, $bg[0], $bg[1], $bg[2]);
        $fgC = imagecolorallocate($img, $fg[0], $fg[1], $fg[2]);
        imagefill($img, 0, 0, $bgC);

        $fontFile = 'C:\\Windows\\Fonts\\arial.ttf';
        $fontSize = max(14, min(40, intval($w / 22)));

        if (file_exists($fontFile)) {
            $bbox = imagettfbbox($fontSize, 0, $fontFile, $title);
            $tw = $bbox[2] - $bbox[0];
            $th = $bbox[1] - $bbox[7];
            $x = intval(($w - $tw) / 2);
            $y = intval(($h - $th) / 2 + $th);
            imagettftext($img, $fontSize, 0, $x, $y, $fgC, $fontFile, $title);

            if ($showSubtitle) {
                $sub = 'Kingdom Network';
                $subSize = max(10, intval($fontSize / 2.5));
                $b2 = imagettfbbox($subSize, 0, $fontFile, $sub);
                $tw2 = $b2[2] - $b2[0];
                imagettftext($img, $subSize, 0, intval(($w - $tw2) / 2), $y + $subSize + 12, $fgC, $fontFile, $sub);
            }
        } else {
            imagestring($img, 5, max(0, intval($w / 2) - 60), intval($h / 2) - 10, mb_substr($title, 0, 30), $fgC);
        }

        $path = tempnam(sys_get_temp_dir(), 'img_') . '.jpg';
        imagejpeg($img, $path, 85);
        imagedestroy($img);
        return $path;
    }

    private function generatePersonImage(string $name, array $bg, array $fg, int $w, int $h): string
    {
        $img = imagecreatetruecolor($w, $h);
        $bgC = imagecolorallocate($img, $bg[0], $bg[1], $bg[2]);
        $fgC = imagecolorallocate($img, $fg[0], $fg[1], $fg[2]);
        imagefill($img, 0, 0, $bgC);

        $cx = intval($w / 2);
        $cy = intval($h / 3);
        $r = intval(min($w, $h) / 5);
        imagefilledellipse($img, $cx, $cy, $r * 2, $r * 2, $fgC);
        imageellipse($img, $cx, $cy, $r * 2, $r * 2, imagecolorallocate($img, 255, 255, 255));

        $fontFile = 'C:\\Windows\\Fonts\\arial.ttf';
        if (file_exists($fontFile)) {
            $fs = max(12, min(28, intval($w / 18)));
            $bbox = imagettfbbox($fs, 0, $fontFile, $name);
            $tw = $bbox[2] - $bbox[0];
            imagettftext($img, $fs, 0, intval(($w - $tw) / 2), intval($h * 0.72), $fgC, $fontFile, $name);

            $sub = 'Kingdom Network';
            $ss = max(9, intval($fs / 2.2));
            $bbox2 = imagettfbbox($ss, 0, $fontFile, $sub);
            $tw2 = $bbox2[2] - $bbox2[0];
            imagettftext($img, $ss, 0, intval(($w - $tw2) / 2), intval($h * 0.72) + $ss + 8, $fgC, $fontFile, $sub);
        } else {
            imagestring($img, 5, max(0, intval($w / 2) - 50), intval($h * 0.7), mb_substr($name, 0, 20), $fgC);
        }

        $path = tempnam(sys_get_temp_dir(), 'person_') . '.jpg';
        imagejpeg($img, $path, 85);
        imagedestroy($img);
        return $path;
    }
}
