<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PetCategorySeeder::class,
            ServiceSeeder::class,
            ProductSeeder::class,
            UserSeeder::class,
            SettingSeeder::class,
        ]);
    }
}

