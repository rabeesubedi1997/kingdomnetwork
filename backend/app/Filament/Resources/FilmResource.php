<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FilmResource\Pages;
use App\Filament\Resources\FilmResource\RelationManagers;
use App\Models\Film;
use Filament\Forms;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Tables;
use UnitEnum;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FilmResource extends Resource
{
    protected static ?string $model = Film::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-film';
    protected static string|UnitEnum|null $navigationGroup = 'Films';
    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Basic Information')->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn(string $operation, $state, Filament\Schemas\Components\Utilities\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(180)
                    ->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('tagline')
                    ->maxLength(300),
                Forms\Components\Textarea::make('synopsis')
                    ->rows(5)
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('short_description')
                    ->rows(3)
                    ->maxLength(500)
                    ->columnSpanFull(),
                Forms\Components\Select::make('status')
                    ->options([
                        'released' => 'Released',
                        'post_production' => 'Post-Production',
                        'pre_production' => 'Pre-Production',
                        'development' => 'Development',
                        'announced' => 'Announced',
                        'cancelled' => 'Cancelled',
                    ])
                    ->default('development')
                    ->required(),
                Forms\Components\DatePicker::make('release_date'),
                Forms\Components\TextInput::make('runtime_minutes')
                    ->numeric()
                    ->minValue(1)
                    ->maxValue(300)
                    ->suffix('minutes'),
                Forms\Components\TextInput::make('rating')
                    ->maxLength(20),
                Forms\Components\TextInput::make('language')
                    ->default('Nepali')
                    ->maxLength(50),
                Forms\Components\TextInput::make('country')
                    ->default('Nepal')
                    ->maxLength(50),
                Forms\Components\TextInput::make('budget')
                    ->numeric()
                    ->prefix('₨')
                    ->minValue(0),
                Forms\Components\TextInput::make('box_office')
                    ->numeric()
                    ->prefix('₨')
                    ->minValue(0),
                Forms\Components\TextInput::make('trailer_url')
                    ->url()
                    ->maxLength(500)
                    ->label('Trailer URL (YouTube/Vimeo)'),
                Forms\Components\Textarea::make('trailer_embed_code')
                    ->rows(3)
                    ->label('Custom Embed Code (optional)'),
            ])->columns(2),

            Forms\Components\Section::make('Key Crew')->schema([
                Forms\Components\Select::make('director_id')
                    ->relationship('director', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Director'),
                Forms\Components\Select::make('producer_id')
                    ->relationship('producer', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Producer'),
                Forms\Components\Select::make('writer_id')
                    ->relationship('writer', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Writer'),
                Forms\Components\Select::make('cinematographer_id')
                    ->relationship('cinematographer', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Cinematographer'),
                Forms\Components\Select::make('editor_id')
                    ->relationship('editor', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Editor'),
                Forms\Components\Select::make('composer_id')
                    ->relationship('composer', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Composer'),
            ])->columns(3),

            Forms\Components\Section::make('Genres')->schema([
                Forms\Components\Select::make('genres')
                    ->relationship('genres', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
            ]),

            Forms\Components\Section::make('Cast')->schema([
                Forms\Components\Repeater::make('cast')
                    ->relationship('cast')
                    ->schema([
                        Forms\Components\Select::make('person_id')
                            ->label('Actor')
                            ->relationship('person', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Forms\Components\TextInput::make('character_name')
                            ->label('Character Name')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('role_name')
                            ->label('Role Type')
                            ->default('Cast')
                            ->maxLength(50),
                        Forms\Components\Toggle::make('is_lead')
                            ->label('Lead Role'),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(4)
                    ->orderable('sort_order')
                    ->addActionLabel('Add Cast Member')
                    ->collapsible()
                    ->itemLabel(fn(array $state): ?string => $state['person_id'] ? \App\Models\Person::find($state['person_id'])?->name : null),
            ]),

            Forms\Components\Section::make('Crew')->schema([
                Forms\Components\Repeater::make('crew')
                    ->relationship('crew')
                    ->schema([
                        Forms\Components\Select::make('person_id')
                            ->label('Crew Member')
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
                            ->required(),
                        Forms\Components\TextInput::make('role')
                            ->required()
                            ->maxLength(100),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(4)
                    ->orderable('sort_order')
                    ->addActionLabel('Add Crew Member')
                    ->collapsible()
                    ->itemLabel(fn(array $state): ?string => $state['person_id'] ? \App\Models\Person::find($state['person_id'])?->name : null),
            ]),

            Forms\Components\Section::make('Awards & Recognition')->schema([
                Forms\Components\Repeater::make('awards')
                    ->relationship('awards')
                    ->schema([
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
                    ])
                    ->columns(4)
                    ->addActionLabel('Add Award')
                    ->collapsible()
                    ->itemLabel(fn(array $state): ?string => $state['award_name'] ?? null),
            ]),

            Forms\Components\Section::make('Filming Locations')->schema([
                Forms\Components\Repeater::make('locations')
                    ->relationship('locations')
                    ->schema([
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
                    ])
                    ->columns(4)
                    ->orderable('sort_order')
                    ->addActionLabel('Add Location')
                    ->collapsible(),
            ]),

            Forms\Components\Section::make('Gallery')->schema([
                Forms\Components\FileUpload::make('gallery')
                    ->relationship('gallery')
                    ->multiple()
                    ->image()
                    ->directory('films/gallery')
                    ->maxSize(10240)
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->panelLayout('grid')
                    ->reorderable()
                    ->panelAspectRatio('16:9')
                    ->downloadable()
                    ->openable(),
            ]),

            Forms\Components\Section::make('Poster & Banner')->schema([
                Forms\Components\FileUpload::make('poster')
                    ->label('Poster Image')
                    ->image()
                    ->directory('films/posters')
                    ->maxSize(5120)
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->imageResizeTargetWidth('800')
                    ->imageResizeTargetHeight('1200')
                    ->singleImageRules(['dimensions:min_width=600,min_height=900']),
                Forms\Components\FileUpload::make('banner')
                    ->label('Banner Image (Hero)')
                    ->image()
                    ->directory('films/banners')
                    ->maxSize(5120)
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->imageResizeTargetWidth('1920')
                    ->imageResizeTargetHeight('1080')
                    ->singleImageRules(['dimensions:min_width=1200,min_height=675']),
            ])->columns(2),

            Forms\Components\Section::make('Settings')->schema([
                Forms\Components\Toggle::make('is_featured')
                    ->label('Featured Film'),
                Forms\Components\TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->label('Display Order'),
                Forms\Components\DateTimePicker::make('published_at')
                    ->label('Publish Date')
                    ->native(false),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('poster')
                    ->label('Poster')
                    ->disk('public')
                    ->height(60)
                    ->width(40),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->limit(40),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => 'released',
                        'info' => 'post_production',
                        'warning' => 'pre_production',
                        'gray' => 'development',
                        'primary' => 'announced',
                        'danger' => 'cancelled',
                    ])
                    ->formatStateUsing(fn(string $state) => ucwords(str_replace('_', ' ', $state))),
                Tables\Columns\TextColumn::make('release_date')
                    ->date('M d, Y')
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray'),
                Tables\Columns\TextColumn::make('director.name')
                    ->label('Director')
                    ->sortable()
                    ->searchable()
                    ->limit(25)
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'released' => 'Released',
                        'post_production' => 'Post-Production',
                        'pre_production' => 'Pre-Production',
                        'development' => 'Development',
                        'announced' => 'Announced',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured Only'),
                Tables\Filters\Filter::make('released')
                    ->label('Released Films')
                    ->query(fn(Builder $q) => $q->where('status', 'released')),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('mark_featured')
                        ->label('Mark as Featured')
                        ->icon('heroicon-o-star')
                        ->action(fn($records) => $records->each->update(['is_featured' => true])),
                    Tables\Actions\BulkAction::make('unmark_featured')
                        ->label('Remove Featured')
                        ->icon('heroicon-o-star')
                        ->color('gray')
                        ->action(fn($records) => $records->each->update(['is_featured' => false])),
                ]),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order');
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\CastRelationManager::class,
            RelationManagers\CrewRelationManager::class,
            RelationManagers\AwardsRelationManager::class,
            RelationManagers\LocationsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFilms::route('/'),
            'create' => Pages\CreateFilm::route('/create'),
            'view' => Pages\ViewFilm::route('/{record}'),
            'edit' => Pages\EditFilm::route('/{record}/edit'),
        ];
    }
}