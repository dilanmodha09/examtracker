import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { RevisionSession } from '../types';

const RevisionPlanner: React.FC = () => {
  const { revisionSessions, addRevisionSession, updateRevisionSession, deleteRevisionSession } = useData();
  const { theme, isDarkMode } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<RevisionSession | null>(null);
  const [newSession, setNewSession] = useState<Partial<RevisionSession>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    subject: '',
    topics: [],
    notes: '',
    completed: false
  });
  const [newTopic, setNewTopic] = useState('');

  const sortedSessions = [...revisionSessions].sort((a, b) => {
    // First by date
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then by start time
    const aStart = a.startTime.split(':').map(Number);
    const bStart = b.startTime.split(':').map(Number);
    return (aStart[0] * 60 + aStart[1]) - (bStart[0] * 60 + bStart[1]);
  });

  const groupedSessions = sortedSessions.reduce((groups, session) => {
    if (!groups[session.date]) {
      groups[session.date] = [];
    }
    groups[session.date].push(session);
    return groups;
  }, {} as Record<string, RevisionSession[]>);

  const addTopicToSession = () => {
    if (!newTopic.trim()) return;
    
    if (editingSession) {
      setEditingSession({
        ...editingSession,
        topics: [...editingSession.topics, newTopic.trim()]
      });
    } else {
      setNewSession({
        ...newSession,
        topics: [...(newSession.topics || []), newTopic.trim()]
      });
    }
    
    setNewTopic('');
  };

  const removeTopicFromSession = (index: number) => {
    if (editingSession) {
      const updatedTopics = [...editingSession.topics];
      updatedTopics.splice(index, 1);
      setEditingSession({
        ...editingSession,
        topics: updatedTopics
      });
    } else {
      const updatedTopics = [...(newSession.topics || [])];
      updatedTopics.splice(index, 1);
      setNewSession({
        ...newSession,
        topics: updatedTopics
      });
    }
  };

  const handleAddSession = () => {
    if (!newSession.subject || !newSession.date || !newSession.startTime || !newSession.endTime) return;
    
    addRevisionSession({
      id: `revision-${Date.now()}`,
      date: newSession.date || new Date().toISOString().split('T')[0],
      startTime: newSession.startTime || '',
      endTime: newSession.endTime || '',
      subject: newSession.subject || '',
      topics: newSession.topics || [],
      notes: newSession.notes || '',
      completed: false
    });
    
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      subject: '',
      topics: [],
      notes: '',
      completed: false
    });
    
    setShowAddForm(false);
  };

  const handleUpdateSession = () => {
    if (!editingSession) return;
    updateRevisionSession(editingSession.id, editingSession);
    setEditingSession(null);
  };

  const toggleSessionCompletion = (id: string, completed: boolean) => {
    updateRevisionSession(id, { completed });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  const sessionForm = (isEditing: boolean) => {
    const session = isEditing ? editingSession : newSession;
    if (!session) return null;
    
    return (
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
          {isEditing ? 'Edit Revision Session' : 'Add New Revision Session'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Subject"
            value={session.subject}
            onChange={(e) => isEditing 
              ? setEditingSession({...editingSession!, subject: e.target.value}) 
              : setNewSession({...newSession, subject: e.target.value})
            }
            className="p-2 rounded-md border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
          />
          <input
            type="date"
            value={session.date}
            onChange={(e) => isEditing 
              ? setEditingSession({...editingSession!, date: e.target.value}) 
              : setNewSession({...newSession, date: e.target.value})
            }
            className="p-2 rounded-md border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
          />
          <input
            type="time"
            placeholder="Start Time"
            value={session.startTime}
            onChange={(e) => isEditing 
              ? setEditingSession({...editingSession!, startTime: e.target.value}) 
              : setNewSession({...newSession, startTime: e.target.value})
            }
            className="p-2 rounded-md border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
          />
          <input
            type="time"
            placeholder="End Time"
            value={session.endTime}
            onChange={(e) => isEditing 
              ? setEditingSession({...editingSession!, endTime: e.target.value}) 
              : setNewSession({...newSession, endTime: e.target.value})
            }
            className="p-2 rounded-md border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
          />
        </div>
        
        <div className="mb-3">
          <div className="flex items-center mb-2 gap-2">
            <input
              type="text"
              placeholder="Add Topic"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="p-2 rounded-md border flex-1 transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTopicToSession();
                }
              }}
            />
            <button
              onClick={addTopicToSession}
              className="p-2 rounded-md transition-colors duration-300"
              style={{
                backgroundColor: theme.secondaryColor,
                color: isDarkMode ? '#111827' : '#4B5563'
              }}
            >
              <Plus size={18} />
            </button>
          </div>
          
          {(session.topics && session.topics.length > 0) && (
            <div 
              className="p-2 rounded-md mb-2 transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
            >
              <h4 
                className="text-sm font-medium mb-1 transition-colors duration-300"
                style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
              >
                Topics:
              </h4>
              <ul className="space-y-1">
                {session.topics.map((topic, index) => (
                  <li 
                    key={index} 
                    className="flex justify-between items-center text-sm p-1 rounded transition-colors duration-300"
                    style={{
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6'
                    }}
                  >
                    <span style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>{topic}</span>
                    <button
                      onClick={() => removeTopicFromSession(index)}
                      className="p-1 rounded-full transition-colors duration-300"
                      style={{ 
                        color: isDarkMode ? '#D1D5DB' : '#6B7280'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <textarea
          placeholder="Notes"
          value={session.notes}
          onChange={(e) => isEditing 
            ? setEditingSession({...editingSession!, notes: e.target.value}) 
            : setNewSession({...newSession, notes: e.target.value})
          }
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
            onClick={() => isEditing ? setEditingSession(null) : setShowAddForm(false)}
            className="px-3 py-1 rounded-md text-sm transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB',
              color: isDarkMode ? '#D1D5DB' : '#4B5563'
            }}
          >
            Cancel
          </button>
          <button
            onClick={isEditing ? handleUpdateSession : handleAddSession}
            className="px-3 py-1 rounded-md text-sm transition-colors duration-300"
            style={{
              backgroundColor: theme.accentColor,
              color: '#FFFFFF'
            }}
            disabled={!session.subject || !session.date || !session.startTime || !session.endTime}
          >
            {isEditing ? 'Update' : 'Add Session'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-16">
      <div className="flex justify-between mb-4 px-4">
        <h2 
          className="text-lg font-semibold transition-colors duration-300"
          style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
        >
          Revision Schedule
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center rounded-md px-3 py-1 text-sm transition-colors duration-300"
          style={{ 
            backgroundColor: theme.primaryColor,
            color: isDarkMode ? '#111827' : '#4B5563'
          }}
          disabled={showAddForm || !!editingSession}
        >
          <Plus size={16} className="mr-1" />
          Add Session
        </button>
      </div>

      {showAddForm && sessionForm(false)}
      {editingSession && sessionForm(true)}

      {Object.keys(groupedSessions).length === 0 ? (
        <div 
          className="text-center py-8 transition-colors duration-300"
          style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
        >
          <p>No revision sessions planned yet.</p>
          <p className="text-sm mt-2">Add your first session to get started.</p>
        </div>
      ) : (
        <div className="space-y-6 px-4">
          {Object.entries(groupedSessions)
            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
            .map(([date, sessions]) => (
              <div key={date}>
                <h3 
                  className="text-md font-semibold mb-3 transition-colors duration-300 flex items-center"
                  style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
                >
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: theme.accentColor }}
                  ></span>
                  {formatDate(date)}
                </h3>
                
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div 
                      key={session.id}
                      className="p-4 rounded-lg shadow-sm transition-all duration-300"
                      style={{ 
                        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                        borderLeft: `3px solid ${
                          session.completed 
                            ? (isDarkMode ? '#10B981' : '#34D399') 
                            : theme.secondaryColor
                        }`,
                        opacity: session.completed ? 0.8 : 1
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="font-semibold transition-colors duration-300"
                          style={{ 
                            color: isDarkMode ? '#F9FAFB' : '#111827',
                            textDecoration: session.completed ? 'line-through' : 'none'
                          }}
                        >
                          {session.subject}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => toggleSessionCompletion(session.id, !session.completed)}
                            className="p-1 rounded-full transition-colors duration-300"
                            style={{ 
                              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                              color: session.completed ? '#10B981' : (isDarkMode ? '#D1D5DB' : '#6B7280')
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingSession(session)}
                            className="p-1 rounded-full transition-colors duration-300"
                            style={{ 
                              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                              color: isDarkMode ? '#D1D5DB' : '#6B7280'
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteRevisionSession(session.id)}
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
                        className="flex items-center mb-3 text-sm transition-colors duration-300"
                        style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                      >
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                      
                      {session.topics.length > 0 && (
                        <div 
                          className="mb-3 p-3 rounded-md transition-colors duration-300"
                          style={{ 
                            backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' 
                          }}
                        >
                          <h4 
                            className="text-xs font-medium mb-2 transition-colors duration-300"
                            style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                          >
                            Topics to Cover:
                          </h4>
                          <ul className="space-y-1">
                            {session.topics.map((topic, index) => (
                              <li 
                                key={index}
                                className="text-sm flex items-center transition-colors duration-300"
                                style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
                              >
                                <span 
                                  className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                                  style={{ backgroundColor: theme.accentColor }}
                                ></span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {session.notes && (
                        <div 
                          className="text-sm transition-colors duration-300"
                          style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}
                        >
                          <p>{session.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RevisionPlanner;