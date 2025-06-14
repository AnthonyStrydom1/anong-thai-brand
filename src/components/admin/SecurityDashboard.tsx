
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Users, Activity } from 'lucide-react';
import SecurityAuditLogs from './SecurityAuditLogs';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

const SecurityDashboard = () => {
  const { isAdmin } = useUserRoles();
  const { logs, getSecurityLogs } = useSecurityAudit();
  const [securityMetrics, setSecurityMetrics] = useState({
    totalEvents: 0,
    failedEvents: 0,
    recentActivity: 0,
    adminActions: 0
  });

  useEffect(() => {
    if (isAdmin()) {
      loadSecurityMetrics();
    }
  }, []);

  const loadSecurityMetrics = async () => {
    try {
      await getSecurityLogs(1000); // Get more logs for metrics
    } catch (error) {
      console.error('Failed to load security metrics:', error);
    }
  };

  useEffect(() => {
    if (logs.length > 0) {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentLogs = logs.filter(log => new Date(log.created_at) > last24Hours);
      const failedLogs = logs.filter(log => !log.success);
      const adminActionLogs = logs.filter(log => 
        ['update', 'create', 'delete'].includes(log.action.toLowerCase())
      );

      setSecurityMetrics({
        totalEvents: logs.length,
        failedEvents: failedLogs.length,
        recentActivity: recentLogs.length,
        adminActions: adminActionLogs.length
      });
    }
  }, [logs]);

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access the security dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">All logged events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityMetrics.failedEvents}</div>
            <p className="text-xs text-muted-foreground">Security failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.adminActions}</div>
            <p className="text-xs text-muted-foreground">Administrative operations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <SecurityAuditLogs />
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Policies</CardTitle>
              <CardDescription>
                Row-Level Security policies currently active in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin Security Audit Policy</h4>
                    <p className="text-sm text-gray-600">Only admins can view security logs</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">System Logging Policy</h4>
                    <p className="text-sm text-gray-600">System can insert security events</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Products Access Policy</h4>
                    <p className="text-sm text-gray-600">Everyone can view active products</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">User Profile Policy</h4>
                    <p className="text-sm text-gray-600">Users can only access their own profiles</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Customer Data Policy</h4>
                    <p className="text-sm text-gray-600">Users can only access their own customer data</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Security Monitoring</CardTitle>
              <CardDescription>
                Live security monitoring and alerts for admin operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Security Monitoring Active</h4>
                    <p className="text-sm text-green-600">All admin operations are being logged and monitored</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Stock Management Security</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Stock updates logged</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Inventory movements tracked</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Admin actions audited</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Order Management Security</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Status changes logged</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Payment updates tracked</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Order views monitored</span>
                    </div>
                  </div>
                </div>

                {securityMetrics.failedEvents > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-800">Security Alert</h4>
                      <p className="text-sm text-red-600">
                        {securityMetrics.failedEvents} failed security events detected. Review audit logs.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
