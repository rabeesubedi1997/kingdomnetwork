<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateJsonApi
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->wantsJson() && !$request->isJson()) {
            $request->headers->set('Accept', 'application/json');
        }

        return $next($request);
    }
}
