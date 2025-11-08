import React from 'react';
import { FingerprintIcon } from 'lucide-react';
import corbado from '../lib/corbadoClient';
import { toast } from 'sonner';

interface BiometricAuthProps {
  username: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ username, onSuccess, onError }) => {
  const handleBiometricAuth = async () => {
    try {
      const result = await corbado.login({
        username: username,
        method: 'passkey'
      });

      if (result.success) {
        onSuccess();
      } else {
        onError('Biometric authentication failed');
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      onError('Biometric authentication error');
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      <button
        type="button"
        onClick={handleBiometricAuth}
        className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      >
        <FingerprintIcon className="h-12 w-12" />
      </button>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Tap to authenticate with biometrics
      </p>
    </div>
  );
};

export default BiometricAuth;