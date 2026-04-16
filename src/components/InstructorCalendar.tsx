import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { INSTRUCTORS } from '../constants';
import { Lesson, Instructor } from '../types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { BookingDialog } from './BookingDialog';

interface InstructorCalendarProps {
  lessons: Lesson[];
  instructors: Instructor[];
  onBook: (lesson: Lesson) => void;
}

export function InstructorCalendar({ lessons, instructors, onBook }: InstructorCalendarProps) {
  const [selectedInstructor, setSelectedInstructor] = useState(instructors[0].id);
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl">Kalendarze Instruktorów</h2>
          <p className="text-muted-foreground">Wybierz instruktora, aby zobaczyć jego dostępność i zarezerwować lekcję.</p>
        </div>
        <BookingDialog onBook={onBook} instructors={instructors} />
      </div>

      <Tabs value={selectedInstructor} onValueChange={setSelectedInstructor} className="w-full">
        <TabsList className="flex flex-wrap w-full bg-white/50 border border-border h-auto p-1">
          {instructors.map(inst => (
            <TabsTrigger key={inst.id} value={inst.id} className="gap-2 flex-1 min-w-[120px]">
              <span className="hidden md:inline">{inst.name}</span>
              <span className="md:hidden">{inst.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {instructors.map(inst => (
          <TabsContent key={inst.id} value={inst.id} className="mt-6">
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-primary text-white flex flex-row items-center gap-4">
                <img src={inst.avatar} alt={inst.name} className="h-12 w-12 rounded-full bg-white/20" />
                <div>
                  <CardTitle>{inst.name}</CardTitle>
                  <p className="text-sm opacity-80">{inst.specialization}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full overflow-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 border-b border-border bg-muted/50">
                      <div className="p-4 border-r border-border font-medium text-center">Czas</div>
                      {weekDays.map(day => (
                        <div key={day.toString()} className="p-4 border-r border-border text-center">
                          <p className="text-xs uppercase text-muted-foreground">{format(day, 'EEE', { locale: pl })}</p>
                          <p className="font-bold">{format(day, 'd MMM', { locale: pl })}</p>
                        </div>
                      ))}
                    </div>

                    {timeSlots.map(time => (
                      <div key={time} className="grid grid-cols-8 border-b border-border group">
                        <div className="p-4 border-r border-border text-center text-sm text-muted-foreground bg-muted/20">
                          {time}
                        </div>
                        {weekDays.map(day => {
                          const isWorkingDay = inst.workingDays.includes(day.getDay());
                          const isFlexibleDay = inst.flexibleDays?.includes(day.getDay());
                          const lesson = lessons.find(l => 
                            l.instructorId === inst.id && 
                            l.time === time && 
                            isSameDay(new Date(l.date), day)
                          );

                          const isMyLesson = lesson?.riderId === 'user-1';

                          return (
                            <div key={day.toString()} className={`p-2 border-r border-border min-h-[80px] relative transition-colors ${isWorkingDay || isFlexibleDay ? 'group-hover:bg-primary/5' : 'bg-muted/30'}`}>
                              {lesson ? (
                                <div className={`h-full p-2 rounded-lg text-xs border ${
                                  !isMyLesson ? 'bg-muted/50 border-border text-muted-foreground' :
                                  lesson.status === 'pending' ? 'bg-accent/10 border-accent/20 text-accent' :
                                  lesson.status === 'scheduled' ? 'bg-primary/10 border-primary/20 text-primary' : 
                                  'bg-muted border-border text-muted-foreground'
                                }`}>
                                  <p className="font-bold">{isMyLesson ? lesson.riderName : 'Zajęte'}</p>
                                  <p className="opacity-80">
                                    {isMyLesson ? (lesson.status === 'pending' ? 'Oczekuje' : 'Potwierdzona') : 'Termin zajęty'}
                                  </p>
                                </div>
                              ) : isWorkingDay ? (
                                <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">Wolne</Badge>
                                </div>
                              ) : isFlexibleDay ? (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Badge variant="secondary" className="text-[10px] cursor-pointer hover:bg-primary hover:text-white">Zapisy indyw.</Badge>
                                </div>
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-[10px] text-muted-foreground uppercase font-medium">Brak zajęć</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
