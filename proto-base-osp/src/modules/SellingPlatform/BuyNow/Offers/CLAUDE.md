# React Query Mutations in Offers Module

This document explains the mutation patterns used for offer submission APIs.

## Overview

The offer submit functions were converted from plain async functions to React Query `useMutation` hooks. This provides automatic cache invalidation, consistent loading/error states, and better integration with React Query's data fetching patterns.

## Query Keys

Query keys are centralized in `offerQueryKeys` for consistent cache management:

```typescript
export const offerQueryKeys = {
  all: ['offers'] as const,
  list: (onlyAssigned: boolean) => [...offerQueryKeys.all, 'list', onlyAssigned] as const,
}
```

## Mutation Hooks

### Pattern

Each mutation hook follows this structure:

```typescript
const useSubmitOrder = () =>
  useMutation<ResponseType, Error, RequestType>({
    mutationFn: (payload) => api.post<ResponseType>(endpoint, payload as any),
    onSuccess: invalidateOffersList,
  })
```

### Available Mutations

| Hook | Purpose |
|------|---------|
| `submitOrder()` | Submit standard offer orders |
| `submitIndexOfferOrder()` | Submit index offer orders |
| `updateIndexOfferOrder()` | Update existing index offer orders |

### Cache Invalidation

All mutations automatically invalidate the offers list on success via `invalidateOffersList()`. This ensures the UI reflects the latest data after any order submission.

## Usage

### Step 1: Get the Mutation Hook

Call the hook function to get the mutation instance:

```typescript
const { submitOrder, submitIndexOfferOrder, updateIndexOfferOrder } = useOffers()

// Create the mutation instance
const submitOrderMutation = submitOrder()
const submitIndexOfferMutation = submitIndexOfferOrder()
const updateIndexOfferMutation = updateIndexOfferOrder()
```

### Step 2: Execute the Mutation

Use `mutateAsync` for promise-based handling with existing `.then()` chains:

```typescript
submitOrderMutation.mutateAsync(payload)
  .then((response) => {
    if (!response?.Validations?.length) {
      // Handle success
    }
  })
  .catch((error) => {
    // Handle error
  })
```

Or use `mutate` with callbacks:

```typescript
submitOrderMutation.mutate(payload, {
  onSuccess: (response) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
})
```

### Step 3: Access Mutation State (Optional)

The mutation instance provides loading and error states:

```typescript
const submitOrderMutation = submitOrder()

// In your component/handler
if (submitOrderMutation.isPending) {
  // Show loading indicator
}

if (submitOrderMutation.isError) {
  // Show error message
}
```

## Migration Guide

### Before (Plain Async Functions)

```typescript
// In useOffers.ts
const submitOrder = async (order: SubmitOrderRequest): Promise<SubmitOrderResponse> => {
  return api.post<SubmitOrderResponse>(endpoint, order as any)
}

// In component
const { submitOrder } = useOffers()
submitOrder(payload).then(handleResponse)
```

### After (Mutation Hooks)

```typescript
// In useOffers.ts
const useSubmitOrder = () =>
  useMutation<SubmitOrderResponse, Error, SubmitOrderRequest>({
    mutationFn: (order) => api.post<SubmitOrderResponse>(endpoint, order as any),
    onSuccess: invalidateOffersList,
  })

// In component
const { submitOrder } = useOffers()
const submitOrderMutation = submitOrder()
submitOrderMutation.mutateAsync(payload).then(handleResponse)
```

## Benefits

1. **Automatic Cache Invalidation**: Offers list refreshes after successful submissions
2. **Consistent State Management**: Loading, error, and success states are handled by React Query
3. **Retry Logic**: Built-in retry capabilities if needed
4. **DevTools Integration**: Mutations visible in React Query DevTools
5. **Optimistic Updates**: Can be added later without changing the API surface
