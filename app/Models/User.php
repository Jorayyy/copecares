<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'phone',
        'address',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function assignedAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'veterinarian_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function processedSales(): HasMany
    {
        return $this->hasMany(Sale::class, 'cashier_id');
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class, 'veterinarian_id');
    }

    // Role checking methods
    public function isAdmin(): bool
    {
        return $this->role?->slug === 'admin';
    }

    public function isVeterinarian(): bool
    {
        return $this->role?->slug === 'veterinarian';
    }

    public function isStaff(): bool
    {
        return $this->role?->slug === 'staff';
    }

    public function isPetOwner(): bool
    {
        return $this->role?->slug === 'pet_owner';
    }

    public function hasRole(string $role): bool
    {
        return $this->role?->slug === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role?->slug, $roles);
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random';
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRole($query, string $role)
    {
        return $query->whereHas('role', function ($q) use ($role) {
            $q->where('slug', $role);
        });
    }

    public function scopeVeterinarians($query)
    {
        return $query->byRole('veterinarian');
    }

    public function scopeStaff($query)
    {
        return $query->byRole('staff');
    }

    public function scopePetOwners($query)
    {
        return $query->byRole('pet_owner');
    }
}

