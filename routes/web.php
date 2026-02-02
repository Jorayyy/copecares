<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\POSController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\PetCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PetController as AdminPetController;
use App\Http\Controllers\Admin\MedicalRecordController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\PetOwner\DashboardController as PetOwnerDashboardController;
use App\Http\Controllers\PetOwner\PetController as PetOwnerPetController;
use App\Http\Controllers\PetOwner\AppointmentController as PetOwnerAppointmentController;
use App\Http\Controllers\PetOwner\ProfileController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/services', [HomeController::class, 'services'])->name('services');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact', [HomeController::class, 'sendMessage'])->name('contact.send');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Appointments
    Route::get('/appointments/calendar', [AdminAppointmentController::class, 'calendar'])->name('appointments.calendar');
    Route::get('/appointments/calendar-events', [AdminAppointmentController::class, 'calendarEvents'])->name('appointments.calendar-events');
    Route::patch('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus'])->name('appointments.update-status');
    Route::resource('appointments', AdminAppointmentController::class);
    
    // POS
    Route::get('/pos', [POSController::class, 'index'])->name('pos.index');
    Route::post('/pos', [POSController::class, 'store'])->name('pos.store');
    Route::get('/pos/sales', [POSController::class, 'sales'])->name('pos.sales');
    Route::get('/pos/sales/{sale}', [POSController::class, 'showSale'])->name('pos.sales.show');
    Route::get('/pos/receipt/{sale}', [POSController::class, 'receipt'])->name('pos.receipt');
    
    // Users
    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::resource('users', UserController::class);
    
    // Services
    Route::resource('services', ServiceController::class);
    
    // Pet Categories
    Route::resource('pet-categories', PetCategoryController::class)->except(['show']);
    
    // Products
    Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');
    Route::resource('products', ProductController::class);
    
    // Pets
    Route::resource('pets', AdminPetController::class);
    
    // Medical Records
    Route::resource('medical-records', MedicalRecordController::class);
    
    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/logo', [SettingController::class, 'updateLogo'])->name('settings.update-logo');
});

/*
|--------------------------------------------------------------------------
| Pet Owner Routes
|--------------------------------------------------------------------------
*/
Route::prefix('pet-owner')->name('pet-owner.')->middleware(['auth', 'pet_owner'])->group(function () {
    Route::get('/', [PetOwnerDashboardController::class, 'index'])->name('dashboard');
    
    // Pets
    Route::resource('pets', PetOwnerPetController::class);
    
    // Appointments
    Route::patch('/appointments/{appointment}/cancel', [PetOwnerAppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::resource('appointments', PetOwnerAppointmentController::class)->only(['index', 'create', 'store', 'show']);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
});
