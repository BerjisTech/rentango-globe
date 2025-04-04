
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";

const AdminReports = () => {
  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>View detailed reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reports and analytics content goes here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
