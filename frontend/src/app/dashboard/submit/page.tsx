import Link from "next/link";

export default function SubmitArticle() {
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
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
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
                  className="px-3 py-2 text-sm font-medium text-blue-600"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Research Article</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Article Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please provide details of the research article you want to submit.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Article title"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
                      Authors (comma separated)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="authors"
                        id="authors"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="e.g. John Smith, Jane Doe"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
                      Journal
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="journal"
                        id="journal"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Journal name"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="year"
                        id="year"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="2023"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                      Volume
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="volume"
                        id="volume"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                      Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="number"
                        id="number"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
                      DOI
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="doi"
                        id="doi"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="e.g. 10.1145/1234567.1234568"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                      Pages
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="pages"
                        id="pages"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="e.g. 123-145"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Submission Notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Any additional information about this submission.
                  </p>
                </div>

                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                      placeholder="Optional notes about this article"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/dashboard"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Submit Article
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}