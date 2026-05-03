# React Query Hooks Documentation

این پروژه از **@tanstack/react-query** برای مدیریت state و caching داده‌های سرور استفاده می‌کند.

## مزایای استفاده از React Query

✅ **Automatic Caching** - داده‌ها به صورت خودکار cache می‌شوند
✅ **Background Refetching** - به‌روزرسانی هوشمند داده‌ها در پس‌زمینه
✅ **Optimistic Updates** - به‌روزرسانی فوری UI قبل از دریافت پاسخ سرور
✅ **Request Deduplication** - جلوگیری از درخواست‌های تکراری
✅ **Pagination Support** - پشتیبانی کامل از pagination
✅ **Better UX** - تجربه کاربری بهتر با loading و error states

---

## ساختار Hooks

### 📁 Structure

```
lib/hooks/
├── useUser.ts        # User-related queries & mutations
├── useCourses.ts     # Course queries
├── useCheckout.ts    # Order & checkout mutations
└── index.ts          # Re-exports
```

---

## 🔧 Configuration

Provider در `lib/providers/ReactQueryProvider.tsx` تنظیم شده است:

```tsx
defaultOptions: {
  queries: {
    staleTime: 5 * 60 * 1000,      // 5 دقیقه fresh
    gcTime: 10 * 60 * 1000,         // 10 دقیقه در cache
    retry: 1,                       // یک بار retry
    refetchOnWindowFocus: false,   // عدم refetch در focus
  }
}
```

---

## 📚 Available Hooks

### 1️⃣ User Hooks (`useUser.ts`)

#### **Queries** (برای دریافت داده)

```tsx
import { useCurrentUser } from '@/lib/hooks/useUser';

function ProfileComponent() {
  const { data, isLoading, error } = useCurrentUser();
  const user = data?.data;

  if (isLoading) return <Spinner />;
  if (error) return <Error />;

  return <div>{user.firstName}</div>;
}
```

**Available Queries:**
- `useCurrentUser()` - دریافت اطلاعات کاربر فعلی
- `useEnrolledCourses(page, limit)` - دریافت دوره‌های ثبت‌نام شده
- `useUserTransactions(page, limit, type?, status?)` - دریافت تراکنش‌ها
- `useUserOrders(page, limit, status?)` - دریافت سفارشات

#### **Mutations** (برای تغییر داده)

```tsx
import { useUpdatePersonalInfo } from '@/lib/hooks/useUser';

function EditProfileForm() {
  const updateMutation = useUpdatePersonalInfo();

  const handleSubmit = (formData) => {
    updateMutation.mutate(formData);
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={updateMutation.isPending}
    >
      {updateMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
    </button>
  );
}
```

**Available Mutations:**
- `useUpdateEnrollmentProgress()` - به‌روزرسانی پیشرفت دوره
- `useUpdatePersonalInfo()` - به‌روزرسانی اطلاعات شخصی (با optimistic update)
- `useUpdateAvatar()` - به‌روزرسانی آواتار
- `useUpdatePayInfo()` - به‌روزرسانی اطلاعات پرداخت

---

### 2️⃣ Course Hooks (`useCourses.ts`)

```tsx
import { useCourses, useCourse } from '@/lib/hooks/useCourses';

function CoursesPage() {
  const { data: courses = [], isLoading } = useCourses();

  return (
    <div>
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

**Available Queries:**
- `useCourses()` - دریافت تمام دوره‌ها (با caching 10 دقیقه‌ای)
- `useCourse(courseId)` - دریافت یک دوره خاص

---

### 3️⃣ Checkout Hooks (`useCheckout.ts`)

```tsx
import { useCreateCheckout, useOrder } from '@/lib/hooks/useCheckout';

function CheckoutButton() {
  const createCheckout = useCreateCheckout();

  const handleCheckout = () => {
    createCheckout.mutate({
      userId: 'user-123',
      items: [{ courseId: 'course-456' }]
    });
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={createCheckout.isPending}
    >
      پرداخت
    </button>
  );
}

