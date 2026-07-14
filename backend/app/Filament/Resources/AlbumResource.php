<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AlbumResource\Pages;
use App\Models\Album;
use BackedEnum;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;

class AlbumResource extends Resource
{
    protected static ?string $model = Album::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-photo';
    protected static string|UnitEnum|null $navigationGroup = 'Gallery';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Album Details')->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn(string $operation, $state, Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(180)
                    ->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull(),
                Forms\Components\Select::make('category')
                    ->options([
                        'behind_the_scenes' => 'Behind the Scenes',
                        'posters' => 'Posters',
                        'stills' => 'Production Stills',
                        'events' => 'Events & Premieres',
                        'concept_art' => 'Concept Art',
                        'marketing' => 'Marketing Materials',
                    ])
                    ->required(),
                Forms\Components\Select::make('film_id')
                    ->label('Associated Film')
                    ->relationship('film', 'title')
                    ->searchable()
                    ->preload()
                    ->placeholder('No film associated'),
                Forms\Components\Select::make('event_id')
                    ->label('Associated Event')
                    ->relationship('event', 'title')
                    ->searchable()
                    ->preload()
                    ->placeholder('No event associated'),
                Forms\Components\Toggle::make('is_public')
                    ->label('Publicly Visible')
                    ->default(true),
                Forms\Components\TextInput::make('sort_order')
                    ->numeric()
                    ->default(0),
            ])->columns(2),

            Forms\Components\Section::make('Cover Image')->schema([
                Forms\Components\FileUpload::make('cover')
                    ->label('Album Cover')
                    ->image()
                    ->directory('gallery/covers')
                    ->maxSize(5120)
                    ->imageResizeTargetWidth('800')
                    ->imageResizeTargetHeight('600')
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover')
                    ->disk('public')
                    ->height(50)
                    ->width(80),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->limit(40),
                Tables\Columns\BadgeColumn::make('category')
                    ->colors([
                        'primary' => 'behind_the_scenes',
                        'success' => 'posters',
                        'info' => 'stills',
                        'warning' => 'events',
                        'danger' => 'concept_art',
                        'gray' => 'marketing',
                    ])
                    ->formatStateUsing(fn($state) => str_replace('_', ' ', ucwords($state, '_'))),
                Tables\Columns\TextColumn::make('film.title')
                    ->label('Film')
                    ->badge()
                    ->color('primary')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('event.title')
                    ->label('Event')
                    ->badge()
                    ->color('info')
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_public')
                    ->label('Public')
                    ->boolean()
                    ->trueIcon('heroicon-o-eye')
                    ->falseIcon('heroicon-o-eye-slash')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('images_count')
                    ->label('Images')
                    ->counts('images')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'behind_the_scenes' => 'Behind the Scenes',
                        'posters' => 'Posters',
                        'stills' => 'Production Stills',
                        'events' => 'Events & Premieres',
                        'concept_art' => 'Concept Art',
                        'marketing' => 'Marketing Materials',
                    ]),
                Tables\Filters\SelectFilter::make('film_id')
                    ->relationship('film', 'title')
                    ->label('Film'),
                Tables\Filters\TernaryFilter::make('is_public')
                    ->label('Public Only'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->reorderable('sort_order')
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAlbums::route('/'),
            'create' => Pages\CreateAlbum::route('/create'),
            'view' => Pages\ViewAlbum::route('/{record}'),
            'edit' => Pages\EditAlbum::route('/{record}/edit'),
        ];
    }
}