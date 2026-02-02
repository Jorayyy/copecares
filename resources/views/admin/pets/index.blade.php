@extends('layouts.admin')

@section('title', 'Pets')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-paw me-2"></i>Pets Management
                    </h3>
                    <div class="card-tools">
                        <a href="{{ route('admin.pets.create') }}" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus me-1"></i>Add Pet
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success alert-dismissible fade show">
                            <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    @endif

                    <div class="table-responsive">
                        <table class="table table-bordered table-striped" id="petsTable">
                            <thead>
                                <tr>
                                    <th width="5%">#</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Breed</th>
                                    <th>Owner</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th width="12%">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($pets as $pet)
                                    <tr>
                                        <td>{{ $loop->iteration }}</td>
                                        <td>
                                            @if($pet->photo)
                                                <img src="{{ Storage::url($pet->photo) }}" 
                                                     alt="{{ $pet->name }}" class="rounded" width="50" height="50">
                                            @else
                                                <div class="bg-secondary text-white rounded d-flex align-items-center justify-content-center" 
                                                     style="width: 50px; height: 50px;">
                                                    <i class="fas fa-paw"></i>
                                                </div>
                                            @endif
                                        </td>
                                        <td><strong>{{ $pet->name }}</strong></td>
                                        <td>{{ $pet->category->name ?? 'N/A' }}</td>
                                        <td>{{ $pet->breed ?? 'N/A' }}</td>
                                        <td>
                                            <a href="{{ route('admin.users.edit', $pet->owner) }}">
                                                {{ $pet->owner->name ?? 'No Owner' }}
                                            </a>
                                        </td>
                                        <td>
                                            @if($pet->date_of_birth)
                                                {{ $pet->date_of_birth->age }} yrs
                                            @else
                                                N/A
                                            @endif
                                        </td>
                                        <td>
                                            @if($pet->gender == 'male')
                                                <span class="badge bg-info"><i class="fas fa-mars me-1"></i>Male</span>
                                            @elseif($pet->gender == 'female')
                                                <span class="badge bg-pink" style="background-color: #e91e63;"><i class="fas fa-venus me-1"></i>Female</span>
                                            @else
                                                <span class="badge bg-secondary">Unknown</span>
                                            @endif
                                        </td>
                                        <td>
                                            <div class="btn-group" role="group">
                                                <a href="{{ route('admin.pets.show', $pet) }}" 
                                                   class="btn btn-info btn-sm" title="View">
                                                    <i class="fas fa-eye"></i>
                                                </a>
                                                <a href="{{ route('admin.pets.edit', $pet) }}" 
                                                   class="btn btn-warning btn-sm" title="Edit">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <form action="{{ route('admin.pets.destroy', $pet) }}" 
                                                      method="POST" class="d-inline"
                                                      onsubmit="return confirm('Are you sure you want to delete this pet?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-danger btn-sm" title="Delete">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9" class="text-center text-muted">No pets found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
$(document).ready(function() {
    $('#petsTable').DataTable({
        "responsive": true,
        "autoWidth": false,
        "order": [[0, "asc"]],
        "columnDefs": [{
            "targets": [-1, 1],
            "orderable": false
        }]
    });
});
</script>
@endpush
