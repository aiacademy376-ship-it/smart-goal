# SmartGoal

SmartGoal — maqsadlar, kundalik vazifalar, kun tartibi va shaxsiy rivojlanishni boshqarish uchun O‘zbekistonda yaratilayotgan veb-ilova.

## Ilova sahifalari

Ilovaning asosiy interfeys tili — o‘zbek tili. Har bir bo‘limning o‘zbekcha, ulashish mumkin bo‘lgan URL manzili mavjud:

| Bo‘lim | URL |
|---|---|
| Bosh sahifa | `/` |
| Maqsadlarim | `/maqsadlar` |
| Vazifalar | `/vazifalar` |
| Kun tartibi | `/kun-tartibi` |
| Statistika | `/statistika` |
| Yutuqlarim | `/yutuqlar` |
| Mukofotlar do‘koni | `/mukofotlar` |
| Hamjamiyat | `/hamjamiyat` |
| Smart AI | `/suniy-intellekt` |
| Bildirishnomalar | `/bildirishnomalar` |
| Sozlamalar | `/sozlamalar` |
| Profilim | `/profil` |

Avvalgi inglizcha manzillar ham eski havolalar buzilmasligi uchun qo‘llab-quvvatlanadi va avtomatik ravishda o‘zbekcha manzilga o‘tadi. Har bir manzilni to‘g‘ridan-to‘g‘ri ochish, yangilash va brauzerning oldinga/orqaga tugmalaridan foydalanish mumkin. Ilova bitta SPA frontend bo‘lib qoladi; alohida statik papkalar nusxasi talab qilinmaydi.

## Tillar

Ilova birinchi ochilganda o‘zbek tilida ishlaydi. Sozlamalardan rus yoki ingliz tilini tanlash mumkin. Tarjima lug‘atlari `script.js` ichidagi `UI_TRANSLATIONS` obyektida saqlanadi. Yangi interfeys matni qo‘shilganda o‘zbekcha asl matn va ruscha hamda inglizcha tarjimalar birga yangilanishi kerak.

Foydalanuvchi kiritgan maqsadlar, vazifalar va profil ma’lumotlari interfeys tarjimasidan mustaqil — ular foydalanuvchi yozgan holicha saqlanadi.

## Asosiy fayllar

- `index.html` — ilovaning HTML qobig‘i va autentifikatsiya oynalari.
- `script.js` — frontend holati, sahifalar, tarjimalar, marshrutlash va API integratsiyasi.
- `style.css` — dizayn va moslashuvchan uslublar.
- `functions/api/[[path]].js` — Pages orqali Worker API’ga same-origin proxy.
- `worker/index.js` — Cloudflare Worker API.
- `worker/migrations/` — D1 ma’lumotlar bazasi migratsiyalari.
- `wrangler.toml` — Worker va D1 konfiguratsiyasi.

Production manzil: https://smart-goal.pages.dev

> Muvaffaqiyatli buildning o‘zi ommaviy ishga tushirishga to‘liq tayyorlikni anglatmaydi. Haqiqiy foydalanuvchilar bilan ro‘yxatdan o‘tish, ma’lumotlarni saqlash, AI, xavfsizlik va turli qurilmalardagi sinovlar alohida bajarilishi kerak.
