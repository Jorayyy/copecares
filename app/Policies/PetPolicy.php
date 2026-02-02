<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;

class PetPolicy
{
    public function view(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id || $user->hasAnyRole(['admin', 'veterinarian', 'staff']);
    }

    public function update(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id || $user->hasAnyRole(['admin', 'staff']);
    }

    public function delete(User $user, Pet $pet): bool
    {
        return $user->id === $pet->user_id || $user->isAdmin();
    }
}
