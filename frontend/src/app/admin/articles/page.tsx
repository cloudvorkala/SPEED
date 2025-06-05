"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Define the shape of article data
interface Article {
  _id: string;
  title: string;
  authors: string[];
  year: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminArticles() {
  const { user, logout, loading: authLoading } = useAuth(); // Get user info and auth state
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]); // Store fetched articles
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message

  // Authentication check on load
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/"); // Redirect if not logged in
      } else if (user.role !== "ADMIN") {
        router.replace("/"); // Redirect if not admin
      } else {
        fetchArticles(); // Load articles if valid admin
      }
    }
  }, [authLoading, user, router]);

  // Fetch all articles from backend
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  // Handle moderation (approve/reject) or deletion
  const handleAction = async (id: string, status?: "APPROVED" | "REJECTED") => {
    const action = status ? `${status.toLowerCase()}` : "delete";
    const message = status
      ? `Are you sure you want to ${action} this article?`
      : "Are you sure you want to delete this article? This action is irreversible.";
    if (!confirm(message)) return;

    const url = status
      ? `http://localhost:4000/articles/${id}/moderate`
      : `http://localhost:4000/articles/${id}`;
    const method = status ? "PUT" : "DELETE";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: status ? JSON.stringify({ status }) : undefined,
      });

      if (!res.ok) throw new Error(`${action} failed`);

      // Update UI after action
      setArticles((prev) =>
        status
          ? prev.map((a) => (a._id === id ? { ...a, status } : a)) // Update status
          : prev.filter((a) => a._id !== id) // Remove deleted article
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    }
  };

  // Handle loading and permission states
  if (authLoading || loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || user.role !== "ADMIN") return <div className="p-8 text-center">Access denied.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="text-blue-600 font-medium hover:underline">← Admin Panel</Link>
          <button onClick={() => { logout(); router.replace("/"); }} className="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderate Articles</h1>

        {/* Error or empty state */}
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500">No articles found</div>
        ) : (
          // Articles table
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Authors</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{a.title}</td>
                    <td className="px-6 py-4">{a.authors.join(", ")}</td>
                    <td className="px-6 py-4">{a.year}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        a.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        a.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap justify-center">
                        {/* Approve/Reject only for pending articles */}
                        {a.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleAction(a._id, "APPROVED")}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(a._id, "REJECTED")}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {/* Delete available for all statuses */}
                        <button
                          onClick={() => handleAction(a._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                        >
                          Delete
                        </button>
                      </div>
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
