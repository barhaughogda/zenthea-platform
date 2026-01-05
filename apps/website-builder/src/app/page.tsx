export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Build your <span className="text-blue-600">vision</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Select a template or start from scratch. Our mobile-first builder ensures your site looks great on every device.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">Template {i} Preview</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Modern Business {i}</h3>
              <p className="mt-2 text-sm text-gray-500">A clean, professional template for modern businesses.</p>
              <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Use this template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