function OrderDetailsPage({ orderId }) {
  const { data, isLoading } = useOrder(orderId);
  const order = data?.order;

  return <OrderDetails order={order} />;
}
```

**Available Hooks:**
- `useOrder(orderId)` - دریافت جزئیات سفارش
- `useCreateCheckout()` - ایجاد session چک‌اوت

---

## 🎯 Best Practices

### 1. استفاده از Query Keys

Query keys برای مدیریت cache استفاده می‌شوند:

```tsx
// ❌ Bad
useQuery({ queryKey: ['user'] })

// ✅ Good - استفاده از factory function
useQuery({ queryKey: userKeys.me() })
```

### 2. Pagination با placeholderData

```tsx
const { data, isLoading } = useEnrolledCourses(page, limit);

// با placeholderData، داده قبلی موقع تغییر صفحه نمایش داده می‌شود
// و loading state را نمی‌بینیم
```

### 3. Optimistic Updates

```tsx
// در useUpdatePersonalInfo پیاده‌سازی شده
// UI فوراً به‌روز می‌شود و اگر خطایی رخ دهد، rollback می‌شود
```

### 4. Error Handling

```tsx
const { data, error, isError } = useCurrentUser();

if (isError) {
  console.error(error);
  toast.error('خطا در دریافت اطلاعات');
}
```

### 5. Dependent Queries

```tsx
const { data: user } = useCurrentUser();
const { data: orders } = useUserOrders(1, 10, {
  enabled: !!user, // فقط وقتی user موجود باشد، اجرا شود
});
```

---

## 🔄 Cache Invalidation

هنگام mutation، cache به صورت خودکار invalidate می‌شود:

```tsx
// مثال: بعد از به‌روزرسانی پروفایل
queryClient.invalidateQueries({ queryKey: userKeys.me() });

// مثال: بعد از ایجاد سفارش
queryClient.invalidateQueries({ queryKey: userKeys.all });
queryClient.invalidateQueries({ queryKey: orderKeys.all });
```

---

## 🐛 Debugging

در محیط development، **React Query DevTools** فعال است:

- در گوشه پایین صفحه آیکون React Query را خواهید دید
- می‌توانید تمام queries، mutations و cache را ببینید
- برای دیدن جزئیات هر query کلیک کنید

---

## 📊 Caching Strategy

| Resource | Stale Time | GC Time | Refetch on Focus | Rationale |
|----------|-----------|---------|-----------------|-----------|
| User Info | 5 min | 10 min | ❌ | کمتر تغییر می‌کند |
| Enrolled Courses | 3 min | 10 min | ❌ | نسبتاً static |
| Transactions | 2 min | 10 min | ❌ | به‌روزرسانی کم |
| Orders | 2 min | 10 min | ❌ | به‌روزرسانی کم |
| Courses List | 10 min | 30 min | ❌ | خیلی کم تغییر می‌کند |
| Order Details | 1 min | 10 min | ❌ | برای صفحه نتیجه |

---

## 🚀 Performance Tips

1. **Use placeholderData for pagination** - برای UX بهتر
2. **Set appropriate staleTime** - برای کاهش network requests
3. **Use enabled option** - برای conditional fetching
4. **Prefetch data** - برای صفحات بعدی pagination

```tsx
// Prefetch example
const queryClient = useQueryClient();

const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: userKeys.orders(page + 1, limit),
    queryFn: () => getUserOrders(page + 1, limit)
  });
};
```

---

## 📝 Migration Notes

### Before (با axios/fetch مستقیم)

```tsx
// ❌ Old way
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/user/me');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### After (با React Query)

```tsx
// ✅ New way
const { data, isLoading } = useCurrentUser();
const user = data?.data;
```

**مزایا:**
- ✅ کد کمتر (از 20 خط به 2 خط!)
- ✅ Automatic caching
- ✅ Background refetching
- ✅ No manual loading states
- ✅ Error handling built-in
- ✅ Request deduplication

---

## 🎓 Learn More

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
