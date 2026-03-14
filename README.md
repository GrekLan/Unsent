# Dating Coach

A production-ready SaaS dating coach web application built with Next.js 14, Supabase, Razorpay, and Groq AI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Payments**: Razorpay (India's payment gateway)
- **AI**: Groq (Llama 3.1) - Free tier available!
- **Deployment**: Vercel

## Features

- **Conversation Analysis**: Paste dating app conversations to get coaching advice
- **Profile Optimization**: Get feedback on your dating profile
- **Date Preparation**: Get personalized conversation topics and follow-up suggestions
- **Usage Tracking**: Free tier with 3 analyses/month, unlimited for Pro users
- **Subscription Management**: Stripe-powered billing with Pro and Pro Plus tiers

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Stripe account
- Groq API key (free tier available)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

3. Configure the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay (India's payment gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Groq AI (Free tier available!)
GROQ_API_KEY=your_groq_api_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL in `supabase-schema.sql` in the Supabase SQL Editor
3. Enable Google OAuth in Supabase Auth settings (optional)

### Razorpay Setup

1. Go to [razorpay.com](https://razorpay.com) and create an account
2. Get your API keys from Dashboard → Settings → API Keys:
   - Key ID → `RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/razorpay`
4. Configure webhook events: `payment.captured`, `subscription.activated`, `subscription.cancelled`
5. Get the webhook secret → `RAZORPAY_WEBHOOK_SECRET`

### Groq AI Setup

1. Go to [console.groq.com](https://console.groq.com) and sign up (free!)
2. Navigate to **API Keys** section
3. Create a new API key
4. Copy the key → `GROQ_API_KEY`
5. **No credit card required** for the free tier!

**Benefits of Groq:**
- ✅ Free tier with generous limits
- ✅ Very fast inference (uses LPUs)
- ✅ High quality models (Llama 3.1)
- ✅ Similar API to OpenAI (easy migration)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
```

### Deployment

Deploy to Vercel:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   ├── analyze/          # Analysis components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── stripe/           # Stripe utilities
│   ├── ai/               # AI prompts
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## Color Palette

- **Licorice** (#1F151C): Main background
- **Cappuccino** (#58382B): Primary buttons/actions
- **Paleviolet** (#C56F8C): Accents
- **Antiquewhite** (#FEEDDB): Text and card backgrounds

## Known Limitations (MVP Scope)

- Screenshot text extraction not yet implemented (placeholder)
- No voice coaching feature
- No video coaching feature
- Basic error handling
- No email notifications

## License

Proprietary - All rights reserved
