"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const mockRequests = {
  leaves: [
    { id: 'L003', userName: 'Alice Johnson', type: 'Comp-off', startDate: '2024-08-01', endDate: '2024-08-01' },
    { id: 'L004', userName: 'Bob Williams', type: 'SL', startDate: '2024-08-03', endDate: '2024-08-04' },
  ],
  overtime: [
    { id: 'O003', userName: 'Charlie Brown', date: '2024-08-02', hours: 1.5 },
  ],
  reimbursements: [
    { id: 'R002', userName: 'Diana Prince', date: '2024-07-28', amount: 200, reason: 'Late work on Project X' },
    { id: 'R004', userName: 'Eve Adams', date: '2024-08-01', amount: 180, reason: 'Client meeting ran late' },
  ]
};

export default function AdminPage() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const role = localStorage.getItem('userRole');
        if (role !== 'hr') {
            router.push('/dashboard');
        }
    }, [router]);
    
    if (!isMounted) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in-50">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Admin Approval Center</CardTitle>
                <CardDescription>Review and process employee requests for leaves, overtime, and reimbursements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="leaves" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="leaves">Leaves</TabsTrigger>
                        <TabsTrigger value="overtime">Overtime</TabsTrigger>
                        <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
                    </TabsList>
                    <TabsContent value="leaves" className="mt-4">
                        <Table>
                            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {mockRequests.leaves.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.userName}</TableCell>
                                        <TableCell>{req.type}</TableCell>
                                        <TableCell>{req.startDate} - {req.endDate}</TableCell>
                                        <TableCell className="text-right space-x-2"><Button size="icon" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100/50 hover:text-green-700"><Check className="h-4 w-4" /></Button><Button size="icon" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100/50 hover:text-red-700"><X className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="overtime" className="mt-4">
                        <Table>
                            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Date</TableHead><TableHead>Hours</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {mockRequests.overtime.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.userName}</TableCell>
                                        <TableCell>{req.date}</TableCell>
                                        <TableCell>{req.hours}</TableCell>
                                        <TableCell className="text-right space-x-2"><Button size="icon" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100/50 hover:text-green-700"><Check className="h-4 w-4" /></Button><Button size="icon" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100/50 hover:text-red-700"><X className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="reimbursements" className="mt-4">
                        <Table>
                            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {mockRequests.reimbursements.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.userName}</TableCell>
                                        <TableCell>{req.date}</TableCell>
                                        <TableCell>${req.amount}</TableCell>
                                        <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                        <TableCell className="text-right space-x-2"><Button size="icon" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100/50 hover:text-green-700"><Check className="h-4 w-4" /></Button><Button size="icon" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100/50 hover:text-red-700"><X className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>
    )
}
