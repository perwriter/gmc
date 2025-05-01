'use client';

import { useState } from 'react';

type Result = {
  gmcNumberId: string;
  registrantNameId: string;
};

export default function Home() {
  const [gmcNumber, setGmcNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmcNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full bg-gray-100 p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">GMC Number Verifier</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter GMC Number"
            value={gmcNumber}
            onChange={(e) => setGmcNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? 'Verifying...' : 'Verify GMC'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600">✅ GMC Number</p>
            <p className="font-semibold text-lg">{result.gmcNumberId}</p>

            <p className="text-sm text-gray-600 mt-3">👤 Registrant Name</p>
            <p className="font-semibold text-lg">{result.registrantNameId}</p>
          </div>
        )}
      </div>
    </main>
  );
}
