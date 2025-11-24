# 🚀 Panduan Deploy Lab Inventory Pro ke Netlify

Panduan lengkap dari awal sampai aplikasi online di Netlify.

---

## 📋 File yang Akan Di-Upload ke GitHub

### ✅ File yang HARUS di-commit:

```
labinventory-pro/
├── .gitignore              ← Daftar file yang diabaikan Git
├── netlify.toml            ← Konfigurasi Netlify
├── package.json            ← Dependencies dan scripts
├── tsconfig.json           ← TypeScript config
├── vite.config.ts          ← Vite config
├── index.html              ← HTML utama
├── index.tsx               ← Entry point React
├── App.tsx                 ← Komponen utama
├── types.ts                ← Type definitions
├── mockData.ts             ← Data dummy
├── metadata.json           ← Metadata aplikasi
├── README.md               ← Dokumentasi
├── DEPLOYMENT.md           ← Panduan deployment
├── components/             ← Folder komponen
│   └── (semua file .tsx)
├── pages/                  ← Folder halaman
│   └── (semua file .tsx)
└── context/                ← Folder context
    └── (semua file .tsx)
```

### ❌ File yang TIDAK di-commit (sudah ada di .gitignore):

```
node_modules/               ← Dependencies (akan di-install otomatis)
dist/                       ← Build output (dibuat saat deploy)
.env.local                  ← Environment variables lokal
*.log                       ← Log files
.DS_Store                   ← Mac system files
```

---

## 🎯 Langkah-Langkah Lengkap

### **TAHAP 1: Persiapan Repository GitHub**

#### 1.1 Buat Repository Baru di GitHub

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
3. Isi form:
   - **Repository name**: `labinventory-pro`
   - **Description**: `Lab Inventory Management System for Applied Manufacturing Technology`
   - **Visibility**: Pilih **Public** atau **Private** (terserah Anda)
   - **JANGAN centang** "Add a README file" (karena sudah ada)
   - **JANGAN centang** "Add .gitignore" (karena sudah ada)
4. Klik **"Create repository"**
5. **COPY URL repository** yang muncul (contoh: `https://github.com/username/labinventory-pro.git`)

---

### **TAHAP 2: Upload Code ke GitHub**

#### 2.1 Buka Terminal/PowerShell

Buka terminal di folder project:
- **Cara 1**: Klik kanan di folder `labinventory-pro` → **"Open in Terminal"**
- **Cara 2**: Buka PowerShell, lalu:
  ```powershell
  cd e:\labinventory-pro
  ```

#### 2.2 Inisialisasi Git (jika belum)

```bash
# Check apakah sudah ada Git
git status
```

Jika muncul error "not a git repository", jalankan:

```bash
# Inisialisasi Git
git init

# Set branch utama ke 'main'
git branch -M main
```

#### 2.3 Konfigurasi Git (jika belum pernah)

```bash
# Set nama Anda
git config --global user.name "Nama Anda"

# Set email Anda (gunakan email yang sama dengan GitHub)
git config --global user.email "email@example.com"
```

#### 2.4 Tambahkan Semua File

```bash
# Tambahkan semua file (kecuali yang ada di .gitignore)
git add .

# Check file apa saja yang akan di-commit
git status
```

Anda akan melihat daftar file yang akan di-commit (warna hijau).

#### 2.5 Commit Perubahan

```bash
# Commit dengan pesan
git commit -m "Initial commit: Lab Inventory Pro application"
```

#### 2.6 Hubungkan dengan GitHub

```bash
# Tambahkan remote repository (ganti URL dengan URL repository Anda)
git remote add origin https://github.com/username/labinventory-pro.git

# Verify remote
git remote -v
```

#### 2.7 Push ke GitHub

```bash
# Push ke GitHub
git push -u origin main
```

**Jika diminta login:**
- Username: username GitHub Anda
- Password: **GUNAKAN Personal Access Token**, bukan password biasa

**Cara membuat Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Pilih scope: `repo`
3. Copy token dan paste sebagai password

**Setelah berhasil push**, buka repository di GitHub untuk memastikan semua file sudah terupload.

---

### **TAHAP 3: Deploy ke Netlify**

#### 3.1 Login ke Netlify

