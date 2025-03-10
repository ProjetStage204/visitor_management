<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    //
}

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'date',
        'time',
        'reason',
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }
}
