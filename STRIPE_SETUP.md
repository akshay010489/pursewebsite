# How to Fix Payment Page - Stripe Setup Guide

## The Problem
The payment page doesn't work because Stripe API keys are not configured. Here's how to fix it:

## Step-by-Step Setup

### Step 1: Create a Stripe Account (Free)

1. Go to https://stripe.com
2. Click "Sign up" (it's completely free)
3. Create your account (no credit card required for test mode)

### Step 2: Get Your API Keys

1. After logging in, go to: https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Step 3: Create .env.local File

1. In your project folder (`C:\Akshay_data\Coding\Purse_website`), create a new file named `.env.local`
   - **Important**: The file must be named exactly `.env.local` (with the dot at the beginning)

2. Add these two lines (replace with YOUR actual keys from Stripe):

```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**Example:**
```
STRIPE_SECRET_KEY=sk_test_51AbC123XyZ456...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbC123XyZ456...
```

### Step 4: Restart the Development Server

1. Stop the current server (press `Ctrl + C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 5: Test the Payment Page

1. Go to http://localhost:3000
2. Add item to cart
3. Click "Proceed to Checkout"
4. Fill in the form
5. Use this **test card number**: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

## Common Issues

### Issue: "Card element not loading"
- **Solution**: Make sure your `.env.local` file has the correct `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Make sure you restarted the server after creating the file

### Issue: "Failed to create payment intent"
- **Solution**: Check that `STRIPE_SECRET_KEY` is correct in `.env.local`
- Make sure you're using **test mode** keys (they start with `pk_test_` and `sk_test_`)

### Issue: File not found
- **Solution**: Make sure the file is named exactly `.env.local` (not `env.local` or `.env.local.txt`)
- The file should be in the root folder: `C:\Akshay_data\Coding\Purse_website\.env.local`

## Quick Checklist

- [ ] Created Stripe account
- [ ] Got API keys from Stripe dashboard
- [ ] Created `.env.local` file in project root
- [ ] Added both keys to `.env.local`
- [ ] Restarted the development server
- [ ] Tested with card number: 4242 4242 4242 4242

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Check the terminal where the server is running for error messages
3. Make sure both keys are from the **Test mode** (not Live mode)
