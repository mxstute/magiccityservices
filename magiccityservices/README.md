# Magic City Services — magiccityservices.com

Miami-Dade County's trusted source for junk removal, pressure washing, and mobile car detailing.

## Tech Stack
- React 18 + Vite 5
- Single-page application
- Google Fonts (Outfit + Playfair Display)
- Fully responsive (mobile-first)

## Local Development
```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## Production Build
```bash
npm run build
```
Output goes to `/dist` folder.

---

## Deploy to Vercel — Step by Step

### 1. Push this project to GitHub
1. Go to github.com and create a new repository called `magiccityservices`
2. In your terminal, from this project folder:
```bash
git init
git add .
git commit -m "Initial commit - Magic City Services hub site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/magiccityservices.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **"Add New Project"**
3. Import your `magiccityservices` repository from GitHub
4. Vercel will auto-detect Vite — leave all settings as default
5. Click **"Deploy"**
6. Wait ~60 seconds. Your site is now live at `magiccityservices.vercel.app`

### 3. Connect your custom domain
1. In the Vercel dashboard, go to your project → **Settings** → **Domains**
2. Type `magiccityservices.com` and click **Add**
3. Vercel will show you DNS records to add
4. Go to Namecheap (where you registered the domain):
   - Log in → Domain List → click **Manage** next to magiccityservices.com
   - Go to **Advanced DNS** tab
   - Delete any existing A records or CNAME records
   - Add these records (Vercel will tell you the exact values):
     - **A Record**: Host = `@`, Value = `76.76.21.21`
     - **CNAME Record**: Host = `www`, Value = `cname.vercel-dns.com`
5. Save. DNS propagation takes 5–30 minutes
6. Back in Vercel, click **Verify** — once DNS propagates, you'll see a green checkmark
7. Vercel automatically provisions an SSL certificate (HTTPS)

### 4. After domain is live
- Update the phone number from placeholder to your real CallRail number
- Update the form to connect to Formspree or your backend
- Update any placeholder content (stats, pricing, etc.)

---

## Before You Go Live Checklist
- [ ] Phone number updated to real CallRail tracking number
- [ ] Quote form connected (Formspree, Netlify Forms, or custom)
- [ ] Google Analytics / Tag Manager installed
- [ ] Google Search Console verified
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Test all links and CTAs on mobile
- [ ] Test page load speed (aim for under 3 seconds)

## Project Structure
```
magiccityservices/
├── index.html          # Entry point with SEO meta tags + JSON-LD
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── public/
│   ├── favicon.svg     # Magic City icon mark
│   ├── robots.txt      # Search engine crawl rules
│   └── sitemap.xml     # Sitemap for Google
└── src/
    ├── main.jsx        # React mount point
    └── App.jsx         # Full site component
```
