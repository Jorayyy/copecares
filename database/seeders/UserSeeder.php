<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $adminRole = Role::where('slug', 'admin')->first();
        User::updateOrCreate(
            ['email' => 'admin@copecares.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'is_active' => true,
            ]
        );

        // Create Veterinarian User
        $vetRole = Role::where('slug', 'veterinarian')->first();
        User::updateOrCreate(
            ['email' => 'vet@copecares.com'],
            [
                'name' => 'Dr. Juan Dela Cruz',
                'password' => Hash::make('vet123'),
                'role_id' => $vetRole->id,
                'phone' => '09123456789',
                'is_active' => true,
            ]
        );

        // Create Staff User
        $staffRole = Role::where('slug', 'staff')->first();
        User::updateOrCreate(
            ['email' => 'staff@copecares.com'],
            [
                'name' => 'Maria Santos',
                'password' => Hash::make('staff123'),
                'role_id' => $staffRole->id,
                'phone' => '09987654321',
                'is_active' => true,
            ]
        );

        // Create Pet Owner User
        $petOwnerRole = Role::where('slug', 'pet_owner')->first();
        User::updateOrCreate(
            ['email' => 'owner@test.com'],
            [
                'name' => 'John Smith',
                'password' => Hash::make('owner123'),
                'role_id' => $petOwnerRole->id,
                'phone' => '09111222333',
                'address' => '123 Main Street, City',
                'is_active' => true,
            ]
        );
    }
}
