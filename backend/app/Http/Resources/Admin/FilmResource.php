<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class FilmResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'tagline' => $this->tagline,
            'synopsis' => $this->synopsis,
            'short_description' => $this->short_description,
            'status' => $this->status,
            'release_date' => $this->release_date?->toDateString(),
            'runtime_minutes' => $this->runtime_minutes,
            'rating' => $this->rating,
            'language' => $this->language,
            'country' => $this->country,
            'budget' => $this->budget,
            'box_office' => $this->box_office,
            'trailer_url' => $this->trailer_url,
            'trailer_embed_code' => $this->trailer_embed_code,
            'trailer_embed_url' => $this->trailer_embed_url,
            'director_id' => $this->director_id,
            'producer_id' => $this->producer_id,
            'writer_id' => $this->writer_id,
            'cinematographer_id' => $this->cinematographer_id,
            'editor_id' => $this->editor_id,
            'composer_id' => $this->composer_id,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'poster_url' => $this->poster_url,
            'banner_url' => $this->banner_url,
            'genres' => $this->whenLoaded('genres'),
            'director' => $this->whenLoaded('director'),
            'producer' => $this->whenLoaded('producer'),
            'writer' => $this->whenLoaded('writer'),
            'cinematographer' => $this->whenLoaded('cinematographer'),
            'editor' => $this->whenLoaded('editor'),
            'composer' => $this->whenLoaded('composer'),
            'cast' => $this->whenLoaded('cast'),
            'crew' => $this->whenLoaded('crew'),
            'awards' => $this->whenLoaded('awards'),
            'locations' => $this->whenLoaded('locations'),
            'press_kit' => $this->whenLoaded('pressKit'),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
