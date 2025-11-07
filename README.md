
# Rightyway Aso-Oke Fabrics LTD. E-Commerce Website

This repository contains the complete, production-ready website project for **Rightyway Aso-Oke Fabrics LTD.**, a Nigerian Aso-Oke fashion brand. The application is built as a Single Page Application (SPA) using React, TypeScript, and Tailwind CSS.

## Project Overview

This project provides a full e-commerce experience with the following key features:
- **Homepage/Landing Page:** A beautiful introduction to the brand, featuring a hero section, best sellers, and company information.
- **Shop Page:** A filterable and searchable grid of all products.
- **Product Detail Pages:** Detailed views for each product with image galleries, descriptions, and pricing.
- **Client-Side Shopping Cart:** A persistent shopping cart drawer for a seamless user experience.
- **Wholesale Pricing:** Automatic price adjustments in the cart for bulk orders.
- **WhatsApp Checkout:** A simple and effective checkout flow that redirects users to WhatsApp with a pre-filled order summary.
- **Simple Admin Panel:** A client-side dashboard (for demonstration) to manage products.
- **SEO & Accessibility:** Built with best practices, including meta tags, JSON-LD structured data, and semantic HTML.

---

## Tech Stack

- **Frontend:** React 18+, TypeScript, `react-router-dom` (HashRouter)
- **Styling:** Tailwind CSS (via CDN)
- **State Management:** React Context API
- **SEO:** `react-helmet-async` for meta tag management.
- **Data:** Product information is managed via a static `data/products.json` file.

---

## Prerequisites

- Node.js (v18.x or later)
- npm or yarn package manager

---

## Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd rightyway-aso-oke
    ```

2.  **Install dependencies:**
    (Note: This project is generated as an SPA without a `package.json`. You will need to initialize a project and install these dependencies.)
    
    First, create a `package.json`:
    ```bash
    npm init -y
    ```
    
    Then install the required libraries:
    ```bash
    npm install react react-dom react-router-dom react-helmet-async
    npm install --save-dev @types/react @types/react-dom typescript vite @vitejs/plugin-react
    ```

3.  **Create `vite.config.ts`:**
    ```typescript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
    })
    ```

4.  **Configure `tsconfig.json`:**
    Make sure your `tsconfig.json` is set up for a React project, especially the `jsx` option:
    ```json
    {
      "compilerOptions": {
        "jsx": "react-jsx",
        // ... other options
      }
    }
    ```

5.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add the following variables. **Do not commit this file to version control.**

    ```
    # The base URL of your deployed site (for SEO meta tags)
    VITE_NEXT_PUBLIC_SITE_URL=http://localhost:3000

    # The name of your brand
    VITE_NEXT_PUBLIC_BRAND_NAME="Rightyway Aso-Oke Fabrics LTD."

    # A secure, random string for accessing the admin panel
    VITE_ADMIN_TOKEN=replace_with_a_very_secure_token

    # (Optional) Your Formspree endpoint URL for contact forms
    VITE_FORM_ENDPOINT_URL=https://formspree.io/f/your_form_id

    # (Optional) Your Google Analytics Measurement ID
    VITE_GA_MEASUREMENT_ID=G-XXXXXXX
    ```
    *Note: To access these in the app, use `import.meta.env.VITE_...` instead of `process.env...`*

6.  **Run the development server:**
    ```bash
    npm run dev 
    ```
    (You might need to add `"dev": "vite"` to the `scripts` section of your `package.json`).

    The application will be available at `http://localhost:3000`.

---

## Content Management

### 1. Editing Products in `data/products.json`
The simplest way to manage products is by directly editing the `/data/products.json` file. Each product is a JSON object with the following structure:

```json
{
  "id": "rw-001",
  "name": "Classic Aso-Oke Red Stripe",
  "sku": "RW-RED-01",
  "price_ngn": 25000,
  "price_usd": 34,
  "wholesale_price_ngn": 20000, // Optional
  "wholesale_threshold": 5,     // Optional
  "description": "Full product description.",
  "short_description": "A brief one-liner.",
  "colors": ["red", "gold"],
  "sizes": ["meter"],
  "image": "/images/fabric-1.jpg", // Path to image in /public/images
  "alt": "Alt text for the image.",
  "tags": ["classic", "wedding"],
  "stock": 50
}
```

### 2. Using the Admin UI (Demonstration Only)
-   Navigate to `/#/admin`.
-   Enter the `ADMIN_TOKEN` you set in your `.env` file.
-   You can add, edit, and delete products using the form.
-   **IMPORTANT:** This admin panel is for demonstration purposes only. It modifies the application's state in your browser but **does not save changes** to the `products.json` file. Once you refresh the page, all changes will be lost. For a production site, this functionality must be replaced with a proper backend and database.

---

## Checkout Flow: WhatsApp vs. Stripe

### Default: WhatsApp Checkout (Enabled)
The default checkout method compiles the cart contents into a detailed message and opens WhatsApp to send it to a pre-configured number.
-   **To configure:** Open `constants.ts` and change the `WHATSAPP_NUMBER` to your business's WhatsApp number (including the country code, without `+`).

