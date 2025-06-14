
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isLogin: boolean;
  isLoading: boolean;
  onSwitchMode: () => void;
}

const FormActions = ({ isLogin, isLoading, onSwitchMode }: FormActionsProps) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchMode}
          disabled={isLoading}
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </Button>
      </div>
    </>
  );
};

export default FormActions;
