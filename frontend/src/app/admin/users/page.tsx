"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "../../../types";
import { API_ENDPOINTS } from "../../../config/api";

// Type for user data returned from API
interface ApiUser {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: string;
  isModerator: boolean;
}

export default function AdminUsers() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/");
      } else if (!user.isAdmin) {
        router.replace("/admin");
      }
    }
  }, [authLoading, user, router]);

  // Fetch user list from API
  useEffect(() => {
    if (user?.isAdmin) {
      const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(API_ENDPOINTS.USERS, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          });

          // Handle session/token errors
          if (res.status === 401) {
            setError("Your session has expired. Please login again.");
            logout();
            router.replace("/");
            return;
          }

          if (res.status === 403) {
            setError("You don't have permission to access this page.");
            router.replace("/admin");
            return;
          }

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }

          // Format users (ensure _id exists)
          const data = await res.json();
          const formattedUsers = data.map((user: ApiUser) => ({
            ...user,
            _id: user.id || user._id,
          }));
          setUsers(formattedUsers as User[]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load users");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [user, router, logout]);

  // Handle deleting a user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      // Remove deleted user from UI list
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Handle toggling moderator status
  const handleToggleModerator = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}/${id}/moderator`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isModerator: !currentStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      // Update user in UI list
      setUsers(users.map(u =>
        u._id === id ? { ...u, isModerator: !currentStatus } : u
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update moderator status");
    }
  };

  // Display loading or access restriction messages
  if (authLoading || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || !user.isAdmin) return <div className="p-8 text-center">Access denied.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 justify-between items-center">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Admin Panel</Link>
          <button
            onClick={() => { logout(); router.replace("/"); }}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

        {/* Show error or user list */}
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Moderator</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* List of users excluding current admin */}
                {users.filter(u => u._id !== user?._id).map(u => (
                  <tr key={u._id}>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleModerator(u._id, u.isModerator)}
                        className={`px-3 py-1 rounded text-xs ${
                          u.isModerator
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {u.isModerator ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 text-center text-sm text-gray-600">
        <p>SPEED - Software Practice Empirical Evidence Database</p>
        <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
      </footer>
    </div>
  );
}