1. Buka [netlify.com](https://www.netlify.com/)
2. Klik **"Sign up"** atau **"Log in"**
3. **Pilih "Continue with GitHub"** (paling mudah)
4. Authorize Netlify untuk mengakses GitHub Anda

#### 3.2 Import Project dari GitHub

1. Di dashboard Netlify, klik **"Add new site"**
2. Pilih **"Import an existing project"**
3. Pilih **"Deploy with GitHub"**
4. **Authorize Netlify** jika diminta
5. Cari dan pilih repository **"labinventory-pro"**

#### 3.3 Configure Build Settings

Netlify akan otomatis mendeteksi settings dari `netlify.toml`, tapi pastikan:

```
Site name: labinventory-pro (atau nama lain yang Anda inginkan)
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

**JANGAN ubah apapun**, langsung klik **"Deploy labinventory-pro"**

#### 3.4 Tunggu Build Selesai

1. Netlify akan mulai build (biasanya 1-3 menit)
2. Anda bisa lihat progress di **"Deploys"** tab
3. Jika ada error, akan muncul di log

**Status build:**
- 🟡 **Building** - Sedang proses
- 🟢 **Published** - Berhasil!
- 🔴 **Failed** - Ada error (check log)

#### 3.5 Akses Website Anda

Setelah build selesai:
1. Klik link yang muncul (contoh: `https://labinventory-pro.netlify.app`)
2. **Website Anda sudah ONLINE!** 🎉

---

## 🔄 Update Website (Setelah Deploy Pertama)

Setiap kali Anda edit code dan ingin update website:

```bash
# 1. Tambahkan perubahan
git add .

# 2. Commit dengan pesan yang jelas
git commit -m "Update: deskripsi perubahan"

# 3. Push ke GitHub
git push
```

**Netlify akan OTOMATIS deploy ulang** dalam 1-3 menit!

---

## 🎨 Customize Domain (Opsional)

### Ubah Nama Subdomain Netlify

1. Di Netlify dashboard → **"Site settings"**
2. **"Domain management"** → **"Options"** → **"Edit site name"**
3. Ubah dari `random-name-123456` ke `labinventory-pro`
4. URL baru: `https://labinventory-pro.netlify.app`

### Gunakan Domain Sendiri (Berbayar)

1. Beli domain (contoh: `labinventory.com`)
2. Di Netlify: **"Add custom domain"**
3. Ikuti instruksi untuk update DNS

---

## 🐛 Troubleshooting

### ❌ Error: "fatal: not a git repository"

**Solusi:**
```bash
git init
git branch -M main
```

### ❌ Error: "failed to push some refs"

**Solusi:**
```bash
# Pull terlebih dahulu
git pull origin main --allow-unrelated-histories

# Lalu push lagi
git push -u origin main
```

### ❌ Error: "Support for password authentication was removed"

**Solusi:** Gunakan Personal Access Token, bukan password biasa.

### ❌ Build Failed di Netlify

**Solusi:**
1. Check error log di Netlify
2. Test build di lokal:
   ```bash
   npm install
   npm run build
   ```
3. Jika error, fix dulu di lokal, lalu commit dan push lagi

### ❌ Halaman Blank setelah Deploy

**Solusi:**
1. Buka browser console (F12) untuk lihat error
2. Pastikan `netlify.toml` ada di root project
3. Redeploy: Netlify dashboard → **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**

### ❌ 404 saat Refresh Halaman

**Solusi:** File `netlify.toml` sudah menghandle ini dengan redirect rules. Pastikan file ada.

---

## ✅ Checklist Lengkap

### Persiapan
- [ ] Akun GitHub sudah dibuat
- [ ] Akun Netlify sudah dibuat
- [ ] Git sudah terinstall di komputer

### Upload ke GitHub
- [ ] Repository GitHub sudah dibuat
- [ ] `git init` sudah dijalankan
- [ ] `git add .` sudah dijalankan
- [ ] `git commit` sudah dijalankan
- [ ] `git remote add origin` sudah dijalankan
- [ ] `git push` berhasil
- [ ] File terlihat di GitHub

### Deploy ke Netlify
- [ ] Login ke Netlify dengan GitHub
- [ ] Import repository dari GitHub
- [ ] Build settings sudah benar
- [ ] Deploy pertama berhasil
- [ ] Website bisa diakses
- [ ] Test semua halaman berfungsi

### Opsional
- [ ] Ubah site name di Netlify
- [ ] Setup custom domain (jika ada)
- [ ] Enable HTTPS (otomatis)
- [ ] Setup analytics (opsional)

---

## 📞 Bantuan Lebih Lanjut

Jika ada masalah:
1. Check error message dengan teliti
2. Google error message tersebut
3. Tanya di [Netlify Community](https://answers.netlify.com/)
4. Atau hubungi saya untuk bantuan lebih lanjut

---

## 🎓 Ringkasan Perintah

```bash
# === SETUP GIT ===
cd e:\labinventory-pro
git init
git branch -M main
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"

# === UPLOAD KE GITHUB ===
git add .
git commit -m "Initial commit: Lab Inventory Pro application"
git remote add origin https://github.com/username/labinventory-pro.git
git push -u origin main

# === UPDATE SELANJUTNYA ===
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

---

**Selamat mencoba! Aplikasi Lab Inventory Pro Anda akan segera online! 🚀**

Jika ada pertanyaan atau kendala, jangan ragu untuk bertanya!
