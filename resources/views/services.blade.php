@extends('layouts.app')

@section('content')
<div class="container-fluid pt-5 pb-5">
    <div class="row">
        <div class="col-md-12">
            <h1 class="mb-4">Our Services</h1>
        </div>
    </div>

    <div class="row">
        @forelse ($services as $service)
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ $service->name }}</h5>
                        <p class="card-text">{{ Str::limit($service->description, 100) }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 mb-0">₱{{ number_format($service->price, 2) }}</span>
                            <button class="btn btn-sm btn-primary" onclick="alert('To book this service, please login to your account')">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-md-12">
                <p class="text-center text-muted">No services available at the moment.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection
