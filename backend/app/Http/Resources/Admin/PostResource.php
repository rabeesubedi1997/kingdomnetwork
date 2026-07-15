<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image_url' => $this->featured_image_url,
            'author_id' => $this->author_id,
            'category_id' => $this->category_id,
            'status' => $this->status,
            'featured' => $this->featured,
            'reading_time' => $this->reading_time,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'schema_type' => $this->schema_type,
            'author' => $this->whenLoaded('author'),
            'category' => $this->whenLoaded('category'),
            'tags' => $this->whenLoaded('tags'),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
