# 🎨 Personal Portfolio API

یک API کامل برای سایت شخصی با قابلیت مدیریت عکس‌ها و متن‌ها.

## ✨ ویژگی‌ها

- 🖼️ **مدیریت عکس‌ها**: آپلود، ویرایش، حذف و دسته‌بندی
- 📝 **مدیریت متن‌ها**: ایجاد پست‌های وبلاگ، پروژه‌ها و متن‌ها
- 🔐 **سیستم لاگین**: پنل مدیریت امن برای شما
- 📊 **دیتابیس**: MySQL با Prisma ORM
- 🔒 **امنیت**: JWT authentication و bcrypt hashing
- 🚀 **TypeScript**: کد تمیز و قابل نگهداری
- ⚡ **Bun**: عملکرد سریع و بهینه

## 🏗️ ساختار پروژه

```
src/
├── controllers/     # کنترل‌کننده‌های درخواست
├── middlewares/    # میدلورها (auth, upload)
├── routes/         # مسیرهای API
├── services/       # منطق کسب‌وکار و Prisma
├── scripts/        # اسکریپت‌های دیتابیس
└── server.ts       # فایل اصلی سرور

prisma/
└── schema.prisma   # مدل‌های دیتابیس

examples/           # فایل‌های نمونه
├── admin-panel.html    # پنل مدیریت
└── upload-example.html # نمونه آپلود
```

## 🗄️ مدل‌های دیتابیس

### Admin (مدیر)
- `id` - شناسه یکتا
- `username` - نام کاربری
- `email` - ایمیل
- `passwordHash` - رمز عبور رمزگذاری شده

### Image (عکس)
- `id` - شناسه یکتا
- `url` - مسیر فایل
- `title` - عنوان عکس
- `description` - توضیحات (اختیاری)
- `category` - دسته‌بندی (اختیاری)
- `createdAt` - تاریخ ایجاد

### Text (متن)
- `id` - شناسه یکتا
- `title` - عنوان
- `content` - محتوای متن
- `excerpt` - خلاصه (اختیاری)
- `category` - دسته‌بندی (اختیاری)
- `published` - وضعیت انتشار
- `createdAt` - تاریخ ایجاد

## 🚀 راه‌اندازی

### 1. نصب وابستگی‌ها
```bash
bun install
```

### 2. تنظیم دیتابیس
فایل `.env` را ویرایش کنید:
```env
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### 3. ایجاد دیتابیس
```bash
mysql -u root -p -e "CREATE DATABASE portfolio_db;"
```

### 4. راه‌اندازی دیتابیس
```bash
bun run db:generate
bun run db:push
bun run db:seed
```

### 5. شروع سرور
```bash
bun run dev
```

## 🌐 API Endpoints

### 🔐 Admin (مدیریت)
- `POST /api/admin/login` - ورود به سیستم
- `POST /api/admin/register` - ایجاد حساب مدیر (فقط برای اولین بار)
- `GET /api/admin/profile` - دریافت پروفایل (نیاز به احراز هویت)

### 🖼️ Images (عکس‌ها)
- `GET /api/images` - دریافت همه عکس‌ها (عمومی)
- `GET /api/images/:id` - دریافت عکس خاص (عمومی)
- `GET /api/images/category/:category` - دریافت عکس‌ها بر اساس دسته (عمومی)
- `POST /api/images` - آپلود عکس (نیاز به احراز هویت)
- `PUT /api/images/:id` - ویرایش عکس (نیاز به احراز هویت)
- `DELETE /api/images/:id` - حذف عکس (نیاز به احراز هویت)

### 📝 Texts (متن‌ها)
- `GET /api/texts/published` - دریافت متن‌های منتشر شده (عمومی)
- `GET /api/texts/:id` - دریافت متن خاص (عمومی)
- `GET /api/texts/category/:category` - دریافت متن‌ها بر اساس دسته (عمومی)
- `POST /api/texts` - ایجاد متن جدید (نیاز به احراز هویت)
- `GET /api/texts` - دریافت همه متن‌ها (نیاز به احراز هویت)
- `PUT /api/texts/:id` - ویرایش متن (نیاز به احراز هویت)
- `DELETE /api/texts/:id` - حذف متن (نیاز به احراز هویت)
- `PATCH /api/texts/:id/toggle-publish` - تغییر وضعیت انتشار (نیاز به احراز هویت)

## 🔧 اسکریپت‌های موجود

- `bun run dev` - شروع سرور توسعه
- `bun run build` - ساخت پروژه
- `bun run start` - شروع سرور تولید
- `bun run db:generate` - تولید Prisma Client
- `bun run db:push` - ارسال schema به دیتابیس
- `bun run db:seed` - پر کردن دیتابیس با داده‌های اولیه
- `bun run db:studio` - باز کردن Prisma Studio
- `bun run db:reset` - ریست کامل دیتابیس

## 👤 اطلاعات ورود پیش‌فرض

بعد از اجرای `bun run db:seed`:
- **نام کاربری**: `admin`
- **رمز عبور**: `admin123`

⚠️ **توجه**: حتماً این رمز عبور را بعد از اولین ورود تغییر دهید!

## 🧪 تست API

### 1. استفاده از پنل مدیریت
فایل `examples/admin-panel.html` را در مرورگر باز کنید.

### 2. استفاده از curl
```bash
# ورود به سیستم
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# آپلود عکس (با token)
curl -X POST http://localhost:3000/api/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@path/to/image.jpg" \
  -F "title=عنوان عکس" \
  -F "description=توضیحات" \
  -F "category=design"
```

## 🔒 امنیت

- **JWT Tokens**: احراز هویت امن
- **bcrypt**: رمزگذاری رمزهای عبور
- **CORS**: محافظت در برابر درخواست‌های غیرمجاز
- **Validation**: بررسی ورودی‌ها

## 📱 استفاده در Nuxt

```typescript
// composables/usePortfolio.ts
export const usePortfolio = () => {
  const getImages = async () => {
    return await $fetch('http://localhost:3000/api/images')
  }
  
  const getPublishedTexts = async () => {
    return await $fetch('http://localhost:3000/api/texts/published')
  }
  
  return { getImages, getPublishedTexts }
}
```

## 🎯 کاربردها

- **سایت شخصی**: نمایش پورتفولیو کاری
- **وبلاگ**: نوشتن پست‌ها و مقالات
- **گالری عکس**: نمایش کارهای هنری و طراحی
- **پروژه‌ها**: معرفی پروژه‌های انجام شده

## 🆘 پشتیبانی

- بررسی لاگ‌های سرور
- اطمینان از اتصال دیتابیس
- بررسی فایل `.env`
- اجرای مجدد `bun run db:generate`
