<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        if (!empty($permissions)) {
            foreach ($permissions as $permission) {
                if ($user->can($permission)) {
                    return $next($request);
                }
            }
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}
