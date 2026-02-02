@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title">Dashboard</h1>
    <div>
        <a href="{{ route('admin.appointments.create') }}" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i>New Appointment
        </a>
    </div>
</div>

<!-- Stats Cards -->
<div class="row g-4 mb-4">
    <div class="col-md-6 col-xl-3">
        <div class="card stat-card">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="text-muted mb-1">Today's Appointments</p>
                        <h3 class="fw-bold mb-0">{{ $stats['total_appointments_today'] }}</h3>
                    </div>
                    <div class="bg-success bg-opacity-10 rounded p-3">
                        <i class="fas fa-calendar-day fa-2x text-success"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card stat-card warning">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="text-muted mb-1">Pending Appointments</p>
                        <h3 class="fw-bold mb-0">{{ $stats['pending_appointments'] }}</h3>
                    </div>
                    <div class="bg-warning bg-opacity-10 rounded p-3">
                        <i class="fas fa-clock fa-2x text-warning"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card stat-card info">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="text-muted mb-1">Today's Sales</p>
                        <h3 class="fw-bold mb-0">₱{{ number_format($stats['total_sales_today'], 2) }}</h3>
                    </div>
                    <div class="bg-info bg-opacity-10 rounded p-3">
                        <i class="fas fa-peso-sign fa-2x text-info"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card stat-card {{ $stats['low_stock_products'] > 0 ? 'danger' : '' }}">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="text-muted mb-1">Low Stock Items</p>
                        <h3 class="fw-bold mb-0">{{ $stats['low_stock_products'] }}</h3>
                    </div>
                    <div class="bg-danger bg-opacity-10 rounded p-3">
                        <i class="fas fa-exclamation-triangle fa-2x text-danger"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row g-4">
    <!-- Today's Appointments -->
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="fas fa-calendar-check me-2"></i>Today's Appointments</span>
                <a href="{{ route('admin.appointments.index', ['date' => today()->format('Y-m-d')]) }}" class="btn btn-sm btn-outline-primary">View All</a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Time</th>
                                <th>Code</th>
                                <th>Pet Owner</th>
                                <th>Pet</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($todayAppointments as $appointment)
                                <tr>
                                    <td>{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('h:i A') }}</td>
                                    <td><span class="fw-semibold">{{ $appointment->code }}</span></td>
                                    <td>{{ $appointment->owner_display_name }}</td>
                                    <td>{{ $appointment->pet_display_name }}</td>
                                    <td>
                                        <span class="badge bg-{{ $appointment->status_badge }}">
                                            {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="{{ route('admin.appointments.show', $appointment) }}" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center py-4 text-muted">No appointments for today</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="col-lg-4">
        <div class="card mb-4">
            <div class="card-header">
                <i class="fas fa-chart-pie me-2"></i>Quick Stats
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Total Pets</span>
                    <span class="fw-bold">{{ $stats['total_pets'] }}</span>
                </div>
                <div class="d-flex justify-content-between py-2">
                    <span class="text-muted">Total Pet Owners</span>
                    <span class="fw-bold">{{ $stats['total_pet_owners'] }}</span>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <i class="fas fa-receipt me-2"></i>Recent Sales
            </div>
            <div class="card-body p-0">
                <ul class="list-group list-group-flush">
                    @forelse($recentSales as $sale)
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">{{ $sale->invoice_number }}</small>
                                <div>{{ $sale->customer_display_name }}</div>
                            </div>
                            <span class="fw-bold text-success">₱{{ number_format($sale->total_amount, 2) }}</span>
                        </li>
                    @empty
                        <li class="list-group-item text-center text-muted">No recent sales</li>
                    @endforelse
                </ul>
            </div>
        </div>
    </div>
</div>

<!-- Upcoming Appointments -->
<div class="card mt-4">
    <div class="card-header">
        <i class="fas fa-calendar-alt me-2"></i>Upcoming Appointments
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Code</th>
                        <th>Pet Owner</th>
                        <th>Pet</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($upcomingAppointments as $appointment)
                        <tr>
                            <td>{{ $appointment->appointment_date->format('M d, Y') }}</td>
                            <td>{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('h:i A') }}</td>
                            <td><a href="{{ route('admin.appointments.show', $appointment) }}" class="text-decoration-none">{{ $appointment->code }}</a></td>
                            <td>{{ $appointment->owner_display_name }}</td>
                            <td>{{ $appointment->pet_display_name }}</td>
                            <td>
                                <span class="badge bg-{{ $appointment->status_badge }}">
                                    {{ ucfirst(str_replace('_', ' ', $appointment->status)) }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">No upcoming appointments</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
