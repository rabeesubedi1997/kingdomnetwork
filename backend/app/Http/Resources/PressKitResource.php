<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PressKitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'film_id' => $this->film_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'logline' => $this->logline,
            'synopsis_short' => $this->synopsis_short,
            'synopsis_long' => $this->synopsis_long,
            'key_cast' => $this->key_cast,
            'key_crew' => $this->key_crew,
            'technical_specs' => $this->technical_specs,
            'festival_history' => $this->festival_history,
            'awards' => $this->awards,
            'assets' => $this->assets,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'is_public' => $this->is_public,
            'film' => $this->whenLoaded('film'),
        ];
    }
}