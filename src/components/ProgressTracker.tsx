import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RiderProgress } from '../types';
import { Trophy, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { LOGO_URL } from '../constants';

interface ProgressTrackerProps {
  progress: RiderProgress;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl">Twoje Postępy</h2>
            <p className="text-muted-foreground">Śledź swój rozwój i przygotuj się do kolejnych wyzwań.</p>
          </div>
          <img src={LOGO_URL} alt="" className="h-16 w-auto opacity-20 grayscale" referrerPolicy="no-referrer" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Umiejętności</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {progress.skills.map(skill => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-semibold">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">Ostatnia aktualizacja: {skill.lastUpdated}</p>
                  </div>
                  <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded">Poziom {skill.level}/5</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> Odznaki Jeździeckie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.badges.map(badge => (
              <div key={badge.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${badge.status === 'earned' ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-primary'}`}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {badge.status === 'earned' ? `Zdobyta: ${badge.date}` : `Planowany termin: ${badge.date}`}
                    </p>
                  </div>
                </div>
                <Badge variant={badge.status === 'earned' ? 'default' : 'outline'} className={badge.status === 'earned' ? 'bg-accent text-black' : ''}>
                  {badge.status === 'earned' ? 'Zdobyta' : 'W trakcie'}
                </Badge>
              </div>
            ))}
            
            <div className="mt-8 p-6 bg-secondary text-white rounded-2xl">
              <h4 className="font-bold mb-2 flex items-center gap-2"><Clock className="h-4 w-4" /> Następny krok</h4>
              <p className="text-sm opacity-90">Brakuje Ci tylko 2 lekcji galopu, aby móc przystąpić do egzaminu na Srebrną Odznakę!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
