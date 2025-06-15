
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';
import type { OrphanedUser } from './types';

interface OrphanedUserCardProps {
  user: OrphanedUser;
  isLinking: boolean;
  onLinkUser: (userId: string, createProfile: boolean, createCustomer: boolean, createAdminRecord: boolean) => void;
}

const OrphanedUserCard = ({ user, isLinking, onLinkUser }: OrphanedUserCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{user.email}</CardTitle>
            <p className="text-sm text-gray-500">
              Created: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={user.has_profile ? "default" : "destructive"}>
              Profile: {user.has_profile ? "✓" : "✗"}
            </Badge>
            <Badge variant={user.has_customer ? "default" : "destructive"}>
              Customer: {user.has_customer ? "✓" : "✗"}
            </Badge>
            <Badge variant={user.user_roles.length > 0 ? "default" : "destructive"}>
              Roles: {user.user_roles.length > 0 ? user.user_roles.join(", ") : "None"}
            </Badge>
            <Badge variant={user.has_user_record ? "default" : "secondary"}>
              Admin Record: {user.has_user_record ? "✓" : "✗"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p><strong>Name:</strong> {user.raw_user_meta_data?.first_name || 'N/A'} {user.raw_user_meta_data?.last_name || 'N/A'}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onLinkUser(user.id, true, true, false)}
              disabled={isLinking}
              size="sm"
            >
              {isLinking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Linking...
                </>
              ) : (
                'Link as Regular User'
              )}
            </Button>
            <Button
              onClick={() => onLinkUser(user.id, true, true, true)}
              disabled={isLinking}
              variant="outline"
              size="sm"
            >
              Link as Admin User
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrphanedUserCard;
