# Mobile Keyboard Testing Plan - Task 3.7

## 🎯 Mobile Form Keyboard Optimization Testing

### **Testing Overview**
Comprehensive testing plan to validate form interactions across different mobile keyboards, input types, and device configurations.

---

## 📱 **Keyboard Type Optimizations Implemented**

### **1. Input Mode Mappings**
```typescript
// Auto-detected inputMode based on input type
const getOptimalInputMode = (): string | undefined => {
  if (inputMode) return inputMode;
  
  switch (type) {
    case 'email': return 'email';      // Shows @ symbol, .com button
    case 'tel': return 'tel';          // Numeric keypad with +*# 
    case 'url': return 'url';          // Shows .com, /, : buttons
    case 'number': return 'numeric';   // Numeric keypad only
    case 'search': return 'search';    // Shows search/go button
    default: return 'text';           // Standard QWERTY
  }
};
```

### **2. Enter Key Hints**
```typescript
// Context-aware enter key hints
const getOptimalEnterKeyHint = (): string | undefined => {
  if (enterKeyHint) return enterKeyHint;
  
  if (type === 'search') return 'search';        // "Search" button
  if (type === 'email' || type === 'password') return 'next';  // "Next" button
  return 'done';  // "Done" button for final fields
};
```

---

## 🧪 **Testing Matrix**

### **Device Categories**
| Device Type | Screen Size | Keyboard Type | Priority |
|-------------|-------------|---------------|----------|
| **iPhone SE** | 375×667px | iOS Native | 🔴 Critical |
| **iPhone 12/13** | 390×844px | iOS Native | 🔴 Critical |
| **iPhone 14 Pro Max** | 430×932px | iOS Native | 🟡 Important |
| **Samsung Galaxy S21** | 360×800px | Samsung Keyboard | 🔴 Critical |
| **Google Pixel 6** | 393×851px | Gboard | 🟡 Important |
| **iPad (Portrait)** | 768×1024px | iOS Large | 🟡 Important |
| **iPad (Landscape)** | 1024×768px | iOS Split | 🟠 Nice-to-have |

### **Keyboard Variants**
| Keyboard App | Market Share | Test Priority | Special Features |
|--------------|--------------|---------------|------------------|
| **iOS Native** | 100% iOS | 🔴 Critical | Predictive text, auto-correction |
| **Gboard** | 65% Android | 🔴 Critical | Voice input, gesture typing |
| **Samsung Keyboard** | 20% Android | 🟡 Important | Multi-language, themes |
| **SwiftKey** | 10% Mobile | 🟠 Nice-to-have | AI predictions, clipboard |

---

## 🔍 **Form Input Testing Scenarios**

### **1. Authentication Modal Tests**
#### **Email Field (`inputMode="email"`)**
- ✅ **iOS Native**: Should show @, .com shortcuts
- ✅ **Gboard**: Should display @ symbol prominently  
- ✅ **Samsung**: Should suggest email domains
- ✅ **Enter Key**: Should show "Next" (enterKeyHint="next")

#### **Password Field (`type="password"`)**
- ✅ **iOS Native**: Should disable predictive text
- ✅ **Gboard**: Should disable suggestions/history
- ✅ **Samsung**: Should show/hide toggle working
- ✅ **Enter Key**: Should show "Done" for single password, "Next" for signup

#### **Full Name Field (`inputMode="text"`)**
- ✅ **iOS Native**: Should enable auto-capitalization
- ✅ **Gboard**: Should provide name suggestions
- ✅ **Samsung**: Should capitalize first letters
- ✅ **Enter Key**: Should show "Next" (enterKeyHint="next")

### **2. Organization Modal Tests**
#### **Organization Name (`autoComplete="organization"`)**
- ✅ **iOS Native**: Should suggest from contacts/saved orgs
- ✅ **Gboard**: Should enable organization autofill
- ✅ **Samsung**: Should capitalize appropriately
- ✅ **Enter Key**: Should show "Next"

