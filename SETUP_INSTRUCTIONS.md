# Quick Setup Instructions

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Stripe

1. Create a free Stripe account at https://stripe.com
2. Go to https://dashboard.stripe.com/test/apikeys
3. Copy your **Publishable key** and **Secret key**
4. Create a file named `.env.local` in the root directory:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   ```
5. Replace the placeholder values with your actual Stripe keys

## Step 3: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 4: Test the Website

1. **View Product**: You'll see a luxury leather handbag listed
2. **Add to Cart**: Click "Add to Cart" button
3. **View Cart**: Click the cart icon in the header
4. **Checkout**: Click "Proceed to Checkout"
5. **Test Payment**: Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)

## Step 5: Deploy to Get a Free Domain

### Option A: Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

Your site will be live at: `https://your-project-name.vercel.app`

### Option B: Netlify

1. Build the project: `npm run build`
2. Go to https://app.netlify.com
3. Drag and drop the `.next` folder
4. Add environment variables (Stripe keys)
5. Your site will be live at: `https://your-project-name.netlify.app`

## Domain Registration

**Note**: I cannot automatically register domains as it requires:
- External service access
- Payment verification
- User account creation

However, you can:

1. **Use the free subdomain** from Vercel/Netlify (recommended for testing)
2. **Register a free domain** at:
   - Freenom.com (if available in your region) - offers .tk, .ml, .ga domains
   - Dot.tk - free .tk domains
3. **Purchase a domain** (recommended for production):
   - Namecheap.com (~$10-15/year)
   - Cloudflare Registrar (~$8-10/year)

See `DOMAIN_SETUP.md` for detailed domain setup instructions.

## Features Included

✅ Product listing page  
✅ Shopping cart functionality  
✅ Secure checkout with Stripe  
✅ Credit card payment processing  
✅ Responsive design  
✅ Modern, beautiful UI  

## Troubleshooting

- **Stripe errors**: Make sure your `.env.local` file has the correct keys
- **Build errors**: Run `npm install` again
- **Payment not working**: Ensure you're using test mode keys from Stripe dashboard
