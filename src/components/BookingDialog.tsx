import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { INSTRUCTORS } from '../constants';
import { Lesson, Instructor } from '../types';

interface BookingDialogProps {
  onBook: (lesson: Lesson) => void;
  instructors: Instructor[];
}

export function BookingDialog({ onBook, instructors }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [instructorId, setInstructorId] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'individual' | 'group' | 'badge-prep'>('individual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !instructorId || !time) return;

    const newLesson: Lesson = {
      id: Math.random().toString(36).substr(2, 9),
      instructorId,
      riderId: 'user-1',
      riderName: 'Malgorzata Kielek',
      date: format(date, 'yyyy-MM-dd'),
      time,
      duration: 60,
      type,
      status: 'pending',
    };

    onBook(newLesson);
    setOpen(false);
    // Reset form
    setDate(undefined);
    setInstructorId('');
    setTime('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 rounded-full px-6" />}>
        <Plus className="h-4 w-4" /> Zarezerwuj lekcję
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nowa rezerwacja</DialogTitle>
          <DialogDescription>
            Wybierz termin i instruktora, aby zapisać się na lekcję.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Instruktor</Label>
            <Select value={instructorId} onValueChange={setInstructorId} required>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz instruktora" />
              </SelectTrigger>
              <SelectContent>
                {instructors.filter(inst => !date || inst.workingDays.includes(date.getDay()) || inst.flexibleDays?.includes(date.getDay())).map(inst => (
                  <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: pl }) : <span>Wybierz datę</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={pl}
                  disabled={(d) => {
                    if (!instructorId) return false;
                    const inst = instructors.find(i => i.id === instructorId);
                    return inst ? (!inst.workingDays.includes(d.getDay()) && !inst.flexibleDays?.includes(d.getDay())) : false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Godzina</Label>
              <Select value={time} onValueChange={setTime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Godzina" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => `${i + 8}:00`).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Typ zajęć</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Indywidualna</SelectItem>
                  <SelectItem value="group">Grupowa</SelectItem>
                  <SelectItem value="badge-prep">Przygotowanie do odznaki</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">Potwierdź rezerwację</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
