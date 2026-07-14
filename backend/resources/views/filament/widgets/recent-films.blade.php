<div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Films</h3>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        @foreach($widget->getFilms() as $film)
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div class="aspect-[2/3] rounded overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3">
                    @if($film->getFirstMediaUrl('poster'))
                        <img src="{{ $film->getFirstMediaUrl('poster', 'thumb') }}" alt="{{ $film->title }}" class="w-full h-full object-cover">
                    @else
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                    @endif
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{{ $film->title }}</h4>
                <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-0.5 text-xs rounded-full bg-{{ $film->status === 'released' ? 'green' : ($film->status === 'post_production' ? 'blue' : ($film->status === 'pre_production' ? 'yellow' : 'gray')) }}-100 text-{{ $film->status === 'released' ? 'green' : ($film->status === 'post_production' ? 'blue' : ($film->status === 'pre_production' ? 'yellow' : 'gray')) }}-800">
                        {{ ucwords(str_replace('_', ' ', $film->status)) }}
                    </span>
                </div>
                @if($film->director)
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Dir: {{ $film->director->name }}</p>
                @endif
            </div>
        @endforeach
    </div>
</div>