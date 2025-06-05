"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext"; // Custom auth context
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation

export default function Register() {
  // Form state variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Custom register function from auth context
  const { register } = useAuth();
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form action
    setError("");        // Reset any previous error messages
    setIsLoading(true);  // Start loading spinner

    try {
      await register(name, email, password); // Register user
      router.push("/dashboard");             // Navigate to dashboard after success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    // Outer container to center the form on the screen
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        
        {/* Branding Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">SPEED</h1>
          <p className="mt-2 text-gray-600">Software Practice Empirical Evidence Database</p>
        </div>

        {/* Registration Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="px-6 py-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Register</h2>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          {/* Link to login page */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>SPEED - Software Practice Empirical Evidence Database</p>
          <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
        </div>
      </div>
    </div>
  );
}
