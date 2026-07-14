<?php

namespace App\Filament\Resources\PressKitResource\Pages;

use App\Filament\Resources\PressKitResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPressKit extends ViewRecord
{
    protected static string $resource = PressKitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}