<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Full system access with all administrative privileges',
            ],
            [
                'name' => 'Veterinarian',
                'slug' => 'veterinarian',
                'description' => 'Veterinary doctor with access to medical records and appointments',
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'description' => 'Front desk staff with access to appointments and POS',
            ],
            [
                'name' => 'Pet Owner',
                'slug' => 'pet_owner',
                'description' => 'Pet owner with access to their pets and appointments',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
