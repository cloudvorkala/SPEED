"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

export default function AdminLogin() {
  const { login } = useAuth(); // Access the login function from the Auth context
  const router = useRouter(); // For navigation

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message display
  const [loading, setLoading] = useState(false); // Loading state

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password); // Attempt login, returns user object
      if (user.isAdmin) {
        router.push("/admin"); // Redirect if user is an admin
      } else {
        setError("You do not have admin access."); // Show access error
      }
    } catch {
      setError("Invalid email or password"); // Authentication error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">SPEED</h1>
          <p className="mt-2 text-gray-600">Software Practice Empirical Evidence Database</p>
        </div>

        {/* Login card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="px-6 py-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Login as Admin</h2>

            {/* Display error if any */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="border-t bg-gray-50 px-6 py-4 text-center">
            <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>SPEED - Software Practice Empirical Evidence Database</p>
          <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
        </div>
      </div>
    </div>
  );
}
