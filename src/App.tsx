import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Calendar as CalendarIcon, MessageSquare, Newspaper, Trophy, User, Bell, Plus, ShieldCheck, Phone } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { INSTRUCTORS, INITIAL_NEWS, LOGO_URL } from './constants';
import { Lesson, NewsItem, RiderProgress, Message, Instructor } from './types';
import { format, addDays, startOfToday } from 'date-fns';
import { pl } from 'date-fns/locale';

// Components
import { InstructorCalendar } from './components/InstructorCalendar';
import { NewsSection } from './components/NewsSection';
import { ProgressTracker } from './components/ProgressTracker';
import { Messaging } from './components/Messaging';
import { BookingDialog } from './components/BookingDialog';
import { AdminInterface } from './components/AdminInterface';
import { BadgesInfo } from './components/BadgesInfo';
import { isFirebaseEnabled } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [instructors, setInstructors] = useState<Instructor[]>(INSTRUCTORS);
  const [logoUrl, setLogoUrl] = useState(LOGO_URL);
  const [userProgress, setUserProgress] = useState<RiderProgress | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock initial data
  useEffect(() => {
    if (!isFirebaseEnabled) {
      console.info("Firebase not configured. Using localStorage fallback.");
    }
    
    const savedLessons = localStorage.getItem('wiki_lessons');
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    } else {
      const initialLessons: Lesson[] = [
        {
          id: '1',
          instructorId: 'inst-4',
          riderId: 'user-1',
          riderName: 'Malgorzata Kielek',
          date: format(addDays(startOfToday(), 1), 'yyyy-MM-dd'),
          time: '10:00',
          duration: 60,
          type: 'individual',
          status: 'scheduled',
        }
      ];
      setLessons(initialLessons);
      localStorage.setItem('wiki_lessons', JSON.stringify(initialLessons));
    }

    const initialProgress: RiderProgress = {
      riderId: 'user-1',
      skills: [
        { name: 'Stęp', level: 5, lastUpdated: '2024-03-20' },
        { name: 'Kłus', level: 4, lastUpdated: '2024-03-25' },
        { name: 'Galop', level: 2, lastUpdated: '2024-04-01' },
        { name: 'Skoki', level: 1, lastUpdated: '2024-04-05' },
      ],
      badges: [
        { name: 'Jeżdżę Konno', date: '2023-09-15', status: 'earned' },
        { name: 'Brązowa Odznaka', date: '2024-06-20', status: 'preparing' },
      ],
    };
    setUserProgress(initialProgress);
  }, []);

  const handleAddLesson = (newLesson: Lesson) => {
    const updated = [...lessons, newLesson];
    setLessons(updated);
    localStorage.setItem('wiki_lessons', JSON.stringify(updated));
    
    toast.success('Wysłano prośbę o rezerwację!', {
      description: `Oczekuj na potwierdzenie od ${instructors.find(i => i.id === newLesson.instructorId)?.name} na ${newLesson.date} o ${newLesson.time}`,
      action: {
        label: "Powiadomienie",
        onClick: () => console.log("Notification clicked"),
      },
    });
    
    // Simulate push notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Klub Jeździecki Wiki', {
        body: `Nowa prośba o rezerwację: ${newLesson.date} o ${newLesson.time}`,
        icon: logoUrl
      });
    }
  };

  const handleUpdateLessonStatus = (lessonId: string, status: 'scheduled' | 'cancelled') => {
    const updated = lessons.map(l => l.id === lessonId ? { ...l, status } : l);
    setLessons(updated);
    localStorage.setItem('wiki_lessons', JSON.stringify(updated));
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    const updated = lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l);
    setLessons(updated);
    localStorage.setItem('wiki_lessons', JSON.stringify(updated));
    
    toast.info('Zmieniono termin lekcji', {
      description: `Nowy termin: ${updatedLesson.date} o ${updatedLesson.time}. Rider został powiadomiony.`,
    });
  };

  const handleUpdateLogo = (url: string) => {
    setLogoUrl(url);
    toast.success('Logo zostało zaktualizowane');
  };

  const handleUpdateInstructor = (updatedInst: Instructor) => {
    setInstructors(prev => prev.map(i => i.id === updatedInst.id ? updatedInst : i));
    toast.success('Dane instruktora zostały zaktualizowane');
  };

  const handleUpdateNews = (updatedNews: NewsItem) => {
    setNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n));
    toast.success('Aktualność została zaktualizowana');
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {!isFirebaseEnabled && (
        <div className="bg-accent/10 border-b border-accent/20 py-2 px-4 text-center text-xs text-accent-foreground font-medium">
          Tryb demonstracyjny (Dane zapisywane lokalnie). Skonfiguruj Firebase dla pełnej synchronizacji.
        </div>
      )}
      <header className="bg-primary text-primary-foreground py-6 px-4 crest-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-black p-1 rounded-lg border border-white/10 shadow-xl">
              <img 
                src={logoUrl} 
                alt="Klub Jeździecki Wiki Logo" 
                className="h-16 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-serif tracking-tight">Klub Jeździecki Wiki</h1>
              <p className="text-xs md:text-sm opacity-90 font-sans uppercase tracking-[0.2em] font-light mb-1">Pasja • Tradycja • Profesjonalizm</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs opacity-75 font-mono">
                <a href="tel:501705161" className="flex items-center gap-1 hover:opacity-100 transition-opacity"><Phone className="size-3" /> 501 705 161</a>
                <a href="tel:504270174" className="flex items-center gap-1 hover:opacity-100 transition-opacity"><Phone className="size-3" /> 504 270 174</a>
                <a href="tel:504313009" className="flex items-center gap-1 hover:opacity-100 transition-opacity"><Phone className="size-3" /> 504 313 009</a>
                <a href="tel:881299290" className="flex items-center gap-1 hover:opacity-100 transition-opacity"><Phone className="size-3" /> 881 299 290</a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Malgorzata</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-white/50 border border-border p-1 h-auto flex-wrap justify-center">
              <TabsTrigger value="dashboard" className="gap-2 py-2 px-4"><User className="h-4 w-4" /> Pulpit</TabsTrigger>
              <TabsTrigger value="calendars" className="gap-2 py-2 px-4"><CalendarIcon className="h-4 w-4" /> Kalendarze</TabsTrigger>
              <TabsTrigger value="news" className="gap-2 py-2 px-4"><Newspaper className="h-4 w-4" /> Aktualności</TabsTrigger>
              <TabsTrigger value="badges" className="gap-2 py-2 px-4"><Trophy className="h-4 w-4" /> Odznaki</TabsTrigger>
              <TabsTrigger value="progress" className="gap-2 py-2 px-4"><Trophy className="h-4 w-4" /> Postępy</TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 py-2 px-4"><MessageSquare className="h-4 w-4" /> Wiadomości</TabsTrigger>
              <TabsTrigger value="admin" className="gap-2 py-2 px-4 bg-accent/10 text-accent hover:bg-accent/20"><ShieldCheck className="h-4 w-4" /> Admin</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-none shadow-lg overflow-hidden relative">
                <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                  <img src={logoUrl} alt="" className="h-32 w-auto grayscale" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-secondary p-6 text-white">
                  <h2 className="text-2xl mb-2">Witaj ponownie, Malgorzata!</h2>
                  <p className="opacity-90 font-sans">Twoja następna lekcja już jutro. Pamiętaj o zabraniu kasku!</p>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Nadchodzące lekcje
                  </h3>
                  <div className="space-y-4">
                    {lessons.filter(l => l.status === 'scheduled' || l.status === 'pending').map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border/50">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${lesson.status === 'pending' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                            <CalendarIcon className={`h-6 w-6 ${lesson.status === 'pending' ? 'text-accent' : 'text-primary'}`} />
                          </div>
                          <div>
                            <p className="font-semibold">{format(new Date(lesson.date), 'EEEE, d MMMM', { locale: pl })}</p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.time} • {instructors.find(i => i.id === lesson.instructorId)?.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="bg-white">{lesson.type === 'individual' ? 'Indywidualna' : 'Grupowa'}</Badge>
                          <Badge className={lesson.status === 'pending' ? 'bg-accent text-black' : 'bg-primary'}>
                            {lesson.status === 'pending' ? 'Oczekuje' : 'Potwierdzona'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {lessons.filter(l => l.status === 'scheduled' || l.status === 'pending').length === 0 && <p className="text-center py-8 text-muted-foreground italic">Brak zaplanowanych lekcji.</p>}
                  </div>
                  <div className="mt-6">
                    <BookingDialog onBook={handleAddLesson} instructors={instructors} />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-lg bg-accent/5 border-l-4 border-accent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-4 w-4 text-accent" /> Przypomnienia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm p-3 bg-white rounded-lg border border-accent/20">
                      <p className="font-bold text-accent">Zawody już w niedzielę!</p>
                      <p className="text-xs text-muted-foreground">Pamiętaj o wyczyszczeniu sprzętu i przygotowaniu paszportu konia.</p>
                    </div>
                    <div className="text-sm p-3 bg-white rounded-lg border border-border">
                      <p className="font-bold">Badania lekarskie</p>
                      <p className="text-xs text-muted-foreground">Twoje orzeczenie wygasa za 14 dni. Umów się na wizytę.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> Twoje postępy</CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4">
                  {userProgress?.skills.slice(0, 3).map(skill => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="font-bold">{skill.level}/5</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500" 
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="p-0 h-auto text-primary" onClick={() => setActiveTab('progress')}>
                    Zobacz wszystkie postępy →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

          <TabsContent value="calendars">
            <InstructorCalendar lessons={lessons} onBook={handleAddLesson} instructors={instructors} />
          </TabsContent>

          <TabsContent value="news">
            <NewsSection news={news} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesInfo />
          </TabsContent>

          <TabsContent value="progress">
            {userProgress && <ProgressTracker progress={userProgress} />}
          </TabsContent>

          <TabsContent value="messages">
            <Messaging instructors={instructors} />
          </TabsContent>

          <TabsContent value="admin">
            <AdminInterface 
              lessons={lessons} 
              instructors={instructors} 
              news={news}
              logoUrl={logoUrl}
              onUpdateLessonStatus={handleUpdateLessonStatus} 
              onUpdateLesson={handleUpdateLesson}
              onUpdateLogo={handleUpdateLogo}
              onUpdateInstructor={handleUpdateInstructor}
              onUpdateNews={handleUpdateNews}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-2 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
          <User className="h-5 w-5" />
          <span className="text-[10px]">Pulpit</span>
        </button>
        <button onClick={() => setActiveTab('calendars')} className={`flex flex-col items-center gap-1 ${activeTab === 'calendars' ? 'text-primary' : 'text-muted-foreground'}`}>
          <CalendarIcon className="h-5 w-5" />
          <span className="text-[10px]">Kalendarz</span>
        </button>
        <button onClick={() => setActiveTab('news')} className={`flex flex-col items-center gap-1 ${activeTab === 'news' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Newspaper className="h-5 w-5" />
          <span className="text-[10px]">Aktualności</span>
        </button>
        <button onClick={() => setActiveTab('badges')} className={`flex flex-col items-center gap-1 ${activeTab === 'badges' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Trophy className="h-5 w-5" />
          <span className="text-[10px]">Odznaki</span>
        </button>
        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center gap-1 ${activeTab === 'messages' ? 'text-primary' : 'text-muted-foreground'}`}>
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px]">Czat</span>
        </button>
        <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-accent' : 'text-muted-foreground'}`}>
          <ShieldCheck className="h-5 w-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      </nav>

      <Toaster position="top-center" />
    </div>
  );
}
