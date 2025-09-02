# Claude Code Instructions for fead.app

## Deployment Protocol

**IMPORTANT: When deploying, always:**
- Deploy the `dev` branch to Vercel
- Use "Preview" environment (not production)
- Create preview deployment for testing

## Project Context

This is a React + TypeScript application for fead.app, an Instagram marketing automation platform.

### Key Technologies
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for database and authentication
- n8n for workflow automation
- Vercel for deployment

### Environment Configuration
- `.env.development` - Development environment (includes service role key for migrations)
- `.env.prod` - Production environment
- Uses `VITE_ENV` variable to explicitly set environment (dev/prod)
- Service role key available for database migrations and admin operations

### Modal Styling Standards
- Form modals use `max-w-md` class
- Management modals use `max-w-7xl w-full` class
- Always use global `Input` component for DRY compliance
- Use `modal-body` wrapper for proper padding

### Code Standards
- Use global UI components (Input, Button) for consistency
- Follow DRY principles
- No comments unless explicitly requested
- Prefer editing existing files over creating new ones

### Database
- Supabase tables: `organizations`, `businesses`
- RLS policies enabled
- Database setup files available in `/supabase/migrations/`
- Service role key for dev environment: Available in `.env.development`
- Use service role for database migrations and admin operations
- Required columns for Instagram OAuth: `access_token`, `is_webhook_subscribed`

### Testing & Quality
- Run linting and type checking after significant changes
- Ensure consistent styling across all modals and components
- Test organization and business creation flows