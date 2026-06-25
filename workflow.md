# Mobile Banking App Development Workflow

This reference outlines the complete workflow for building a mobile banking app with tap-to-pay functionality.

## Phase 1: Database & Backend Setup

### 1.1 Create Database Schema
- Define `bankAccounts` table with user_id, account_holder_name, bank_name, account_number, routing_number
- Define `transactions` table with user_id, bank_account_id, amount, description, timestamp
- Ensure all tables have userId for proper user isolation
- Use `drizzle-kit generate` to create migrations
- Apply migrations with `webdev_execute_sql`

**Key files:**
- `templates/bankAccounts-schema.ts` - Copy this schema template to `drizzle/schema.ts`

### 1.2 Implement Database Helpers
- Create query helpers for CRUD operations on bank accounts
- Create query helpers for transaction management
- All queries must filter by userId for security
- Use Drizzle ORM for type safety

**Key files:**
- `templates/db-helpers.ts` - Copy these helpers to `server/db.ts`

### 1.3 Create tRPC Procedures
- Implement protected procedures for bank account management (add, list, delete)
- Implement protected procedures for transaction management (create, list)
- Use Zod for input validation
- Always verify user ownership before operations

**Key files:**
- `templates/trpc-procedures.ts` - Copy these routers to `server/routers.ts`

## Phase 2: Frontend - Core Pages

### 2.1 Dashboard/Home Page
- Display account overview (count, total spent, recent transactions)
- Show quick action buttons (Add Account, Tap to Pay)
- Use cards for visual hierarchy
- Implement loading states with skeletons

### 2.2 Add Bank Account Page
- Create form with fields: account holder name, bank name, account number, routing number
- Implement form validation with Zod
- Show security messaging
- Display success toast on submission
- Navigate back to accounts list after success

### 2.3 Saved Accounts Page
- List all user's bank accounts
- Always mask account numbers (show last 4 digits only)
- Implement account selection (click to use for tap-to-pay)
- Add delete functionality with confirmation dialog
- Show empty state when no accounts exist

### 2.4 Tap to Pay Page
- Create animated NFC/contactless payment interface
- Implement account selection dropdown
- Add amount and merchant description inputs
- Create "Tap to Pay" button with animation feedback
- Display payment confirmation modal after success
- Allow users to view transaction or make another payment

### 2.5 Transaction History Page
- Display chronologically sorted transactions (newest first)
- Show amount, date, merchant, and masked account number
- Use icons for visual clarity (e.g., arrow icon for payments)
- Show empty state when no transactions exist

## Phase 3: Navigation & Layout

### 3.1 Bottom Navigation Bar
- Create 5-tab navigation: Home, Add, Pay, Accounts, History
- Use icons from lucide-react
- Highlight active tab with blue color and top border
- Ensure 48px+ minimum touch targets
- Add aria-labels for accessibility

### 3.2 Routing Setup
- Configure wouter routes for all pages
- Implement back button navigation
- Handle authentication state (show login screen if not authenticated)
- Add loading state during auth check

## Phase 4: Design & Polish

### 4.1 Color Palette & Typography
- Use blue gradients for primary actions (blue-600 to blue-700)
- Use slate neutrals for backgrounds and text (slate-50 to slate-900)
- Apply premium typography with tracking-tight on headings
- Set system font stack in index.css

### 4.2 Component Styling
- Use Tailwind CSS with shadcn/ui components
- Implement consistent spacing (4px grid)
- Use shadow-md for cards, shadow-lg for hover states
- Add smooth transitions (200-300ms) on interactive elements

### 4.3 Accessibility
- Ensure all touch targets are at least 48px (min-h-12 min-w-12)
- Add aria-labels to all icon buttons
- Use semantic HTML (buttons, links, forms)
- Implement keyboard navigation support
- Test with screen readers

### 4.4 Mobile Optimization
- Design mobile-first with responsive breakpoints
- Optimize for Android screen sizes (375px+)
- Use full-width layouts with padding
- Implement bottom navigation to avoid top nav overlap
- Test on various device sizes

## Phase 5: Security Best Practices

### 5.1 Account Number Masking
- Always mask account numbers in UI (show last 4 digits only)
- Use `maskAccountNumber()` utility function
- Never store unmasked account numbers in state
- Display masked numbers in transaction history

**Key files:**
- `templates/maskAccount.ts` - Copy this utility to `client/src/lib/maskAccount.ts`

### 5.2 User Data Isolation
- All queries filter by userId
- Verify user ownership before delete operations
- Use protectedProcedure for all sensitive operations
- Never expose other users' data in responses

### 5.3 Form Validation
- Validate all inputs with Zod schemas
- Show clear error messages to users
- Validate account number format (minimum length)
- Validate routing number format (exactly 9 digits)

## Implementation Checklist

- [ ] Database schema created and migrated
- [ ] Database helpers implemented
- [ ] tRPC procedures created
- [ ] Dashboard page built
- [ ] Add Account page built
- [ ] Accounts list page built
- [ ] Tap to Pay page built
- [ ] Transaction History page built
- [ ] Bottom navigation implemented
- [ ] Routing configured
- [ ] Color palette and typography set
- [ ] Accessibility improvements applied
- [ ] Mobile optimization completed
- [ ] Security best practices implemented
- [ ] TypeScript checks pass
- [ ] Checkpoint created
