<?php

namespace Database\Seeders;

use App\Models\PetCategory;
use Illuminate\Database\Seeder;

class PetCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Dogs', 'description' => 'Canine pets'],
            ['name' => 'Cats', 'description' => 'Feline pets'],
            ['name' => 'Birds', 'description' => 'Avian pets'],
            ['name' => 'Hamsters', 'description' => 'Small rodent pets'],
            ['name' => 'Rabbits', 'description' => 'Rabbit pets'],
            ['name' => 'Fish', 'description' => 'Aquatic pets'],
            ['name' => 'Reptiles', 'description' => 'Reptile pets'],
            ['name' => 'Others', 'description' => 'Other types of pets'],
        ];

        foreach ($categories as $category) {
            PetCategory::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
