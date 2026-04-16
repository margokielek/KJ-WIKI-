import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Lesson, Instructor, NewsItem } from '../types';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Check, X, Clock, User, Calendar, ShieldCheck, Image as ImageIcon, Save, Edit2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

function ImageUpload({ onUpload, currentImage, label, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Proszę wybrać plik graficzny');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <div className={`
        border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center p-4 text-center
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'}
      `}>
        {currentImage ? (
          <div className="relative w-full aspect-video md:aspect-square flex items-center justify-center overflow-hidden rounded-lg">
            <img src={currentImage} alt="Preview" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="text-white h-8 w-8" />
            </div>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs font-medium">{label || 'Przeciągnij i upuść zdjęcie'}</p>
            <p className="text-[10px] text-muted-foreground mt-1">lub kliknij aby wybrać</p>
          </>
        )}
      </div>
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        onChange={onFileChange}
        accept="image/*"
      />
    </div>
  );
}

interface AdminInterfaceProps {
  lessons: Lesson[];
  instructors: Instructor[];
  news: NewsItem[];
  logoUrl: string;
  onUpdateLessonStatus: (lessonId: string, status: 'scheduled' | 'cancelled') => void;
  onUpdateLesson: (lesson: Lesson) => void;
  onUpdateLogo: (url: string) => void;
  onUpdateInstructor: (inst: Instructor) => void;
  onUpdateNews: (news: NewsItem) => void;
}

export function AdminInterface({ 
  lessons, 
  instructors, 
  news,
  logoUrl,
  onUpdateLessonStatus,
  onUpdateLesson,
  onUpdateLogo,
  onUpdateInstructor,
  onUpdateNews
}: AdminInterfaceProps) {
  const [activeAdminTab, setActiveAdminTab] = useState('bookings');
  const [editingLogo, setEditingLogo] = useState(logoUrl);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('all');
  const [reschedulingLesson, setReschedulingLesson] = useState<Lesson | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  const filteredLessons = selectedTrainerId === 'all' 
    ? lessons 
    : lessons.filter(l => l.instructorId === selectedTrainerId);

  const pendingLessons = filteredLessons.filter(l => l.status === 'pending');
  const upcomingLessons = filteredLessons.filter(l => l.status === 'scheduled');

  const handleApprove = (lessonId: string) => {
    onUpdateLessonStatus(lessonId, 'scheduled');
    toast.success('Lekcja została zatwierdzona');
  };

  const handleReject = (lessonId: string) => {
    onUpdateLessonStatus(lessonId, 'cancelled');
    toast.error('Lekcja została odrzucona');
  };

  const handleReschedule = () => {
    if (!reschedulingLesson || !newDate || !newTime) return;
    
    onUpdateLesson({
      ...reschedulingLesson,
      date: newDate,
      time: newTime,
      status: 'pending' // Set back to pending so rider has to confirm? Or just scheduled.
      // User request says "send information about change", usually implies a proposal.
      // Let's keep it as scheduled but with a note or just update it.
    });
    
    setReschedulingLesson(null);
    setNewDate('');
    setNewTime('');
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" /> Panel Admina
          </h2>
          <p className="text-muted-foreground">Zarządzaj rezerwacjami i klubem.</p>
        </div>
        
        <div className="w-full md:w-64 space-y-1">
          <Label className="text-[10px] uppercase tracking-wider opacity-60">Zalogowany jako:</Label>
          <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
            <SelectTrigger className="bg-white border-primary/20">
              <SelectValue placeholder="Wybierz trenera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszyscy Trenerzy (SuperAdmin)</SelectItem>
              {instructors.map(inst => (
                <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="bookings" className="gap-2">
            <Calendar className="h-4 w-4" /> Rezerwacje
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Media i Grafika
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Pending Requests */}
            <Card className="border-none shadow-lg border-l-4 border-accent">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" /> Oczekujące prośby
                  </CardTitle>
                  <Badge variant="secondary" className="bg-accent text-black">
                    {pendingLessons.length}
                  </Badge>
                </div>
                <CardDescription>Lekcje wymagające Twojego potwierdzenia.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-auto max-h-[400px]">
                  <div className="space-y-4">
                    {pendingLessons.length > 0 ? (
                      pendingLessons.map(lesson => (
                        <div key={lesson.id} className="p-4 bg-muted/50 rounded-xl border border-border/50 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-full shadow-sm">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold">{lesson.riderName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {instructors.find(i => i.id === lesson.instructorId)?.name}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-white text-[10px]">
                              {lesson.type === 'individual' ? 'Indywidualna' : 'Grupowa'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground bg-white/50 p-2 rounded-lg">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(lesson.date), 'd MMM', { locale: pl })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.time}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-primary hover:bg-primary/90 gap-1"
                              onClick={() => handleApprove(lesson.id)}
                            >
                              <Check className="h-4 w-4" /> Zatwierdź
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-destructive text-destructive hover:bg-destructive/10 gap-1"
                              onClick={() => handleReject(lesson.id)}
                            >
                              <X className="h-4 w-4" /> Odrzuć
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-muted-foreground italic">Brak oczekujących próśb.</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Upcoming Lessons Overview */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Nadchodzące lekcje
                </CardTitle>
                <CardDescription>Podgląd wszystkich zatwierdzonych terminów.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium w-12">{lesson.time}</span>
                        <div>
                          <p className="font-semibold">{lesson.riderName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {instructors.find(i => i.id === lesson.instructorId)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{format(new Date(lesson.date), 'd.MM')}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] gap-1 hover:bg-primary/10"
                          onClick={() => {
                            setReschedulingLesson(lesson);
                            setNewDate(lesson.date);
                            setNewTime(lesson.time);
                          }}
                        >
                          <Clock className="h-3 w-3" /> Przełóż
                        </Button>
                      </div>
                    </div>
                  ))}
                  {upcomingLessons.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground text-sm italic">Brak zaplanowanych lekcji.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {/* Logo Management */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Logo Klubu
              </CardTitle>
              <CardDescription>Zmień główne logo wyświetlane w nagłówku.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="bg-black p-4 rounded-xl shadow-md flex items-center justify-center">
                  <ImageUpload 
                    currentImage={editingLogo} 
                    onUpload={(url) => {
                      setEditingLogo(url);
                      onUpdateLogo(url);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">URL Logotypu (opcjonalnie)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="logo-url" 
                        value={editingLogo} 
                        onChange={(e) => setEditingLogo(e.target.value)}
                        placeholder="https://..."
                      />
                      <Button onClick={() => onUpdateLogo(editingLogo)} size="icon">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Możesz przeciągnąć plik graficzny bezpośrednio na podgląd logotypu powyżej.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Avatars */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Zdjęcia Instruktorów
              </CardTitle>
              <CardDescription>Zarządzaj awatarami kadry trenerskiej.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map(inst => (
                  <div key={inst.id} className="p-4 bg-muted/20 rounded-xl border border-border/50 space-y-3">
                    <div className="flex justify-center">
                      <ImageUpload 
                        currentImage={inst.avatar} 
                        onUpload={(url) => onUpdateInstructor({ ...inst, avatar: url })}
                        className="w-24 h-24"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">{inst.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Kliknij zdjęcie aby zmienić</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News Images */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Grafiki w Aktualnościach
              </CardTitle>
              <CardDescription>Edytuj zdjęcia przypisane do wpisów.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {news.map(item => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-xl border border-border/50 items-center">
                      <div className="md:col-span-1">
                        <ImageUpload 
                          currentImage={item.image} 
                          onUpload={(url) => onUpdateNews({ ...item, image: url })}
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground">{item.date}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        </div>
                        <Input 
                          className="h-8 text-xs" 
                          value={item.image} 
                          onChange={(e) => onUpdateNews({ ...item, image: e.target.value })}
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={!!reschedulingLesson} onOpenChange={(open) => !open && setReschedulingLesson(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Zmień termin lekcji</DialogTitle>
            <DialogDescription>
              Zaproponuj nowy termin dla {reschedulingLesson?.riderName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nowa Data</Label>
              <Input 
                type="date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Nowa Godzina</Label>
              <Input 
                type="time" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReschedulingLesson(null)}>Anuluj</Button>
            <Button onClick={handleReschedule}>Wyślij informację o zmianie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
