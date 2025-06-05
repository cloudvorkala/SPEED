"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (user === null) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* top navegation bar */}
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

      {/* main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* footpage */}
      <footer className="bg-gray-50 py-4 text-center text-sm text-gray-600">
        <p>SPEED - Software Practice Empirical Evidence Database</p>
        <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
      </footer>
    </div>
  );
}
