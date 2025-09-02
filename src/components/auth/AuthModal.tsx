import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@/components/ui/button';
import { Input } from '../ui/Input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AccessibleForm, FormInstructions } from '../ui/accessible-form'
import { FormData, FormErrors } from '../../types/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { t, isRTL } = useLanguage()
  const { signIn, signUp, resetPassword, loading } = useAuth()

  // Sync internal mode state with defaultMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
    }
  }, [defaultMode, isOpen])

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation (not for reset mode)
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      // Signup specific validations - DISABLED: Users must request demo first
      /* if (mode === 'signup') {
        if (!formData.fullName?.trim()) {
          newErrors.fullName = 'Full name is required'
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
      } */
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setErrors({ general: getErrorMessage(error) })
        } else {
          onClose()
        }
      // DISABLED: Signup functionality - Users must request demo first
      /* 
      else if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        if (error) {
          setErrors({ general: getErrorMessage(error) })
        } else {
          setSuccessMessage('Account created successfully! You are now signed in.')
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      } 
      */ 
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email)
        if (error) {
          setErrors({ general: getErrorMessage(error) })
        } else {
          setSuccessMessage('Password reset email sent! Check your inbox.')
          setTimeout(() => {
            setMode('signin')
            setSuccessMessage('')
          }, 3000)
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get user-friendly error messages
  const getErrorMessage = (error: any): string => {
    if (!error?.message) return 'An error occurred. Please try again.'
    
    const message = error.message.toLowerCase()
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials.'
    }
    if (message.includes('email already registered')) {
      return 'An account with this email already exists. Try signing in instead.'
    }
    if (message.includes('weak password')) {
      return 'Password is too weak. Please choose a stronger password.'
    }
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address.'
    }
    if (message.includes('signup disabled')) {
      return 'Account registration is currently disabled.'
    }
    
    return error.message
  }

  // Reset form when switching modes
  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    setFormData({
      email: formData.email, // Keep email when switching
      password: '',
      confirmPassword: '',
      fullName: '',
      rememberMe: false
    })
    setErrors({})
    setSuccessMessage('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'font-arabic text-right' : ''}>
            {mode === 'signin' && 'Sign In'}
            {/* {mode === 'signup' && 'Create Account'} */}
            {mode === 'reset' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'font-arabic text-right' : ''}>
            {mode === 'signin' && 'Welcome back to fead.app'}
            {/* {mode === 'signup' && 'Join fead.app today'} */}
            {mode === 'reset' && 'Enter your email to reset your password'}
          </DialogDescription>
        </DialogHeader>

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-4 border-green-500/30 bg-green-500/10">
            <AlertDescription className="text-green-600 dark:text-green-400">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* General Error */}
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <FormInstructions 
          instructions={[
            mode === 'signin' ? "Use your registered email and password" : 
            mode === 'signup' ? "All fields marked with * are required" :
            "Enter the email address associated with your account",
            "Password visibility can be toggled using the eye icon",
            mode === 'signup' ? "Password must be at least 6 characters long" : "",
            "Use Tab to navigate between fields"
          ].filter(Boolean)}
        />

        <AccessibleForm
          title=""
          description=""
          errorSummary={Object.values(errors).filter(Boolean) as string[]}
          onSubmit={handleSubmit}
        >
          {/* Full Name - Signup only */}
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              required
              disabled={isSubmitting}
              autoComplete="name"
              enterKeyHint="next"
              inputMode="text"
              leftIcon={<User size={20} />}
              error={errors.fullName}
              helpText="Enter your first and last name as it will appear on your profile"
              screenReaderInstructions="This field is required for account creation. Enter your full name as you'd like it to appear to other users."
            />
          )}

          {/* Email */}
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
            disabled={isSubmitting}
            autoComplete="email"
            inputMode="email"
            enterKeyHint={mode === 'reset' ? 'send' : 'next'}
            leftIcon={<Mail size={20} />}
            error={errors.email}
            helpText={mode === 'reset' ? 'We\'ll send password reset instructions to this email' : 'We\'ll use this email for your account and important notifications'}
            screenReaderInstructions={mode === 'reset' ? 'Enter the email address associated with your account to receive reset instructions' : 'Enter a valid email address that you have access to'}
          />

          {/* Password - Not for reset mode */}
          {mode !== 'reset' && (
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              enterKeyHint={mode === 'signin' ? 'done' : 'next'}
              leftIcon={<Lock size={20} />}
              showPasswordToggle={true}
              error={errors.password}
              helpText={mode === 'signup' ? 'Choose a strong password with at least 6 characters' : 'Enter your account password'}
              screenReaderInstructions={mode === 'signup' ? 'Create a secure password. You can use the toggle button to show or hide the password as you type' : 'Enter the password for your account. Use the toggle button if you need to see what you\'re typing'}
            />
          )}

          {/* Confirm Password - Signup only */}
          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              autoComplete="new-password"
              enterKeyHint="done"
              leftIcon={<Lock size={20} />}
              showPasswordToggle={true}
              passwordVisible={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              helpText="Re-enter your password to confirm it matches"
              screenReaderInstructions="Enter the same password you used above to confirm it's correct. This helps prevent typing errors."
            />
          )}

          {/* Remember Me - Signin only */}
          {mode === 'signin' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
                disabled={isSubmitting}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 sm:pt-2">
            <Button
              type="submit"
              loading={isSubmitting || loading}
              loadingText="Please wait..."
              className="w-full"
              size="lg"
            >
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Email'}
            </Button>
          </div>
        </AccessibleForm>
      </DialogContent>
    </Dialog>
  )
}