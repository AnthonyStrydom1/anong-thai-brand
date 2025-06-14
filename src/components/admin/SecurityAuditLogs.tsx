
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Edit, Trash2, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
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
      case 'login':
      case 'logout':
      case 'authentication':
        return <Shield className="h-4 w-4" />;
      case 'rate_limit_exceeded':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) {
      return 'bg-red-100 text-red-800 border-red-200';
    }

    switch (action.toLowerCase()) {
      case 'view':
      case 'select':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'create':
      case 'insert':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
      case 'edit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delete':
      case 'remove':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'login':
      case 'logout':
      case 'authentication':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rate_limit_exceeded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading security logs...</span>
          </div>
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
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-2">Error loading security logs</p>
            <p className="text-sm text-gray-500">{error}</p>
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
          <Badge variant="outline" className="ml-2">
            {logs.length} events
          </Badge>
        </CardTitle>
        <CardDescription>
          Track all administrative actions and security events across the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-gray-600 mb-2">No security events recorded</p>
              <p className="text-sm text-gray-500">
                Security events will appear here as they occur.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full border ${getActionColor(log.action, log.success)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {log.resource_type}
                    </Badge>
                    <Badge className={`text-xs border ${getActionColor(log.action, log.success)}`}>
                      {log.action}
                    </Badge>
                    {!log.success && (
                      <Badge variant="destructive" className="text-xs">
                        FAILED
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 font-medium">
                    {log.resource_id ? `Resource: ${log.resource_id}` : 'System action'}
                  </p>
                  {log.details && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}</span>
                    {log.user_id && (
                      <span>User: {log.user_id.substring(0, 8)}...</span>
                    )}
                    {log.ip_address && (
                      <span>IP: {log.ip_address}</span>
                    )}
                  </div>
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
