@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Settings</h1>
        </div>
    </div>

    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            {{ session('success') }}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
    @endif

    <div class="card">
        <div class="card-header">
            <h5>System Settings</h5>
        </div>
        <div class="card-body">
            <form method="POST" action="{{ route('admin.settings.update') }}">
                @csrf

                <div class="form-group">
                    <label for="clinic_name">Clinic Name</label>
                    <input type="text" class="form-control" id="clinic_name" name="clinic_name" 
                           value="{{ $settings['clinic_name'] ?? 'CopeCares Veterinary' }}">
                </div>

                <div class="form-group">
                    <label for="clinic_address">Clinic Address</label>
                    <textarea class="form-control" id="clinic_address" name="clinic_address" rows="3">{{ $settings['clinic_address'] ?? '' }}</textarea>
                </div>

                <div class="form-group">
                    <label for="clinic_phone">Clinic Phone</label>
                    <input type="text" class="form-control" id="clinic_phone" name="clinic_phone" 
                           value="{{ $settings['clinic_phone'] ?? '' }}">
                </div>

                <div class="form-group">
                    <label for="clinic_email">Clinic Email</label>
                    <input type="email" class="form-control" id="clinic_email" name="clinic_email" 
                           value="{{ $settings['clinic_email'] ?? '' }}">
                </div>

                <div class="form-group">
                    <label for="business_hours">Business Hours</label>
                    <input type="text" class="form-control" id="business_hours" name="business_hours" 
                           value="{{ $settings['business_hours'] ?? '9:00 AM - 6:00 PM' }}">
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
