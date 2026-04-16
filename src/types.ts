export type Instructor = {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  workingDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  flexibleDays?: number[]; // Days with "individual bookings"
};

export type Lesson = {
  id: string;
  instructorId: string;
  riderId: string;
  riderName: string;
  date: string; // ISO string
  time: string; // HH:mm
  duration: number; // minutes
  type: 'individual' | 'group' | 'badge-prep';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  category: 'news' | 'event' | 'badge';
};

export type RiderProgress = {
  riderId: string;
  skills: {
    name: string;
    level: number; // 1-5
    lastUpdated: string;
  }[];
  badges: {
    name: string;
    date: string;
    status: 'earned' | 'preparing';
  }[];
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
};
