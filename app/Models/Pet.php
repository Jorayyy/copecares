<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Pet extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'pet_category_id',
        'name',
        'breed',
        'gender',
        'birth_date',
        'weight',
        'color',
        'medical_notes',
        'image',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PetCategory::class, 'pet_category_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    public function getAgeAttribute(): string
    {
        if (!$this->birth_date) {
            return 'Unknown';
        }

        $now = Carbon::now();
        $diff = $this->birth_date->diff($now);

        if ($diff->y > 0) {
            return $diff->y . ' ' . ($diff->y === 1 ? 'year' : 'years') . ' old';
        } elseif ($diff->m > 0) {
            return $diff->m . ' ' . ($diff->m === 1 ? 'month' : 'months') . ' old';
        } else {
            return $diff->d . ' ' . ($diff->d === 1 ? 'day' : 'days') . ' old';
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
