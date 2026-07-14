<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'department' => $this->department,
            'type' => $this->type,
            'location' => $this->location,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'benefits' => $this->benefits,
            'salary_range' => $this->salary_range,
            'is_remote' => $this->is_remote,
            'is_open' => $this->is_open,
            'closes_at' => $this->closes_at?->toISOString(),
            'published_at' => $this->published_at?->toISOString(),
            'applications_count' => $this->whenCounted('applications'),
        ];
    }
}