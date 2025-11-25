# Nolaz Store

A modern, responsive e-commerce website for contemporary fashion with Google Sheets integration and WhatsApp checkout.

## 🌟 Features

- **Modern Design**: Clean, contemporary UI with mobile-first approach
- **Shopping Cart**: Add multiple products, manage quantities, WhatsApp checkout
- **Google Sheets Integration**: Products managed via Google Sheets
- **Admin Panel**: Full CRUD operations (Create, Read, Update, Delete) for products
- **Mobile Responsive**: Optimized for all devices
- **Image Upload**: Cloudinary integration for product images
- **Multi-page**: Home, Shop, About, Contact pages

## 🚀 Live Demo

Visit: [https://noah390.github.io/Nolaz-Store-/home.html](https://noah390.github.io/Nolaz-Store-/home.html)

## 📱 Pages

- **Home**: Landing page with featured products
- **Shop**: Full product catalog with filtering and sorting
- **About**: Company story and team information
- **Contact**: Contact form and business information
- **Admin**: Product management panel

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/noah390/Nolaz-Store-.git
   cd Nolaz-Store-
   ```

2. **Configure Google Sheets**
   - Create a Google Sheet with columns: id, name, price, description, category, image, status
   - Publish as CSV and get the URL
   - Update `SHEET_CSV_URL` in `script.js` and `home.js`

3. **Setup Google Apps Script**
   - Copy code from `apps-script.gs`
   - Deploy as web app
   - Update `APPS_SCRIPT_URL` in `admin.js`

4. **Configure Cloudinary (Optional)**
   - Create Cloudinary account
   - Update `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` in `admin.js`

5. **Update Configuration**
   - Open `update-config.html` in browser for easy configuration
   - Or manually update the configuration variables in JavaScript files

## 📁 File Structure

```
Nolaz-Store/
├── home.html          # Landing page
├── shop.html          # Product catalog
├── about.html         # About page
├── contact.html       # Contact page
├── admin.html         # Admin panel
├── index.html         # Shop redirect
├── style.css          # All styles
├── script.js          # Main functionality
├── home.js            # Home page scripts
├── admin.js           # Admin functionality
├── cart.js            # Shopping cart
├── mobile.js          # Mobile navigation
├── apps-script.gs     # Google Apps Script
├── image/             # Team member images
└── docs/              # Setup guides
```

## 🎨 Customization

- **Colors**: Update CSS variables in `style.css`
- **Logo**: Replace SVG in header sections
- **Content**: Edit HTML files for text and images
- **WhatsApp**: Update phone number in JavaScript files

## 📞 Support

- **WhatsApp**: +234 904 645 6469
- **Email**: hello@nolazstore.com

## 📄 License

© 2024 Nolaz Store — Built with ❤️

---

**Tech Stack**: HTML5, CSS3, JavaScript, Google Sheets API, Cloudinary, WhatsApp Business API