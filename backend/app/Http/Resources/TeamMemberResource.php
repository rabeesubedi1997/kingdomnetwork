<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'bio' => $this->bio,
            'photo_url' => $this->photo?->getUrl(),
            'social_links' => $this->social_links,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}