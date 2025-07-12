"use client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { format } from "date-fns"

const attendanceData = [
  { id: 'A001', date: '2024-07-22', inTime: '09:02', outTime: '18:05' },
  { id: 'A002', date: '2024-07-21', inTime: '09:00', outTime: '18:00' },
  { id: 'A003', date: '2024-07-20', inTime: '08:55', outTime: '18:10' },
];

export default function AttendancePage() {
  const [inTime, setInTime] = useState<string | null>(null)
  const [outTime, setOutTime] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [])

  const handleClockIn = () => {
    setInTime(format(new Date(), 'HH:mm:ss'));
    setOutTime(null);
  }

  const handleClockOut = () => {
    setOutTime(format(new Date(), 'HH:mm:ss'));
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Today's Attendance ({format(currentTime, 'PPP')})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-around p-6 border rounded-lg text-center">
            <div>
              <p className="text-sm text-muted-foreground">IN TIME</p>
              <p className="text-3xl font-bold text-primary">{inTime || '--:--:--'}</p>
            </div>
            <div className="text-5xl font-bold my-4 sm:my-0">{format(currentTime, 'HH:mm:ss')}</div>
            <div>
              <p className="text-sm text-muted-foreground">OUT TIME</p>
              <p className="text-3xl font-bold text-primary">{outTime || '--:--:--'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <Button onClick={handleClockIn} disabled={!!inTime && !outTime} className="w-full">Clock In</Button>
          <Button onClick={handleClockOut} disabled={!inTime || !!outTime} variant="outline" className="w-full">Clock Out</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>{record.inTime}</TableCell>
                  <TableCell>{record.outTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
