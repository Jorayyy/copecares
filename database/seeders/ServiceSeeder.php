<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\PetCategory;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'General Check-up',
                'description' => 'Complete physical examination and health assessment',
                'price' => 500.00,
                'duration_minutes' => 30,
                'categories' => ['Dogs', 'Cats', 'Birds', 'Hamsters', 'Rabbits'],
            ],
            [
                'name' => 'Vaccination',
                'description' => 'Standard vaccination for common diseases',
                'price' => 800.00,
                'duration_minutes' => 20,
                'categories' => ['Dogs', 'Cats'],
            ],
            [
                'name' => 'Anti-Rabies Vaccine',
                'description' => 'Rabies vaccination for pets',
                'price' => 350.00,
                'duration_minutes' => 15,
                'categories' => ['Dogs', 'Cats'],
            ],
            [
                'name' => 'Deworming',
                'description' => 'Internal parasite treatment',
                'price' => 300.00,
                'duration_minutes' => 15,
                'categories' => ['Dogs', 'Cats', 'Rabbits'],
            ],
            [
                'name' => 'Grooming - Basic',
                'description' => 'Bath, brush, nail trim, and ear cleaning',
                'price' => 500.00,
                'duration_minutes' => 60,
                'categories' => ['Dogs', 'Cats'],
            ],
            [
                'name' => 'Grooming - Full',
                'description' => 'Complete grooming with haircut and styling',
                'price' => 800.00,
                'duration_minutes' => 90,
                'categories' => ['Dogs', 'Cats'],
            ],
            [
                'name' => 'Dental Cleaning',
                'description' => 'Professional teeth cleaning and oral health check',
                'price' => 1500.00,
                'duration_minutes' => 45,
                'categories' => ['Dogs', 'Cats'],
            ],
            [
                'name' => 'Spay/Neuter Surgery',
                'description' => 'Sterilization surgery',
                'price' => 3500.00,
                'duration_minutes' => 120,
                'categories' => ['Dogs', 'Cats', 'Rabbits'],
            ],
            [
                'name' => 'X-Ray',
                'description' => 'Diagnostic imaging',
                'price' => 1200.00,
                'duration_minutes' => 30,
                'categories' => ['Dogs', 'Cats', 'Birds', 'Rabbits'],
            ],
            [
                'name' => 'Laboratory Tests',
                'description' => 'Blood work and other laboratory diagnostics',
                'price' => 1000.00,
                'duration_minutes' => 20,
                'categories' => ['Dogs', 'Cats', 'Birds', 'Hamsters', 'Rabbits'],
            ],
        ];

        foreach ($services as $serviceData) {
            $categories = $serviceData['categories'];
            unset($serviceData['categories']);
            
            $service = Service::updateOrCreate(
                ['name' => $serviceData['name']],
                $serviceData
            );

            // Attach pet categories
            $categoryIds = PetCategory::whereIn('name', $categories)->pluck('id');
            $service->petCategories()->sync($categoryIds);
        }
    }
}
