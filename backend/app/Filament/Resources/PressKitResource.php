<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PressKitResource\Pages;
use App\Models\PressKit;
use Filament\Forms;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Tables;
use UnitEnum;
use Filament\Tables\Table;

class PressKitResource extends Resource
{
    protected static ?string $model = PressKit::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-document-text';
    protected static string|UnitEnum|null $navigationGroup = 'Press';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Select::make('film_id')
                ->label('Film')
                ->relationship('film', 'title')
                ->searchable()
                ->preload()
                ->required()
                ->reactive()
                ->afterStateUpdated(fn(Filament\Schemas\Components\Utilities\Set $set, $state) => $state ? $set('title', \App\Models\Film::find($state)?->title . ' Press Kit') : null),

            Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(200),

            Forms\Components\TextInput::make('slug')
                ->required()
                ->maxLength(180)
                ->unique(ignoreRecord: true)
                ->live(onBlur: true)
                ->afterStateUpdated(fn(string $operation, $state, Filament\Schemas\Components\Utilities\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),

            Forms\Components\Textarea::make('logline')
                ->rows(2)
                ->maxLength(300)
                ->columnSpanFull(),

            Forms\Components\Textarea::make('synopsis_short')
                ->label('Short Synopsis')
                ->rows(3)
                ->maxLength(500)
                ->columnSpanFull(),

            Forms\Components\Textarea::make('synopsis_long')
                ->label('Full Synopsis')
                ->rows(5)
                ->columnSpanFull(),

            Forms\Components\Repeater::make('key_cast')
                ->label('Key Cast')
                ->schema([
                    Forms\Components\Select::make('person_id')
                        ->label('Actor')
                        ->relationship('person', 'name')
                        ->searchable()
                        ->preload(),
                    Forms\Components\TextInput::make('character_name')
                        ->label('Character')
                        ->maxLength(100),
                ])->columns(2)->collapsible()->addActionLabel('Add Cast Member'),

            Forms\Components\Repeater::make('key_crew')
                ->label('Key Crew')
                ->schema([
                    Forms\Components\Select::make('person_id')
                        ->label('Person')
                        ->relationship('person', 'name')
                        ->searchable()
                        ->preload(),
                    Forms\Components\TextInput::make('role')
                        ->label('Role')
                        ->maxLength(100),
                    Forms\Components\TextInput::make('department')
                        ->label('Department')
                        ->maxLength(100),
                ])->columns(3)->collapsible()->addActionLabel('Add Crew Member'),

            Forms\Components\Repeater::make('technical_specs')
                ->label('Technical Specifications')
                ->schema([
                    Forms\Components\TextInput::make('spec')
                        ->label('Specification')
                        ->required()
                        ->maxLength(100),
                    Forms\Components\TextInput::make('value')
                        ->required()
                        ->maxLength(200),
                ])->columns(2)->collapsible()->addActionLabel('Add Specification'),

            Forms\Components\Repeater::make('festival_history')
                ->label('Festival History')
                ->schema([
                    Forms\Components\TextInput::make('festival')
                        ->required()
                        ->maxLength(200),
                    Forms\Components\TextInput::make('year')
                        ->numeric()
                        ->minValue(2000)
                        ->maxValue(date('Y') + 1),
                    Forms\Components\TextInput::make('award')
                        ->label('Award/Selection')
                        ->maxLength(200),
                    Forms\Components\TextInput::make('category')
                        ->maxLength(150),
                ])->columns(4)->collapsible()->addActionLabel('Add Festival'),

            Forms\Components\Repeater::make('awards')
                ->label('Awards')
                ->schema([
                    Forms\Components\TextInput::make('award_name')
                        ->required()
                        ->maxLength(200),
                    Forms\Components\TextInput::make('category')
                        ->maxLength(150),
                    Forms\Components\TextInput::make('year')
                        ->numeric()
                        ->minValue(2000)
                        ->maxValue(date('Y') + 1),
                    Forms\Components\Select::make('result')
                        ->options([
                            'won' => 'Won',
                            'nominated' => 'Nominated',
                            'shortlisted' => 'Shortlisted',
                        ])
                        ->default('nominated')
                        ->required(),
                ])->columns(4)->collapsible()->addActionLabel('Add Award'),

            Forms\Components\Section::make('Downloadable Assets')->schema([
                Forms\Components\FileUpload::make('assets')
                    ->label('All Assets (Posters, Stills, Clips, Logos, One-Sheets)')
                    ->multiple()
                    ->directory('press-kits/assets')
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'])
                    ->maxSize(51200)
                    ->downloadable()
                    ->openable()
                    ->panelLayout('grid')
                    ->reorderable(),
            ]),

            Forms\Components\Section::make('Contact & Settings')->schema([
                Forms\Components\TextInput::make('contact_email')
                    ->email()
                    ->label('Press Contact Email')
                    ->placeholder('press@kingdomnetwork.com.np'),
                Forms\Components\TextInput::make('contact_phone')
                    ->label('Press Contact Phone'),
                Forms\Components\Toggle::make('is_public')
                    ->label('Publicly Accessible')
                    ->default(true),
                Forms\Components\TextInput::make('password')
                    ->label('Password Protection (Optional)')
                    ->placeholder('Leave empty for no password')
                    ->password()
                    ->revealable(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->limit(40),
                Tables\Columns\TextColumn::make('film.title')
                    ->label('Film')
                    ->badge()
                    ->color('primary')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_public')
                    ->label('Public')
                    ->boolean()
                    ->trueIcon('heroicon-o-eye')
                    ->falseIcon('heroicon-o-eye-slash')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('contact_email')
                    ->label('Press Email')
                    ->icon('heroicon-m-envelope')
                    ->placeholder('—')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('M d, Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_public')
                    ->label('Public Only'),
                Tables\Filters\SelectFilter::make('film_id')
                    ->relationship('film', 'title')
                    ->label('Film'),
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
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPressKits::route('/'),
            'create' => Pages\CreatePressKit::route('/create'),
            'view' => Pages\ViewPressKit::route('/{record}'),
            'edit' => Pages\EditPressKit::route('/{record}/edit'),
        ];
    }
}