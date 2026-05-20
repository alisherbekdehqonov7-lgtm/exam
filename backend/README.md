# 🍃 BookHaven API

Online bookstore backend — **NestJS + JSON file database**.

## 📦 O'rnatish

```bash
npm install
```

## 🚀 Ishga tushirish

```bash
# Development (auto-reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server `http://localhost:3001/api` da ishlaydi.

## ⚙️ Environment

`.env` fayl yarating:

```env
PORT=3001
JWT_SECRET=your_super_secret_key_here
```

## 📁 Loyiha tuzilishi

```
src/
├── database/              # JSON fayllar + database service
│   ├── users.json
│   ├── books.json
│   ├── authors.json
│   ├── favorites.json
│   ├── reviews.json
│   ├── cart.json
│   ├── notifications.json
│   ├── database.service.ts
│   └── database.module.ts
├── common/
│   ├── interfaces/        # TypeScript types
│   ├── guards/            # JWT + Admin guards
│   ├── decorators/        # @CurrentUser()
│   └── utils/             # Helpers (paginate, generateId)
├── modules/
│   ├── auth/              # Register, Login
│   ├── users/             # Profile management
│   ├── books/             # Books CRUD
│   ├── authors/           # Authors CRUD
│   ├── favorites/         # Favorites toggle
│   ├── reviews/           # Reviews + rating
│   ├── cart/              # Cart + Checkout
│   ├── search/            # Unified search
│   └── notifications/     # Notifications
├── app.module.ts
└── main.ts
```

## 🔐 Authentication

Login qilingandan keyin token oling va keyingi so'rovlarda yuboring:

```http
Authorization: Bearer <your_jwt_token>
```

## 📋 API Endpoints

Barcha endpoint'lar `/api` prefiksi bilan boshlanadi.

### 🔑 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Ro'yxatdan o'tish |
| POST | `/auth/login` | — | Tizimga kirish |
| GET | `/auth/profile` | 🔒 | Joriy foydalanuvchi |

**Register example:**
```json
POST /api/auth/register
{
  "fullName": "Zayniddin",
  "email": "test@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

### 👤 Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | 🔒 | Profile + statistika |
| PUT | `/users/profile` | 🔒 | Profile yangilash |
| PATCH | `/users/change-password` | 🔒 | Parolni o'zgartirish |
| GET | `/users` | 🔒 admin | Hammasi |

### 📚 Books

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/books` | — | Barcha kitoblar (filter/sort/pagination) |
| GET | `/books/featured` | — | Tanlangan kitoblar |
| GET | `/books/new-arrivals` | — | Yangi qo'shilganlar |
| GET | `/books/genres` | — | Barcha janrlar |
| GET | `/books/:id` | — | Bitta kitob (related bilan) |
| POST | `/books` | 🔒 admin | Kitob qo'shish |
| PUT | `/books/:id` | 🔒 admin | Kitobni yangilash |
| DELETE | `/books/:id` | 🔒 admin | O'chirish |

**Filter parametrlari:**
```
GET /api/books?page=1&limit=12&genre=Fiction&minPrice=5&maxPrice=50&minRating=4&language=English&sort=newest&search=midnight
```

`sort` qiymatlari: `newest`, `oldest`, `price_asc`, `price_desc`, `rating`, `popularity`

### ✍️ Authors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/authors` | — | Barcha mualliflar |
| GET | `/authors/popular` | — | Mashhurlar |
| GET | `/authors/:id` | — | Muallif + kitoblari |
| POST | `/authors` | 🔒 admin | Muallif qo'shish |
| PUT | `/authors/:id` | 🔒 admin | Yangilash |
| DELETE | `/authors/:id` | 🔒 admin | O'chirish |
| POST | `/authors/:id/follow` | 🔒 | Follow qilish |

### ❤️ Favorites

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/favorites` | 🔒 | Sevimli kitoblar |
| POST | `/favorites/:bookId` | 🔒 | Toggle (qo'shish/olib tashlash) |
| GET | `/favorites/check/:bookId` | 🔒 | Tekshirish |
| DELETE | `/favorites/:bookId` | 🔒 | O'chirish |

### ⭐ Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/book/:bookId` | — | Kitob sharhlari + statistika |
| GET | `/reviews/my` | 🔒 | Mening sharhlarim |
| POST | `/reviews/book/:bookId` | 🔒 | Sharh yozish |
| DELETE | `/reviews/:id` | 🔒 | O'chirish |

**Review yozish:**
```json
POST /api/reviews/book/book_001
{
  "rating": 5,
  "text": "Ajoyib kitob!"
}
```

### 🛒 Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | 🔒 | Savat + total |
| POST | `/cart/:bookId` | 🔒 | Qo'shish |
| PUT | `/cart/:bookId` | 🔒 | Quantity yangilash |
| DELETE | `/cart/:bookId` | 🔒 | Item o'chirish |
| DELETE | `/cart` | 🔒 | Savat tozalash |
| POST | `/cart/checkout` | 🔒 | Buyurtma berish |

### 🔍 Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=...&type=all` | Books va authors bo'yicha qidiruv |

`type` qiymatlari: `all`, `books`, `authors`

### 🔔 Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | 🔒 | Barcha xabarlar |
| PATCH | `/notifications/:id/read` | 🔒 | Read deb belgilash |
| PATCH | `/notifications/read-all` | 🔒 | Hammasini read |
| DELETE | `/notifications/:id` | 🔒 | O'chirish |

## 🧪 Test Foydalanuvchilari

`users.json` ichida 3 ta default user bor, lekin **parollar bcrypt placeholder**. Yangi user yaratish uchun `/auth/register` ishlating yoki seed parollarini haqiqiy hash bilan almashtiring.

Yangi user yarating:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## 🌐 CORS

Frontend ulash uchun `main.ts` ichida CORS sozlangan:
- `http://localhost:3000` (Next.js)
- `http://localhost:5173` (Vite/React)
- `http://localhost:4200` (Angular)

Boshqa origin qo'shish uchun `main.ts` faylini tahrirlang.

## 📝 Eslatma

- **JSON file database** — production uchun emas. Real loyihada PostgreSQL/MongoDB ga o'tkazish kerak.
- **Database fayllar** har safar yozilganda butunligicha qayta yoziladi (atomic emas). Concurrent yozish muammoli bo'lishi mumkin.
- **JWT secret** — `.env` faylda saqlang, productionda hech qachon hardcode qilmang.
- **File upload** (cover image, avatar) hozircha minimal — `multer` qo'shilgan, lekin upload endpoint'lari kengaytirilishi kerak.

## 🔧 Keyingi qadamlar

- [ ] Multer bilan file upload (cover, avatar)
- [ ] Real PostgreSQL/MongoDB ga o'tkazish (Prisma/TypeORM)
- [ ] Email notifications (nodemailer)
- [ ] Stripe checkout integration
- [ ] Order history module
- [ ] Admin dashboard endpoints
- [ ] Refresh token mechanism

---

🍃 Made with NestJS for BookHaven
