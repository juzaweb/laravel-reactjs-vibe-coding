# Juzaweb CMS Blog Module - AI Coding Guide

## Architecture Overview
This is a **Juzaweb CMS module** extending Laravel. It implements a multi-language blog system with posts, categories, and comments using a translatable architecture with separate translation tables.

## Key Patterns & Conventions

### Models & Data Architecture
- **UUID Primary Keys**: All main models (`Post`, `Category`) use UUIDs, not auto-incrementing IDs
- **Translation Pattern**: Main models have companion translation tables (`post_translations`, `post_category_translations`)
  - Main model stores non-translatable data (status, timestamps)
  - Translation model stores locale-specific content (title, slug, content, description)
  - Use `translatedAttributes` property to define translatable fields
- **Trait Composition**: Models extensively use traits for functionality:
  ```php
  use HasAPI, HasUuids, Translatable, HasTags, HasComments, HasThumbnail, HasMedia, UsedInFrontend;
  ```

### Controllers & Routes
- Controllers extend `AdminController` from Juzaweb Core
- Use `Route::admin('posts', PostController::class)` for resource routes
- DataTable classes handle admin listing pages (see `PostsDataTable`, `CategoriesDataTable`)
- **Authentication**: Tests require `is_super_admin = 1` user for admin access

### Service Provider Registration
The `BlogServiceProvider` handles:
- **Sitemap Integration**: Registers translatable models with sitemap
- **Menu Registration**: Creates admin menu structure using `Menu::make()`
- **Service binding**: Loads migrations, views, config, translations

### Frontend Asset Compilation
- Uses **Laravel Mix** with manifest merging for multi-package builds
- Assets located in `/assets/` folder, compiled to `/assets/public/`
- Empty CSS/JS arrays suggest assets are managed by parent CMS

### Testing Approach
- **Feature Tests**: Test full HTTP requests to admin endpoints
- **Factories**: Use model factories for test data (`PostFactory`, `CategoryFactory`)
- **SQLite in-memory**: Tests use `:memory:` database for speed
- **Orchestra Testbench**: Package testing framework for Laravel packages

## Development Workflows

### Adding New Features
1. Create migration with UUID primary key and translation table structure
2. Add model with proper traits and `$translatedAttributes`
3. Create controller extending `AdminController`
4. Add DataTable class for admin listing
5. Register routes using `Route::admin()`
6. Add menu items in service provider's `registerMenus()`

### Translation Support
- Always use translation tables for user-facing content
- Reference translated model in controllers: `Category::withTranslation()`
- Translation keys use module namespace: `__('blog::translation.posts')`

### Frontend Integration
- Models implement `UsedInFrontend` trait for public display
- Automatic sitemap generation for SEO
- Views namespaced with `blog::` prefix

## Testing Commands
```bash
# Run tests with proper environment
vendor/bin/phpunit

# Install dev dependencies
composer require juzaweb/dev-tool --dev
```

## Asset Development
```bash
# Watch mode for development
npm run hot

# Production build
npm run prod
```