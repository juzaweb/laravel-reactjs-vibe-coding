<?php

namespace Juzaweb\Modules\Core\Permissions\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * API Scope Group model for grouping OAuth scopes.
 * Table: api_scope_groups
 */
class ApiScopeGroup extends Model
{
    protected $table = 'api_scope_groups';

    protected $guarded = [];
}
