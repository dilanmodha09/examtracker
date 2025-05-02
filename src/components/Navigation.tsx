import React from 'react';
import { Calendar, BookOpen, Clock, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { theme, isDarkMode } = useTheme();
  
  const navItems = [
    { icon: <Home size={22} />, label: 'Home' },
    { icon: <Calendar size={22} />, label: 'Exams' },
    { icon: <BookOpen size={22} />, label: 'Revision' }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t transition-colors duration-300"
      style={{
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderColor: isDarkMode ? '#374151' : '#E5E7EB'
      }}
    >
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
            activeTab === index ? 'scale-110' : 'opacity-70'
          }`}
          style={{
            color: activeTab === index ? theme.accentColor : isDarkMode ? '#9CA3AF' : '#6B7280'
          }}
        >
          <div className="mb-1">
            {item.icon}
          </div>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;