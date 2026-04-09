# Juzaweb CMS Installer

[![Tests](https://github.com/juzaweb/installer/actions/workflows/tests.yml/badge.svg)](https://github.com/juzaweb/installer/actions/workflows/tests.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive installation package for Juzaweb CMS that provides a web-based installation wizard and command-line installation support.


## Features

- **Web-based Installation Wizard**: User-friendly interface for installing Juzaweb CMS
- **System Requirements Check**: Validates PHP version and required extensions
- **Permissions Verification**: Ensures proper folder permissions
- **Environment Configuration**: Easy setup of database and application settings
- **Database Installation**: Automated database migration and seeding
- **Admin Account Creation**: Quick setup of the first administrator account
- **Command-line Installation**: Support for automated installation via Artisan command

## Installation

This package is automatically included with Juzaweb CMS. No separate installation is required.

## Requirements

### PHP Version
- PHP >= 8.2

### Required PHP Extensions
- OpenSSL
- PDO
- Mbstring
- Tokenizer
- JSON
- cURL

### Apache Modules
- mod_rewrite

### Folder Permissions
The following directories must be writable (775):
- `storage/`
- `bootstrap/cache/`
- `resources/`
- `public/`

## Usage

### Web-based Installation

1. Navigate to your application URL in a web browser
2. The installer will automatically redirect you to the installation wizard
3. Follow the step-by-step process:
   - **Welcome**: Introduction to the installer
   - **Requirements**: System requirements verification
   - **Permissions**: Folder permissions check
   - **Environment**: Database and application configuration
   - **Database**: Database installation
   - **Admin**: Create administrator account
   - **Final**: Complete installation

### Command-line Installation

Use the Artisan command for automated installation:

```bash
php artisan install
```

This command will guide you through the installation process via the command line.

## Configuration

### Publishing Configuration

To customize the installer configuration, publish the config file:

```bash
php artisan vendor:publish --tag=installer_config
```

This will create `config/installer.php` where you can customize:
- Minimum PHP version
- Required PHP extensions
- Required Apache modules
- Folder permissions
- Environment form validation rules

### Publishing Assets

To publish the installer assets (CSS, JS, images):

```bash
php artisan vendor:publish --tag=installer-assets
```

Assets will be published to `public/vendor/installer/`.

## Middleware

The package registers the following middleware:

### `Installed` Middleware
- Automatically applied to `theme` and `admin` middleware groups
- Redirects to the installer if the application is not yet installed
- Prevents access to the application until installation is complete

### `CanInstall` Middleware
- Registered as `install` middleware alias
- Protects the installer routes
- Prevents re-installation if the application is already installed

## Routes

The installer provides the following routes under the `/install` prefix:

- `GET /install` - Welcome page
- `GET /install/requirements` - Requirements check
- `GET /install/permissions` - Permissions check
- `GET /install/environment` - Environment configuration form
- `POST /install/environment` - Save environment configuration
- `GET /install/database` - Database installation
- `GET /install/admin` - Admin account creation form
- `POST /install/admin` - Save admin account
- `GET /install/final` - Installation completion

## Helper Functions

### `isActive()`

Set the active class to the current opened menu.

```php
/**
 * @param array|string $route Route name(s) to check
 * @param string $className CSS class name (default: 'active')
 * @return string|false Returns the class name if active, empty string or false otherwise
 */
isActive($route, $className = 'active')
```

**Examples:**

```php
// Single route
<li class="{{ isActive('install.welcome') }}">Welcome</li>

// Multiple routes
<li class="{{ isActive(['install.requirements', 'install.permissions']) }}">System Check</li>

// Custom class name
<li class="{{ isActive('install.database', 'current') }}">Database</li>
```

## Events

The package dispatches the following events:

- `Juzaweb\Modules\Installer\Events\EnvironmentSaved` - Fired when environment configuration is saved
- `Juzaweb\Modules\Installer\Events\LaravelInstallerFinished` - Fired when installation is completed

## Testing

The package includes a comprehensive test suite using PHPUnit and Orchestra Testbench.

### Running Tests

```bash
# Run all tests
composer test

# Run tests with coverage
composer test-coverage

# Run specific test file
vendor/bin/phpunit tests/Feature/InstallerRoutesTest.php

# Run tests with verbose output
vendor/bin/phpunit --testdox
```

### Test Coverage

The test suite includes comprehensive coverage for both validation failures and success scenarios:

**Feature Tests:**
- `InstallerRoutesTest` - Tests for all GET routes (welcome, requirements, permissions, environment)
- `EnvironmentPostTest` - Environment configuration POST endpoint
  - **Validation Tests** (6 tests): Required fields, data types, max lengths, input preservation
  - **Success Tests** (4 tests): Valid credentials, database connection, redirect flow, environment file saving
- `AdminPostTest` - Admin account creation POST endpoint
  - **Validation Tests** (11 tests): Required fields, email format, password rules, confirmation, max lengths
  - **Success Tests** (6 tests): User creation, password hashing, various email formats, special characters, success messages
- `InstallerMiddlewareTest` - Tests for middleware behavior and CSRF protection

**Unit Tests:**
- `HelperFunctionsTest` - Tests for the `isActive()` helper function

**Total Test Cases:** 30+ tests covering:
- ✅ Route accessibility
- ✅ Form validation rules (required, format, length)
- ✅ Error handling and redirects
- ✅ Input preservation on validation failure
- ✅ Successful form submissions
- ✅ Database operations (mocked)
- ✅ Password hashing
- ✅ Middleware functionality
- ✅ CSRF protection



### Code Formatting

The package uses Laravel Pint for code formatting:

```bash
# Format code
composer format

# Check code style without fixing
vendor/bin/pint --test
```

### Continuous Integration

The package uses GitHub Actions for automated testing. Tests run on:
- PHP 8.2 and 8.3
- Laravel 11.x
- Ubuntu latest

The CI workflow runs on every push and pull request to `main`, `master`, and `develop` branches.

## Security


- The installer automatically disables itself after successful installation
- Environment files are protected and not accessible via web
- Database credentials are validated before saving
- Admin password is hashed using Laravel's secure hashing

## Troubleshooting

### Installation Page Not Loading

If the installation page doesn't load:
1. Check that your web server is properly configured
2. Ensure `.htaccess` (Apache) or nginx configuration is correct
3. Verify that `mod_rewrite` is enabled (Apache)

### Permission Errors

If you encounter permission errors:
```bash
chmod -R 775 storage bootstrap/cache resources public
chown -R www-data:www-data storage bootstrap/cache resources public
```

### Database Connection Failed

If database connection fails:
1. Verify database credentials
2. Ensure the database exists
3. Check that the database user has proper permissions
4. Confirm the database server is running

## License

This package is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For support and documentation, visit:
- Homepage: [https://cms.juzaweb.com](https://cms.juzaweb.com)
