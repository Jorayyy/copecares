@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-12">
            <h1>Sale Receipt #{{ $sale->id }}</h1>
            <p class="text-muted">{{ $sale->created_at->format('M d, Y H:i A') }}</p>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Customer Information</h5>
                    <p><strong>Name:</strong> {{ $sale->user->name ?? 'N/A' }}</p>
                    <p><strong>Email:</strong> {{ $sale->user->email ?? 'N/A' }}</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h5>Items Purchased</h5>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
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
                                    <td colspan="4" class="text-center">No items found</td>
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
                    <h5>Summary</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-2">
                        <div class="col-6"><strong>Subtotal:</strong></div>
                        <div class="col-6 text-right">₱{{ number_format($sale->total_amount, 2) }}</div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-6"><strong>Total:</strong></div>
                        <div class="col-6 text-right"><h5>₱{{ number_format($sale->total_amount, 2) }}</h5></div>
                    </div>
                </div>
            </div>

            <a href="{{ route('admin.pos.sales') }}" class="btn btn-secondary btn-block mt-3">Back to Sales</a>
            <button class="btn btn-primary btn-block mt-2" onclick="window.print()">Print Receipt</button>
        </div>
    </div>
</div>
@endsection
