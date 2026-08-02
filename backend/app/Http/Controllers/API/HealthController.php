<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class HealthController extends Controller
{
    /**
     * Le SELECT ne sert pas qu'au diagnostic : il tient la base Supabase
     * éveillée, celle-ci se mettant en pause après plusieurs jours sans requête.
     */
    public function __invoke()
    {
        try {
            DB::select('select 1');
            $database = 'ok';
        } catch (Throwable $e) {
            Log::error('Health check: base injoignable', ['exception' => $e]);
            $database = 'error';
        }

        return response()->json([
            'status'    => $database,
            'database'  => $database,
            'timestamp' => now()->toIso8601String(),
        ], $database === 'ok' ? 200 : 503);
    }
}
