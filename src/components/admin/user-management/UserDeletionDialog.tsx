
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, Database, Shield } from 'lucide-react';
import { useAdminUserDeletion } from '@/hooks/useAdminUserDeletion';

interface UserDeletionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onUserDeleted: () => void;
}

const UserDeletionDialog = ({
  isOpen,
  onOpenChange,
  userId,
  userEmail,
  onUserDeleted
}: UserDeletionDialogProps) => {
  const [deleteFromAuth, setDeleteFromAuth] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [step, setStep] = useState<'preview' | 'confirm' | 'deleting'>('preview');
  
  const {
    isLoading,
    deletionPreview,
    getDeletePreview,
    deleteUserComplete,
    clearPreview
  } = useAdminUserDeletion();

  React.useEffect(() => {
    if (isOpen && userId && step === 'preview') {
      getDeletePreview(userId);
    }
  }, [isOpen, userId, step]);

  const handleClose = () => {
    setStep('preview');
    setConfirmDelete(false);
    setDeleteFromAuth(false);
    clearPreview();
    onOpenChange(false);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    setStep('deleting');
    const result = await deleteUserComplete(userId, deleteFromAuth);
    
    if (result?.success) {
      onUserDeleted();
      handleClose();
    } else {
      setStep('confirm');
    }
  };

  const getItemTypeLabel = (type: string): { label: string; icon: React.ReactNode; variant: "default" | "destructive" | "secondary" } => {
    switch (type) {
      case 'customer':
        return { label: 'Customer Record', icon: <Shield className="w-3 h-3" />, variant: 'destructive' };
      case 'orders':
        return { label: 'Orders', icon: <Database className="w-3 h-3" />, variant: 'destructive' };
      case 'order_items':
        return { label: 'Order Items', icon: <Database className="w-3 h-3" />, variant: 'destructive' };
      case 'addresses':
        return { label: 'Addresses', icon: <Database className="w-3 h-3" />, variant: 'secondary' };
      case 'wishlists':
        return { label: 'Wishlists', icon: <Database className="w-3 h-3" />, variant: 'secondary' };
      case 'reviews':
        return { label: 'Product Reviews', icon: <Database className="w-3 h-3" />, variant: 'secondary' };
      case 'profile':
        return { label: 'Profile', icon: <Shield className="w-3 h-3" />, variant: 'destructive' };
      case 'user_roles':
        return { label: 'User Roles', icon: <Shield className="w-3 h-3" />, variant: 'destructive' };
      case 'user_record':
        return { label: 'Admin User Record', icon: <Shield className="w-3 h-3" />, variant: 'destructive' };
      case 'mfa_challenges':
        return { label: 'MFA Challenges', icon: <Database className="w-3 h-3" />, variant: 'secondary' };
      default:
        return { label: type, icon: <Database className="w-3 h-3" />, variant: 'default' };
    }
  };

  if (step === 'preview') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Delete User - Preview
            </DialogTitle>
            <DialogDescription>
              Reviewing what will be deleted for user: <strong>{userEmail}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading deletion preview...</p>
              </div>
            ) : deletionPreview ? (
              <>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    The following data will be permanently deleted. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-medium">Items to be deleted:</h4>
                  {deletionPreview.items_to_delete.length > 0 ? (
                    <div className="grid gap-2">
                      {deletionPreview.items_to_delete.map((item, index) => {
                        const { label, icon, variant } = getItemTypeLabel(item.type);
                        return (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {icon}
                              <span>{label}</span>
                            </div>
                            <Badge variant={variant}>
                              {item.count} {item.count === 1 ? 'item' : 'items'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No associated data found. Only auth user will be affected.</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setStep('confirm')}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Proceed to Delete
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Failed to load deletion preview.</p>
                <Button variant="outline" onClick={handleClose} className="mt-2">
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'confirm') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              This is your final confirmation. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You are about to permanently delete user <strong>{userEmail}</strong> and all associated data.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delete-from-auth"
                  checked={deleteFromAuth}
                  onCheckedChange={(checked) => setDeleteFromAuth(checked === true)}
                />
                <label htmlFor="delete-from-auth" className="text-sm">
                  Also delete from Supabase Authentication
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-delete"
                  checked={confirmDelete}
                  onCheckedChange={(checked) => setConfirmDelete(checked === true)}
                />
                <label htmlFor="confirm-delete" className="text-sm">
                  I understand this action cannot be undone
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back to Preview
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                disabled={!confirmDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete User Permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Deleting step
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deleting User...</DialogTitle>
          <DialogDescription>
            Please wait while we delete the user and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Deleting user data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeletionDialog;
