# fead.app Business Dashboard - Complete Supabase Authentication System

A modern React business dashboard application with comprehensive Supabase authentication, featuring a dark futuristic design and multilingual support.

## 🚀 Features

### Authentication System
- ✅ **Email/Password Signup** - Complete user registration
- ✅ **Email/Password Signin** - Secure user authentication  
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Protected Routes** - Route-level authentication guards
- ✅ **Session Management** - Automatic token refresh and persistence
- ✅ **User Profile** - Complete profile management interface
- ✅ **Error Handling** - Comprehensive error messages and validation
- ✅ **Loading States** - Smooth UX with loading indicators

### UI/UX Features
- 🎨 **Dark Futuristic Design** - Modern glassmorphism effects
- 🌍 **Multilingual Support** - English and Arabic (RTL)
- 📱 **Fully Responsive** - Mobile-first design approach
- ⚡ **Smooth Animations** - CSS animations and transitions
- 🎯 **Consistent Branding** - Unified color system with CSS variables

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## 📦 Installation & Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd fead-business
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

#### Configure Authentication
1. Go to **Authentication > Settings**
2. **Configure email confirmation**:
   - For development: Set "Enable email confirmations" to **OFF** for immediate login
   - For production: Keep "Enable email confirmations" to **ON** for security
3. Configure **Site URL**:
   - Add `http://localhost:5173` for development
   - Add your production URL when deploying

#### Get Your Keys
1. Go to **Settings > API**
2. Copy your **Project URL** and **anon public key**

### 3. Environment Variables

Choose the appropriate environment file based on your setup:

#### For Local Development
Copy `.env.local` and update with your values:
```env
# Local Environment Variables
VITE_N8N_WEBHOOK_URL=https://your-local-n8n-instance.com/webhook/fead-app-emails
VITE_INSTAGRAM_CLIENT_ID=your_local_instagram_client_id
VITE_INSTAGRAM_REDIRECT_URL=http://localhost:5173/
VITE_SUPABASE_URL=your_local_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_local_supabase_anon_key_here
```

#### For Development Environment
Use `.env.dev` with development-specific values.

#### For Production
Use `.env.prod` with production values.

### 4. Start Development Server
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx          # Complete auth modal (signin/signup/reset)
│   │   ├── ProtectedRoute.tsx     # Route protection wrapper
│   │   └── UserProfile.tsx        # User profile management
│   ├── dashboard/
│   │   └── Dashboard.tsx          # Protected dashboard
│   ├── layout/
│   │   └── Navigation.tsx         # Navigation with user menu
│   ├── sections/
│   │   ├── HeroSection.tsx        # Landing page hero
│   │   ├── Footer.tsx             # Footer with contact form
│   │   └── ...
│   └── ui/
│       ├── Button.tsx             # Reusable button component
│       └── Input.tsx              # Form input component
├── contexts/
│   ├── AuthContext.tsx            # Authentication state management
│   └── LanguageContext.tsx        # Multilingual support
├── lib/
│   └── supabase.ts                # Supabase client and helpers
├── types/
│   ├── auth.ts                    # Authentication TypeScript types
│   └── index.ts                   # General types
└── App.tsx                        # Main application component
```

## 🔐 Authentication Flow

### User Registration (Signup)
1. User fills signup form with email, password, and full name
2. Form validation (email format, password strength, matching passwords)
3. Supabase creates user account
4. User is automatically signed in (email confirmation disabled)
5. Redirect to dashboard or profile

### User Login (Signin)
1. User enters email and password
2. Form validation
3. Supabase authenticates credentials
4. Session is established and persisted
5. User gains access to protected routes

### Password Reset
1. User requests password reset with email
2. Supabase sends reset email
3. User clicks link and sets new password
4. Automatic redirect to signin

### Session Management
- Automatic token refresh
- Persistent sessions across browser restarts
- Real-time auth state updates
- Secure logout with session cleanup

## 🎨 Design System

### Color Variables
```css
:root {
  --brand-green: #00D4AA;        /* Primary brand color */
  --gradient-start: #24243e;     /* Background gradient start */
  --gradient-end: #302b63;       /* Background gradient end */
  --glass-bg: rgba(0, 212, 170, 0.08);     /* Glass effect background */
  --glass-border: rgba(0, 212, 170, 0.15); /* Glass effect border */
}
```

### Component Classes
- `.glass-card` - Glassmorphism effect
- `.btn-primary` - Primary button styling
- `.btn-outline` - Outline button styling
- `.dark-gradient-bg` - Main background gradient

## 🛡️ Security Features

### Input Validation
- Email format validation
- Password strength requirements (minimum 6 characters)
- Password confirmation matching
- XSS protection through React's built-in escaping

### Authentication Security
- Secure password hashing (handled by Supabase)
- JWT token-based authentication
- Automatic token refresh
- Secure session storage
- CSRF protection

### Route Protection
```tsx
<ProtectedRoute requireAuth={true}>
  <Dashboard />
</ProtectedRoute>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly buttons and inputs
- Optimized form layouts
- Reduced animations for performance

## 🌍 Internationalization

### Supported Languages
- **English** (default)
- **Arabic** (RTL support)

### Adding New Languages
1. Add language to `languages` array in `LanguageContext.tsx`
2. Add translations to `translations` object
3. Update language selector in navigation

## 🚀 Deployment

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

## 🧪 Testing Authentication

### Test User Flows
1. **Signup Flow**:
   - Try invalid email formats
   - Test password requirements
   - Verify password confirmation
   - Check successful registration

2. **Signin Flow**:
   - Test with invalid credentials
   - Verify successful login
   - Check session persistence

3. **Protected Routes**:
   - Access dashboard without login
   - Verify redirect behavior
   - Test logout functionality

## 🔧 Customization

### Changing Brand Colors
Update the `--brand-green` variable in `src/index.css`:
```css
:root {
  --brand-green: #your-color;
}
```

### Adding New Auth Providers
Extend the `authHelpers` in `src/lib/supabase.ts`:
```typescript
signInWithGoogle: async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  return { data, error }
}
```

## 📚 API Reference

### AuthContext Methods
```typescript
const { 
  user,           // Current user object
  session,        // Current session
  loading,        // Loading state
  signUp,         // (email, password, fullName) => Promise
  signIn,         // (email, password) => Promise  
  signOut,        // () => Promise
  resetPassword,  // (email) => Promise
  updatePassword  // (password) => Promise
} = useAuth()
```

### Supabase Helpers
```typescript
import { authHelpers } from './lib/supabase'

// All authentication operations
await authHelpers.signUp(email, password, userData)
await authHelpers.signIn(email, password)
await authHelpers.signOut()
await authHelpers.resetPassword(email)
await authHelpers.updatePassword(password)
await authHelpers.getCurrentUser()
await authHelpers.getSession()
```

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check email/password combination
   - Verify user exists in Supabase Auth dashboard

2. **Environment variables not loading**
   - Ensure `.env.local` file exists
   - Restart development server after changes
   - Check variable names start with `VITE_`

3. **Email confirmation issues**
   - Disable email confirmation in Supabase settings
   - Check spam folder for confirmation emails
   - Verify Site URL configuration

4. **Session not persisting**
   - Check browser localStorage
   - Verify Supabase client configuration
   - Clear browser cache and cookies

## 📄 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and Supabase**