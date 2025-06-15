
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw } from 'lucide-react';

interface UserSearchSectionProps {
  searchEmail: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UserSearchSection = ({ 
  searchEmail, 
  onSearchChange, 
  onRefresh, 
  isLoading 
}: UserSearchSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Users
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search-email">Search by Name or Email</Label>
            <Input
              id="search-email"
              type="text"
              placeholder="Enter name or email address..."
              value={searchEmail}
              onChange={(e) => onSearchChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSearchSection;
