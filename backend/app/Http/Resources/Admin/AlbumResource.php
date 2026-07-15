<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'cover_url' => $this->cover_url,
            'category' => $this->category,
            'film_id' => $this->film_id,
            'event_id' => $this->event_id,
            'is_public' => $this->is_public,
            'sort_order' => $this->sort_order,
            'film' => $this->whenLoaded('film'),
            'event' => $this->whenLoaded('event'),
            'images' => $this->whenLoaded('images'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
