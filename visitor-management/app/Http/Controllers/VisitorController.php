<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VisitorController extends Controller
{
    // CREATE VISITOR
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'cin' => 'required|string|unique:visitors',
            'phone' => 'required|string',
            'reason' => 'required|string',
        ]);

        $visitor = Visitor::create([
            'name' => $request->name,
            'cin' => $request->cin,
            'phone' => $request->phone,
            'reason' => $request->reason,
            'user_id' => Auth::id(), // Associate with the logged-in user
        ]);

        return response()->json(['message' => 'Visitor added successfully', 'visitor' => $visitor]);
    }

    // GET ALL VISITORS
    public function index()
    {
        return response()->json(Visitor::with('user')->get());
    }

    // GET SINGLE VISITOR
    public function show($id)
    {
        return response()->json(Visitor::findOrFail($id));
    }

    // UPDATE VISITOR
    public function update(Request $request, $id)
    {
        $visitor = Visitor::findOrFail($id);
        $visitor->update($request->all());

        return response()->json(['message' => 'Visitor updated successfully', 'visitor' => $visitor]);
    }

    // DELETE VISITOR
    public function destroy($id)
    {
        Visitor::findOrFail($id)->delete();

        return response()->json(['message' => 'Visitor deleted successfully']);
    }
}
