"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { automaticReimbursementApproval, AutomaticReimbursementApprovalOutput } from '@/ai/flows/reimbursement-approver'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Info, Loader2 } from "lucide-react"

const reimbursementSchema = z.object({
  logoutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:mm."),
  transportMode: z.string().min(2, "Transport mode is required."),
  reason: z.string().min(10, "Reason must be at least 10 characters long."),
  amount: z.coerce.number().min(1, "Amount must be greater than 0."),
})

// Mock Data
const pastReimbursements = [
    { id: 'R001', date: '2024-07-25', amount: 150, status: 'Approved', reasoning: 'Logout time after 11 PM.' },
    { id: 'R002', date: '2024-07-20', amount: 200, status: 'Rejected', reasoning: 'Logout time was before 11 PM.' },
    { id: 'R003', date: '2024-07-15', amount: 120, status: 'Approved', reasoning: 'Logout time after 11 PM and valid reason provided.' },
]

export default function ReimbursementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AutomaticReimbursementApprovalOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof reimbursementSchema>>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      logoutTime: "",
      transportMode: "",
      reason: "",
      amount: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof reimbursementSchema>) {
    setIsLoading(true);
    setAiResult(null);
    setError(null);
    try {
        const result = await automaticReimbursementApproval(values);
        setAiResult(result);
        form.reset();
    } catch (e) {
        setError("An unexpected error occurred while processing the request. Please try again.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">New Reimbursement Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="logoutTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logout Time (24h format)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 23:30" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is used to verify eligibility for transport reimbursement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="transportMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode of Transport</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Taxi, Auto-rickshaw" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for late logout</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Project deadline, Critical issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Approval
              </Button>
            </form>
          </Form>

          {aiResult && (
            <Alert className={`mt-6 ${aiResult.isApproved ? 'border-green-500' : 'border-red-500'}`}>
              {aiResult.isApproved ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <AlertTitle className={`${aiResult.isApproved ? 'text-green-700' : 'text-red-700'}`}>
                Reimbursement {aiResult.isApproved ? 'Approved' : 'Rejected'}
              </AlertTitle>
              <AlertDescription className="prose-sm">
                <strong>AI Reasoning:</strong> {aiResult.reasoning}
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Reimbursement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reasoning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastReimbursements.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.date}</TableCell>
                  <TableCell>${req.amount}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{req.reasoning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
