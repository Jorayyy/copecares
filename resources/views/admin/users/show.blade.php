@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>{{ $user->name }}</h1>
            <p class="text-muted">{{ $user->email }}</p>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.users.edit', $user->id) }}" class="btn btn-warning">
                <i class="fa fa-edit"></i> Edit
            </a>
            <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Back</a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>User Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Name:</strong> {{ $user->name }}</p>
                    <p><strong>Email:</strong> {{ $user->email }}</p>
                    <p><strong>Role:</strong> <span class="badge badge-info">{{ $user->role->name ?? 'N/A' }}</span></p>
                    <p><strong>Joined:</strong> {{ $user->created_at->format('M d, Y') }}</p>
                    <p><strong>Status:</strong> <span class="badge badge-success">Active</span></p>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Actions</h5>
                </div>
                <div class="card-body">
                    <a href="{{ route('admin.users.edit', $user->id) }}" class="btn btn-warning btn-block">Edit User</a>
                    <form method="POST" action="{{ route('admin.users.destroy', $user->id) }}" class="mt-2">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-block" onclick="return confirm('Are you sure?')">Delete User</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
