import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import AdminProvider from '@/context/AdminContext';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyStore - Your One-Stop Shop',
  description: 'Shop the latest products at MyStore. Find great deals on electronics, fashion, home goods, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <Layout>
                {children}
              </Layout>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 