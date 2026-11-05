# SmartGoal

SmartGoal — maqsadlar, kundalik vazifalar, kun tartibi va shaxsiy rivojlanishni boshqarish uchun veb-ilova.

## Ilova sahifalari

Ilova bitta tezkor frontend asosida ishlaydi, lekin har bir bo‘limning alohida, ulashish mumkin bo‘lgan URL manzili bor:

| Bo‘lim | URL |
|---|---|
| Bosh sahifa | `/` |
| Maqsadlar | `/goals` |
| Vazifalar | `/tasks` |
| Kun tartibi | `/planner` |
| Statistika | `/statistics` |
| Yutuqlar | `/achievements` |
| Mukofotlar do‘koni | `/rewards` |
| Hamjamiyat | `/community` |
| Smart AI | `/ai` |
| Bildirishnomalar | `/notifications` |
| Sozlamalar | `/settings` |
| Profil | `/profile` |

Har bir manzilni to‘g‘ridan-to‘g‘ri ochish, yangilash va brauzerning oldinga/orqaga tugmalaridan foydalanish qo‘llab-quvvatlanadi. Cloudflare Pages SPA rejimida mavjud bo‘lmagan yo‘llar uchun bosh HTML faylini beradi; shu sabab alohida statik papkalar nusxasini yaratish shart emas.

## Tillar

Interfeys o‘zbek, rus va ingliz tillarini qo‘llaydi. Interfeys matnlari `script.js` ichidagi `UI_TRANSLATIONS` lug‘atlarida saqlanadi. Yangi UI matni qo‘shilganda uchala til uchun tarjimani ham qo‘shing. Matn tugunlaridagi ortiqcha probel va qator tashlashlar tarjima kalitini buzmasligi uchun normalizatsiya qilinadi.

Foydalanuvchi kiritgan maqsadlar, vazifalar, profil ma’lumotlari va AI suhbatlari foydalanuvchining o‘z matni bo‘lib qoladi; interfeys tarjimasi ularni avtomatik o‘zgartirmaydi.

## Asosiy fayllar

- `index.html` — ilovaning HTML qobig‘i va autentifikatsiya oynalari.
- `script.js` — frontend holati, sahifalar, tarjimalar, marshrutlash va API integratsiyasi.
- `style.css` — dizayn va responsiv uslublar.
- `functions/api/[[path]].js` — Pages orqali Worker API’ga same-origin proxy.
- `worker/index.js` — Cloudflare Worker API.
- `worker/migrations/` — D1 ma’lumotlar bazasi migratsiyalari.
- `wrangler.toml` — Worker va D1 konfiguratsiyasi.

`cloudflare/` papkasidagi eski fayllar tarixiy draft; amaldagi deploy uchun root `wrangler.toml` va `worker/index.js` ishlatiladi.

## Ishga tushirish va tekshiruv

Frontend Cloudflare Pages’da statik sayt sifatida, API esa Cloudflare Workers’da ishlaydi. Repository’dagi GitHub Actions JavaScript sintaksisini, responsiv UI shartlarini, tarjima va marshrutlash bo‘yicha muhim qoidalarni, D1 migratsiyalarini hamda XP cheklovlarini tekshiradi.

Production manzil: https://smart-goal.pages.dev

> Eslatma: muvaffaqiyatli buildning o‘zi ommaviy ishga tushirishga to‘liq tayyorlikni anglatmaydi. Real login/ro‘yxatdan o‘tish, ma’lumotlarni saqlash, AI, xavfsizlik, mobil qurilmalar va brauzerlararo sinovlar alohida bajarilishi kerak.
