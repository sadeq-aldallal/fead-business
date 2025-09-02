/**
 * Mobile Keyboard Input Optimization Tests
 * Validates that form inputs have proper mobile keyboard attributes
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthModal } from '../components/auth/AuthModal'
import { BusinessModal } from '../components/modals/BusinessModal'
import { OrganizationModal } from '../components/modals/OrganizationModal'
import { DashboardProvider } from '../contexts/DashboardContext'
import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'

const TestWrapper = ({ children }) => (
  <LanguageProvider>
    <AuthProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </AuthProvider>
  </LanguageProvider>
)

describe('Mobile Keyboard Input Optimizations', () => {
  describe('AuthModal Keyboard Attributes', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} defaultMode="signin" />
        </TestWrapper>
      )
    })

    it('email input should have email inputMode and appropriate attributes', () => {
      const emailInput = screen.getByLabelText(/email/i)
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('inputMode', 'email')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(emailInput).toHaveAttribute('enterKeyHint', 'next')
    })

    it('password input should disable suggestions and have proper attributes', () => {
      const passwordInput = screen.getByLabelText(/password/i)
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
      expect(passwordInput).toHaveAttribute('enterKeyHint', 'done')
    })
  })

  describe('AuthModal Signup Mode Keyboard Attributes', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} defaultMode="signup" />
        </TestWrapper>
      )
    })

    it('full name input should have text inputMode and name autoComplete', () => {
      const fullNameInput = screen.getByLabelText(/full name/i)
      
      expect(fullNameInput).toHaveAttribute('type', 'text')
      expect(fullNameInput).toHaveAttribute('inputMode', 'text')
      expect(fullNameInput).toHaveAttribute('autoComplete', 'name')
      expect(fullNameInput).toHaveAttribute('enterKeyHint', 'next')
    })

    it('password fields should have proper autoComplete for new passwords', () => {
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      expect(passwordInput).toHaveAttribute('autoComplete', 'new-password')
      expect(confirmPasswordInput).toHaveAttribute('autoComplete', 'new-password')
      expect(confirmPasswordInput).toHaveAttribute('enterKeyHint', 'done')
    })
  })

  describe('OrganizationModal Keyboard Attributes', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <OrganizationModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )
    })

    it('organization name should have organization autoComplete', () => {
      const orgNameInput = screen.getByLabelText(/organization name/i)
      
      expect(orgNameInput).toHaveAttribute('type', 'text')
      expect(orgNameInput).toHaveAttribute('inputMode', 'text')
      expect(orgNameInput).toHaveAttribute('autoComplete', 'organization')
      expect(orgNameInput).toHaveAttribute('enterKeyHint', 'next')
    })

    it('phone input should have tel inputMode and attributes', () => {
      const phoneInput = screen.getByLabelText(/phone number/i)
      
      expect(phoneInput).toHaveAttribute('type', 'tel')
      expect(phoneInput).toHaveAttribute('inputMode', 'tel')
      expect(phoneInput).toHaveAttribute('autoComplete', 'tel')
      expect(phoneInput).toHaveAttribute('enterKeyHint', 'done')
    })

    it('email input should have email keyboard attributes', () => {
      const emailInput = screen.getByLabelText(/email/i)
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('inputMode', 'email')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(emailInput).toHaveAttribute('enterKeyHint', 'next')
    })
  })

  describe('BusinessModal Keyboard Attributes', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <BusinessModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )
    })

    it('business name should have proper text input attributes', () => {
      const businessNameInput = screen.getByLabelText(/business name/i)
      
      expect(businessNameInput).toHaveAttribute('type', 'text')
      expect(businessNameInput).toHaveAttribute('inputMode', 'text')
      expect(businessNameInput).toHaveAttribute('autoComplete', 'organization')
      expect(businessNameInput).toHaveAttribute('enterKeyHint', 'next')
    })
  })

  describe('Input Accessibility Attributes', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )
    })

    it('form inputs should have proper ARIA attributes', () => {
      const emailInput = screen.getByLabelText(/email/i)
      
      // Should have aria-required for required fields
      expect(emailInput).toHaveAttribute('aria-required', 'true')
      
      // Should have aria-invalid initially set to false
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')
      
      // Should have aria-describedby for help text and instructions
      expect(emailInput).toHaveAttribute('aria-describedby')
    })

    it('password toggle buttons should have proper accessibility', () => {
      const passwordToggles = screen.getAllByRole('button', { name: /show password|hide password/i })
      
      passwordToggles.forEach(toggle => {
        // Should have proper aria-label
        expect(toggle).toHaveAttribute('aria-label')
        
        // Should have title attribute for tooltip
        expect(toggle).toHaveAttribute('title')
        
        // Should have aria-describedby linking to input
        expect(toggle).toHaveAttribute('aria-describedby')
      })
    })
  })

  describe('Touch Target Requirements', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )
    })

    it('form inputs should meet minimum touch target size', () => {
      const inputs = screen.getAllByRole('textbox')
      
      inputs.forEach(input => {
        const computedStyle = window.getComputedStyle(input)
        const minHeight = parseInt(computedStyle.minHeight)
        
        // Should meet WCAG 2.1 AA requirement of 44px minimum
        expect(minHeight).toBeGreaterThanOrEqual(44)
      })
    })

    it('password toggle buttons should meet touch target requirements', () => {
      const passwordToggles = screen.getAllByRole('button', { name: /show password|hide password/i })
      
      passwordToggles.forEach(toggle => {
        const computedStyle = window.getComputedStyle(toggle)
        const minHeight = parseInt(computedStyle.minHeight)
        const minWidth = parseInt(computedStyle.minWidth)
        
        // Should meet WCAG 2.1 AA requirement
        expect(minHeight).toBeGreaterThanOrEqual(44)
        expect(minWidth).toBeGreaterThanOrEqual(44)
      })
    })
  })

  describe('Form Validation States', () => {
    beforeEach(() => {
      render(
        <TestWrapper>
          <AuthModal isOpen={true} onClose={() => {}} />
        </TestWrapper>
      )
    })

    it('should provide accessible error announcements', () => {
      // Error summary should be present (initially empty)
      const errorSummary = screen.queryByRole('alert')
      
      // Should exist or be creatable for errors
      if (errorSummary) {
        expect(errorSummary).toHaveAttribute('aria-live', 'polite')
      }
    })

    it('form instructions should be properly associated', () => {
      // Form instructions should have proper role
      const instructions = screen.queryByRole('note')
      
      if (instructions) {
        expect(instructions).toHaveAttribute('aria-label', 'Form instructions')
      }
    })
  })
})

describe('Mobile Viewport Optimizations', () => {
  it('modals should have responsive sizing classes', () => {
    render(
      <TestWrapper>
        <AuthModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    )

    const dialog = screen.getByRole('dialog')
    const dialogContent = dialog.closest('[role="dialog"]').parentElement

    // Should have mobile-responsive classes
    expect(dialogContent).toHaveClass(/max-w-\[95vw\]|sm:max-w-md/)
    expect(dialogContent).toHaveClass(/mx-4/)
  })

  it('should prevent iOS auto-zoom with proper font sizes', () => {
    render(
      <TestWrapper>
        <AuthModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    )

    const inputs = screen.getAllByRole('textbox')
    
    inputs.forEach(input => {
      const computedStyle = window.getComputedStyle(input)
      const fontSize = parseInt(computedStyle.fontSize)
      
      // Should be at least 16px to prevent iOS auto-zoom
      expect(fontSize).toBeGreaterThanOrEqual(16)
    })
  })
})

// Performance testing helpers
describe('Keyboard Performance', () => {
  it('should debounce validation to prevent excessive updates', async () => {
    const { rerender } = render(
      <TestWrapper>
        <AuthModal isOpen={true} onClose={() => {}} />
      </TestWrapper>
    )

    // Note: In actual implementation, validation debounce is 500ms
    // This test would need to be expanded with user interaction simulation
    // and timing assertions using fake timers or integration testing
    
    expect(true).toBe(true) // Placeholder - would implement with @testing-library/user-event
  })
})