@extends('layouts.app')

@section('title', 'Welcome')

@section('content')
<!-- Hero Section -->
<section class="bg-primary text-white py-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
                <h1 class="display-4 fw-bold mb-4">
                    Welcome to <span class="text-warning">CopeCares</span>
                </h1>
                <p class="lead mb-4">
                    Your trusted partner in pet healthcare. We provide comprehensive veterinary services 
                    to keep your furry friends happy and healthy.
                </p>
                <div class="d-flex gap-3 flex-wrap">
                    <a href="{{ route('register') }}" class="btn btn-warning btn-lg px-4">
                        <i class="fas fa-paw me-2"></i>Register Now
                    </a>
                    <a href="{{ route('login') }}" class="btn btn-outline-light btn-lg px-4">
                        <i class="fas fa-sign-in-alt me-2"></i>Login
                    </a>
                </div>
            </div>
            <div class="col-lg-6 text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/3047/3047928.png" 
                     alt="Veterinary Care" class="img-fluid" style="max-height: 350px;">
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-primary">Our Services</h2>
            <p class="text-muted">Comprehensive care for your beloved pets</p>
        </div>
        
        <div class="row g-4">
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-stethoscope fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">General Check-up</h5>
                        <p class="card-text text-muted">
                            Regular health examinations to ensure your pet stays in optimal condition.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-success bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-syringe fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">Vaccination</h5>
                        <p class="card-text text-muted">
                            Keep your pets protected with up-to-date vaccinations and preventive care.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-warning bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-tooth fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">Dental Care</h5>
                        <p class="card-text text-muted">
                            Professional dental cleaning and oral health services for your pets.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-info bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-cut fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">Grooming</h5>
                        <p class="card-text text-muted">
                            Complete grooming services to keep your pets looking and feeling their best.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-danger bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-procedures fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">Surgery</h5>
                        <p class="card-text text-muted">
                            State-of-the-art surgical procedures performed by experienced veterinarians.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm text-center">
                    <div class="card-body p-4">
                        <div class="feature-icon bg-secondary bg-gradient text-white rounded-circle mb-3 mx-auto" 
                             style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-home fa-2x"></i>
                        </div>
                        <h5 class="card-title fw-bold">Pet Boarding</h5>
                        <p class="card-text text-muted">
                            Safe and comfortable boarding facilities when you need to travel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose Us Section -->
<section class="py-5">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
                <img src="https://cdn-icons-png.flaticon.com/512/2138/2138508.png" 
                     alt="Veterinary Team" class="img-fluid" style="max-height: 400px;">
            </div>
            <div class="col-lg-6">
                <h2 class="fw-bold text-primary mb-4">Why Choose CopeCares?</h2>
                
                <div class="d-flex mb-3">
                    <div class="me-3 text-primary">
                        <i class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold">Experienced Veterinarians</h5>
                        <p class="text-muted">Our team consists of licensed and experienced veterinary professionals.</p>
                    </div>
                </div>
                
                <div class="d-flex mb-3">
                    <div class="me-3 text-primary">
                        <i class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold">Modern Facilities</h5>
                        <p class="text-muted">State-of-the-art equipment and comfortable environment for your pets.</p>
                    </div>
                </div>
                
                <div class="d-flex mb-3">
                    <div class="me-3 text-primary">
                        <i class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold">Online Appointment</h5>
                        <p class="text-muted">Easy online booking system for your convenience.</p>
                    </div>
                </div>
                
                <div class="d-flex mb-3">
                    <div class="me-3 text-primary">
                        <i class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div>
                        <h5 class="fw-bold">24/7 Emergency Care</h5>
                        <p class="text-muted">Available around the clock for pet emergencies.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Call to Action Section -->
<section class="py-5 bg-primary text-white">
    <div class="container text-center">
        <h2 class="fw-bold mb-4">Ready to Give Your Pet the Best Care?</h2>
        <p class="lead mb-4">Register now and book your first appointment with us.</p>
        <a href="{{ route('register') }}" class="btn btn-warning btn-lg px-5">
            <i class="fas fa-calendar-check me-2"></i>Book Appointment
        </a>
    </div>
</section>

<!-- Contact Info Section -->
<section class="py-5 bg-light">
    <div class="container">
        <div class="row text-center">
            <div class="col-md-4 mb-4 mb-md-0">
                <div class="p-4">
                    <i class="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                    <h5 class="fw-bold">Visit Us</h5>
                    <p class="text-muted">123 Pet Care Street<br>Tacloban City, Leyte</p>
                </div>
            </div>
            <div class="col-md-4 mb-4 mb-md-0">
                <div class="p-4">
                    <i class="fas fa-phone fa-3x text-primary mb-3"></i>
                    <h5 class="fw-bold">Call Us</h5>
                    <p class="text-muted">(053) 123-4567<br>0917-123-4567</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-4">
                    <i class="fas fa-clock fa-3x text-primary mb-3"></i>
                    <h5 class="fw-bold">Working Hours</h5>
                    <p class="text-muted">Monday - Saturday<br>8:00 AM - 6:00 PM</p>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