#### **Phone Number (`inputMode="tel"`)**
- ✅ **iOS Native**: Should show numeric keypad with +*#
- ✅ **Gboard**: Should format numbers automatically
- ✅ **Samsung**: Should detect country codes
- ✅ **Enter Key**: Should show "Done" (final field)

#### **Email Field (`inputMode="email"`)**
- ✅ **Cross-keyboard**: Consistent @ and .com access
- ✅ **Auto-complete**: Should suggest business emails
- ✅ **Enter Key**: Should show "Next"

### **3. Business Modal Tests**
#### **Business Name (`inputMode="text"`)**
- ✅ **iOS Native**: Should auto-capitalize words
- ✅ **Gboard**: Should suggest business-related terms
- ✅ **Samsung**: Should provide word suggestions
- ✅ **Enter Key**: Should show "Next"

#### **Business Type Selector**
- ✅ **Accessibility**: Should announce selection changes
- ✅ **Touch**: 48px minimum touch targets
- ✅ **Navigation**: Should work with keyboard navigation

---

## ⚙️ **Technical Testing Criteria**

### **1. Keyboard Appearance**
```typescript
// Test: Correct keyboard appears for input type
const testKeyboardType = (inputType: string, expectedKeyboard: string) => {
  // iOS: Check for appropriate keyboard layout
  // Android: Verify correct InputMethodService
  // Expected keyboards: text, email, tel, numeric, search, url
};
```

### **2. Enter Key Behavior**
```typescript
// Test: Enter key shows correct action
const testEnterKeyHint = (field: string, expectedHint: string) => {
  // iOS: Check returnKeyType
  // Android: Check imeActionLabel
  // Expected hints: next, done, search, send, go
};
```

### **3. Autocomplete Integration**
```typescript
// Test: Autofill suggestions appear correctly
const testAutoComplete = (field: string, autoCompleteType: string) => {
  // iOS: Check textContentType
  // Android: Check autofillHints
  // Types: email, tel, name, organization, current-password, new-password
};
```

### **4. Virtual Keyboard Impact**
```typescript
// Test: Forms remain accessible when keyboard appears
const testKeyboardOverlay = () => {
  // Modal positioning: Should not be covered by keyboard
  // Scroll behavior: Should auto-scroll to focused field
  // Submit buttons: Should remain accessible
  // iOS landscape: Should handle reduced height
};
```

---

## 🧪 **Automated Testing Framework**

### **Playwright Mobile Testing**
```typescript
// Example test for keyboard behavior
test('Email input shows email keyboard on iOS', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  const emailInput = page.getByLabel('Email');
  await emailInput.focus();
  
  // Check inputMode attribute
  await expect(emailInput).toHaveAttribute('inputMode', 'email');
  // Check enterKeyHint
  await expect(emailInput).toHaveAttribute('enterKeyHint', 'next');
  // Check autoComplete
  await expect(emailInput).toHaveAttribute('autoComplete', 'email');
});
```

### **Manual Testing Checklist**
```markdown
#### Per-Device Testing Protocol:

**Setup:**
1. Open fead.app in device browser
2. Clear browser cache/cookies
3. Test in both portrait and landscape
4. Test with third-party keyboard if available

**Authentication Modal:**
- [ ] Email field shows email keyboard (@, .com buttons)
- [ ] Email enter key shows "Next"
- [ ] Password field disables suggestions
- [ ] Password enter key shows "Done" (sign in) or "Next" (sign up)
- [ ] Full name field capitalizes appropriately
- [ ] Full name enter key shows "Next"
- [ ] Confirm password enter key shows "Done"

**Organization Modal:**
- [ ] Organization name enables text predictions
- [ ] Phone field shows numeric keypad
- [ ] Phone field formats numbers correctly
- [ ] Email field consistent with auth modal
- [ ] Country selector is keyboard navigable

**Business Modal:**
- [ ] Business name field capitalizes words
- [ ] Business type selector accessible via keyboard
- [ ] Submit button accessible when keyboard open

**Cross-Modal Tests:**
- [ ] Tab navigation works correctly
- [ ] Forms don't scroll behind keyboard
- [ ] Submit buttons remain accessible
- [ ] Error messages visible above keyboard
- [ ] Auto-focus works correctly after modal open
```

