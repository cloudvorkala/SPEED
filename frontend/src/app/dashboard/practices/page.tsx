import Link from "next/link";

export default function Practices() {
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
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
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
            <div className="flex items-center">
              <button className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-900">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Software Engineering Practices</h1>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search practices..."
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <button
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: "tdd",
              name: "Test-Driven Development (TDD)",
              description: "A software development process relying on software requirements being converted to test cases before software is fully developed.",
              claimsCount: 8,
              evidenceCount: 24,
            },
            {
              id: "pair-programming",
              name: "Pair Programming",
              description: "An agile software development technique in which two programmers work together at one workstation.",
              claimsCount: 6,
              evidenceCount: 18,
            },
            {
              id: "code-review",
              name: "Code Review",
              description: "Systematic examination of computer source code intended to find and fix mistakes.",
              claimsCount: 5,
              evidenceCount: 15,
            },
            {
              id: "agile",
              name: "Agile Methods",
              description: "A set of principles for software development under which requirements and solutions evolve through the collaborative effort.",
              claimsCount: 10,
              evidenceCount: 30,
            },
            {
              id: "devops",
              name: "DevOps",
              description: "A set of practices that combines software development and IT operations aiming to shorten development cycles.",
              claimsCount: 7,
              evidenceCount: 21,
            },
            {
              id: "continuous-integration",
              name: "Continuous Integration",
              description: "The practice of merging all developers' working copies to a shared mainline several times a day.",
              claimsCount: 4,
              evidenceCount: 12,
            },
          ].map((practice) => (
            <div key={practice.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">{practice.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{practice.description}</p>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-500">{practice.claimsCount} claims</span>
                  <span className="text-gray-500">{practice.evidenceCount} evidence records</span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <Link
                  href={`/dashboard/practices/${practice.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View practice details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}