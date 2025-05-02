import React, { useState, useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NextExam from './components/NextExam';
import ExamList from './components/ExamList';
import RevisionPlanner from './components/RevisionPlanner';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [pageTitle, setPageTitle] = useState('Next Exam');

  useEffect(() => {
    switch (activeTab) {
      case 0:
        setPageTitle('Next Exam');
        break;
      case 1:
        setPageTitle('Exam List');
        break;
      case 2:
        setPageTitle('Revision Planner');
        break;
      default:
        setPageTitle('Exam Tracker');
        break;
    }
  }, [activeTab]);

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
          <Header title={pageTitle} />
          
          <main className="pb-20 overflow-hidden">
            <div 
              className="transition-transform duration-300 ease-in-out flex w-[300vw]"
              style={{
                transform: `translateX(-${activeTab * (100 / 3)}%)`
              }}
            >
              <div className="w-screen flex-shrink-0 px-4">
                <NextExam />
              </div>
              <div className="w-screen flex-shrink-0 px-4">
                <ExamList />
              </div>
              <div className="w-screen flex-shrink-0 px-4">
                <RevisionPlanner />
              </div>
            </div>
          </main>
          
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;