"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
  const { user, logout } = useAuth(); // Get current user and logout function from AuthContext
  const router = useRouter();

  // Redirect non-admin users away from this page
  useEffect(() => {
    if (user && !user.isAdmin) {
      router.replace("/");
    }
  }, [user, router]);

  // Show loading state while user info is being retrieved
  if (user === null) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Show error if not an admin
  if (!user || !user.isAdmin) {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  // Handle logout action
  const handleLogout = () => {
    logout(); // Clear user context and token
    router.push("/"); // Redirect to home page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 justify-between items-center">
          <span className="text-xl font-bold text-blue-600">SPEED Admin</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Admin Panel</h1>

        {/* Admin functions section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management Box */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Manage Users</h2>
            <p className="text-sm text-gray-600 mb-4">
              View, create, update, and remove user accounts from the system.
            </p>
            <Link
              href="/admin/users"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to User Management →
            </Link>
          </div>

          {/* Article Moderation Box */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Moderate Articles</h2>
            <p className="text-sm text-gray-600 mb-4">
              Review, approve, and reject submitted articles in the system.
            </p>
            <Link
              href="/admin/articles"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Article Moderation →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 text-center text-sm text-gray-600">
        <p>SPEED - Software Practice Empirical Evidence Database</p>
        <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
      </footer>
    </div>
  );
}
