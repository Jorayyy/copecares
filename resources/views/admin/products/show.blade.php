@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>{{ $product->name }}</h1>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-warning">
                <i class="fa fa-edit"></i> Edit
            </a>
            <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">Back</a>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Product Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Category:</strong> {{ $product->category->name ?? 'N/A' }}</p>
                    <p><strong>Description:</strong> {{ $product->description ?? 'No description' }}</p>
                    <p><strong>Cost Price:</strong> ₱{{ number_format($product->cost_price, 2) }}</p>
                    <p><strong>Selling Price:</strong> ₱{{ number_format($product->selling_price, 2) }}</p>
                    <p><strong>Stock:</strong> {{ $product->stock_quantity }} units</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Actions</h5>
                </div>
                <div class="card-body">
                    <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-warning btn-block">Edit</a>
                    <form method="POST" action="{{ route('admin.products.destroy', $product->id) }}" class="mt-2">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-block" onclick="return confirm('Are you sure?')">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
