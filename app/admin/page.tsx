'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiShield, FiPackage, FiUsers, FiShoppingBag, 
  FiBarChart2, FiGrid, FiSettings, FiDatabase 
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdmin();
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    console.log('Admin page state:', { user: !!user, isAdmin, isLoading });
    
    // Skip the check if we're still loading auth state
    if (isLoading) {
      console.log('Admin check is still loading, waiting...');
      return;
    }
    
    if (!user) {
      console.log('No user found, redirecting to signin');
      // Use direct navigation for more reliable redirect
      window.location.href = '/signin?redirect=/admin';
      return;
    }
    
    if (!isAdmin) {
      console.log('User is not admin, showing toast and redirecting');
      toast.error('You do not have permission to access this page');
      // Use direct navigation for more reliable redirect
      window.location.href = '/';
      return;
    }
    
    console.log('User is admin, loading stats');
    // Load stats immediately without waiting
    fetchStats();
  }, [user, isAdmin, isLoading, router]);

  const fetchStats = async () => {
    // In a real application, you would fetch real stats from your backend
    // Here we're just providing mock data immediately
    setStatsLoading(true);
    
    try {
      // No artificial delay - just set the stats immediately
      setStats({
        totalProducts: 48,
        totalUsers: 156,
        totalOrders: 27,
        totalRevenue: 4358.95
      });
    } catch (error) {
      console.error('Error setting admin stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Show loading state while checking admin status
  if (isLoading) {
    console.log('Rendering loading state for admin page');
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Deny access if not an admin
  if (!isAdmin) {
    console.log('Rendering access denied state');
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
          <div className="mb-6 text-6xl text-red-500">
            <FiShield />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin area.
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  console.log('Rendering admin dashboard');
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-light rounded-full">
              <FiPackage className="text-primary text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Products</h3>
              {statsLoading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.totalProducts}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Users</h3>
              {statsLoading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FiShoppingBag className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Orders</h3>
              {statsLoading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FiBarChart2 className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
              {statsLoading ? (
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">₹{stats.totalRevenue.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Links */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Admin Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <Link 
            href="/admin/products" 
            className="p-6 border-b md:border-r border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-light rounded-full">
                <FiPackage className="text-primary text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Product Management</h3>
                <p className="text-sm text-gray-600 mt-1">Add, edit, and delete products</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/admin/categories" 
            className="p-6 border-b md:border-r border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FiGrid className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Categories</h3>
                <p className="text-sm text-gray-600 mt-1">Manage product categories</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/admin/orders" 
            className="p-6 border-b lg:border-r border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FiShoppingBag className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Order Management</h3>
                <p className="text-sm text-gray-600 mt-1">View and manage orders</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/admin/users" 
            className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">User Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage user accounts</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/admin/settings" 
            className="p-6 border-b md:border-r border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiSettings className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Site Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Configure store settings</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/admin/database" 
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <FiDatabase className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Database</h3>
                <p className="text-sm text-gray-600 mt-1">Backup and manage data</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-primary-light p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-primary mb-4">Admin Tips</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Use the search function in each section to quickly find what you're looking for</li>
          <li>Regular backups of your database are recommended to prevent data loss</li>
          <li>Add admin users through the User Management section</li>
          <li>Check the order management section daily to process new orders</li>
        </ul>
      </div>
    </div>
  );
} 