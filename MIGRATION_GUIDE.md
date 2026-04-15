# 🎯 Service Layer Architecture - Migration Guide

## ✅ What's Set Up

Your app now follows this architecture:

```
Components → Stores → Services → Mock Data (NOW) / API (LATER)
```

## 📁 Files Created

1. **`src/services/restaurant.service.js`** - Service layer for restaurant/meal data
2. **`src/hooks/useRestaurantInit.js`** - Hook to initialize data on app load
3. **`src/store/restaurantStore.js`** - Updated with `fetchRestaurants()` and `fetchMeals()` actions

## 🚀 When Backend is Ready - Migration Steps

### **Step 1: Update Service Layer ONLY**

Open `src/services/restaurant.service.js` and:

1. **Add axios import:**
```javascript
import api from './api';
```

2. **Replace each function's return statement:**

**BEFORE (Mock):**
```javascript
export const fetchMeals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    data: mockMeals,
  };
};
```

**AFTER (Real API):**
```javascript
export const fetchMeals = async () => {
  return await api.get('/meals');
};
```

3. **Remove mock imports:**
```javascript
// DELETE THIS LINE:
import { mockRestaurants, mockMeals } from "../mocks/meals";
```

### **Step 2: That's It! 🎉**

**NO changes needed in:**
- ❌ Components
- ❌ Stores  
- ❌ Hooks
- ❌ App.jsx

Everything will automatically use the real API!

## 📋 API Endpoints Needed

| Function | Method | Endpoint | Response |
|----------|--------|----------|----------|
| `fetchRestaurants()` | GET | `/restaurants` | Array of restaurants with meals |
| `fetchMeals()` | GET | `/meals` | Array of all meals |
| `fetchMealsByCategory(category)` | GET | `/meals?category={category}` | Filtered meals |
| `fetchMealById(id)` | GET | `/meals/{id}` | Single meal object |
| `fetchRestaurantById(id)` | GET | `/restaurants/{id}` | Single restaurant with meals |

## 🔧 How to Use in Components

When you create components that need meal data:

```javascript
import { useRestaurantStore } from "../store";

function MyComponent() {
  const { meals, loading, error } = useRestaurantStore();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {meals.map(meal => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
```

## 📝 To Initialize Data

In your `App.jsx`, add:

```javascript
import { useRestaurantInit } from "./hooks/useRestaurantInit";

export default function App() {
  useAuthInit();
  useRestaurantInit(); // Add this line
  
  // ... rest of your app
}
```

## 💡 Benefits

✅ **Easy Migration** - Change service layer only when backend is ready  
✅ **Type Safety** - Can add TypeScript types to service layer  
✅ **Caching** - Can add caching logic in service layer  
✅ **Error Handling** - Centralized error handling  
✅ **Testing** - Easy to mock services for testing  

## 🎯 Next Steps

1. **Add `useRestaurantInit()` to App.jsx** when you have components that need meal data
2. **When backend is ready** - Just update `restaurant.service.js`
3. **Add more services** - Follow the same pattern for orders, users, etc.
