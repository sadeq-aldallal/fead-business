import React, { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  // Mobile keyboard optimization
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  // Enhanced autocomplete
  autoComplete?: string;
  // Mobile-specific props
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  // Real-time validation
  onValidate?: (value: string) => string | undefined;
  validationDelay?: number;
  // Enhanced accessibility
  helpText?: string;
  labelHidden?: boolean;
  ariaLabel?: string;
  screenReaderInstructions?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success = false,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  passwordVisible,
  onTogglePassword,
  type = 'text',
  inputMode,
  autoComplete,
  enterKeyHint,
  onValidate,
  validationDelay = 500,
  helpText,
  labelHidden = false,
  ariaLabel,
  screenReaderInstructions,
  className = '',
  id,
  required,
  onChange,
  ...props
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const showPassword = passwordVisible !== undefined ? passwordVisible : internalShowPassword;
  const togglePassword = onTogglePassword || (() => setInternalShowPassword(!internalShowPassword));
  const displayError = error || internalError;
  const { isRTL } = useLanguage();

  // Generate unique IDs for accessibility
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;
  const instructionsId = `${inputId}-instructions`;
  
  // Build aria-describedby list
  const ariaDescribedBy = [
    displayError ? errorId : undefined,
    helpText ? helpId : undefined,
    screenReaderInstructions ? instructionsId : undefined
  ].filter(Boolean).join(' ') || undefined;

  // Debounced validation
  const validateInput = useCallback((value: string) => {
    if (!onValidate) return;
    
    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      const validationError = onValidate(value);
      setInternalError(validationError);
      setIsValidating(false);
    }, validationDelay);

    return () => clearTimeout(timeoutId);
  }, [onValidate, validationDelay]);

  // Handle input change with validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Clear previous validation timeout and start new one
    if (onValidate) {
      validateInput(value);
    }
    
    // Call original onChange if provided
    if (onChange) {
      onChange(e);
    }
  }, [onChange, validateInput]);

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  
  // Calculate padding based on icons and RTL - enhanced for mobile
  const hasLeftIcon = leftIcon || (!isRTL && showPasswordToggle);
  const hasRightIcon = rightIcon || (isRTL && showPasswordToggle) || (!isRTL && showPasswordToggle);

  // Auto-detect inputMode based on type if not explicitly provided
  const getOptimalInputMode = (): string | undefined => {
    if (inputMode) return inputMode;
    
    switch (type) {
      case 'email':
        return 'email';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      case 'number':
        return 'numeric';
      case 'search':
        return 'search';
      default:
        return 'text';
    }
  };

  // Auto-detect enterKeyHint based on context
  const getOptimalEnterKeyHint = (): string | undefined => {
    if (enterKeyHint) return enterKeyHint;
    
    if (type === 'search') return 'search';
    if (type === 'email' || type === 'password') return 'next';
    return 'done';
  };

  return (
    <div className="space-y-2">
      {/* Screen reader instructions (invisible to sighted users) */}
      {screenReaderInstructions && (
        <div id={instructionsId} className="sr-only">
          {screenReaderInstructions}
        </div>
      )}
      
      {label && !labelHidden && (
        <Label 
          htmlFor={inputId}
          className={cn(
            "text-sm sm:text-base font-medium",
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="required">*</span>
          )}
        </Label>
      )}
      
      {/* Hidden label for screen readers when label is visually hidden */}
      {labelHidden && label && (
        <Label htmlFor={inputId} className="sr-only">
          {label}
          {required && ' (required)'}
        </Label>
      )}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <ShadcnInput
          id={inputId}
          type={inputType}
          inputMode={getOptimalInputMode() as any}
          enterKeyHint={getOptimalEnterKeyHint() as any}
          autoComplete={autoComplete}
          aria-invalid={displayError ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          aria-required={required ? 'true' : undefined}
          aria-label={ariaLabel}
          onChange={handleChange}
          className={cn(
            displayError && 'border-destructive focus:ring-destructive focus:border-destructive',
            success && !displayError && 'border-green-500 focus:ring-green-500 focus:border-green-500',
            isValidating && 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500',
            hasLeftIcon && 'pl-12 sm:pl-14',
            hasRightIcon && 'pr-12 sm:pr-14',
            isRTL && 'text-right',
            className
          )}
          {...props}
        />
        
        {/* Right Icon or Password Toggle */}
        {showPasswordToggle ? (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md p-1 z-10 touch-target transition-all duration-150 active:scale-95"
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-describedby={inputId}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={24} aria-hidden="true" />
            ) : (
              <Eye size={24} aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </button>
        ) : rightIcon ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
            {rightIcon}
          </div>
        ) : null}
      </div>
      
      {/* Help text */}
      {helpText && !displayError && !isValidating && (
        <div 
          id={helpId}
          className={cn(
            "mt-1 text-sm text-muted-foreground",
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          {helpText}
        </div>
      )}
      
      {/* Validation States */}
      {isValidating && (
        <div 
          className={cn(
            "mt-2 p-2 rounded-md bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
            isRTL ? 'text-right' : 'text-left'
          )}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <span className="animate-spin" aria-hidden="true">⏳</span>
            <span>Validating input...</span>
          </p>
        </div>
      )}

      {success && !displayError && !isValidating && (
        <div 
          className={cn(
            "mt-2 p-2 rounded-md bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800",
            isRTL ? 'text-right' : 'text-left'
          )}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
            <span aria-hidden="true">✅</span>
            <span>Input is valid</span>
          </p>
        </div>
      )}

      {displayError && (
        <div 
          id={errorId}
          role="alert"
          aria-live="polite"
          className={cn(
            "mt-2 p-3 rounded-md bg-destructive/10 border border-destructive/30",
            isRTL ? 'text-right' : 'text-left'
          )}
        >
          <p className={cn(
            "text-sm sm:text-base text-destructive font-medium flex items-start gap-2 min-h-[44px] items-center",
            isRTL ? 'text-right' : 'text-left'
          )}>
            <span className="text-destructive flex-shrink-0 text-lg" aria-hidden="true">⚠️</span>
            <span>{displayError}</span>
          </p>
        </div>
      )}
    </div>
  );
};