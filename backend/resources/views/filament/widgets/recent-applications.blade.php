<div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Job Applications</h3>
    <div class="space-y-3">
        @foreach($widget->getApplications() as $application)
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">{{ $application->name }}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ $application->job->title ?? 'Unknown Position' }}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full bg-{{ match($application->status) { 'submitted' => 'blue', 'reviewing' => 'yellow', 'interviewed' => 'purple', 'offered' => 'green', 'rejected' => 'red', 'hired' => 'emerald', default => 'gray' }}-100 text-{{ match($application->status) { 'submitted' => 'blue', 'reviewing' => 'yellow', 'interviewed' => 'purple', 'offered' => 'green', 'rejected' => 'red', 'hired' => 'emerald', default => 'gray' }}-800">
                        {{ ucfirst(str_replace('_', ' ', $application->status)) }}
                    </span>
                </div>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ $application->created_at->diffForHumans() }}</span>
                    <span>{{ $application->email }}</span>
                </div>
            </div>
        @endforeach
    </div>
</div>