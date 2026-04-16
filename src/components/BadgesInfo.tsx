import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Trophy, ExternalLink, FileText, Info, CheckCircle2 } from 'lucide-react';

export function BadgesInfo() {
  const badgeLevels = [
    {
      name: 'Jeżdżę Konno',
      description: 'Podstawowa odznaka potwierdzająca umiejętności opieki nad koniem i bezpiecznego poruszania się w trzech chodach.',
      requirements: [
        'Wiek: minimum 6 lat',
        'Opieka stajenna i siodłanie',
        'Egzamin praktyczny (czworobok)',
        'Egzamin teoretyczny'
      ],
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      name: 'Brązowa Odznaka',
      description: 'Pierwszy stopień odznaki sportowej, uprawniający do startów w zawodach regionalnych (klasa L).',
      requirements: [
        'Posiadanie odznaki "Jeżdżę Konno"',
        'Wiek: minimum 7 lat',
        'Próba ujeżdżeniowa',
        'Próba skokowa (przeszkody do 70 cm)',
        'Egzamin teoretyczny'
      ],
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      name: 'Srebrna Odznaka',
      description: 'Drugi stopień odznaki sportowej, wymagany do startów w zawodach ogólnopolskich i wyższych klasach.',
      requirements: [
        'Posiadanie Brązowej Odznaki (min. 1 rok)',
        'Próba ujeżdżeniowa (wyższy poziom)',
        'Próba skokowa (przeszkody do 80-90 cm)',
        'Egzamin teoretyczny z rozszerzonego zakresu'
      ],
      color: 'bg-slate-200 text-slate-700 border-slate-300'
    },
    {
      name: 'Złota Odznaka',
      description: 'Najwyższy stopień odznaki jeździeckiej w Polsce.',
      requirements: [
        'Posiadanie Srebrnej Odznaki',
        'Próba ujeżdżeniowa (klasa P/N)',
        'Próba skokowa (klasa P/N)',
        'Zaawansowana wiedza teoretyczna'
      ],
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif flex items-center gap-3">
            <Trophy className="h-8 w-8 text-accent" /> Odznaki Jeździeckie PZJ
          </h2>
          <p className="text-muted-foreground">Informacje o systemie szkolenia i egzaminach Polskiego Związku Jeździeckiego.</p>
        </div>
        <Button asChild variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
          <a href="https://pzj.pl/edukacja/odznaki-jezdzieckie/" target="_blank" rel="noopener noreferrer">
            Oficjalna strona PZJ <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {badgeLevels.map((badge, index) => (
          <Card key={index} className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge className={`${badge.color} px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                  {badge.name}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-xl">{badge.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {badge.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" /> Główne wymagania:
                </p>
                <ul className="space-y-2">
                  {badge.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Ważne Dokumenty
          </CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Pobierz aktualne regulaminy i pytania egzaminacyjne ze strony PZJ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" className="justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-none" asChild>
              <a href="https://pzj.pl/wp-content/uploads/2023/12/Regulamin-odznak-jezdzieckich-2024.pdf" target="_blank" rel="noopener noreferrer">
                Regulamin Odznak 2024
              </a>
            </Button>
            <Button variant="secondary" className="justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-none" asChild>
              <a href="https://pzj.pl/edukacja/pytania-egzaminacyjne/" target="_blank" rel="noopener noreferrer">
                Pytania Egzaminacyjne
              </a>
            </Button>
          </div>
          <p className="mt-6 text-xs opacity-60 italic text-center">
            Klub Jeździecki Wiki regularnie organizuje egzaminy na odznaki. Śledź aktualności lub zapytaj instruktora o najbliższy termin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
