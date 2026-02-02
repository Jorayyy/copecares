<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccination extends Model
{
    use HasFactory;

    protected $fillable = [
        'pet_id',
        'medical_record_id',
        'vaccine_name',
        'vaccination_date',
        'next_due_date',
        'batch_number',
        'notes',
    ];

    protected $casts = [
        'vaccination_date' => 'date',
        'next_due_date' => 'date',
    ];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function isDue(): bool
    {
        return $this->next_due_date && $this->next_due_date->isPast();
    }

    public function isUpcoming(): bool
    {
        return $this->next_due_date && $this->next_due_date->isFuture() && $this->next_due_date->diffInDays(now()) <= 30;
    }
}
