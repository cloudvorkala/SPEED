"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">SPEED</h1>
          <p className="mt-2 text-gray-600">Software Practice Empirical Evidence Database</p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="px-6 py-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Login</h2>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Don&apos;t have an account?</span>
              <Link href="/register" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>SPEED - Software Practice Empirical Evidence Database</p>
          <p className="mt-1">AUT Software Engineering Research Group (SERG)</p>
        </div>
      </div>
    </div>
  );
}
