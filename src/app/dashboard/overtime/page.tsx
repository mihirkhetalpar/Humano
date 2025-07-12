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
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const overtimeSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    hours: z.coerce.number().min(0.5, "Overtime must be at least 0.5 hours.").max(8, "Overtime cannot exceed 8 hours for a single day."),
})

const overtimeHistory = [
    { id: 'O001', date: '2024-07-25', hours: 2, status: 'Approved' },
    { id: 'O002', date: '2024-07-18', hours: 3, status: 'Approved' },
    { id: 'O003', date: '2024-08-02', hours: 1.5, status: 'Pending' },
];

export default function OvertimePage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof overtimeSchema>>({
        resolver: zodResolver(overtimeSchema),
    });

    function onSubmit(data: z.infer<typeof overtimeSchema>) {
        toast({
          title: "Overtime Submitted",
          description: `Your request for ${data.hours} hours on ${format(data.date, "PPP")} is pending approval.`,
        });
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
                    <CardTitle className="font-headline">Log Overtime</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col mt-2">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("2000-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem className="mt-2">
                                            <FormLabel>Hours</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.5" placeholder="e.g., 2.5" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit">Submit for Approval</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="font-headline">Overtime History</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {overtimeHistory.map((ot) => (
                                <TableRow key={ot.id}>
                                    <TableCell className="font-medium">{ot.date}</TableCell>
                                    <TableCell>{ot.hours}</TableCell>
                                    <TableCell>{getStatusBadge(ot.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
