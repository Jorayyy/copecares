@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-sm">
                <div class="card-body p-5">
                    <div class="text-center mb-4">
                        <i class="fas fa-paw fa-3x text-success mb-3"></i>
                        <h3 class="fw-bold">Welcome Back</h3>
                        <p class="text-muted">Sign in to your account</p>
                    </div>

                    @if($errors->any())
                        <div class="alert alert-danger">
                            @foreach($errors->all() as $error)
                                <div>{{ $error }}</div>
                            @endforeach
                        </div>
                    @endif

                    <form method="POST" action="{{ route('login') }}">
                        @csrf
                        
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" class="form-control @error('email') is-invalid @enderror" 
                                   id="email" name="email" value="{{ old('email') }}" required autofocus>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control @error('password') is-invalid @enderror" 
                                   id="password" name="password" required>
                        </div>

                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="remember" name="remember">
                            <label class="form-check-label" for="remember">Remember me</label>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2">
                            <i class="fas fa-sign-in-alt me-2"></i>Sign In
                        </button>
                    </form>

                    <hr class="my-4">

                    <p class="text-center mb-0">
                        Don't have an account? <a href="{{ route('register') }}" class="text-success">Register here</a>
                    </p>
                </div>
            </div>

            <div class="card mt-3 bg-light border-0">
                <div class="card-body">
                    <p class="small text-muted mb-2"><strong>Demo Accounts:</strong></p>
                    <p class="small text-muted mb-1">Admin: admin@copecares.com / admin123</p>
                    <p class="small text-muted mb-1">Vet: vet@copecares.com / vet123</p>
                    <p class="small text-muted mb-1">Staff: staff@copecares.com / staff123</p>
                    <p class="small text-muted mb-0">Pet Owner: owner@test.com / owner123</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
