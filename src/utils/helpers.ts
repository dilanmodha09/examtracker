import { Exam } from '../types';

export const formatDate = (dateString: string): string => {
  if (dateString === 'TBA') return 'To be announced';
  
  const date = new Date(dateString.split('/').reverse().join('-'));
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  if (timeString === 'N/A') return 'Time not set';
  return timeString;
};

export const isExamCompleted = (exam: Exam): boolean => {
  if (exam.completed) return true;
  if (exam.date === 'TBA') return false;
  
  const today = new Date();
  const [day, month, year] = exam.date.split('/');
  const examDate = new Date(Number(year), Number(month) - 1, Number(day));
  const [hours, minutes] = exam.time.split(':').map(Number);
  
  examDate.setHours(hours, minutes);
  
  return examDate < today;
};

export const getNextExam = (exams: Exam[]): Exam | null => {
  const today = new Date();
  
  const upcomingExams = exams
    .filter(exam => !isExamCompleted(exam) && exam.date !== 'TBA')
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/');
      const [dayB, monthB, yearB] = b.date.split('/');
      const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
      const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));
      return dateA.getTime() - dateB.getTime();
    });
    
  return upcomingExams.length > 0 ? upcomingExams[0] : null;
};

export const getTimeRemaining = (examDate: string, examTime: string): string => {
  if (examDate === 'TBA' || examTime === 'N/A') return 'Date to be announced';
  
  const now = new Date();
  const [day, month, year] = examDate.split('/');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const [hours, minutes] = examTime.split(':').map(Number);
  
  date.setHours(hours, minutes);
  
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'Exam has started';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}, ${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}, ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} remaining`;
  } else {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} remaining`;
  }
};

export const parseExamJson = (jsonString: string): Exam[] => {
  try {
    const data = JSON.parse(jsonString);
    
    // Check if it's the school timetable format
    if (data.candidate && Array.isArray(data.exams)) {
      return data.exams.map((exam: any, index: number) => ({
        id: `exam-${index}-${Date.now()}`,
        name: `${exam.element} - ${exam.component}`,
        date: exam.date === 'TBA' ? 'TBA' : exam.date.split(' ')[1],
        time: exam.start,
        location: exam.room,
        seatNumber: exam.seat,
        notes: `Board: ${exam.board}\nLevel: ${exam.level}\nDuration: ${exam.duration}`,
        completed: false
      }));
    }
    
    // Validate if it's an array (legacy format)
    if (Array.isArray(data)) {
      return data.map((item: any, index: number) => ({
        id: item.id || `exam-${index}-${Date.now()}`,
        name: item.name,
        date: item.date,
        time: item.time,
        location: item.location || '',
        seatNumber: item.seatNumber || '',
        notes: item.notes || '',
        completed: item.completed || false
      }));
    }
    
    throw new Error('Invalid JSON format. Expected either a school timetable or an array of exams.');
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw error;
  }
};