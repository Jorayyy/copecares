<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General Settings
            ['key' => 'clinic_name', 'value' => 'CopeCares Veterinary Clinic', 'group' => 'general'],
            ['key' => 'clinic_short_name', 'value' => 'CopeCares', 'group' => 'general'],
            ['key' => 'clinic_email', 'value' => 'info@copecares.com', 'group' => 'general'],
            ['key' => 'clinic_phone', 'value' => '(053) 123-4567', 'group' => 'general'],
            ['key' => 'clinic_address', 'value' => '123 Veterinary Street, Tacloban City, Leyte', 'group' => 'general'],
            
            // Operating Hours
            ['key' => 'opening_time', 'value' => '08:00', 'group' => 'schedule'],
            ['key' => 'closing_time', 'value' => '17:00', 'group' => 'schedule'],
            ['key' => 'appointment_duration', 'value' => '30', 'group' => 'schedule'],
            ['key' => 'max_appointments_per_day', 'value' => '30', 'group' => 'schedule'],
            
            // POS Settings
            ['key' => 'tax_rate', 'value' => '12', 'group' => 'pos'],
            ['key' => 'currency_symbol', 'value' => '₱', 'group' => 'pos'],
            ['key' => 'receipt_footer', 'value' => 'Thank you for choosing CopeCares!', 'group' => 'pos'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
