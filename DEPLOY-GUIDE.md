# 🚀 PANDUAN DEPLOY PPI AIU WEBSITE KE HEROKU

## Step 1: Install Heroku CLI
1. Kunjungi: https://devcenter.heroku.com/articles/heroku-cli
2. Download "Heroku CLI for Windows"
3. Install dan restart PowerShell/Command Prompt

## Step 2: Daftar Heroku (Gratis)
1. Kunjungi: https://signup.heroku.com/
2. Daftar dengan email
3. Verifikasi email

## Step 3: Login & Deploy
Buka PowerShell di folder project ini, lalu jalankan:

```bash
# 1. Login ke Heroku
heroku login

# 2. Buat aplikasi baru (ganti 'ppi-aiu-website' dengan nama pilihan Anda)
heroku create ppi-aiu-website

# 3. Set environment variables (PENTING!)
heroku config:set MONGO_URI="mongodb+srv://waltercoy:PPIAIUMENDUNIA2025@webapp.mglzntg.mongodb.net/ppiaiu"
heroku config:set SESSION_SECRET="PPIAIUMENDUNIA2025_SECRET_KEY"
heroku config:set NODE_ENV="production"

# 4. Deploy website
git push heroku main

# 5. Buka website Anda!
heroku open
```

## Step 4: Custom Domain (Opsional)
Setelah deploy berhasil, Anda bisa:
1. Beli domain (contoh: ppiaiu.org)
2. Set custom domain di Heroku dashboard
3. Update DNS records

## 🎉 Selesai!
Website akan live di: https://ppi-aiu-website.herokuapp.com
(atau nama app yang Anda pilih)

## Troubleshooting
Jika ada error, jalankan:
```bash
heroku logs --tail
```