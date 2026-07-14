<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PersonResource\Pages;
use App\Models\Person;
use Filament\Forms;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Tables;
use UnitEnum;
use Filament\Tables\Table;

class PersonResource extends Resource
{
    protected static ?string $model = Person::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-user';
    protected static string|UnitEnum|null $navigationGroup = 'Films';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Personal Details')->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(150)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn(string $operation, $state, Filament\Schemas\Components\Utilities\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(180)
                    ->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('role')
                    ->maxLength(100)
                    ->placeholder('Director, Actor, Producer, etc.'),
                Forms\Components\Textarea::make('bio')
                    ->rows(5)
                    ->columnSpanFull(),
                Forms\Components\DatePicker::make('birth_date'),
                Forms\Components\TextInput::make('birth_place')
                    ->maxLength(150),
                Forms\Components\TextInput::make('imdb_url')
                    ->url()
                    ->maxLength(300)
                    ->label('IMDb URL'),
                Forms\Components\KeyValue::make('social_links')
                    ->label('Social Links')
                    ->keyLabel('Platform')
                    ->valueLabel('URL')
                    ->addActionLabel('Add Social Link')
                    ->columnSpanFull(),
            ])->columns(2),

            Forms\Components\Section::make('Profile Photo')->schema([
                Forms\Components\FileUpload::make('photo')
                    ->label('Profile Photo')
                    ->image()
                    ->directory('people')
                    ->maxSize(5120)
                    ->imageResizeTargetWidth('400')
                    ->imageResizeTargetHeight('500')
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->disk('public')
                    ->height(50)
                    ->width(50)
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                Tables\Columns\TextColumn::make('role')
                    ->badge()
                    ->color('primary')
                    ->limit(20),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('directedFilms_count')
                    ->label('Directed')
                    ->counts('directedFilms')
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('producedFilms_count')
                    ->label('Produced')
                    ->counts('producedFilms')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('castRoles_count')
                    ->label('Cast Roles')
                    ->counts('castRoles')
                    ->badge()
                    ->color('warning'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Only'),
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
            ->defaultSort('name');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPeople::route('/'),
            'create' => Pages\CreatePerson::route('/create'),
            'view' => Pages\ViewPerson::route('/{record}'),
            'edit' => Pages\EditPerson::route('/{record}/edit'),
        ];
    }
}