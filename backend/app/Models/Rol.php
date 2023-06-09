<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{

    public $timestamps = false;
    
    protected $fillable = [

        'id',
        'nombre'
    ];

   public function users()
    {
        return $this->hasMany(User::class);
    }

    

}