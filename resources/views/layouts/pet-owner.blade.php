<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'My Account') - CopeCares</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --sidebar-width: 260px;
            --primary-color: #2E7D32;
            --secondary-color: #81C784;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f6f9;
        }
        
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--sidebar-width);
            height: 100vh;
            background: linear-gradient(180deg, #1565C0 0%, #1976D2 100%);
            color: white;
            z-index: 1000;
            overflow-y: auto;
        }
        
        .sidebar-brand {
            padding: 20px;
            font-size: 1.5rem;
            font-weight: 700;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .sidebar-nav {
            padding: 20px 0;
        }
        
        .sidebar .nav-link {
            color: rgba(255,255,255,0.8);
            padding: 12px 20px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            background-color: rgba(255,255,255,0.1);
            color: white;
        }
        
        .sidebar .nav-link i {
            width: 25px;
            margin-right: 10px;
        }
        
        .main-content {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
        }
        
        .top-navbar {
            background: white;
            padding: 15px 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .content-wrapper {
            padding: 25px;
        }
        
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .btn-primary {
            background-color: #1976D2;
            border-color: #1976D2;
        }
        
        .btn-primary:hover {
            background-color: #1565C0;
            border-color: #1565C0;
        }
        
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.show {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
        }
    </style>
    @stack('styles')
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <i class="fas fa-paw me-2"></i>CopeCares
        </div>
        <nav class="sidebar-nav">
            <a class="nav-link {{ request()->routeIs('pet-owner.dashboard') ? 'active' : '' }}" href="{{ route('pet-owner.dashboard') }}">
                <i class="fas fa-home"></i> Dashboard
            </a>
            <a class="nav-link {{ request()->routeIs('pet-owner.pets.*') ? 'active' : '' }}" href="{{ route('pet-owner.pets.index') }}">
                <i class="fas fa-paw"></i> My Pets
            </a>
            <a class="nav-link {{ request()->routeIs('pet-owner.appointments.*') ? 'active' : '' }}" href="{{ route('pet-owner.appointments.index') }}">
                <i class="fas fa-calendar-check"></i> Appointments
            </a>
            <a class="nav-link {{ request()->routeIs('pet-owner.profile.*') ? 'active' : '' }}" href="{{ route('pet-owner.profile.edit') }}">
                <i class="fas fa-user"></i> My Profile
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
        <div class="top-navbar">
            <button class="btn btn-link d-lg-none" id="sidebarToggle">
                <i class="fas fa-bars"></i>
            </button>
            <div></div>
            <div class="dropdown">
                <a class="btn btn-link dropdown-toggle text-dark text-decoration-none" href="#" role="button" data-bs-toggle="dropdown">
                    <img src="{{ auth()->user()->avatar_url }}" alt="Avatar" class="rounded-circle me-2" width="32" height="32">
                    {{ auth()->user()->name }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="{{ route('home') }}"><i class="fas fa-globe me-2"></i>View Website</a></li>
                    <li><a class="dropdown-item" href="{{ route('pet-owner.profile.edit') }}"><i class="fas fa-user me-2"></i>Profile</a></li>
                    <li>
                        <form action="{{ route('logout') }}" method="POST">
                            @csrf
                            <button type="submit" class="dropdown-item"><i class="fas fa-sign-out-alt me-2"></i>Logout</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>

        <div class="content-wrapper">
            @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    {{ session('error') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            @endif

            @yield('content')
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <script>
        document.getElementById('sidebarToggle')?.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    </script>
    @stack('scripts')
</body>
</html>
