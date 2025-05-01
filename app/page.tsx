'use client';

import { useState } from 'react';

type Result = {
  gmcNumberId: string;
  registrantNameId: string;
};

export default function Home() {
  const [gmcNumber, setGmcNumber] = useState('');
  const [registrantName, setRegistrantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setIsVerified(false);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmcNumber, registrantName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);

      // If no registrant name is entered, skip the verification
      if (registrantName) {
        const nameParts = data.registrantNameId
          .toLowerCase()
          .split(/\s+/); // Split the full name into parts (e.g., "Elizabeth Louise EDMONDSON")
        
        // Check if any part of the name entered matches any part of the full name
        const isPartMatch = nameParts.some(part =>
          part.includes(registrantName.toLowerCase()) // Check if the entered name part matches a part of the registrant name
        );

        // Check if the full name entered matches exactly
        const isFullNameMatch = data.registrantNameId
          .toLowerCase()
          .includes(registrantName.toLowerCase()); // Case-insensitive full name match

        setIsVerified(isPartMatch || isFullNameMatch); // Verified if any part or the full name matches
      } else {
        setIsVerified(true); // If no name is entered, just verify the GMC number
      }
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
          <input
            type="text"
            placeholder="Enter Registrant Name (Optional)"
            value={registrantName}
            onChange={(e) => setRegistrantName(e.target.value)}
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
            {/* Display only verification result */}
            {isVerified ? (
              <p className="mt-3 text-green-600 font-semibold">✅ Verified</p>
            ) : (
              <p className="mt-3 text-red-600 font-semibold">❌ Name does not match</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
