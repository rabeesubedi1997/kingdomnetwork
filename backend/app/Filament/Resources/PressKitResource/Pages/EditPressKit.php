<?php

namespace App\Filament\Resources\PressKitResource\Pages;

use App\Filament\Resources\PressKitResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPressKit extends EditRecord
{
    protected static string $resource = PressKitResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}