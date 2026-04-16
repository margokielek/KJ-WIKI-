import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { NewsItem } from '../types';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Calendar, Tag, Trophy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LOGO_URL } from '../constants';

interface NewsSectionProps {
  news: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  const handleRegister = (title: string) => {
    toast.success(`Zapisano na: ${title}! Potwierdzenie wyślemy e-mailem.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl">Aktualności i Wydarzenia</h2>
          <p className="text-muted-foreground">Bądź na bieżąco z życiem naszego klubu.</p>
        </div>
        <div className="flex items-center gap-6">
          <img src={LOGO_URL} alt="" className="h-12 w-auto opacity-20 grayscale hidden md:block" referrerPolicy="no-referrer" />
          <div className="hidden md:flex gap-2">
            <Badge variant="outline" className="bg-white">Wszystkie</Badge>
            <Badge variant="outline" className="bg-white">Wydarzenia</Badge>
            <Badge variant="outline" className="bg-white">Odznaki</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => (
          <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <Badge className={
                  item.category === 'event' ? 'bg-secondary' : 
                  item.category === 'badge' ? 'bg-accent text-black' : 'bg-primary'
                }>
                  {item.category === 'event' ? 'Wydarzenie' : 
                   item.category === 'badge' ? 'Odznaki' : 'Aktualności'}
                </Badge>
              </div>
            </div>
            <CardHeader className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.date), 'd MMMM yyyy', { locale: pl })}
              </div>
              <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">{item.content}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" className="flex-1 text-xs h-8">Szczegóły</Button>
                {(item.category === 'event' || item.category === 'badge') && (
                  <Button 
                    className="flex-1 text-xs h-8" 
                    onClick={() => handleRegister(item.title)}
                  >
                    Zapisz się
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Trophy size={160} />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Odznaki Jeździeckie</CardTitle>
            <CardDescription>Najbliższe terminy egzaminów i kursów przygotowawczych.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
              <div>
                <p className="font-bold">Brązowa Odznaka</p>
                <p className="text-xs text-muted-foreground">20 Czerwca 2024</p>
              </div>
              <Button size="sm" onClick={() => handleRegister('Brązowa Odznaka')}>Zapisz się</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
              <div>
                <p className="font-bold">Srebrna Odznaka</p>
                <p className="text-xs text-muted-foreground">15 Lipca 2024</p>
              </div>
              <Button size="sm" onClick={() => handleRegister('Srebrna Odznaka')}>Zapisz się</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/10 overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <CheckCircle size={160} />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Konkursy Klubowe</CardTitle>
            <CardDescription>Rywalizacja i dobra zabawa dla wszystkich członków.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
              <div>
                <p className="font-bold">Towarzyskie Zawody w Ujeżdżeniu</p>
                <p className="text-xs text-muted-foreground">5 Maja 2024</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => handleRegister('Zawody w Ujeżdżeniu')}>Startuj</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
              <div>
                <p className="font-bold">Hubertus 2024</p>
                <p className="text-xs text-muted-foreground">Październik 2024</p>
              </div>
              <Badge variant="outline">Wkrótce</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
