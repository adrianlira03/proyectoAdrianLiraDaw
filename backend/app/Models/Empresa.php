<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{

    public $timestamps = false;
    
    protected $fillable = [

        'nombre',
        'descripcion'
    ];

   public function sedes()
    {
        return $this->hasMany(Sede::class);
    }

    public function candidaturas()
    {
        return $this->hasMany(Candidatura::class);
    }

}