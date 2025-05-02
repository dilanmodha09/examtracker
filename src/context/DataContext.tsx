import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exam, RevisionSession } from '../types';

interface DataContextType {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  revisionSessions: RevisionSession[];
  setRevisionSessions: React.Dispatch<React.SetStateAction<RevisionSession[]>>;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updatedExam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  addRevisionSession: (session: RevisionSession) => void;
  updateRevisionSession: (id: string, updatedSession: Partial<RevisionSession>) => void;
  deleteRevisionSession: (id: string) => void;
  loadExamsFromJson: (exams: Exam[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(() => {
    const savedExams = localStorage.getItem('exams');
    return savedExams ? JSON.parse(savedExams) : [];
  });

  const [revisionSessions, setRevisionSessions] = useState<RevisionSession[]>(() => {
    const savedSessions = localStorage.getItem('revisionSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('revisionSessions', JSON.stringify(revisionSessions));
  }, [revisionSessions]);

  const addExam = (exam: Exam) => {
    setExams(prevExams => [...prevExams, exam]);
  };

  const updateExam = (id: string, updatedExam: Partial<Exam>) => {
    setExams(prevExams => 
      prevExams.map(exam => 
        exam.id === id ? { ...exam, ...updatedExam } : exam
      )
    );
  };

  const deleteExam = (id: string) => {
    setExams(prevExams => prevExams.filter(exam => exam.id !== id));
  };

  const addRevisionSession = (session: RevisionSession) => {
    setRevisionSessions(prevSessions => [...prevSessions, session]);
  };

  const updateRevisionSession = (id: string, updatedSession: Partial<RevisionSession>) => {
    setRevisionSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === id ? { ...session, ...updatedSession } : session
      )
    );
  };

  const deleteRevisionSession = (id: string) => {
    setRevisionSessions(prevSessions => prevSessions.filter(session => session.id !== id));
  };

  const loadExamsFromJson = (newExams: Exam[]) => {
    setExams(newExams);
  };

  return (
    <DataContext.Provider
      value={{
        exams,
        setExams,
        revisionSessions,
        setRevisionSessions,
        addExam,
        updateExam,
        deleteExam,
        addRevisionSession,
        updateRevisionSession,
        deleteRevisionSession,
        loadExamsFromJson
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};