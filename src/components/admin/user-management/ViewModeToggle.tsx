
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: 'admin' | 'all';
  onViewModeChange: (mode: 'admin' | 'all') => void;
}

const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>View Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'admin' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('admin')}
          >
            Admin Users Only
          </Button>
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('all')}
          >
            All Users
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewModeToggle;
