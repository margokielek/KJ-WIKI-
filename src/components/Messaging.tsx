import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Instructor, Message } from '../types';
import { Send, Search, User, MessageSquare, Phone, Info } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { LOGO_URL } from '../constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MessagingProps {
  instructors: Instructor[];
}

export function Messaging({ instructors }: MessagingProps) {
  const [selectedContact, setSelectedContact] = useState<{id: string, name: string, avatar: string, type: 'instructor' | 'user'} | null>(
    instructors[0] ? { ...instructors[0], type: 'instructor' } : null
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatTab, setActiveChatTab] = useState<'instructors' | 'riders'>('instructors');

  // Mock other riders for search
  const otherRiders = [
    { id: 'user-2', name: 'Anna Kowalska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', type: 'user' as const },
    { id: 'user-3', name: 'Piotr Nowak', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Piotr', type: 'user' as const },
    { id: 'user-4', name: 'Katarzyna Wiśniewska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kasia', type: 'user' as const },
  ];

  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    'inst-4': [
      { id: '1', senderId: 'inst-4', receiverId: 'user-1', text: 'Cześć! Czy jutro o 10:00 pasuje Ci trening na Wiki?', timestamp: '2024-04-14T15:30:00Z' },
      { id: '2', senderId: 'user-1', receiverId: 'inst-4', text: 'Tak, oczywiście. Do zobaczenia!', timestamp: '2024-04-14T15:45:00Z' },
    ],
    'user-2': [
      { id: '3', senderId: 'user-2', receiverId: 'user-1', text: 'Hej, jedziesz jutro na zawody?', timestamp: '2024-04-15T10:00:00Z' },
    ]
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user-1',
      receiverId: selectedContact.id,
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    setMessageText('');
  };

  const filteredInstructors = instructors.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRiders = otherRiders.filter(rider => 
    rider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-80 border-none shadow-lg overflow-hidden flex flex-col bg-white/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl">Wiadomości</h3>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {Object.keys(chatHistory).length} aktywnych
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Szukaj osób..." 
              className="pl-9 bg-white/50 border-none shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <Tabs value={activeChatTab} onValueChange={(v) => setActiveChatTab(v as any)} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2 bg-muted/50">
            <TabsTrigger value="instructors" className="text-xs">Trenerzy</TabsTrigger>
            <TabsTrigger value="riders" className="text-xs">Jeźdźcy</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-2">
            <TabsContent value="instructors" className="m-0 p-2 space-y-1">
              {filteredInstructors.map(inst => (
                <button
                  key={inst.id}
                  onClick={() => setSelectedContact({ ...inst, type: 'instructor' })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    selectedContact?.id === inst.id 
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]' 
                      : 'hover:bg-white/80 text-foreground'
                  }`}
                >
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={inst.avatar} />
                    <AvatarFallback>{inst.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left overflow-hidden flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate text-sm">{inst.name}</p>
                      <span className={`text-[10px] ${selectedContact?.id === inst.id ? 'text-white/50' : 'text-muted-foreground'}`}>
                        {chatHistory[inst.id] ? format(new Date(chatHistory[inst.id].slice(-1)[0].timestamp), 'HH:mm') : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${selectedContact?.id === inst.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {chatHistory[inst.id] ? chatHistory[inst.id].slice(-1)[0].text : inst.specialization}
                    </p>
                  </div>
                </button>
              ))}
            </TabsContent>

            <TabsContent value="riders" className="m-0 p-2 space-y-1">
              {filteredRiders.map(rider => (
                <button
                  key={rider.id}
                  onClick={() => setSelectedContact(rider)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    selectedContact?.id === rider.id 
                      ? 'bg-primary text-white shadow-md transform scale-[1.02]' 
                      : 'hover:bg-white/80 text-foreground'
                  }`}
                >
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={rider.avatar} />
                    <AvatarFallback>{rider.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left overflow-hidden flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate text-sm">{rider.name}</p>
                      <span className={`text-[10px] ${selectedContact?.id === rider.id ? 'text-white/50' : 'text-muted-foreground'}`}>
                        {chatHistory[rider.id] ? format(new Date(chatHistory[rider.id].slice(-1)[0].timestamp), 'HH:mm') : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${selectedContact?.id === rider.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {chatHistory[rider.id] ? chatHistory[rider.id].slice(-1)[0].text : 'Kliknij, aby napisać'}
                    </p>
                  </div>
                </button>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </Card>

      <Card className="flex-1 border-none shadow-lg overflow-hidden flex flex-col bg-white/80 backdrop-blur-sm">
        {selectedContact ? (
          <>
            <CardHeader className="p-4 border-b bg-white/50 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-serif">{selectedContact.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.type === 'instructor' ? 'Trener' : 'Użytkownik'} • Aktywny
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    Dzisiaj, {format(new Date(), 'd MMMM', { locale: pl })}
                  </span>
                </div>
                
                {(chatHistory[selectedContact.id] || []).map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'user-1' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`group relative max-w-[75%] p-4 rounded-2xl text-sm shadow-sm transition-all ${
                      msg.senderId === 'user-1' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-foreground rounded-tl-none border border-border/50'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 opacity-60 ${msg.senderId === 'user-1' ? 'text-right' : 'text-left'}`}>
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white/80 backdrop-blur-md">
              <div className="flex gap-3 items-center max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Napisz wiadomość..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="rounded-2xl bg-muted/30 border-none focus-visible:ring-primary h-12 pl-4 pr-12 text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {/* Add emoji or attachment icons here if needed */}
                  </div>
                </div>
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={!messageText.trim()}
                  className="rounded-2xl h-12 w-12 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground italic gap-6 p-12 text-center">
            <div className="bg-muted/30 p-8 rounded-full">
              <MessageSquare className="h-16 w-16 opacity-20" />
            </div>
            <div>
              <h4 className="text-xl font-serif text-foreground not-italic mb-2">Twoje Centrum Kontaktu</h4>
              <p className="max-w-xs mx-auto">Wybierz trenera lub innego jeźdźca z listy po lewej, aby rozpocząć bezpieczną rozmowę.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
