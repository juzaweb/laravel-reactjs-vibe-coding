<?php

namespace Juzaweb\Modules\Payment\Http\Controllers;

use Juzaweb\Modules\Core\Http\Controllers\BackendController;

class PaymentHistoryController extends BackendController
{
    public function index()
    {
        return view('cms::backend.index', [
            'title' => __('Payment Histories'),
        ]);
    }
}
