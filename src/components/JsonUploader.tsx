import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { parseExamJson } from '../utils/helpers';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const JsonUploader: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loadExamsFromJson } = useData();
  const { theme, isDarkMode } = useTheme();
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJsonSubmit = () => {
    try {
      const exams = parseExamJson(jsonText);
      loadExamsFromJson(exams);
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setJsonText(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md p-5 rounded-lg shadow-lg transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        }}
      >
        <h2 
          className="text-xl font-bold mb-4 transition-colors duration-300"
          style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
        >
          Import Exam Timetable
        </h2>
        
        <div className="mb-4">
          <label 
            className="block mb-2 text-sm font-medium transition-colors duration-300"
            style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
          >
            Upload Timetable File
          </label>
          <div 
            className="flex items-center justify-center w-full transition-colors duration-300 border-2 border-dashed rounded-lg h-32 cursor-pointer hover:bg-opacity-10"
            style={{
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
              <Upload size={24} className="mb-2" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }} />
              <span className="text-sm font-medium transition-colors duration-300" style={{ color: isDarkMode ? '#D1D5DB' : '#6B7280' }}>
                Click to upload timetable
              </span>
              <span className="text-xs mt-1" style={{ color: isDarkMode ? '#9CA3AF' : '#9CA3AF' }}>
                JSON files only
              </span>
              <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label 
            className="block mb-2 text-sm font-medium transition-colors duration-300"
            style={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
          >
            Or Paste Timetable JSON
          </label>
          <textarea
            className="w-full p-3 rounded-md border transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
              borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
              color: isDarkMode ? '#F9FAFB' : '#111827'
            }}
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`{
  "candidate": {
    "name": "John Smith",
    "number": "1234",
    "year": "11"
  },
  "exams": [
    {
      "date": "Thu 08/05/2025",
      "start": "13:00",
      "duration": "0h 45m",
      "board": "AQA",
      "component": "Math Paper 1",
      "room": "Main Hall",
      "seat": "A1"
    }
  ]
}`}
          />
        </div>

        {status === 'error' && (
          <div 
            className="mb-4 p-3 rounded-md flex items-start space-x-2 transition-colors duration-300"
            style={{ backgroundColor: isDarkMode ? '#4C1D24' : '#FEE2E2', color: isDarkMode ? '#FECACA' : '#991B1B' }}
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {status === 'success' && (
          <div 
            className="mb-4 p-3 rounded-md flex items-center space-x-2 transition-colors duration-300"
            style={{ backgroundColor: isDarkMode ? '#064E3B' : '#D1FAE5', color: isDarkMode ? '#6EE7B7' : '#065F46' }}
          >
            <Check size={18} className="flex-shrink-0" />
            <span className="text-sm">Timetable imported successfully!</span>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              color: isDarkMode ? '#F9FAFB' : '#4B5563'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleJsonSubmit}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            style={{
              backgroundColor: theme.accentColor,
              color: '#FFFFFF'
            }}
            disabled={!jsonText.trim() || status === 'success'}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonUploader;