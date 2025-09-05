'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CloseIcon } from '@/components/icons';
interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(date);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days = [];
    
    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const today = new Date();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = currentDate.toDateString() === date.toDateString();
      
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        fullDate: currentDate
      });
    }

    // Add next month's leading days
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  };

  const handleDateSelect = (selectedDate: Date) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleYearChange = (increment: number) => {
    setViewDate(new Date(viewDate.getFullYear() + increment, viewDate.getMonth(), 1));
  };

  const days = getDaysInMonth(viewDate);

  return (
    <>
      <div className="relative">
        <Input
          value={format(date, 'dd/MM/yyyy')}
          readOnly
          onClick={() => setIsOpen(true)}
          className="border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg cursor-pointer pr-10 h-10 text-sm"
          placeholder="Select date"
        />
        <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <DialogTitle className="text-lg font-semibold text-gray-900">Finalize start date</DialogTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-50 rounded-full p-1 transition-colors duration-200"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select value={months[viewDate.getMonth()]} onValueChange={(value) => {
                  const monthIndex = months.indexOf(value);
                  setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
                }}>
                  <SelectTrigger className="w-32 border-gray-200 rounded-lg h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={viewDate.getFullYear().toString()} onValueChange={(value) => {
                  setViewDate(new Date(parseInt(value), viewDate.getMonth(), 1));
                }}>
                  <SelectTrigger className="w-24 border-gray-200 rounded-lg h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map((day) => (
                  <div key={day} className="py-2 text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day.fullDate && handleDateSelect(day.fullDate)}
                    disabled={!day.isCurrentMonth}
                    className={`
                      w-10 h-10 text-sm rounded-lg transition-all duration-200 hover:bg-violet-50
                      ${!day.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-violet-600'}
                      ${day.isSelected ? 'bg-violet-600 text-white hover:bg-violet-700' : ''}
                      ${day.isToday && !day.isSelected ? 'bg-violet-100 text-violet-600 font-semibold' : ''}
                    `}
                  >
                    {day.date}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-10 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDateChange(viewDate);
                  setIsOpen(false);
                }}
                className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold"
              >
                Select
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}