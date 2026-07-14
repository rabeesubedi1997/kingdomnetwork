<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobResource\Pages;
use App\Models\Job;
use Filament\Forms;
use Filament\Schemas\Schema;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Tables;
use UnitEnum;
use Filament\Tables\Table;

class JobResource extends Resource
{
    protected static ?string $model = Job::class;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';
    protected static string|UnitEnum|null $navigationGroup = 'Careers';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Job Details')->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(200)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn(string $operation, $state, Filament\Schemas\Components\Utilities\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(180)
                    ->unique(ignoreRecord: true),
                Forms\Components\Select::make('department')
                    ->options([
                        'Production' => 'Production',
                        'Development' => 'Development',
                        'Marketing' => 'Marketing',
                        'Finance' => 'Finance',
                        'Operations' => 'Operations',
                        'Creative' => 'Creative',
                        'Technical' => 'Technical',
                        'Human Resources' => 'Human Resources',
                    ])
                    ->required()
                    ->searchable(),
                Forms\Components\Select::make('type')
                    ->options([
                        'full_time' => 'Full Time',
                        'part_time' => 'Part Time',
                        'contract' => 'Contract',
                        'internship' => 'Internship',
                        'freelance' => 'Freelance',
                    ])
                    ->default('full_time')
                    ->required(),
                Forms\Components\TextInput::make('location')
                    ->default('Kathmandu, Nepal')
                    ->maxLength(150),
                Forms\Components\TextInput::make('salary_range')
                    ->maxLength(100)
                    ->placeholder('e.g., ₨50,000 - ₨80,000/month'),
                Forms\Components\Toggle::make('is_remote')
                    ->label('Remote Friendly'),
            ])->columns(3),

            Forms\Components\Section::make('Description')->schema([
                Forms\Components\RichEditor::make('description')
                    ->label('Job Description')
                    ->columnSpanFull()
                    ->toolbarButtons([
                        'blockquote', 'bold', 'bulletList', 'codeBlock', 'h2', 'h3', 'italic', 'link', 'orderedList', 'redo', 'strike', 'underline', 'undo',
                    ]),
                Forms\Components\RichEditor::make('requirements')
                    ->label('Requirements')
                    ->columnSpanFull()
                    ->toolbarButtons([
                        'blockquote', 'bold', 'bulletList', 'codeBlock', 'h2', 'h3', 'italic', 'link', 'orderedList', 'redo', 'strike', 'underline', 'undo',
                    ]),
                Forms\Components\RichEditor::make('benefits')
                    ->label('Benefits')
                    ->columnSpanFull()
                    ->toolbarButtons([
                        'blockquote', 'bold', 'bulletList', 'codeBlock', 'h2', 'h3', 'italic', 'link', 'orderedList', 'redo', 'strike', 'underline', 'undo',
                    ]),
            ])->columns(1),

            Forms\Components\Section::make('Publishing')->schema([
                Forms\Components\Toggle::make('is_open')
                    ->label('Position Open')
                    ->default(true),
                Forms\Components\DateTimePicker::make('closes_at')
                    ->label('Application Deadline')
                    ->native(false),
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
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('medium')
                    ->limit(40),
                Tables\Columns\TextColumn::make('department')
                    ->badge()
                    ->color('primary')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'primary' => 'full_time',
                        'info' => 'part_time',
                        'warning' => 'contract',
                        'success' => 'internship',
                        'gray' => 'freelance',
                    ])
                    ->formatStateUsing(fn($state) => str_replace('_', ' ', $state)),
                Tables\Columns\IconColumn::make('is_remote')
                    ->label('Remote')
                    ->boolean()
                    ->trueIcon('heroicon-o-home-modern')
                    ->falseIcon('heroicon-o-building-office')
                    ->trueColor('success')
                    ->falseColor('gray'),
                Tables\Columns\IconColumn::make('is_open')
                    ->label('Open')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\TextColumn::make('location')
                    ->icon('heroicon-m-map-pin')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('closes_at')
                    ->label('Deadline')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->placeholder('No deadline')
                    ->color(fn($state) => $state && $state < now() ? 'danger' : 'gray'),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('applications_count')
                    ->label('Applications')
                    ->counts('applications')
                    ->badge()
                    ->color('info'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('department')
                    ->options([
                        'Production' => 'Production',
                        'Development' => 'Development',
                        'Marketing' => 'Marketing',
                        'Finance' => 'Finance',
                        'Operations' => 'Operations',
                        'Creative' => 'Creative',
                        'Technical' => 'Technical',
                        'Human Resources' => 'Human Resources',
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'full_time' => 'Full Time',
                        'part_time' => 'Part Time',
                        'contract' => 'Contract',
                        'internship' => 'Internship',
                        'freelance' => 'Freelance',
                    ]),
                Tables\Filters\TernaryFilter::make('is_open')
                    ->label('Open Positions'),
                Tables\Filters\TernaryFilter::make('is_remote')
                    ->label('Remote Friendly'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('open')
                        ->label('Open Positions')
                        ->icon('heroicon-o-unlock-closed')
                        ->color('success')
                        ->action(fn($records) => $records->each->update(['is_open' => true])),
                    Tables\Actions\BulkAction::make('close')
                        ->label('Close Positions')
                        ->icon('heroicon-o-lock-closed')
                        ->color('danger')
                        ->action(fn($records) => $records->each->update(['is_open' => false])),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobs::route('/'),
            'create' => Pages\CreateJob::route('/create'),
            'view' => Pages\ViewJob::route('/{record}'),
            'edit' => Pages\EditJob::route('/{record}/edit'),
        ];
    }
}