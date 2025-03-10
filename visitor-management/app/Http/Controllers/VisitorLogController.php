<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use App\Models\Visitor;
use Illuminate\Http\Request;

class VisitorLogController extends Controller
{
    // CHECK-IN A VISITOR
    public function checkIn(Request $request)
    {
        $request->validate([
            'visitor_id' => 'required|exists:visitors,id'
        ]);

        $log = VisitorLog::create([
            'visitor_id' => $request->visitor_id,
            'check_in_time' => now(),
            'check_out_time' => null
        ]);

        return response()->json(['message' => 'Visitor checked in successfully', 'log' => $log]);
    }

    // CHECK-OUT A VISITOR
    public function checkOut(Request $request, $id)
    {
        $log = VisitorLog::where('visitor_id', $id)->whereNull('check_out_time')->first();

        if (!$log) {
            return response()->json(['message' => 'No active check-in found for this visitor'], 404);
        }

        $log->update(['check_out_time' => now()]);

        return response()->json(['message' => 'Visitor checked out successfully', 'log' => $log]);
    }

    // GET ALL LOGS
    public function index()
    {
        return response()->json(VisitorLog::with('visitor')->get());
    }
}
