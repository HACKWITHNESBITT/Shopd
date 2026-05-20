# The Kisumu Cut - Premium Barbershop Website

A modern, responsive, and premium single-page website built for a local barbershop in Kisumu, Kenya. This project features a dark/moody aesthetic, smooth micro-animations, and a fully functional multi-step online booking system integrated with EmailJS.

## Features

- **Premium Design:** A clean, dark-themed UI with elegant gold accents, utilizing Google Fonts (Outfit & Playfair Display).
- **Responsive Layout:** Fully optimized for mobile, tablet, and desktop viewing.
- **Interactive Booking System:** A seamless, multi-step booking form that guides users through selecting a service, barber, date, and time.
- **Automated Notifications:** Integrated with EmailJS to instantly send booking details to the barbershop's email address without requiring a backend server.
- **Dynamic Content Sections:** Services menu, barber profiles, gallery grid, customer reviews, and a Google Maps embed for location.

## Tech Stack

- **HTML5:** Semantic structure and SEO best practices.
- **Vanilla CSS:** Custom design system utilizing CSS variables, Flexbox, CSS Grid, and custom animations (No external frameworks like Tailwind/Bootstrap).
- **Vanilla JavaScript:** DOM manipulation for the mobile menu, smooth scrolling, and managing the state of the multi-step booking form.
- **EmailJS:** Third-party service used for handling form submissions and sending automated emails directly from the frontend.

## Project Structure

```
Shopd/
├── index.html        # Main HTML document containing all sections
├── css/
│   └── style.css     # Core stylesheet (variables, layouts, animations)
├── js/
│   ├── app.js        # Global UI interactivity (mobile menu, scrolling)
│   └── booking.js    # Multi-step booking form logic and EmailJS integration
├── images/           # Directory for gallery, barber profiles, and hero images
└── README.md         # Project documentation
```

## Setup & Installation

This is a static frontend website, meaning no complex build steps or backend servers are required.

1. **Clone or Download the Repository:**
   Download the project files to your local machine.

2. **Open the Website:**
   Simply double-click `index.html` to open the website in your default web browser.

3. **Local Development Server (Optional but recommended):**
   To test the site in a more realistic environment, you can serve it locally using tools like VS Code's "Live Server" extension, or Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000` in your browser.

## EmailJS Configuration

The booking system is currently configured to send emails using EmailJS. If you are deploying this for a client or changing the receiving email, you must update the EmailJS credentials in the code:

1. **Create an account** at [EmailJS](https://www.emailjs.com/).
2. **Connect an Email Service** (e.g., Gmail) to get your `Service ID`.
3. **Create an Email Template** matching the variables sent from the form (`{{name}}`, `{{phone}}`, `{{email}}`, `{{service}}`, `{{barber}}`, `{{date}}`, `{{time}}`) to get your `Template ID`.
4. **Get your Public Key** from the Account tab.
5. **Update the code:**
   - In `index.html` (near the bottom), replace the Public Key string in `emailjs.init('eZ1CHt5nyUHWpUGE5');`.
   - In `js/booking.js` (inside the form submit handler), replace the Service ID and Template ID in `emailjs.send('service_egyghyj', 'template_1j1l47m', templateParams)`.

## Deployment

The website is ready to be hosted on any static file hosting service. Excellent free options include:
- **GitHub Pages**
- **Netlify**
- **Vercel**

Simply drag and drop the project folder or connect your git repository to one of these services to make the website live on the internet.
