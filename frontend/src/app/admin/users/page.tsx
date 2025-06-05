"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "../../../types";

interface ApiUser {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminUsers() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/");
      } else if (user.role !== "ADMIN") {
        router.replace("/dashboard");
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        try {
          console.log('Fetching users with token:', token.substring(0, 20) + '...');
          const res = await fetch(`${API_URL}/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          });

          console.log('Response status:', res.status);

          if (res.status === 401) {
            console.log('Token validation failed');
            setError("Your session has expired. Please login again.");
            logout();
            router.replace("/");
            return;
          }

          if (res.status === 403) {
            console.log('Access denied');
            setError("You don't have permission to access this page.");
            router.replace("/dashboard");
            return;
          }

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          console.log('Users data:', data);
          const formattedUsers = data.map((user: ApiUser) => ({
            ...user,
            _id: user.id || user._id,
          }));
          setUsers(formattedUsers as User[]);
        } catch (err) {
          console.error('Fetch error:', err);
          setError(err instanceof Error ? err.message : "Failed to load users");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [user, router, logout]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
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
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || user.role !== "ADMIN") return <div className="p-8 text-center">Access denied.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 justify-between items-center">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Admin Panel</Link>
          <button onClick={() => { logout(); router.replace("/"); }} className="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
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
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.filter(u => u._id !== user?._id).map(u => (
                  <tr key={u._id}>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(u._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer className="bg-gray-50 py-4 text-center text-sm text-gray-600">
        <p>SPEED - Software Practice Empirical Evidence Database</p>
        <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
      </footer>
    </div>
  );
}
