<?php

namespace App\Filament\Resources\PressKitResource\Pages;

use App\Filament\Resources\PressKitResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePressKit extends CreateRecord
{
    protected static string $resource = PressKitResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}