<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiteSettingResource\Pages;
use App\Models\SiteSetting;
use Filament\Forms;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Tables;
use UnitEnum;
use Filament\Tables\Table;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static string|UnitEnum|null $navigationGroup = 'Core';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Setting')->schema([
                Forms\Components\TextInput::make('key')
                    ->required()
                    ->maxLength(100)
                    ->unique(ignoreRecord: true)
                    ->helperText('Unique key for this setting (e.g., site_name, contact_email)'),
                Forms\Components\Select::make('group')
                    ->options([
                        'general' => 'General',
                        'contact' => 'Contact',
                        'social' => 'Social Media',
                        'seo' => 'SEO',
                        'analytics' => 'Analytics',
                    ])
                    ->default('general')
                    ->required(),
                Forms\Components\Toggle::make('is_public')
                    ->label('Publicly Accessible via API')
                    ->default(false)
                    ->helperText('If enabled, this setting will be available in the public /site endpoint'),
            ])->columns(3),

            Forms\Components\Section::make('Value')->schema([
                Forms\Components\Textarea::make('value')
                    ->label('Setting Value (JSON)')
                    ->rows(8)
                    ->columnSpanFull()
                    ->helperText('Enter valid JSON. Examples: "string", 123, true, {"key": "value"}, ["item1", "item2"]')
                    ->extraAttributes(['style' => 'font-family: monospace;']),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('key')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->copyable()
                    ->copyMessage('Key copied'),
                Tables\Columns\BadgeColumn::make('group')
                    ->colors([
                        'primary' => 'general',
                        'success' => 'contact',
                        'info' => 'social',
                        'warning' => 'seo',
                        'purple' => 'analytics',
                    ]),
                Tables\Columns\IconColumn::make('is_public')
                    ->label('Public')
                    ->boolean()
                    ->trueIcon('heroicon-o-globe-alt')
                    ->falseIcon('heroicon-o-lock-closed')
                    ->trueColor('success')
                    ->falseColor('gray'),
                Tables\Columns\TextColumn::make('value')
                    ->label('Value')
                    ->limit(60)
                    ->wrap()
                    ->html()
                    ->formatStateUsing(fn($state) => is_string($state) ? $state : json_encode($state, JSON_PRETTY_PRINT)),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('group')
                    ->options([
                        'general' => 'General',
                        'contact' => 'Contact',
                        'social' => 'Social Media',
                        'seo' => 'SEO',
                        'analytics' => 'Analytics',
                    ]),
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
            ->defaultSort('group')
            ->defaultSort('key');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSiteSettings::route('/'),
            'create' => Pages\CreateSiteSetting::route('/create'),
            'view' => Pages\ViewSiteSetting::route('/{record}'),
            'edit' => Pages\EditSiteSetting::route('/{record}/edit'),
        ];
    }
}