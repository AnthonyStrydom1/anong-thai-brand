
import React from 'react';

interface MfaCodeInputProps {
  code: string[];
  isVerifying: boolean;
  onCodeChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const MfaCodeInput = ({ code, isVerifying, onCodeChange, onKeyDown }: MfaCodeInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Enter verification code
      </label>
      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => onCodeChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={isVerifying}
            autoFocus={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MfaCodeInput;
