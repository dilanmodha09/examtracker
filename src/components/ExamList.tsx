import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatDate, formatTime, isExamCompleted } from '../utils/helpers';
import { Pencil, Trash2, Check, Plus, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import JsonUploader from './JsonUploader';
import { Exam } from '../types';

const ExamList: React.FC = () => {
  const { exams, updateExam, deleteExam, addExam } = useData();
  const { theme, isDarkMode } = useTheme();
  const [showJsonUploader, setShowJsonUploader] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    seatNumber: '',
    notes: ''
  });

  const upcomingExams = exams
    .filter(exam => !isExamCompleted(exam))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastExams = exams
    .filter(exam => isExamCompleted(exam))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddExam = () => {
    if (!newExam.name || !newExam.date || !newExam.time) return;
    
    addExam({
      id: `exam-${Date.now()}`,
      name: newExam.name || '',
      date: newExam.date || new Date().toISOString().split('T')[0],
      time: newExam.time || '',
      location: newExam.location || '',
      seatNumber: newExam.seatNumber || '',
      notes: newExam.notes || '',
      completed: false
    });
    
    setNewExam({
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      seatNumber: '',
      notes: ''
    });
    
    setShowAddForm(false);
  };

  const toggleExamCompletion = (id: string, completed: boolean) => {
    updateExam(id, { completed });
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    updateExam(id, { notes });
    setEditingExam(null);
  };

  return (
    <div className="pb-16">
      <div className="flex justify-between mb-4 px-4">
        <h2 
          className="text-lg font-semibold transition-colors duration-300"
          style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
        >
          Upcoming Exams ({upcomingExams.length})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center rounded-md px-3 py-1 text-sm transition-colors duration-300"
            style={{ 
              backgroundColor: theme.primaryColor,
              color: isDarkMode ? '#111827' : '#4B5563'
            }}
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
          <button
            onClick={() => setShowJsonUploader(true)}
            className="flex items-center rounded-md px-3 py-1 text-sm transition-colors duration-300"
            style={{ 
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              color: isDarkMode ? '#F9FAFB' : '#4B5563'
            }}
          >
            <Upload size={16} className="mr-1" />
            Import
          </button>
        </div>
      </div>

      {showAddForm && (
        <div 
          className="mb-4 p-4 rounded-lg transition-colors duration-300"
          style={{ 
            backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
          }}
        >
          <h3 
            className="text-md font-semibold mb-3 transition-colors duration-300"
            style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
          >
            Add New Exam
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Exam Name"
              value={newExam.name}
              onChange={(e) => setNewExam({...newExam, name: e.target.value})}
              className="p-2 rounded-md border transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            />
            <input
              type="date"
              value={newExam.date}
              onChange={(e) => setNewExam({...newExam, date: e.target.value})}
              className="p-2 rounded-md border transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            />
            <input
              type="text"
              placeholder="Time (e.g., 14:00-16:00)"
              value={newExam.time}
              onChange={(e) => setNewExam({...newExam, time: e.target.value})}
              className="p-2 rounded-md border transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            />
            <input
              type="text"
              placeholder="Location"
              value={newExam.location}
              onChange={(e) => setNewExam({...newExam, location: e.target.value})}
              className="p-2 rounded-md border transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            />
            <input
              type="text"
              placeholder="Seat Number"
              value={newExam.seatNumber}
              onChange={(e) => setNewExam({...newExam, seatNumber: e.target.value})}
              className="p-2 rounded-md border transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            />
          </div>
          <textarea
            placeholder="Notes"
            value={newExam.notes}
            onChange={(e) => setNewExam({...newExam, notes: e.target.value})}
            className="w-full p-2 rounded-md border mb-3 transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
            rows={2}
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 rounded-md text-sm transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB',
                color: isDarkMode ? '#D1D5DB' : '#4B5563'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddExam}
              className="px-3 py-1 rounded-md text-sm transition-colors duration-300"
              style={{
                backgroundColor: theme.accentColor,
                color: '#FFFFFF'
              }}
              disabled={!newExam.name || !newExam.date || !newExam.time}
            >
              Add Exam
            </button>
          </div>
        </div>
      )}

      {upcomingExams.length === 0 ? (
        <div 
          className="text-center py-8 transition-colors duration-300"
          style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
        >
          <p>No upcoming exams.</p>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {upcomingExams.map(exam => (
            <div 
              key={exam.id}
              className="p-4 rounded-lg shadow-sm transition-colors duration-300"
              style={{ 
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderLeft: `3px solid ${theme.primaryColor}`
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 
                  className="font-semibold transition-colors duration-300"
                  style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
                >
                  {exam.name}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleExamCompletion(exam.id, !exam.completed)}
                    className="p-1 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                      color: exam.completed ? '#10B981' : (isDarkMode ? '#D1D5DB' : '#6B7280')
                    }}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingExam(exam)}
                    className="p-1 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                      color: isDarkMode ? '#D1D5DB' : '#6B7280'
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="p-1 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                      color: isDarkMode ? '#D1D5DB' : '#6B7280'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div 
                className="flex items-center mb-2 text-sm transition-colors duration-300"
                style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
              >
                <span className="mr-3">{formatDate(exam.date)}</span>
                <span>{formatTime(exam.time)}</span>
              </div>
              
              {exam.seatNumber && (
                <div 
                  className="flex items-center mb-2 text-sm transition-colors duration-300"
                  style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                >
                  <span className="mr-2">Seat:</span>
                  <span>{exam.seatNumber}</span>
                </div>
              )}
              
              {exam.location && (
                <div 
                  className="flex items-center mb-2 text-sm transition-colors duration-300"
                  style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                >
                  <span className="mr-2">Location:</span>
                  <span>{exam.location}</span>
                </div>
              )}
              
              {editingExam?.id === exam.id ? (
                <div className="mt-3">
                  <textarea
                    value={editingExam.notes || ''}
                    onChange={(e) => setEditingExam({...editingExam, notes: e.target.value})}
                    placeholder="Add notes..."
                    className="w-full p-2 rounded-md border mb-2 transition-colors duration-300"
                    style={{
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                      color: isDarkMode ? '#F9FAFB' : '#111827'
                    }}
                    rows={3}
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingExam(null)}
                      className="px-3 py-1 rounded-md text-xs transition-colors duration-300"
                      style={{
                        backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                        color: isDarkMode ? '#D1D5DB' : '#4B5563'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateNotes(exam.id, editingExam.notes || '')}
                      className="px-3 py-1 rounded-md text-xs transition-colors duration-300"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: '#FFFFFF'
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : exam.notes ? (
                <div 
                  className="mt-2 p-3 rounded-md text-sm transition-colors duration-300"
                  style={{ 
                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    color: isDarkMode ? '#D1D5DB' : '#4B5563'
                  }}
                >
                  {exam.notes}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {pastExams.length > 0 && (
        <>
          <h2 
            className="text-lg font-semibold mt-8 mb-4 px-4 transition-colors duration-300"
            style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
          >
            Past Exams ({pastExams.length})
          </h2>
          <div className="space-y-3 px-4">
            {pastExams.map(exam => (
              <div 
                key={exam.id}
                className="p-4 rounded-lg shadow-sm transition-colors duration-300"
                style={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderLeft: `3px solid ${isDarkMode ? '#6B7280' : '#9CA3AF'}`,
                  opacity: 0.8
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-semibold transition-colors duration-300"
                    style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                  >
                    {exam.name}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleExamCompletion(exam.id, !exam.completed)}
                      className="p-1 rounded-full transition-colors duration-300"
                      style={{ 
                        backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                        color: exam.completed ? '#10B981' : (isDarkMode ? '#D1D5DB' : '#6B7280')
                      }}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-1 rounded-full transition-colors duration-300"
                      style={{ 
                        backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                        color: isDarkMode ? '#D1D5DB' : '#6B7280'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="flex items-center mb-2 text-sm transition-colors duration-300"
                  style={{ color: isDarkMode ? '#9CA3AF' : '#9CA3AF' }}
                >
                  <span className="mr-3">{formatDate(exam.date)}</span>
                  <span>{formatTime(exam.time)}</span>
                </div>
                
                {exam.notes && (
                  <div 
                    className="mt-2 p-3 rounded-md text-sm transition-colors duration-300"
                    style={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                      color: isDarkMode ? '#9CA3AF' : '#9CA3AF'
                    }}
                  >
                    {exam.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {showJsonUploader && <JsonUploader onClose={() => setShowJsonUploader(false)} />}
    </div>
  );
};

export default ExamList;