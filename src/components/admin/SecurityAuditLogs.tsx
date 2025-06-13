
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { format } from 'date-fns';

const SecurityAuditLogs = () => {
  const { logs, isLoading, error, getSecurityLogs } = useSecurityAudit();

  useEffect(() => {
    getSecurityLogs();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view':
      case 'select':
        return <Eye className="h-4 w-4" />;
      case 'create':
      case 'insert':
        return <Plus className="h-4 w-4" />;
      case 'update':
      case 'edit':
        return <Edit className="h-4 w-4" />;
      case 'delete':
      case 'remove':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view':
      case 'select':
        return 'bg-blue-100 text-blue-800';
      case 'create':
      case 'insert':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'edit':
        return 'bg-yellow-100 text-yellow-800';
      case 'delete':
      case 'remove':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading security logs...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">Security audit logging is being set up</p>
            <p className="text-sm text-gray-500">
              Once the database migration is complete, security events will be tracked here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Logs
        </CardTitle>
        <CardDescription>
          Track all administrative actions and security events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">No security logs found</p>
              <p className="text-sm text-gray-500">
                Security events will appear here once the audit system is active.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.resource_type}
                    </Badge>
                    <Badge className={`text-xs ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900">
                    {log.resource_id ? `Resource ID: ${log.resource_id}` : 'System action'}
                  </p>
                  {log.details && (
                    <p className="text-xs text-gray-600 mt-1">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLogs;
