@extends('layouts.app')

@section('content')
<div class="container pt-5 pb-5">
    <div class="row">
        <div class="col-md-8">
            <h1>Contact Us</h1>

            @if (session('success'))
                <div class="alert alert-success alert-dismissible fade show">
                    Thank you for your message! We'll get back to you soon.
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                </div>
            @endif

            <form method="POST" action="{{ route('contact.send') }}" class="mt-4">
                @csrf

                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input type="text" class="form-control @error('name') is-invalid @enderror" 
                           id="name" name="name" value="{{ old('name') }}" required>
                    @error('name')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" class="form-control @error('email') is-invalid @enderror" 
                           id="email" name="email" value="{{ old('email') }}" required>
                    @error('email')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" class="form-control @error('phone') is-invalid @enderror" 
                           id="phone" name="phone" value="{{ old('phone') }}">
                    @error('phone')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="subject">Subject *</label>
                    <input type="text" class="form-control @error('subject') is-invalid @enderror" 
                           id="subject" name="subject" value="{{ old('subject') }}" required>
                    @error('subject')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea class="form-control @error('message') is-invalid @enderror" 
                              id="message" name="message" rows="5" required>{{ old('message') }}</textarea>
                    @error('message')
                        <span class="invalid-feedback">{{ $message }}</span>
                    @enderror
                </div>

                <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Contact Information</h5>
                </div>
                <div class="card-body">
                    <p><i class="fa fa-phone"></i> <strong>Phone:</strong> <br>(02) 1234-5678</p>
                    <p><i class="fa fa-envelope"></i> <strong>Email:</strong> <br>info@copecares.com</p>
                    <p><i class="fa fa-map-marker"></i> <strong>Address:</strong> <br>123 Pet Street, Manila, Philippines</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h5>Business Hours</h5>
                </div>
                <div class="card-body">
                    <p><strong>Monday - Sunday:</strong></p>
                    <p>9:00 AM - 6:00 PM</p>
                    <p class="text-muted text-sm">Emergency services available 24/7</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
