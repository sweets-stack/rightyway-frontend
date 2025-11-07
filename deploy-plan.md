
# Deployment Plan for Rightyway Aso-Oke Fabrics LTD.

This document outlines the recommended steps to deploy and maintain the Rightyway Aso-Oke Fabrics LTD. website for production.

## 1. Recommended Hosting: Vercel

**Vercel** is the recommended hosting platform for this project due to its seamless integration with modern JavaScript frameworks, global CDN, automatic SSL, and generous free tier.

## 2. Pre-Deployment Checklist

- [ ] **Finalize Content:** Ensure all product information in `data/products.json` is accurate and all placeholder text on pages (About, Contact, etc.) has been replaced with final copy.
- [ ] **Replace Images:** All placeholder images (`picsum.photos` or local placeholders) must be replaced with high-quality, optimized product photography.
- [ ] **Configure Environment Variables:** Create a `.env.production` file or prepare the variables for your hosting provider's UI. Ensure `VITE_NEXT_PUBLIC_SITE_URL` points to your final domain name.
- [ ] **Test Locally:** Run a production build locally (`npm run build` and `npm run preview`) to catch any issues before deploying.
- [ ] **Set Up Analytics:** Ensure your `VITE_GA_MEASUREMENT_ID` is set to your production Google Analytics 4 property ID.

## 3. Domain Name & DNS

1.  **Purchase a Domain:** If you don't have one, purchase a domain name from a registrar like Namecheap, GoDaddy, or Google Domains. A good choice would be `rightywayasooke.com` or similar.

2.  **Link Domain to Vercel:**
    -   In your Vercel project dashboard, go to **Settings > Domains**.
    -   Enter your domain name and click "Add".
    -   Vercel will provide you with DNS records to add to your domain registrar's settings. This will typically be either an `A` record or `CNAME` records.
    -   Log in to your domain registrar, find the DNS management section, and update the records as instructed by Vercel.

3.  **DNS Propagation:** It may take anywhere from a few minutes to 48 hours for DNS changes to propagate globally. Vercel will show the status of your domain configuration.

## 4. SSL Certificate

**Vercel automatically provisions and renews free SSL certificates** for all domains connected to a project. Once your DNS is configured correctly, your site will be served over HTTPS (`https://`). No manual SSL setup is required.

## 5. Email Handling

For a professional appearance, you should have an email address like `info@yourdomain.com`.

-   **Recommendation:** Use a service like **Google Workspace** or **Zoho Mail**. They provide reliable email hosting for custom domains.
-   **Setup:** Your chosen email provider will give you `MX`, `SPF`, and `DKIM` records. Add these to your domain's DNS settings, just as you did for Vercel.

## 6. Post-Deployment Steps

1.  **Submit Sitemap to Google:**
    -   This project does not auto-generate a `sitemap.xml`. You can use an online generator to create one based on your site's pages (`/`, `/#/shop`, `/#/about`, etc.).
    -   Place the generated `sitemap.xml` in your `/public` directory.
    -   Set up **Google Search Console** for your domain.
    -   Submit your `sitemap.xml` URL (`https://yourdomain.com/sitemap.xml`) to Google Search Console to help Google index your site.

2.  **Create `robots.txt`:**
    -   Create a `robots.txt` file in your `/public` directory to guide search engine crawlers. A basic file would look like this:
        ```
        User-agent: *
        Allow: /
        Sitemap: https://yourdomain.com/sitemap.xml
        ```

## 7. Backup Plan

-   **Code:** Your code is the most critical asset. Keep it version-controlled in a Git repository (e.g., GitHub) with regular pushes.
-   **Product Data:** Since the data is in `data/products.json`, it is backed up along with your code in Git.
-   **Future State (with CMS/DB):** If you migrate to a Headless CMS or database, ensure you understand their backup procedures. Most services offer automated daily backups. Regularly export your data as a secondary precaution.
