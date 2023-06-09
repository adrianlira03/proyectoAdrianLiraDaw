<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{

    public $timestamps = false;
    
    protected $fillable = [

        'empresa_id',
        'direccion',
        'telefono'
    ];


    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

}