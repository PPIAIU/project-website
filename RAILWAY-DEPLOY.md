# 🚄 DEPLOY PPI AIU WEBSITE KE RAILWAY

## ✨ Keunggulan Railway:
- ✅ Gratis tanpa perlu kartu kredit
- ✅ Deploy otomatis dari GitHub
- ✅ Database MongoDB included
- ✅ Custom domain support
- ✅ SSL certificate otomatis

## 🚀 Langkah Deploy:

### Step 1: Push ke GitHub (Jika belum)
```bash
# Pastikan code sudah di GitHub
git remote -v
git push origin main
```

### Step 2: Deploy di Railway
1. **Kunjungi**: https://railway.app/
2. **Login**: Dengan akun GitHub Anda
3. **New Project**: Klik "Deploy from GitHub repo"
4. **Pilih Repository**: PPIAIU/project-website
5. **Deploy**: Railway akan otomatis detect Node.js app

### Step 3: Set Environment Variables
Di Railway dashboard, tambahkan:
```
MONGO_URI = mongodb+srv://waltercoy:PPIAIUMENDUNIA2025@webapp.mglzntg.mongodb.net/ppiaiu
SESSION_SECRET = PPIAIUMENDUNIA2025_SECRET_KEY
NODE_ENV = production
PORT = 3000
```

### Step 4: Custom Domain (Opsional)
- Railway memberikan URL gratis: https://your-app.railway.app
- Bisa custom domain: ppiaiu.org (jika punya)

## 🎉 Selesai!
Website akan live dalam 2-3 menit!

## 📱 Monitoring
- Dashboard Railway: Monitor traffic, logs, performance
- Auto-deploy: Setiap push ke GitHub = deploy otomatis
- Rollback: Mudah rollback ke versi sebelumnya