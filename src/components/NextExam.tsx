import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { getNextExam, formatDate, formatTime, getTimeRemaining } from '../utils/helpers';
import { Clock, MapPin, User, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import JsonUploader from './JsonUploader';

const NextExam: React.FC = () => {
  const { exams } = useData();
  const { theme, isDarkMode } = useTheme();
  const nextExam = getNextExam(exams);
  const [showJsonUploader, setShowJsonUploader] = useState(false);

  // Animation class for countdown
  const pulseAnimation = "animate-pulse";

  if (!nextExam) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6 text-center transition-colors duration-300"
        style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
      >
        <div 
          className="p-8 rounded-full mb-6"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Clock size={48} style={{ color: '#FFFFFF' }} />
        </div>
        <h2 className="text-xl font-bold mb-2">No upcoming exams</h2>
        <p className="mb-6">Import your exam timetable to see your next exam here.</p>
        <button
          onClick={() => setShowJsonUploader(true)}
          className="flex items-center px-4 py-2 rounded-lg transition-colors duration-300"
          style={{ 
            backgroundColor: theme.accentColor,
            color: '#FFFFFF'
          }}
        >
          <Upload size={20} className="mr-2" />
          Import Timetable
        </button>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining(nextExam.date, nextExam.time);
  
  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300"
        style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
      >
        <div className="flex justify-end w-full mb-4">
          <button
            onClick={() => setShowJsonUploader(true)}
            className="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors duration-300"
            style={{ 
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              color: isDarkMode ? '#D1D5DB' : '#6B7280'
            }}
          >
            <Upload size={16} className="mr-1" />
            Import
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2 transition-colors duration-300">
          {nextExam.name}
        </h2>
        
        <div 
          className="w-full max-w-md p-6 rounded-lg mb-6 shadow-md transition-all duration-300"
          style={{ 
            backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
            borderLeft: `4px solid ${theme.accentColor}`
          }}
        >
          <div className="flex items-center mb-4">
            <Clock size={18} className="mr-2" style={{ color: theme.accentColor }} />
            <div>
              <p className="font-semibold">
                {formatDate(nextExam.date)}
              </p>
              <p>{formatTime(nextExam.time)}</p>
            </div>
          </div>
          
          {nextExam.location && (
            <div className="flex items-center mb-4">
              <MapPin size={18} className="mr-2" style={{ color: theme.accentColor }} />
              <p>{nextExam.location}</p>
            </div>
          )}
          
          {nextExam.seatNumber && (
            <div className="flex items-center">
              <User size={18} className="mr-2" style={{ color: theme.accentColor }} />
              <p>Seat {nextExam.seatNumber}</p>
            </div>
          )}
        </div>
        
        <div 
          className={`text-lg font-medium px-4 py-2 rounded-full ${pulseAnimation}`}
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: theme.accentColor 
          }}
        >
          {timeRemaining}
        </div>
      </div>

      {showJsonUploader && <JsonUploader onClose={() => setShowJsonUploader(false)} />}
    </div>
  );
};

export default NextExam;