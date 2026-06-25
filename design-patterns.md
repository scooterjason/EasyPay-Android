# Mobile Banking App - Design Patterns & Best Practices

## UI Component Patterns

### Card Layout Pattern
Use shadcn/ui Card component with consistent styling:
```tsx
<Card className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</Card>
```

### Form Pattern
Use react-hook-form with Zod validation:
```tsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### List Item Pattern
Each list item should be clickable and show action buttons:
```tsx
<Card className="p-4 cursor-pointer" onClick={handleSelect}>
  <div className="flex items-start justify-between">
    <div>{/* Main content */}</div>
    <button onClick={(e) => { e.stopPropagation(); handleAction(); }}>
      {/* Action button */}
    </button>
  </div>
</Card>
```

## Animation Patterns

### NFC Wave Animation
Create pulsing waves for payment interface:
```tsx
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0; }
}
```

### Button Feedback
Add scale effect on click:
```tsx
className="transition-transform active:scale-95"
```

### Modal Transitions
Use opacity for smooth modal appearance:
```tsx
className={`transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
```

## Data Flow Patterns

### Account Masking
Always mask account numbers before display:
```tsx
import { maskAccountNumber } from '@/lib/maskAccount';
<p>{maskAccountNumber(account.accountNumber)}</p>
```

### Transaction Formatting
Format amounts in cents to dollars:
```tsx
const formatAmount = (cents: number) => (cents / 100).toFixed(2);
```

### Loading States
Show skeleton loaders during data fetch:
```tsx
const { data, isLoading } = trpc.query.useQuery();
if (isLoading) return <Skeleton className="h-24 rounded-lg" />;
```

## Accessibility Patterns

### Touch Target Sizing
Ensure all interactive elements are 48px minimum:
```tsx
className="min-h-12 min-w-12 flex items-center justify-center"
```

### Icon Button Labels
Always add aria-labels to icon-only buttons:
```tsx
<button aria-label="Delete account" onClick={handleDelete}>
  <Trash2 className="w-5 h-5" />
</button>
```

### Semantic Navigation
Use proper roles and aria attributes:
```tsx
<a href={path} role="tab" aria-selected={isActive}>
  {label}
</a>
```

## Security Patterns

### User Isolation
All database queries must filter by userId:
```ts
.where(eq(bankAccounts.userId, userId))
```

### Ownership Verification
Verify user owns resource before delete:
```ts
const account = await getBankAccountById(id, userId);
if (!account) throw new Error("Not found");
```

### Input Validation
Use Zod schemas for all form inputs:
```ts
const schema = z.object({
  accountNumber: z.string().min(8),
  routingNumber: z.string().regex(/^\d{9}$/),
});
```

## State Management Patterns

### Optimistic Updates
Update UI immediately, rollback on error:
```tsx
const mutation = trpc.mutation.useMutation({
  onMutate: (newData) => {
    // Update cache immediately
  },
  onError: () => {
    // Rollback cache
  },
});
```

### Invalidation Pattern
Refetch data after mutations:
```tsx
onSuccess: () => {
  utils.query.invalidate();
}
```

## Mobile-First Layout Patterns

### Safe Area Padding
Add bottom padding for fixed navigation:
```tsx
<div className="pb-20">{/* Content */}</div>
```

### Responsive Spacing
Use consistent 4px grid spacing:
```tsx
className="px-4 py-6" // 16px horizontal, 24px vertical
```

### Full-Width Buttons
Buttons should span full width on mobile:
```tsx
className="w-full h-12" // Full width, 48px height
```

## Color Palette

| Purpose | Color | Tailwind |
|---------|-------|----------|
| Primary Action | Blue | `bg-blue-600 hover:bg-blue-700` |
| Background | Light Gray | `bg-slate-50` |
| Text Primary | Dark Gray | `text-slate-900` |
| Text Secondary | Medium Gray | `text-slate-600` |
| Success | Green | `text-green-600` |
| Danger | Red | `text-red-500` |
| Accent | Blue | `text-blue-600` |

## Typography

| Element | Style | Tailwind |
|---------|-------|----------|
| Page Title | 24px Bold | `text-2xl font-bold` |
| Section Title | 18px Bold | `text-lg font-semibold` |
| Body Text | 16px Regular | `text-base` |
| Caption | 12px Regular | `text-xs` |
| Monospace | 14px | `font-mono text-sm` |
