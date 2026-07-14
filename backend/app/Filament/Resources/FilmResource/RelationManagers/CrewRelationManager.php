<?php

namespace App\Filament\Resources\FilmResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class CrewRelationManager extends RelationManager
{
    protected static string $relationship = 'crew';
    protected static ?string $recordTitleAttribute = 'role';
    protected static ?string $title = 'Crew Members';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Select::make('person_id')
                ->label('Person')
                ->relationship('person', 'name')
                ->searchable()
                ->preload()
                ->required(),
            Forms\Components\Select::make('department')
                ->options([
                    'Directing' => 'Directing',
                    'Writing' => 'Writing',
                    'Production' => 'Production',
                    'Camera' => 'Camera',
                    'Lighting' => 'Lighting',
                    'Sound' => 'Sound',
                    'Art' => 'Art Direction',
                    'Costume' => 'Costume & Makeup',
                    'Editing' => 'Editing',
                    'Visual Effects' => 'Visual Effects',
                    'Music' => 'Music',
                    'Post Production' => 'Post Production',
                ])
                ->required()
                ->searchable(),
            Forms\Components\TextInput::make('role')
                ->required()
                ->maxLength(100),
            Forms\Components\TextInput::make('sort_order')
                ->numeric()
                ->default(0),
        ])->columns(4);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('role')
            ->columns([
                Tables\Columns\TextColumn::make('person.name')
                    ->label('Person')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('department')
                    ->badge()
                    ->colors([
                        'primary' => 'Directing',
                        'success' => 'Camera',
                        'warning' => 'Lighting',
                        'info' => 'Sound',
                        'gray' => 'Editing',
                        'purple' => 'Music',
                        'pink' => 'Art',
                    ])
                    ->searchable(),
                Tables\Columns\TextColumn::make('role')
                    ->searchable(),
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