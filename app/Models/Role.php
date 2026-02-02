<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public static function getAdmin(): ?Role
    {
        return static::where('slug', 'admin')->first();
    }

    public static function getVeterinarian(): ?Role
    {
        return static::where('slug', 'veterinarian')->first();
    }

    public static function getStaff(): ?Role
    {
        return static::where('slug', 'staff')->first();
    }

    public static function getPetOwner(): ?Role
    {
        return static::where('slug', 'pet_owner')->first();
    }
}
