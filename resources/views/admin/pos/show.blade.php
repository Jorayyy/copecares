@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-12">
            <h1>Sale Details #{{ $sale->id }}</h1>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5>Sale Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Date:</strong> {{ $sale->created_at->format('M d, Y H:i A') }}</p>
                    <p><strong>Customer:</strong> {{ $sale->user->name ?? 'N/A' }}</p>
                    <p><strong>Status:</strong> <span class="badge badge-success">Completed</span></p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h5>Items</h5>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($sale->items as $item)
                                <tr>
                                    <td>{{ $item->product_name ?? $item->product->name ?? 'N/A' }}</td>
                                    <td>{{ $item->quantity }}</td>
                                    <td>₱{{ number_format($item->unit_price, 2) }}</td>
                                    <td>₱{{ number_format($item->total, 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center text-muted">No items</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Transaction Summary</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <strong>₱{{ number_format($sale->total_amount, 2) }}</strong>
                        </div>
                    </div>
                    <hr>
                    <div class="mb-3">
                        <div class="d-flex justify-content-between">
                            <h6>Total Amount:</h6>
                            <h5 class="text-primary">₱{{ number_format($sale->total_amount, 2) }}</h5>
                        </div>
                    </div>
                </div>
            </div>

            <a href="{{ route('admin.pos.sales') }}" class="btn btn-secondary btn-block mt-3">Back</a>
            <a href="{{ route('admin.pos.receipt', $sale->id) }}" class="btn btn-primary btn-block mt-2">View Receipt</a>
        </div>
    </div>
</div>
@endsection
