@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-12">
            <h1>Sales</h1>
        </div>
    </div>

    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Today's Sales</h5>
                    <h3 class="text-primary">₱{{ number_format($todayTotal, 2) }}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">This Month</h5>
                    <h3 class="text-success">₱{{ number_format($monthTotal, 2) }}</h3>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Total Transactions</h5>
                    <h3>{{ $sales->count() }}</h3>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h3>Sales History</h3>
        </div>
        <div class="card-body">
            <table class="table table-striped" id="salesTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pet Owner</th>
                        <th>Date</th>
                        <th>Total Amount</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($sales as $sale)
                        <tr>
                            <td>#{{ $sale->id }}</td>
                            <td>{{ $sale->user->name ?? 'N/A' }}</td>
                            <td>{{ $sale->created_at->format('M d, Y H:i') }}</td>
                            <td>₱{{ number_format($sale->total_amount, 2) }}</td>
                            <td>{{ $sale->items->count() }} item(s)</td>
                            <td>
                                <a href="{{ route('admin.pos.show', $sale->id) }}" class="btn btn-sm btn-info">View</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center">No sales found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

@push('scripts')
<script>
    $(document).ready(function() {
        $('#salesTable').DataTable({
            "responsive": true,
            "autoWidth": false,
            "columnDefs": [{
                "targets": -1,
                "orderable": false
            }]
        });
    });
</script>
@endpush
@endsection
