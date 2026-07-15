<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray($request): array
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
            'sort_order' => $this->sort_order,
            'applications_count' => $this->whenHas('applications_count'),
            'closes_at' => $this->closes_at?->toISOString(),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
