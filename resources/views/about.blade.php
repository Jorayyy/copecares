@extends('layouts.app')

@section('content')
<div class="container pt-5 pb-5">
    <div class="row">
        <div class="col-md-8">
            <h1>About CopeCares</h1>
            <p class="lead">Your trusted veterinary care partner</p>

            <h3 class="mt-4">Our Mission</h3>
            <p>At CopeCares Veterinary Clinic, our mission is to provide compassionate, professional, and affordable veterinary care for your beloved pets. We believe that every animal deserves the highest quality medical attention.</p>

            <h3 class="mt-4">Our Services</h3>
            <ul>
                <li>General Check-ups and Vaccinations</li>
                <li>Dental Care</li>
                <li>Surgery and Orthopedics</li>
                <li>Diagnostic Services</li>
                <li>Pet Grooming</li>
                <li>Boarding Services</li>
                <li>Emergency Care</li>
            </ul>

            <h3 class="mt-4">Why Choose Us?</h3>
            <ul>
                <li>Experienced and caring veterinarians</li>
                <li>State-of-the-art medical equipment</li>
                <li>Convenient appointment scheduling</li>
                <li>Affordable pricing</li>
                <li>Same-day appointments available</li>
                <li>Compassionate care for your pets</li>
            </ul>
        </div>

        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5>Contact Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Phone:</strong> (02) 1234-5678</p>
                    <p><strong>Email:</strong> info@copecares.com</p>
                    <p><strong>Address:</strong> 123 Pet Street, Manila, Philippines</p>
                    <p><strong>Hours:</strong> 9:00 AM - 6:00 PM (Mon-Sun)</p>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h5>Get Started</h5>
                </div>
                <div class="card-body">
                    <p>Ready to provide the best care for your pet?</p>
                    @auth
                        <a href="{{ route('pet-owner.dashboard') }}" class="btn btn-primary btn-block">My Account</a>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-primary btn-block">Login</a>
                        <a href="{{ route('register') }}" class="btn btn-secondary btn-block mt-2">Register</a>
                    @endauth
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
