"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Practice {
  _id: string;
  name: string;
  description: string;
  claims?: Array<{
    _id: string;
    statement: string;
    evidence: Array<{
      _id: string;
      result: "AGREE" | "DISAGREE" | "NEUTRAL";
    }>;
  }>;
}

export default function PracticesPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        console.log("Fetching practices...");
        const response = await fetch("http://localhost:4000/practices", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch practices: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        setPractices(data);
      } catch (err) {
        console.error("Error fetching practices:", err);
        setError(err instanceof Error ? err.message : "Failed to load practices");
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center text-gray-500">Loading practices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-blue-600">SPEED</span>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Home
                </Link>
                <Link
                  href="/dashboard/practices"
                  className="px-3 py-2 text-sm font-medium text-blue-600"
                >
                  Practices
                </Link>
                <Link
                  href="/dashboard/search"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Search
                </Link>
                <Link
                  href="/dashboard/submit"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Submit Article
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 mr-2">
              ← Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Software Engineering Practices</h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map((practice) => (
              <div key={practice._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <Link
                    href={`/dashboard/practices/${practice._id}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                  >
                    {practice.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{practice.description}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flex flex-wrap gap-2">
                    {practice.claims?.map((claim) => (
                      <div
                        key={claim._id}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                      >
                        {claim.statement}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {practice.claims?.length ?? 0} claims
                    </div>
                    <Link
                      href={`/dashboard/practices/${practice._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}