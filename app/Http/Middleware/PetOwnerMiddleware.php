<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PetOwnerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('pet-owner.login');
        }

        if (!auth()->user()->isPetOwner()) {
            abort(403, 'Access denied. Pet owners only.');
        }

        return $next($request);
    }
}
