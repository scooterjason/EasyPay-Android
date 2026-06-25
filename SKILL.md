---
name: mobile-banking-app
description: Build elegant mobile banking apps with tap-to-pay functionality. Use for creating bank account managers, payment simulators, transaction histories, and fintech applications with premium design and security best practices.
---

# Mobile Banking App Skill

This skill provides a complete workflow for building mobile banking applications with tap-to-pay payment simulation, bank account management, and transaction history. It includes reusable templates, database schemas, tRPC procedures, and design patterns optimized for Android and mobile devices.

## When to Use This Skill

Use this skill when building:
- Mobile banking apps with account management
- Tap-to-pay payment simulators
- Fintech applications with transaction history
- Apps requiring bank account storage and user data isolation
- Mobile-first applications with premium design

## Overview

The mobile banking app workflow consists of five phases:

1. **Database & Backend Setup** - Create schemas, helpers, and tRPC procedures
2. **Frontend Core Pages** - Build Dashboard, Add Account, Accounts List, Tap to Pay, and History
3. **Navigation & Layout** - Implement bottom navigation and routing
4. **Design & Polish** - Apply premium fintech styling and accessibility
5. **Security & Best Practices** - Ensure user isolation, data masking, and validation

## Quick Start

### Phase 1: Database & Backend Setup

**Step 1.1: Create Database Schema**

1. Open `drizzle/schema.ts` in your webdev project
2. Copy the schema from `templates/bankAccounts-schema.ts`
3. Run `pnpm drizzle-kit generate` to create migrations
4. Apply migrations with `webdev_execute_sql`

**Step 1.2: Implement Database Helpers**

1. Open `server/db.ts`
2. Copy the helper functions from `templates/db-helpers.ts`
3. Import the schema types at the top of the file

**Step 1.3: Create tRPC Procedures**

1. Open `server/routers.ts`
2. Copy the router definitions from `templates/trpc-procedures.ts`
3. Add the routers to your main `appRouter`

### Phase 2: Frontend Core Pages

Build these pages in order, using the patterns from `references/design-patterns.md`:

1. **Dashboard** - Overview with stats and quick actions
2. **Add Account** - Form with validation and security messaging
3. **Accounts List** - Display accounts with masked numbers and delete
4. **Tap to Pay** - Animated NFC interface with payment simulation
5. **Transaction History** - Chronologically sorted transactions

For each page:
- Use shadcn/ui components for consistency
- Implement loading states with skeletons
- Add empty states when no data exists
- Ensure all touch targets are 48px minimum

### Phase 3: Navigation & Layout

1. Create a bottom navigation bar with 5 tabs (Home, Add, Pay, Accounts, History)
2. Configure wouter routing for all pages
3. Implement authentication check (show login screen if needed)
4. Add back button navigation on detail pages

### Phase 4: Design & Polish

1. Update `client/src/index.css` with premium typography
2. Use blue gradients for primary actions
3. Apply consistent spacing and shadows
4. Add aria-labels to all icon buttons
5. Test on mobile devices (375px+ width)

### Phase 5: Security Best Practices

1. Copy `templates/maskAccount.ts` to `client/src/lib/maskAccount.ts`
2. Always use `maskAccountNumber()` when displaying account numbers
3. Verify all database queries filter by userId
4. Use Zod schemas for form validation
5. Test that users can only see their own data

## Key Files & Templates

| File | Purpose |
|------|----------|
| `templates/bankAccounts-schema.ts` | Database schema for accounts and transactions |
| `templates/db-helpers.ts` | Query helpers for database operations |
| `templates/trpc-procedures.ts` | tRPC routers for API endpoints |
| `templates/maskAccount.ts` | Account number masking utility |
| `references/workflow.md` | Detailed step-by-step workflow |
| `references/design-patterns.md` | UI patterns, colors, typography, accessibility |

## Design System

### Color Palette
- **Primary**: Blue-600 to Blue-700 (actions, highlights)
- **Background**: Slate-50 (light backgrounds)
- **Text**: Slate-900 (primary), Slate-600 (secondary)
- **Accent**: Green-600 (success), Red-500 (danger)

### Typography
- **Headings**: Bold with tight tracking
- **Body**: System font stack with antialiased rendering
- **Monospace**: For account numbers (font-mono)

### Spacing
- **Grid**: 4px base unit
- **Padding**: 16px horizontal (px-4), 24px vertical (py-6)
- **Touch targets**: Minimum 48px (min-h-12 min-w-12)

## Security Checklist

- [ ] All account numbers masked (show last 4 digits only)
- [ ] All database queries filter by userId
- [ ] User ownership verified before delete operations
- [ ] Form inputs validated with Zod schemas
- [ ] protectedProcedure used for sensitive operations
- [ ] Account number masking utility implemented
- [ ] Transaction history only shows user's own transactions
- [ ] No sensitive data exposed in error messages

## Accessibility Checklist

- [ ] All interactive elements 48px minimum
- [ ] Icon buttons have aria-labels
- [ ] Semantic HTML used (buttons, links, forms)
- [ ] Keyboard navigation supported
- [ ] Color contrast meets WCAG standards
- [ ] Loading states clearly indicated
- [ ] Form errors clearly labeled

## Mobile Optimization Checklist

- [ ] Mobile-first responsive design
- [ ] Bottom navigation for easy thumb access
- [ ] Full-width buttons and inputs
- [ ] Safe area padding for notches
- [ ] Tested on 375px+ width devices
- [ ] Touch targets large and spaced
- [ ] No horizontal scrolling

## Common Patterns

### Masking Account Numbers
```tsx
import { maskAccountNumber } from '@/lib/maskAccount';

// Always use in UI
<p className="font-mono">{maskAccountNumber(account.accountNumber)}</p>
// Output: ••••••5678
```

### Form Validation
```tsx
const schema = z.object({
  accountNumber: z.string().min(8, "Must be at least 8 digits"),
  routingNumber: z.string().regex(/^\d{9}$/, "Must be exactly 9 digits"),
});
```

### User Data Isolation
```ts
// Always filter by userId
const accounts = await db
  .select()
  .from(bankAccounts)
  .where(eq(bankAccounts.userId, userId));
```

### Loading States
```tsx
const { data, isLoading } = trpc.bankAccounts.list.useQuery();
if (isLoading) return <Skeleton className="h-24 rounded-lg" />;
```

## Troubleshooting

**Issue**: Account numbers visible in plain text
- **Solution**: Use `maskAccountNumber()` utility before displaying

**Issue**: Users seeing other users' transactions
- **Solution**: Verify all queries filter by userId from context

**Issue**: Touch targets too small on mobile
- **Solution**: Add `min-h-12 min-w-12` to all interactive elements

**Issue**: Form validation not working
- **Solution**: Ensure Zod schema is passed to `zodResolver()`

## Next Steps

After completing the core app:

1. **Real Payment Integration** - Connect to Stripe or payment processor
2. **Transaction Receipts** - Add PDF generation for transactions
3. **Biometric Auth** - Implement fingerprint/face recognition
4. **Analytics** - Track user behavior and payment patterns
5. **Push Notifications** - Alert users of transactions

## References

- **Workflow**: See `references/workflow.md` for detailed step-by-step instructions
- **Design Patterns**: See `references/design-patterns.md` for UI patterns and best practices
- **Accessibility**: WCAG 2.1 AA standards for mobile apps
- **Security**: OWASP guidelines for financial applications
