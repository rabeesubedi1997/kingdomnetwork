<?php

namespace App\Filament\Resources\FilmResource\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AwardsRelationManager extends RelationManager
{
    protected static string $relationship = 'awards';
    protected static ?string $recordTitleAttribute = 'award_name';
    protected static ?string $title = 'Awards & Recognition';

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('award_name')
                ->required()
                ->maxLength(200),
            Forms\Components\TextInput::make('category')
                ->maxLength(150),
            Forms\Components\TextInput::make('year')
                ->required()
                ->numeric()
                ->minValue(2000)
                ->maxValue(date('Y') + 2),
            Forms\Components\Select::make('result')
                ->options([
                    'won' => 'Won',
                    'nominated' => 'Nominated',
                    'shortlisted' => 'Shortlisted',
                ])
                ->default('nominated')
                ->required(),
            Forms\Components\Textarea::make('notes')
                ->rows(2),
        ])->columns(4);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('award_name')
            ->columns([
                Tables\Columns\TextColumn::make('award_name')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\BadgeColumn::make('result')
                    ->colors([
                        'success' => 'won',
                        'warning' => 'nominated',
                        'info' => 'shortlisted',
                    ])
                    ->formatStateUsing(fn(string $state) => ucfirst($state)),
                Tables\Columns\TextColumn::make('year')
                    ->sortable(),
                Tables\Columns\TextColumn::make('notes')
                    ->limit(40)
                    ->placeholder('—'),
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
            ->defaultSort('year', 'desc');
    }
}