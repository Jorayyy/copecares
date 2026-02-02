<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\PetCategory;
use App\Models\Message;
use App\Models\Setting;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function about()
    {
        return view('about');
    }

    public function services()
    {
        $services = Service::where('is_active', true)->get();
        
        return view('services', compact('services'));
    }

    public function contact()
    {
        return view('contact');
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        Message::create($validated);

        return back()->with('success', 'Your message has been sent. We will get back to you soon!');
    }
}
