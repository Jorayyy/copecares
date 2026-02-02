<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Pet;
use App\Models\Sale;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_appointments_today' => Appointment::today()->count(),
            'pending_appointments' => Appointment::pending()->count(),
            'total_pets' => Pet::count(),
            'total_pet_owners' => User::petOwners()->count(),
            'total_sales_today' => Sale::today()->completed()->sum('total_amount'),
            'low_stock_products' => Product::lowStock()->count(),
        ];

        $todayAppointments = Appointment::with(['user', 'pet', 'services'])
            ->today()
            ->orderBy('appointment_time')
            ->limit(10)
            ->get();

        $recentSales = Sale::with(['customer', 'cashier'])
            ->latest()
            ->limit(5)
            ->get();

        $upcomingAppointments = Appointment::with(['user', 'pet'])
            ->upcoming()
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(10)
            ->get();

        return view('admin.dashboard', compact('stats', 'todayAppointments', 'recentSales', 'upcomingAppointments'));
    }
}
