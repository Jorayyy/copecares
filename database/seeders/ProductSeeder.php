<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create Product Categories
        $categories = [
            ['name' => 'Pet Food', 'description' => 'Dog and cat food products'],
            ['name' => 'Medications', 'description' => 'Veterinary medicines and supplements'],
            ['name' => 'Accessories', 'description' => 'Pet accessories and supplies'],
            ['name' => 'Grooming Products', 'description' => 'Shampoos, brushes, and grooming tools'],
            ['name' => 'Treats', 'description' => 'Pet treats and snacks'],
        ];

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(['name' => $category['name']], $category);
        }

        // Create Sample Products
        $products = [
            [
                'category' => 'Pet Food',
                'name' => 'Premium Dog Food 1kg',
                'sku' => 'PDF-001',
                'description' => 'High-quality dry dog food',
                'cost_price' => 250.00,
                'selling_price' => 350.00,
                'stock_quantity' => 50,
                'reorder_level' => 10,
                'unit' => 'pack',
            ],
            [
                'category' => 'Pet Food',
                'name' => 'Cat Food Premium 1kg',
                'sku' => 'PCF-001',
                'description' => 'Nutritious cat food',
                'cost_price' => 280.00,
                'selling_price' => 380.00,
                'stock_quantity' => 45,
                'reorder_level' => 10,
                'unit' => 'pack',
            ],
            [
                'category' => 'Medications',
                'name' => 'Deworming Tablet',
                'sku' => 'MED-001',
                'description' => 'Deworming medication for dogs and cats',
                'cost_price' => 50.00,
                'selling_price' => 100.00,
                'stock_quantity' => 100,
                'reorder_level' => 20,
                'unit' => 'tablet',
            ],
            [
                'category' => 'Medications',
                'name' => 'Vitamin Supplement',
                'sku' => 'MED-002',
                'description' => 'Multi-vitamin for pets',
                'cost_price' => 150.00,
                'selling_price' => 250.00,
                'stock_quantity' => 60,
                'reorder_level' => 15,
                'unit' => 'bottle',
            ],
            [
                'category' => 'Accessories',
                'name' => 'Dog Collar - Medium',
                'sku' => 'ACC-001',
                'description' => 'Adjustable dog collar',
                'cost_price' => 80.00,
                'selling_price' => 150.00,
                'stock_quantity' => 30,
                'reorder_level' => 5,
                'unit' => 'piece',
            ],
            [
                'category' => 'Grooming Products',
                'name' => 'Pet Shampoo 500ml',
                'sku' => 'GRM-001',
                'description' => 'Gentle pet shampoo',
                'cost_price' => 120.00,
                'selling_price' => 200.00,
                'stock_quantity' => 40,
                'reorder_level' => 10,
                'unit' => 'bottle',
            ],
            [
                'category' => 'Treats',
                'name' => 'Dog Treats Pack',
                'sku' => 'TRT-001',
                'description' => 'Delicious dog treats',
                'cost_price' => 60.00,
                'selling_price' => 120.00,
                'stock_quantity' => 80,
                'reorder_level' => 15,
                'unit' => 'pack',
            ],
        ];

        foreach ($products as $productData) {
            $category = ProductCategory::where('name', $productData['category'])->first();
            unset($productData['category']);
            
            $productData['product_category_id'] = $category->id;
            
            Product::updateOrCreate(['sku' => $productData['sku']], $productData);
        }
    }
}
