@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Medical Records</h1>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.medical-records.create') }}" class="btn btn-primary">
                <i class="fa fa-plus"></i> Add Record
            </a>
        </div>
    </div>

    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            {{ session('success') }}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <table class="table table-striped" id="recordsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pet</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Vet</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($records as $record)
                        <tr>
                            <td>{{ $record->id }}</td>
                            <td>{{ $record->pet->name ?? 'N/A' }}</td>
                            <td>{{ $record->record_date->format('M d, Y') }}</td>
                            <td>
                                @if ($record->type === 'checkup')
                                    <span class="badge badge-info">Check-up</span>
                                @elseif ($record->type === 'vaccination')
                                    <span class="badge badge-success">Vaccination</span>
                                @elseif ($record->type === 'surgery')
                                    <span class="badge badge-danger">Surgery</span>
                                @else
                                    <span class="badge badge-secondary">{{ ucfirst($record->type) }}</span>
                                @endif
                            </td>
                            <td>{{ $record->veterinarian->name ?? 'N/A' }}</td>
                            <td>
                                <a href="{{ route('admin.medical-records.show', $record->id) }}" class="btn btn-sm btn-info">
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a href="{{ route('admin.medical-records.edit', $record->id) }}" class="btn btn-sm btn-warning">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <form method="POST" action="{{ route('admin.medical-records.destroy', $record->id) }}" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="text-center text-muted">No medical records found</td>
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
        $('#recordsTable').DataTable({
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
