<?php

/**
 * JUZAWEB CMS - Laravel CMS for Your Project
 *
 * @author     The Anh Dang
 *
 * @link       https://cms.juzaweb.com
 *
 * @license    GNU V2
 */

namespace Juzaweb\Modules\Core\Providers;

use Illuminate\Support\Facades\Gate;
use Juzaweb\Modules\Core\Contracts\Sitemap;
use Juzaweb\Modules\Core\Facades\Menu;
use Juzaweb\Modules\Core\Facades\MenuBox;
use Juzaweb\Modules\Core\Facades\PageBlock;
use Juzaweb\Modules\Core\Facades\Setting;
use Juzaweb\Modules\Core\Facades\Widget;
use Juzaweb\Modules\Core\Models\Client;
use Juzaweb\Modules\Core\Models\Pages\Page;
use Juzaweb\Modules\Core\Models\Pages\PageTranslation;
use Juzaweb\Modules\Core\Models\User;
use Laravel\Passport\Passport;

class AdminServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::define('viewLogViewer', function (?User $user) {
            return $user && $user->isSuperAdmin();
        });

        Passport::enablePasswordGrant();
        Passport::useClientModel(Client::class);

        $this->registerSettings();
        $this->registerGlobalPageBlocks();
        $this->registerGlobalWidgets();

        $this->app[Sitemap::class]->register('pages', PageTranslation::class);
    }

    public function register(): void
    {
        //
    }

    protected function registerSettings(): void
    {
        $this->booted(
            function () {
                Setting::make('title')->default(config('app.name'));

                Setting::make('description');
                Setting::make('sitename');

                Setting::make('logo');
                Setting::make('favicon');
                Setting::make('banner');

                Setting::make('user_registration')->default(true);

                Setting::make('user_verification')->default(false);

                Setting::make('multiple_language')->default('none');
                Setting::make('language')->default('en');

                // Social Login Settings
                $drivers = array_keys(config('core.social_login.providers', []));

                foreach ($drivers as $driver) {
                    Setting::make("{$driver}_login")
                        ->add();

                    Setting::make("{$driver}_client_id")
                        ->add();

                    Setting::make("{$driver}_client_secret")
                        ->add();
                }

                Setting::make('mail_host')->rules(['nullable', 'string']);
                Setting::make('mail_port')->rules(['nullable', 'integer', 'min:1', 'max:65535']);
                Setting::make('mail_username')->rules(['nullable', 'string']);
                Setting::make('mail_password')->rules(['nullable', 'string']);
                Setting::make('mail_encryption')->rules(['nullable', 'string', 'in:tls,ssl']);
                Setting::make('mail_from_address')->rules(['nullable', 'email']);
                Setting::make('mail_from_name')->rules(['nullable', 'string']);

                // Custom Scripts Settings
                Setting::make('custom_header_script')->rules(['nullable', 'string']);
                Setting::make('custom_footer_script')->rules(['nullable', 'string']);

                Setting::make('google_analytics_id')->rules(['nullable', 'string']);

                // Cookie Consent Settings
                Setting::make('cookie_consent_enabled')->default(false);
                Setting::make('cookie_consent_message')->rules(['nullable', 'string']);

                Setting::make('captcha')->rules(['nullable', 'string']);
                Setting::make('captcha_site_key')->rules(['nullable', 'string']);
                Setting::make('captcha_site_secret')->rules(['nullable', 'string']);
            }
        );
    }

    protected function registerGlobalPageBlocks(): void
    {
        PageBlock::make(
            'html',
            function () {
                return [
                    'label' => __('core::translation.html_block'),
                    'form' => 'core::global.blocks.html.form',
                    'view' => 'core::global.blocks.html.view',
                ];
            }
        );
    }

    protected function registerGlobalWidgets(): void
    {
        Widget::make(
            'html',
            function () {
                return [
                    'label' => __('core::translation.html_widget'),
                    'description' => __('core::translation.display_custom_html_content'),
                    'form' => 'core::global.widgets.html.form',
                    'view' => 'core::global.widgets.html.show',
                ];
            }
        );
    }
}
