<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModuleSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $modules = ModuleSetting::orderBy('sort_order')->orderBy('module_name')->get();
        return response()->json($modules);
    }

    public function update(Request $request, ModuleSetting $moduleSetting): JsonResponse
    {
        $data = $request->validate([
            'is_enabled' => 'boolean',
            'config' => 'nullable|array',
            'sort_order' => 'integer',
        ]);

        $moduleSetting->update($data);

        return response()->json($moduleSetting);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:module_settings,id',
            'modules.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->modules as $item) {
            ModuleSetting::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Order updated']);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:module_settings,id',
            'modules.*.is_enabled' => 'boolean',
        ]);

        foreach ($request->modules as $item) {
            ModuleSetting::where('id', $item['id'])->update(['is_enabled' => $item['is_enabled']]);
        }

        return response()->json(['message' => 'Modules updated']);
    }
}
