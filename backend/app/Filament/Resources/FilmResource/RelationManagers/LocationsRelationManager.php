<?php

namespace App\Filament\Resources\FilmResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class LocationsRelationManager extends RelationManager
{
    protected static string $relationship = 'locations';
    protected static ?string $recordTitleAttribute = 'location_name';
    protected static ?string $title = 'Filming Locations';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('location_name')
                ->required()
                ->maxLength(150),
            Forms\Components\TextInput::make('country')
                ->default('Nepal')
                ->maxLength(50),
            Forms\Components\TextInput::make('lat')
                ->numeric()
                ->step('any')
                ->label('Latitude'),
            Forms\Components\TextInput::make('lng')
                ->numeric()
                ->step('any')
                ->label('Longitude'),
            Forms\Components\Textarea::make('description')
                ->rows(2),
            Forms\Components\TextInput::make('sort_order')
                ->numeric()
                ->default(0),
        ])->columns(4);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('location_name')
            ->columns([
                Tables\Columns\TextColumn::make('location_name')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                Tables\Columns\TextColumn::make('country')
                    ->badge(),
                Tables\Columns\TextColumn::make('lat')
                    ->label('Lat/Lng')
                    ->formatStateUsing(fn($state, $record) => $state ? "{$state}, {$record->lng}" : '—'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->reorderable('sort_order');
    }
}