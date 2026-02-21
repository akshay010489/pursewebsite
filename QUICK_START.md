# Quick Start - Run Website Locally

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd` or `powershell`, press Enter
- Or right-click in the project folder and select "Open in Terminal"

### Step 2: Navigate to Project Folder

```bash
cd C:\Akshay_data\Coding\Purse_website
```

### Step 3: Install Dependencies (First Time Only)

```bash
npm install
```

This will download all required packages. Wait for it to complete (may take 1-2 minutes).

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Step 5: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

You should see your purse website!

## Note About Stripe (For Testing Payments)

The website will work for browsing and adding to cart, but for the payment checkout to work, you need to:

1. Create a free Stripe account: https://stripe.com
2. Get test API keys from: https://dashboard.stripe.com/test/apikeys
3. Create a file named `.env.local` in the project folder with:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```
4. Restart the server (stop with Ctrl+C, then run `npm run dev` again)

**But you can test the website without Stripe first** - you can browse products and add them to cart!

## Troubleshooting

**Error: "npm is not recognized"**
- Install Node.js from https://nodejs.org (download the LTS version)
- Restart your terminal after installing

**Error: "Cannot find module"**
- Run `npm install` again

**Port 3000 already in use**
- Stop the other application using port 3000, or
- The server will automatically use port 3001

## To Stop the Server

Press `Ctrl + C` in the terminal