### Optional: Stripe Integration (Instructions)
To integrate Stripe for paid checkouts:
1.  **Sign up for Stripe:** Create an account at [stripe.com](https://stripe.com).
2.  **Get API Keys:** Find your public and secret keys in the Stripe Dashboard. Add them to your `.env` file.
3.  **Create a Backend:** Stripe payments require a backend server to securely create a PaymentIntent. You cannot do this from the client-side alone. You can use services like Vercel Serverless Functions, Netlify Functions, or a dedicated Node.js server.
4.  **Install Stripe Libraries:**
    ```bash
    npm install @stripe/stripe-js @stripe/react-stripe-js
    ```
5.  **Implement Checkout:**
    -   Wrap your app in the `<Elements>` provider from `@stripe/react-stripe-js`.
    -   Create a checkout page with Stripe's card input elements.
    -   Modify the checkout button's `onClick` handler. Instead of calling `checkoutViaWhatsApp`, it should make a POST request to your backend endpoint with the cart details.
    -   Your backend will create a Stripe PaymentIntent and return its `client_secret` to the frontend.
    -   The frontend will use this secret to confirm the payment with Stripe.

---

## Deployment to Vercel

1.  **Push to a Git Repository:** Create a new repository on GitHub, GitLab, or Bitbucket and push your code.
2.  **Create a Vercel Project:**
    -   Sign up or log in to [Vercel](https://vercel.com).
    -   Click "Add New..." -> "Project".
    -   Import your Git repository.
3.  **Configure the Project:**
    -   Vercel should automatically detect that it's a Vite project.
    -   Framework Preset: `Vite`.
    -   Build Command: `npm run build` (or `vite build`).
    -   Output Directory: `dist`.
4.  **Add Environment Variables:**
    -   Go to your project's "Settings" -> "Environment Variables".
    -   Add all the variables from your `.env` file (e.g., `VITE_NEXT_PUBLIC_SITE_URL`, `VITE_ADMIN_TOKEN`).
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your site.

---

## Photography & Images

This project uses placeholder images. To replace them:
1.  **Save Images:** Place your final product images inside the `/public/images/` directory.
2.  **Update `products.json`:** For each product, update the `image` field to point to the correct filename (e.g., `"/images/your-product-image.jpg"`). Also, update the `alt` text to be descriptive.

**Suggested Unsplash Keywords for Photography:**
-   `african fabric pattern`
-   `textile close up`
-   `colorful woven texture`
-   `nigerian fashion`
-   `sewing detail`

**Recommended Shot List:**
-   Flat lay of the full fabric piece.
-   Close-up detail shot showing the weave and texture.
-   Lifestyle shot of the fabric being worn or used in an outfit.
-   A shot of the fabric draped over a mannequin or chair.

---

## Testing

### Manual QA Checklist
-   [ ] **Responsiveness:** Check all pages on desktop, tablet, and mobile screen sizes.
-   [ ] **Forms:** Test the contact and wholesale forms. Ensure they submit correctly.
-   [ ] **Cart Flow:** Add items, update quantities, remove items, and clear the cart.
-   [ ] **Wholesale Logic:** Verify that wholesale prices are applied when the quantity threshold is met.
-   [ ] **WhatsApp Checkout:** Ensure the WhatsApp redirect works and the message is formatted correctly.
-   [ ] **Admin Panel:** Test logging in and the (simulated) add/edit/delete functionality.
-   [ ] **Links & Navigation:** Click through all links in the header, footer, and on pages to ensure they work.

### Automated Testing (Lighthouse)
You can use Google Lighthouse in Chrome DevTools to audit your site's performance, accessibility, and SEO.
1.  Open your deployed site in Chrome.
2.  Open DevTools (`Ctrl+Shift+I` or `Cmd+Opt+I`).
3.  Go to the "Lighthouse" tab.
4.  Select categories (Performance, Accessibility, Best Practices, SEO) and "Mobile" device.
5.  Click "Analyze page load".

**Target Scores:**
-   **Performance:** 90+
-   **Accessibility:** 95+
-   **Best Practices:** 100
-   **SEO:** 100

---

## Production Recommendations: Moving Beyond the Demo

This project is a fantastic starting point. To make it a fully robust, scalable production application, consider the following upgrades:

1.  **Switch to a Headless CMS or Database:**
    -   **Why?** To allow non-developers to manage products easily and to persist data.
    -   **Options:**
        -   **Headless CMS:** Sanity, Contentful, Strapi. These offer rich UIs for content management.
        -   **Backend-as-a-Service (BaaS):** Firebase, Supabase. These provide a database, authentication, and APIs out of the box.
    -   **Steps:**
        1.  Set up your chosen service and model your product data.
        2.  Migrate the data from `products.json`.
        3.  Replace the data fetching logic in `ProductContext.tsx` with API calls to your new service.
        4.  Rebuild the Admin page to use the service's API for creating, updating, and deleting products.

2.  **Implement a Proper Backend for Forms & Admin:**
    -   **Why?** For security and functionality (e.g., saving form submissions, protecting the admin panel).
    -   **Options:**
        -   Use serverless functions (Vercel/Netlify) with a lightweight framework like Express.js.
        -   Build a full backend with Node.js, Python, etc.
    -   **Steps:**
        1.  Create API endpoints for `/api/products` (GET, POST, PUT, DELETE).
        2.  Create an endpoint for `/api/contact` to handle form submissions (e.g., send an email using Nodemailer or SendGrid).
        3.  Implement proper authentication for the admin endpoints (e.g., JWT).