---

## 📊 **Performance Metrics**

### **Keyboard Appearance Speed**
- **Target**: <100ms from field focus to keyboard appearance
- **iOS**: Typically 50-80ms
- **Android**: Varies by keyboard app (50-150ms)

### **Input Responsiveness**
- **Target**: <16ms per keystroke for 60fps
- **Measurement**: Use React DevTools Profiler
- **Real-time validation**: Debounced to 500ms

### **Form Submission**
- **Target**: Submit button accessible within 250ms after keyboard appearance
- **Auto-scroll**: Should complete within 300ms
- **Error display**: Should appear above keyboard within 200ms

---

## ✅ **Success Criteria**

### **Keyboard Optimization**
- ✅ **Email fields**: All tested keyboards show @ and .com shortcuts
- ✅ **Phone fields**: All tested keyboards show numeric layout with symbols
- ✅ **Text fields**: All tested keyboards enable appropriate predictions/capitalization
- ✅ **Password fields**: All tested keyboards disable suggestions and history

### **User Experience**
- ✅ **Accessibility**: All form fields meet WCAG 2.1 AA guidelines
- ✅ **Touch Targets**: All interactive elements ≥44px
- ✅ **Keyboard Navigation**: Full keyboard accessibility
- ✅ **Screen Reader**: VoiceOver/TalkBack compatibility

### **Cross-Platform Consistency**
- ✅ **iOS**: Consistent behavior across Safari and in-app browsers
- ✅ **Android**: Consistent behavior across Chrome, Samsung Browser, Firefox
- ✅ **Keyboard Apps**: Graceful degradation across keyboard variants
- ✅ **Form State**: Maintains state during keyboard appearance/dismissal

---

## 🚨 **Known Issues & Workarounds**

### **iOS Safari Auto-Zoom Prevention**
```css
/* Prevents auto-zoom on input focus */
input[type="text"], input[type="email"], 
input[type="password"], select, textarea {
  font-size: 16px !important;
}
```

### **Android Chrome Keyboard Overlay**
```css
/* Handles virtual keyboard overlay */
.modal-mobile-keyboard {
  max-height: 85vh;
  overflow-y: auto;
}

@media screen and (max-height: 500px) {
  .modal-mobile-keyboard {
    position: fixed;
    top: 5vh;
    transform: translate(-50%, 0);
  }
}
```

### **Samsung Internet Edge Cases**
- Double-tap zoom disabled via `touch-action: manipulation`
- Custom form validation styled for Samsung's dark theme
- Predictive text conflicts resolved via appropriate `autoComplete` values

---

## 🎯 **Testing Schedule**

### **Phase 1: Core Functionality (Week 1)**
- iPhone SE + iOS Native keyboard
- Samsung Galaxy S21 + Samsung keyboard  
- Basic form submission flows

### **Phase 2: Extended Coverage (Week 2)**
- Additional device sizes
- Third-party keyboards (Gboard, SwiftKey)
- Edge cases and error scenarios

### **Phase 3: Accessibility & Performance (Week 3)**  
- Screen reader testing
- Performance profiling
- Cross-browser compatibility

### **Phase 4: User Acceptance (Week 4)**
- Beta user feedback
- Analytics implementation
- Final optimizations

---

## ✅ **Task 3.7 Status: IN PROGRESS**

**Next Actions:**
1. Execute manual testing across device matrix
2. Document keyboard behavior variations  
3. Create automated Playwright tests
4. Performance profiling with React DevTools
5. Accessibility testing with VoiceOver/TalkBack

**Ready to proceed to Task 3.8: Verify form submission and validation works on touch devices** 🚀