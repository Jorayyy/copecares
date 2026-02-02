<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'user_id',
        'pet_id',
        'veterinarian_id',
        'owner_name',
        'contact',
        'email',
        'address',
        'pet_name',
        'pet_breed',
        'pet_age',
        'pet_category_id',
        'appointment_date',
        'appointment_time',
        'reason',
        'notes',
        'status',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($appointment) {
            if (empty($appointment->code)) {
                $appointment->code = static::generateCode();
            }
        });
    }

    public static function generateCode(): string
    {
        $prefix = 'APT';
        $date = now()->format('Ymd');
        $lastAppointment = static::whereDate('created_at', today())->latest()->first();
        $sequence = $lastAppointment ? ((int) substr($lastAppointment->code, -4)) + 1 : 1;
        
        return $prefix . '-' . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }

    public function veterinarian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'veterinarian_id');
    }

    public function petCategory(): BelongsTo
    {
        return $this->belongsTo(PetCategory::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)->withPivot('price')->withTimestamps();
    }

    public function sale(): HasOne
    {
        return $this->hasOne(Sale::class);
    }

    public function medicalRecord(): HasOne
    {
        return $this->hasOne(MedicalRecord::class);
    }

    public function getOwnerDisplayNameAttribute(): string
    {
        return $this->user ? $this->user->name : ($this->owner_name ?? 'N/A');
    }

    public function getPetDisplayNameAttribute(): string
    {
        return $this->pet ? $this->pet->name : ($this->pet_name ?? 'N/A');
    }

    public function getTotalServicesAmountAttribute(): float
    {
        return $this->services->sum('pivot.price');
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'confirmed' => 'info',
            'in_progress' => 'primary',
            'completed' => 'success',
            'cancelled' => 'danger',
            'no_show' => 'secondary',
            default => 'secondary',
        };
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>=', today())
                     ->whereIn('status', ['pending', 'confirmed']);
    }
}
