'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/?portal=cliente');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o Portal do Cliente...</p>
      </div>
    </div>
  );
}
