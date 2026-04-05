<?php

namespace Juzaweb\Modules\Core\Permissions\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * API Scope model for OAuth scope management.
 * Table: api_scopes
 */
class ApiScope extends Model
{
    protected $table = 'api_scopes';

    protected $guarded = [];
}
