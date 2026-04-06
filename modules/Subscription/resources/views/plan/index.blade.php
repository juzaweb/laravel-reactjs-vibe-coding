@extends('core::layouts.admin')

@section('content')
    <div class="row">
        <div class="col-md-12">
            @can('plans.create')
                <a href="{{ $createUrl }}" class="btn btn-primary">
                    <i class="fas fa-plus"></i> {{ __('Add Plan') }}
                </a>
            @endcan
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-md-12">
            {{--@component('components.datatables.filters')
                <div class="col-md-3 jw-datatable_filters">

                </div>
            @endcomponent--}}
        </div>

        <div class="col-md-12 mt-2">
            <x-card title="{{ __('Plans') }}">
                {{ $dataTable->table() }}
            </x-card>
        </div>
    </div>
@endsection

@section('scripts')
    {{ $dataTable->scripts(null, ['nonce' => csp_script_nonce()]) }}
@endsection
