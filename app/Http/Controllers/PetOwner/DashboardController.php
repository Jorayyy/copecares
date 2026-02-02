<?php

namespace App\Http\Controllers\PetOwner;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Pet;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $petsCount = $user->pets()->count();
        $totalAppointments = Appointment::whereHas('pet', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();
        $upcomingAppointments = Appointment::whereHas('pet', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->whereIn('status', ['pending', 'confirmed'])
          ->where('appointment_date', '>=', now())
          ->count();
        $completedAppointments = Appointment::whereHas('pet', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'completed')->count();

        $pets = $user->pets()->with('category')->get();

        $appointments = Appointment::whereHas('pet', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->with(['pet', 'services'])
          ->whereIn('status', ['pending', 'confirmed'])
          ->where('appointment_date', '>=', now())
          ->orderBy('appointment_date')
          ->limit(5)
          ->get();

        return view('pet-owner.dashboard', compact(
            'petsCount', 
            'totalAppointments', 
            'upcomingAppointments', 
            'completedAppointments',
            'pets', 
            'appointments'
        ));
    }
}
