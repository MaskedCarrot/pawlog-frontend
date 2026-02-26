import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors">
            <span className="text-2xl">🐾</span>
            <span className="text-lg font-semibold">PawLog</span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">Back</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
          <p>By using PawLog, you agree to these terms.</p>
          <h2 className="text-lg font-medium text-gray-900 mt-6">Use of service</h2>
          <p>PawLog is a pet care management tool. Use it responsibly. We are not liable for any harm to pets or users.</p>
          <h2 className="text-lg font-medium text-gray-900 mt-6">Your data</h2>
          <p>You retain ownership of your data. We store it to provide the service.</p>
          <h2 className="text-lg font-medium text-gray-900 mt-6">Contact</h2>
          <p>Questions? Email us at <a href="mailto:support@pawlog.app" className="text-primary hover:underline">support@pawlog.app</a>.</p>
        </div>
      </main>
    </div>
  );
}
