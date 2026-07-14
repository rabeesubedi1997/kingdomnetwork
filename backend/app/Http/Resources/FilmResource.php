<?php

namespace App\Http\Resources;

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
            'status_config' => $this->status_config,
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
            'director' => $this->whenLoaded('director'),
            'producer' => $this->whenLoaded('producer'),
            'writer' => $this->whenLoaded('writer'),
            'cinematographer' => $this->whenLoaded('cinematographer'),
            'editor' => $this->whenLoaded('editor'),
            'composer' => $this->whenLoaded('composer'),
            'genres' => $this->whenLoaded('genres'),
            'cast' => $this->whenLoaded('cast', fn() => $this->cast->map(fn($castMember) => [
                'id' => $castMember->id,
                'role_name' => $castMember->role_name,
                'character_name' => $castMember->character_name,
                'is_lead' => $castMember->is_lead,
                'sort_order' => $castMember->sort_order,
                'person' => $this->whenLoaded('person'),
            ])),
            'crew' => $this->whenLoaded('crew', fn() => $this->crew->map(fn($crewMember) => [
                'id' => $crewMember->id,
                'department' => $crewMember->department,
                'role' => $crewMember->role,
                'sort_order' => $crewMember->sort_order,
                'person' => $this->whenLoaded('person'),
            ])),
            'awards' => $this->whenLoaded('awards', fn() => $this->awards->map(fn($award) => [
                'id' => $award->id,
                'award_name' => $award->award_name,
                'category' => $award->category,
                'year' => $award->year,
                'result' => $award->result,
                'notes' => $award->notes,
            ])),
            'locations' => $this->whenLoaded('locations', fn() => $this->locations->map(fn($location) => [
                'id' => $location->id,
                'location_name' => $location->location_name,
                'country' => $location->country,
                'lat' => $location->lat,
                'lng' => $location->lng,
                'description' => $location->description,
                'sort_order' => $location->sort_order,
            ])),
            'gallery_images' => $this->whenLoaded('gallery', fn() => $this->gallery_images),
            'press_kit' => $this->whenLoaded('pressKit'),
            'screenings' => $this->whenLoaded('screenings', fn() => $this->screenings->map(fn($screening) => [
                'id' => $screening->id,
                'title' => $screening->title,
                'event_type' => $screening->event_type,
                'start_datetime' => $screening->start_datetime,
                'end_datetime' => $screening->end_datetime,
                'venue_name' => $screening->venue_name,
                'venue_address' => $screening->venue_address,
                'ticket_url' => $screening->ticket_url,
                'is_public' => $screening->is_public,
                'rsvp_required' => $screening->rsvp_required,
            ])),
            'poster_url' => $this->poster_url,
            'banner_url' => $this->banner_url,
            'status_config' => $this->status_config,
            'json_ld' => $this->json_ld,
        ];
    }
}