import Link from "next/link";

export default function Search() {
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
                  className="px-3 py-2 text-sm font-medium text-blue-600"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Evidence</h1>

        {/* Search form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <form>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="practice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Software Engineering Practice
                  </label>
                  <select
                    id="practice"
                    name="practice"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a practice</option>
                    <option value="tdd">Test-Driven Development (TDD)</option>
                    <option value="pair-programming">Pair Programming</option>
                    <option value="code-review">Code Review</option>
                    <option value="agile">Agile Methods</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-1">
                    Claim
                  </label>
                  <select
                    id="claim"
                    name="claim"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a claim</option>
                    <option value="quality">Improves Code Quality</option>
                    <option value="bugs">Reduces Defects</option>
                    <option value="productivity">Increases Productivity</option>
                    <option value="satisfaction">Improves Developer Satisfaction</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="year-range"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Publication Year Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      id="start-year"
                      placeholder="Start year"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      id="end-year"
                      placeholder="End year"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                >
                  Search
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  Save Query
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search results */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Test-Driven Development (TDD) and Code Quality Improvement
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">Found 5 relevant articles</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Article Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Authors
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Year
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Result
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Research Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      title: "Impact of Test-Driven Development on Code Quality: An Empirical Study",
                      authors: "John Smith, Jane Doe",
                      year: "2021",
                      result: "Agree",
                      type: "Experiment",
                    },
                    {
                      title: "Comparing TDD and Traditional Development Methods on Code Quality",
                      authors: "Robert Johnson, Mary Williams",
                      year: "2019",
                      result: "Agree",
                      type: "Case Study",
                    },
                    {
                      title: "TDD Application in Enterprise Environments and its Impact on Code Quality",
                      authors: "David Brown, Lisa Green",
                      year: "2020",
                      result: "Disagree",
                      type: "Experiment",
                    },
                    {
                      title: "Test-Driven Development and Code Quality: A Literature Review",
                      authors: "Michael Davis, Sarah Wilson",
                      year: "2022",
                      result: "Neutral",
                      type: "Literature Review",
                    },
                    {
                      title: "Differences in Code Quality Impact of TDD Among Various Development Teams",
                      authors: "Chris Taylor, Amanda Miller",
                      year: "2023",
                      result: "Agree",
                      type: "Survey",
                    },
                  ].map((paper, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                        <Link href={`/dashboard/articles/${index}`}>{paper.title}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.authors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paper.result === "Agree"
                              ? "bg-green-100 text-green-800"
                              : paper.result === "Disagree"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {paper.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paper.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}