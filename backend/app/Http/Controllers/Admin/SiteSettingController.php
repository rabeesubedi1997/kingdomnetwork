<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
class SiteSettingController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SiteSettingResource::collection(SiteSetting::orderBy('group')->orderBy('key')->get());
    }

    public function show(SiteSetting $siteSetting): SiteSettingResource
    {
        return new SiteSettingResource($siteSetting);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => 'required|string|max:255|unique:site_settings,key',
            'value' => 'nullable',
            'group' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        $setting = SiteSetting::create($data);

        return response()->json(new SiteSettingResource($setting), 201);
    }

    public function update(Request $request, SiteSetting $siteSetting): SiteSettingResource
    {
        $data = $request->validate([
            'key' => 'required|string|max:255|unique:site_settings,key,' . $siteSetting->id,
            'value' => 'nullable',
            'group' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        $siteSetting->update($data);

        return new SiteSettingResource($siteSetting);
    }

    public function destroy(SiteSetting $siteSetting): JsonResponse
    {
        $siteSetting->delete();

        return response()->json(null, 204);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated']);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif,webp,svg|max:5120',
            'type' => 'required|in:logo,favicon,dark_logo',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $request->type . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('brand', $filename, 'public');

        $key = match($request->type) {
            'logo' => 'logo_url',
            'favicon' => 'favicon_url',
            'dark_logo' => 'logo_dark_url',
        };
        $value = '/storage/' . $path;

        SiteSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => 'brand', 'is_public' => true]
        );

        return response()->json([
            'message' => ucfirst(str_replace('_', ' ', $request->type)) . ' uploaded successfully',
            'url' => $value,
        ]);
    }
}
