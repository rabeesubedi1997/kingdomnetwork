<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'event_type' => $this->event_type,
            'start_datetime' => $this->start_datetime?->toISOString(),
            'end_datetime' => $this->end_datetime?->toISOString(),
            'venue_name' => $this->venue_name,
            'venue_address' => $this->venue_address,
            'venue_city' => $this->venue_city,
            'venue_country' => $this->venue_country,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'film' => $this->whenLoaded('film', fn() => [
                'id' => $this->film->id,
                'title' => $this->film->title,
                'slug' => $this->film->slug,
            ]),
            'poster' => $this->poster,
            'ticket_url' => $this->ticket_url,
            'is_public' => $this->is_public,
            'rsvp_required' => $this->rsvp_required,
            'max_attendees' => $this->max_attendees,
            'rsvps' => $this->whenLoaded('rsvps', fn() => $this->rsvps),
        ];
    }
}