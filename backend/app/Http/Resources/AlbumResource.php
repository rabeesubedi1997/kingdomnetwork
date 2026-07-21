<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'cover_url' => $this->cover_url,
            'category' => $this->category,
            'film' => $this->whenLoaded('film', fn() => [
                'id' => $this->film->id,
                'title' => $this->film->title,
                'slug' => $this->film->slug,
            ]),
            'event' => $this->whenLoaded('event', fn() => [
                'id' => $this->event->id,
                'title' => $this->event->title,
                'slug' => $this->event->slug,
            ]),
            'is_public' => $this->is_public,
            'sort_order' => $this->sort_order,
            'images' => $this->whenLoaded('images', fn() => $this->images->map(fn($image) => [
                'id' => $image->id,
                'media_id' => $image->media_id,
                'caption' => $image->caption,
                'sort_order' => $image->sort_order,
                'media' => $image->media ? [
                    'id' => $image->media->id,
                    'url' => $image->media->original_url,
                    'thumb' => $image->media->preview_url ?: $image->media->original_url,
                ] : null,
            ])),
            'cover' => $this->cover,
        ];
    }
}