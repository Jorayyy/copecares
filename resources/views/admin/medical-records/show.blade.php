@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Medical Record #{{ $medicalRecord->id }}</h1>
        </div>
        <div class="col-md-4 text-right">
            <a href="{{ route('admin.medical-records.edit', $medicalRecord->id) }}" class="btn btn-warning">
                <i class="fa fa-edit"></i> Edit
            </a>
            <a href="{{ route('admin.medical-records.index') }}" class="btn btn-secondary">Back</a>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h5>Record Information</h5>
        </div>
        <div class="card-body">
            <p><strong>Pet:</strong> {{ $medicalRecord->pet->name ?? 'N/A' }}</p>
            <p><strong>Date:</strong> {{ $medicalRecord->record_date->format('M d, Y H:i A') }}</p>
            <p><strong>Type:</strong>
                @if ($medicalRecord->type === 'checkup')
                    <span class="badge badge-info">Check-up</span>
                @elseif ($medicalRecord->type === 'vaccination')
                    <span class="badge badge-success">Vaccination</span>
                @elseif ($medicalRecord->type === 'surgery')
                    <span class="badge badge-danger">Surgery</span>
                @else
                    <span class="badge badge-secondary">{{ ucfirst($medicalRecord->type) }}</span>
                @endif
            </p>
            <p><strong>Veterinarian:</strong> {{ $medicalRecord->veterinarian->name ?? 'N/A' }}</p>
        </div>
    </div>

    <div class="card mt-3">
        <div class="card-header">
            <h5>Notes</h5>
        </div>
        <div class="card-body">
            <p>{{ $medicalRecord->notes ?? 'No notes available' }}</p>
        </div>
    </div>
</div>
@endsection
