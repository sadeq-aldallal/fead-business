import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginWelcomePageProps {
  onHomeClick?: () => void;
}

export const LoginWelcomePage: React.FC<LoginWelcomePageProps> = ({
  onHomeClick
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Back Button - Mobile */}
      <button
        onClick={onHomeClick}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white transition-all duration-200"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* Hero Image Section - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <img 
            src="/fead.app_logo.png" 
            alt="fead.app" 
            className="h-16 w-auto mb-8 filter brightness-0 invert"
          />
          <h1 className="text-4xl font-bold mb-4 text-center">
            Never Miss a Customer
          </h1>
          <p className="text-xl text-center opacity-90 leading-relaxed max-w-md">
            AI-powered Instagram automation that transforms DMs into sales opportunities
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:w-1/2">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="text-center lg:hidden mb-8">
            <img 
              src="/fead.app_logo.png" 
              alt="fead.app" 
              className="h-12 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to fead.app
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered Instagram automation
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Start automating your Instagram business today' 
                : 'Sign in to your fead.app dashboard'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Back to Home - Desktop */}
          <div className="hidden lg:block mt-8 text-center">
            <button
              onClick={onHomeClick}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back to homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};