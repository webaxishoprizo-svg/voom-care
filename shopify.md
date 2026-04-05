# Shopify Storefront Integration Guide

This document provides a comprehensive guide for connecting and managing the Shopify Storefront API for the **NORPERFUME** website. Use this as a reference for setting up new environments or integrating additional features.

## 1. Core Credentials
The website connects to Shopify via the **Storefront API (GraphQL)**.

| Field | Value |
|-------|-------|
| **Store URL** | `https://nor-perfume-2.myshopify.com` |
| **Storefront Access Token** | `597e532f7345926a95b019ced728a002` |
| **API Version** | `2024-01` |
| **Endpoint** | `https://nor-perfume-2.myshopify.com/api/2024-01/graphql.json` |

---

## 🤖 System Instruction for AI Developers
If you are an AI assistant tasked with configuring or debugging this website, follow these rules:
1. **Always use the `SHOPIFY_CONFIG`** identifiers provided in Section 1 for all API calls.
2. **Consult Section 4** before adding new components. Use the exact **Namespace & Key** listed to ensure the dashboard data matches the UI rendering.
3. **Reference Section 5** for the base fetch architecture to maintain consistency across the codebase.
4. **Environment Setup**: If you need to create a `.env` file, map the values from Section 1 to: `SHOPIFY_DOMAIN`, `SHOPIFY_ACCESS_TOKEN`, and `SHOPIFY_API_VERSION`.

---

> [!IMPORTANT]
> Keep the Access Token secure. For production environments, it is recommended to move these credentials into an `.env` file.

---

## 2. Integrated Features
The following features are currently powered by the Shopify integration:

### 🛍️ Product Catalog
- **Product Detail Page (PDP)**: Fetches full product details, variants, images, and description by handle.
- **Collections**: Dynamically lists products belonging to specific collections (e.g., Best Sellers, New Arrivals).
- **Inventory Check**: Real-time checking of `availableForSale` status for each variant.

### 🛒 Cart System
- **Persistent Cart**: Uses Shopify's `cartCreate` mutation to generate a unique cart ID stored in the browser.
- **Line Item Management**: Add products, update quantities, and remove items directly via API calls.
- **Direct Checkout**: Generates a `checkoutUrl` that redirects the user to the secure Shopify checkout page.

### 👤 Customer Accounts
- **Registration & Login**: Create customer accounts and generate access tokens.
- **Order History**: Authenticated users can view their past orders, status, and tracking information.
- **Profile Updates**: Allow users to update their personal information and default shipping addresses.

### 🖼️ CMS / Metafields
- **Hero Slider**: Powered by a Shopify collection where high-resolution images and marketing text are fetched from custom **Metafields** (`custom.hero_image`, `custom.hero_description`).

---

## 3. How to Configure (New Website Setup)

### Step 1: Create a Custom App in Shopify
1. Log in to your **Shopify Admin**.
2. Go to **Settings** > **Apps and sales channels**.
3. Click **Develop apps** > **Create an app**.
4. Name your app (e.g., "Headless Storefront").

### Step 2: Configure API Scopes
1. Click **Configuration**.
2. Under **Storefront API integration**, click **Configure**.
3. Select the following scopes (essential for this project):
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_listings`
   - `unauthenticated_read_collection_listings`
4. Click **Save**.

### Step 3: Install & Get Token
1. Click **Install app**.
2. Copy the **Storefront access token**. 
3. Update the `SHOPIFY_CONFIG` object in your codebase (`/src/lib/shopify/client.ts` or `/js/shopify.js`).

---

## 4. Metafield Dictionary (Custom Data)
Metafields allow you to add extra information to your Shopify Products or Collections that aren't available by default (like Hero Images or Fragrance Notes).

To add these, go to **Shopify Admin** > **Settings** > **Custom data** > **Products** (or Collections).

### 🏷️ For Hero Slider (Collection Metafields)
Used to control the aesthetic look of the home page hero slider.

| Section | Label in Shopify | Namespace & Key | Metafield Type | Description |
|:---|:---|:---|:---|:---|
| **Hero Slider** | Hero Image | `custom.hero_image` | **File (Image)** | High-res background image (Desktop) |
| **Hero Slider** | Hero Mobile Image | `custom.hero_mobile_image` | **File (Image)** | Vertical background image (Mobile) |
| **Hero Slider** | Hero Description | `custom.hero_description` | **Multi-line text** | Catchy marketing text for the slide |
| **Hero Slider** | Hero Mobile Video | `custom.hero_mobile_video` | **File (Video)** | Optional video background (Mobile) |

### 🧴 For Product Details (Product Metafields)
Used to display specific information on the Product Detail Page (PDP).

| Section | Label in Shopify | Namespace & Key | Metafield Type | Description |
|:---|:---|:---|:---|:---|
| **Details** | Fragrance Composition | `custom.composition` | **Multi-line text** | Top, heart, and base notes |
| **Details** | How To Use | `custom.how_to_use` | **Multi-line text** | Application instructions |
| **Details** | What's In The Box | `custom.whats_in_the_box` | **Multi-line text** | Package contents list |

---

## 5. Implementation Reference (Developer)

### GraphQL Fetch Function
```javascript
async function shopifyQuery(query, variables = {}) {
    const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });
    return await response.json();
}
```

---

## 6. Maintenance & Tips
- **API Versions**: Shopify updates its API every quarter. Ensure you check for deprecated fields if you upgrade beyond `2024-01`.
- **Caching**: Ensure that product queries use a reasonable cache revalidation time (e.g., 1 hour) to balance performance and inventory accuracy.
- **Image Optimization**: Use the `url(transform: { maxWidth: 2000, preferredContentType: WEBP })` filter in your GraphQL queries to let Shopify handle image sizing and compression automatically.

