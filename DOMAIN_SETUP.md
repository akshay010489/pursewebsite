# Domain Registration Guide

## Free Domain Options

Unfortunately, truly free domain registration services are very limited in 2024. However, here are your best options:

### Option 1: Free Subdomain Services (Recommended for Testing)

These services provide free subdomains that you can use immediately:

1. **Vercel** (Recommended)
   - Provides: `your-project.vercel.app`
   - Steps:
     ```bash
     npm install -g vercel
     vercel
     ```
   - You can add a custom domain later
   - Free SSL certificate included

2. **Netlify**
   - Provides: `your-project.netlify.app`
   - Free SSL certificate
   - Easy deployment via drag-and-drop

3. **GitHub Pages**
   - Provides: `username.github.io/your-project`
   - Free for public repositories

### Option 2: Free TLD Domains (Limited Availability)

Some services offer free domains with certain TLDs, but availability is limited:

1. **Freenom** (if available in your region)
   - Offers: .tk, .ml, .ga, .cf domains
   - Website: https://www.freenom.com
   - Note: Service availability varies by region

2. **Dot TK**
   - Website: https://www.dot.tk
   - Free .tk domains

### Option 3: Purchase a Domain (Recommended for Production)

For a professional website, purchasing a domain is recommended:

**Recommended Domain Names for Purse Website:**
- purseboutique.com
- luxuryhandbags.com
- elegantpurses.com
- pursecollection.com
- designerhandbags.com
- handbagboutique.com
- premiumpurses.com

**Where to Buy:**
- **Namecheap**: ~$10-15/year for .com
- **Google Domains**: Competitive pricing
- **Cloudflare Registrar**: At-cost pricing (~$8-10/year)
- **GoDaddy**: Popular but slightly more expensive

## Setting Up Your Domain

### If Using Vercel:

1. Deploy your site:
   ```bash
   npm install -g vercel
   vercel
   ```

2. Add custom domain:
   - Go to your project on Vercel dashboard
   - Settings → Domains
   - Add your domain
   - Update DNS records as instructed

### If Using Netlify:

1. Deploy your site
2. Go to Site settings → Domain management
3. Add custom domain
4. Update DNS records

### DNS Configuration

Once you have a domain, you'll need to:

1. Point your domain to your hosting provider:
   - **A Record**: Point to hosting IP
   - **CNAME Record**: Point to hosting subdomain
   - **Nameservers**: Update at your domain registrar

2. Wait for DNS propagation (usually 24-48 hours)

## Quick Start with Free Subdomain

The fastest way to get your site live:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
# Your site will be live at: https://your-project.vercel.app
```

## Important Notes

- Free domains (like .tk) may have limitations and lower trust scores
- For a real business, purchasing a .com domain is recommended
- Always use HTTPS (SSL) for payment processing
- Keep your Stripe keys secure and never commit them to version control
