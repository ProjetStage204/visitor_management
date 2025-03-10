<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id', 'check_in_time', 'check_out_time'
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }
}
