# Panduan Deploy ke Netlify

Panduan lengkap untuk mendeploy aplikasi Lab Inventory Pro ke Netlify.

## Prasyarat

1. **Akun Netlify** - Daftar gratis di [netlify.com](https://www.netlify.com/)
2. **Git Repository** (Opsional tapi direkomendasikan) - GitHub, GitLab, atau Bitbucket
3. **Node.js** terinstall di komputer lokal (untuk testing)

## Metode 1: Deploy via Git (Direkomendasikan)

### Langkah 1: Push ke Git Repository

Jika belum menggunakan Git, inisialisasi repository:

```bash
# Inisialisasi Git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit perubahan
git commit -m "Initial commit - Lab Inventory Pro"

# Tambahkan remote repository (ganti dengan URL repository Anda)
git remote add origin https://github.com/username/labinventory-pro.git

# Push ke GitHub
git push -u origin main
```

### Langkah 2: Connect ke Netlify

1. Login ke [Netlify](https://app.netlify.com/)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih provider Git Anda (GitHub/GitLab/Bitbucket)
4. Authorize Netlify untuk mengakses repository Anda
5. Pilih repository **labinventory-pro**

### Langkah 3: Configure Build Settings

Netlify akan otomatis mendeteksi pengaturan dari file `netlify.toml`, tapi pastikan:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (kosongkan atau isi dengan `.`)

### Langkah 4: Deploy

1. Klik **"Deploy site"**
2. Tunggu proses build selesai (biasanya 1-3 menit)
3. Site Anda akan live di URL seperti: `https://random-name-123456.netlify.app`

### Langkah 5: Custom Domain (Opsional)

1. Di dashboard Netlify, klik **"Domain settings"**
2. Klik **"Add custom domain"**
3. Ikuti instruksi untuk menghubungkan domain Anda

---

## Metode 2: Deploy Manual via Netlify CLI

### Langkah 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Langkah 2: Login ke Netlify

```bash
netlify login
```

Browser akan terbuka untuk authorize CLI.

### Langkah 3: Build Aplikasi

```bash
npm install
npm run build
```

### Langkah 4: Deploy

**Deploy untuk preview:**
```bash
netlify deploy
```

Pilih:
- Create & configure a new site
- Pilih team
- Site name (atau enter untuk random)
- Publish directory: `dist`

**Deploy ke production:**
```bash
netlify deploy --prod
```

---

## Metode 3: Drag & Drop (Paling Mudah)

### Langkah 1: Build Aplikasi Lokal

```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

Folder `dist` akan dibuat dengan file-file production-ready.

### Langkah 2: Deploy via Drag & Drop

1. Login ke [Netlify](https://app.netlify.com/)
2. Scroll ke bawah ke bagian **"Want to deploy a new site without connecting to Git?"**
3. **Drag & drop** folder `dist` ke area yang disediakan
4. Tunggu upload selesai
5. Site Anda akan langsung live!

> ⚠️ **Catatan**: Metode ini tidak mendukung auto-deploy saat ada perubahan code. Anda harus manual build dan upload ulang setiap kali ada perubahan.

---

## Environment Variables (Jika Diperlukan)

Jika aplikasi Anda menggunakan environment variables:

1. Di Netlify dashboard, buka **Site settings** → **Environment variables**
2. Klik **"Add a variable"**
3. Tambahkan key dan value (contoh: `VITE_API_URL`)
4. Klik **"Save"**
5. Redeploy site Anda

> 📝 **Penting**: Untuk Vite, environment variables harus diawali dengan `VITE_`

---

## Troubleshooting

### ❌ Build Failed

**Masalah**: Build gagal dengan error "Command failed"

**Solusi**:
1. Pastikan `package.json` memiliki script `build`
2. Test build di lokal: `npm run build`
3. Check error log di Netlify dashboard
4. Pastikan semua dependencies terinstall

### ❌ Page Not Found (404) saat Refresh

**Masalah**: Halaman menampilkan 404 saat di-refresh atau akses langsung ke route

**Solusi**: File `netlify.toml` sudah menghandle ini dengan redirect rules. Pastikan file tersebut ada di root project.

### ❌ Blank Page setelah Deploy

**Masalah**: Site deploy sukses tapi menampilkan halaman kosong

**Solusi**:
1. Check browser console untuk error
2. Pastikan base path di `vite.config.ts` sudah benar
3. Pastikan semua assets path menggunakan relative path

### ❌ Environment Variables Tidak Terbaca

**Masalah**: Environment variables tidak terdeteksi

**Solusi**:
1. Pastikan variable name diawali dengan `VITE_`
2. Set di Netlify dashboard, bukan di `.env.local`
3. Redeploy setelah menambahkan variables

---

## Optimasi Performance

### 1. Enable Asset Optimization

Di Netlify dashboard:
- **Site settings** → **Build & deploy** → **Post processing**
- Enable:
  - ✅ Bundle CSS
  - ✅ Minify CSS
  - ✅ Minify JS
  - ✅ Pretty URLs

### 2. Enable HTTPS

Netlify otomatis menyediakan SSL certificate gratis. Pastikan:
- **Domain settings** → **HTTPS**
- ✅ Force HTTPS enabled

### 3. Caching

File `netlify.toml` sudah mengkonfigurasi caching untuk assets dengan:
```toml
Cache-Control = "public, max-age=31536000, immutable"
```

---

## Monitoring & Analytics

### Netlify Analytics (Berbayar)

Untuk tracking visitor:
1. **Site settings** → **Analytics**
2. Enable Netlify Analytics ($9/bulan)

### Google Analytics (Gratis)

Tambahkan Google Analytics tag di `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Auto Deploy

Jika menggunakan Git (Metode 1), setiap push ke branch `main` akan otomatis trigger deploy baru.

**Deploy Previews**: Netlify juga akan membuat preview untuk setiap Pull Request.

---

## Custom Domain Setup

### Menggunakan Domain Sendiri

1. **Beli domain** dari provider (Namecheap, GoDaddy, dll)
2. Di Netlify: **Domain settings** → **Add custom domain**
3. Masukkan domain Anda (contoh: `labinventory.com`)
4. Update DNS records di domain provider:

**Untuk apex domain (labinventory.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**Untuk subdomain (www.labinventory.com):**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

5. Tunggu DNS propagation (bisa 24-48 jam)

---

## Biaya

- **Netlify Free Tier**:
  - ✅ 100GB bandwidth/bulan
  - ✅ 300 build minutes/bulan
  - ✅ Unlimited sites
  - ✅ SSL certificate gratis
  - ✅ Deploy previews
  - ✅ Form submissions (100/bulan)

Untuk aplikasi Lab Inventory Pro, **free tier sudah lebih dari cukup**.

---

## Backup & Rollback

Netlify menyimpan semua deploy history. Untuk rollback:

1. **Deploys** tab di dashboard
2. Pilih deploy yang ingin di-restore
3. Klik **"Publish deploy"**

---

## Support

- 📚 [Netlify Documentation](https://docs.netlify.com/)
- 💬 [Netlify Community](https://answers.netlify.com/)
- 🐦 [Netlify Twitter](https://twitter.com/netlify)

---

## Checklist Deploy

- [ ] Code sudah di-commit ke Git (jika pakai Metode 1)
- [ ] File `netlify.toml` ada di root project
- [ ] Test build lokal: `npm run build` berhasil
- [ ] Environment variables sudah di-set (jika ada)
- [ ] Connect repository ke Netlify
- [ ] Configure build settings
- [ ] Deploy site
- [ ] Test semua halaman dan fitur
- [ ] Setup custom domain (opsional)
- [ ] Enable HTTPS
- [ ] Setup analytics (opsional)

---

**Selamat! Aplikasi Lab Inventory Pro Anda sekarang sudah online! 🎉**
