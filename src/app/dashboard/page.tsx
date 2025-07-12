"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck, CalendarOff, CircleDollarSign, BarChart3, Users } from "lucide-react"

// Mock data, in a real app this would be fetched from Firestore
const employeeData = {
  attendanceSummary: { present: 18, absent: 2, halfDay: 1 },
  leaveBalance: { cl: 5, sl: 8, compOff: 2 },
  recentReimbursements: [
    { id: 'R001', date: '2023-10-25', amount: 150, status: 'Approved' },
    { id: 'R002', date: '2023-10-28', amount: 200, status: 'Pending' },
    { id: 'R003', date: '2023-10-15', amount: 120, status: 'Rejected' },
  ]
};

const hrData = {
  employeeCount: 75,
  pendingApprovals: { leaves: 5, reimbursements: 3, overtime: 2 },
  onLeaveToday: 8,
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName'));
  }, []);

  if (!isMounted) return null; // or a loading skeleton

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const EmployeeDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeData.attendanceSummary.present} Days Present</div>
            <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <CalendarOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeData.leaveBalance.cl + employeeData.leaveBalance.sl + employeeData.leaveBalance.compOff} Total Leaves</div>
            <p className="text-xs text-muted-foreground">CL: {employeeData.leaveBalance.cl}, SL: {employeeData.leaveBalance.sl}, Comp-off: {employeeData.leaveBalance.compOff}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reimbursements</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${employeeData.recentReimbursements.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.amount, 0)}</div>
            <p className="text-xs text-muted-foreground">Approved this month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reimbursement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.recentReimbursements.map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>${req.amount}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const HRDashboard = () => (
     <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrData.employeeCount}</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrData.pendingApprovals.leaves + hrData.pendingApprovals.reimbursements + hrData.pendingApprovals.overtime}</div>
             <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <CalendarOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrData.onLeaveToday}</div>
            <p className="text-xs text-muted-foreground">employees are on leave</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Pending Approvals Breakdown</CardTitle>
          <CardDescription>A summary of requests awaiting action.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-muted-foreground">Leaves</h3>
                  <p className="text-4xl font-bold">{hrData.pendingApprovals.leaves}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-muted-foreground">Reimbursements</h3>
                  <p className="text-4xl font-bold">{hrData.pendingApprovals.reimbursements}</p>
              </div>
               <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-muted-foreground">Overtime</h3>
                  <p className="text-4xl font-bold">{hrData.pendingApprovals.overtime}</p>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="animate-in fade-in-50">
      <h1 className="text-3xl font-bold mb-4 font-headline">Welcome, {userName || 'User'}!</h1>
      {userRole === 'hr' ? <HRDashboard /> : <EmployeeDashboard />}
    </div>
  )
}
