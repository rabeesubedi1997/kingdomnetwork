<?php

namespace App\Filament\Resources\FilmResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class CastRelationManager extends RelationManager
{
    protected static string $relationship = 'cast';
    protected static ?string $recordTitleAttribute = 'character_name';
    protected static ?string $title = 'Cast Members';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Select::make('person_id')
                ->label('Actor')
                ->relationship('person', 'name')
                ->searchable()
                ->preload()
                ->required(),
            Forms\Components\TextInput::make('character_name')
                ->required()
                ->maxLength(100),
            Forms\Components\TextInput::make('role_name')
                ->default('Cast')
                ->maxLength(50),
            Forms\Components\Toggle::make('is_lead')
                ->label('Lead Role'),
            Forms\Components\TextInput::make('sort_order')
                ->numeric()
                ->default(0),
        ])->columns(4);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('character_name')
            ->columns([
                Tables\Columns\TextColumn::make('person.name')
                    ->label('Actor')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('character_name')
                    ->label('Character')
                    ->searchable(),
                Tables\Columns\TextColumn::make('role_name')
                    ->label('Role Type'),
                Tables\Columns\IconColumn::make('is_lead')
                    ->label('Lead')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray'),
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