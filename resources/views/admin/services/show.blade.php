@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>{{ $service->name }}</h1>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.services.edit', $service->id) }}" class="btn btn-warning">
                <i class="fa fa-edit"></i> Edit
            </a>
            <a href="{{ route('admin.services.index') }}" class="btn btn-secondary">Back</a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Service Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Name:</strong> {{ $service->name }}</p>
                    <p><strong>Category:</strong> {{ $service->category->name ?? 'N/A' }}</p>
                    <p><strong>Price:</strong> ₱{{ number_format($service->price, 2) }}</p>
                    <p><strong>Duration:</strong> {{ $service->duration_minutes ?? '30' }} minutes</p>
                    <p><strong>Description:</strong> {{ $service->description ?? 'No description' }}</p>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Actions</h5>
                </div>
                <div class="card-body">
                    <a href="{{ route('admin.services.edit', $service->id) }}" class="btn btn-warning btn-block">Edit Service</a>
                    <form method="POST" action="{{ route('admin.services.destroy', $service->id) }}" class="mt-2">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-block" onclick="return confirm('Are you sure?')">Delete Service</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
