# MyStore

A modern e-commerce web application built with Next.js, React, and Supabase.

## Features

- User authentication with Supabase
- Product browsing and searching
- Shopping cart with local storage persistence
- Checkout process with shipping and payment with Razor Pay
- Admin Dashboard
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend/API**: Supabase
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather)
- **Notifications**: React Hot Toast

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://fqyaxeyfusrshzlwnhec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeWF4ZXlmdXNyc2h6bHduaGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODg4MjUsImV4cCI6MjA2MDU2NDgyNX0.eoBwvbLD6HYOyWIaVXkPXPP7Y3IrxPoZCSPsAQHym04
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Database Schema

The application uses the following database tables in Supabase:

- **users**: User accounts (handled by Supabase Auth)
- **products**: Product information including name, description, price, and images
- **categories**: Product categories
- **orders**: Order information linked to users
- **order_items**: Individual items within an order

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

## Stripe Integration

To enable the payment processing with Stripe:

1. Create a Stripe account
2. Add your Stripe API keys to the environment variables
3. Update the checkout process to use Stripe for payment processing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Amazon
- Icons from Feather Icons
- Color palette custom designed for a unique look and feel 
