"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const leaveSchema = z.object({
  leaveType: z.string({ required_error: "Please select a leave type." }),
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date({ required_error: "An end date is required." }),
  }),
  reason: z.string().min(10, { message: "Reason must be at least 10 characters." }).max(160, { message: "Reason must not be longer than 160 characters." }),
})

const leaveHistory = [
    { id: 'L001', type: 'SL', startDate: '2024-07-10', endDate: '2024-07-11', status: 'Approved' },
    { id: 'L002', type: 'CL', startDate: '2024-06-22', endDate: '2024-06-22', status: 'Approved' },
    { id: 'L003', type: 'Comp-off', startDate: '2024-08-01', endDate: '2024-08-01', status: 'Pending' },
];

export default function LeavesPage() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof leaveSchema>>({
        resolver: zodResolver(leaveSchema),
        defaultValues: {
            reason: "",
        }
    })

    function onSubmit(data: z.infer<typeof leaveSchema>) {
        toast({
          title: "Leave Request Submitted",
          description: `Your ${data.leaveType} request from ${format(data.dateRange.from, "PPP")} to ${format(data.dateRange.to, "PPP")} is pending approval.`,
        })
        form.reset();
    }
    
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

    return (
        <div className="space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Apply for Leave</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="leaveType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Leave Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select leave type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                                                    <SelectItem value="SL">Sick Leave (SL)</SelectItem>
                                                    <SelectItem value="Comp-off">Compensatory Off</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateRange"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col mt-2">
                                            <FormLabel>Leave Dates</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value?.from && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value?.from ? (
                                                                field.value.to ? (
                                                                    <>
                                                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                                                        {format(field.value.to, "LLL dd, y")}
                                                                    </>
                                                                ) : (
                                                                    format(field.value.from, "LLL dd, y")
                                                                )
                                                            ) : (
                                                                <span>Pick a date range</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={field.value?.from}
                                                        selected={{from: field.value?.from, to: field.value?.to}}
                                                        onSelect={field.onChange}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us a little bit about your reason for leave"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit Request</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="font-headline">Leave History</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaveHistory.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.type}</TableCell>
                                    <TableCell>{leave.startDate}</TableCell>
                                    <TableCell>{leave.endDate}</TableCell>
                                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
