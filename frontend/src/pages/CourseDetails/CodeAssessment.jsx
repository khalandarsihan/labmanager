import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Circle, Minus, X } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeContext';

const CodeEditor = ({ value, onChange, language = 'python' }) => {
  const { useLightTheme } = useTheme();
  const lineNumbers = (value || '').split('\n').map((_, i) => i + 1);
  
  // Theme specific styles
  const topBarBg = useLightTheme ? "bg-gray-200" : "bg-gray-800";
  const languageBadgeBg = useLightTheme ? "bg-purple-100 text-purple-800" : "bg-gray-700 text-gray-300";
  const editorBg = useLightTheme ? "bg-white" : "bg-gray-900";
  const lineNumbersBg = useLightTheme ? "bg-gray-100 text-gray-500" : "bg-gray-950 text-gray-500";
  const editorTextColor = useLightTheme ? "text-gray-800" : "text-gray-100";
  
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-300 dark:border-gray-700">
      {/* Mac-style top bar */}
      <div className={`${topBarBg} px-3 py-2 flex items-center`}>
        <div className="flex gap-2">
          <X className="w-3 h-3 text-red-500" />
          <Minus className="w-3 h-3 text-yellow-500" />
          <Circle className="w-3 h-3 text-green-500" />
        </div>
        <span className={`ml-auto px-2 py-0.5 text-xs rounded ${languageBadgeBg}`}>{language}</span>
      </div>
      
      <div className={`flex ${editorBg}`}>
        <div className={`p-4 select-none ${lineNumbersBg} text-right min-w-[3rem]`}>
          {lineNumbers.map(num => (
            <div key={num} className="leading-6 text-sm">{num}</div>
          ))}
        </div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 p-4 ${editorBg} ${editorTextColor} font-mono text-sm leading-6 resize-none outline-none min-h-[300px] w-full`}
          spellCheck="false"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
};

const CodeAssessment = ({ question, onSubmit, index, answers = {}, setAnswers }) => {
  const [showTests, setShowTests] = useState(false);
  const { useLightTheme, themeStyles } = useTheme();
  
  if (!question) return null;
  
  const currentAnswer = answers[index] || '';
  const initialCode = question?.initial_code || '';

  // Theme specific styles
  const cardBg = useLightTheme ? "bg-white" : "bg-gray-800/50";
  const cardBorder = useLightTheme ? "border-purple-200/50" : "border-gray-700/50";
  const linkColor = useLightTheme ? "text-purple-600 hover:text-purple-800" : "text-blue-400 hover:text-blue-300";
  const buttonPrimary = useLightTheme ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-amber-300 hover:bg-amber-400 text-gray-900";
  const testCaseBg = useLightTheme ? "bg-gray-50" : "bg-gray-800/80";
  const testCaseBorder = useLightTheme ? "border-gray-200" : "border-gray-700";
  const codeBg = useLightTheme ? "bg-white border-gray-200" : "bg-gray-700 border-gray-600";
  const headerBg = useLightTheme ? "bg-purple-50" : "bg-gray-700";

  return (
    <Card className={`mb-6 overflow-hidden ${cardBg} border ${cardBorder}`}>
      <div className="p-6">
        <div className={`mb-6 ${themeStyles.text.primary}`} dangerouslySetInnerHTML={{ __html: question.question }} />
        
        <CodeEditor 
          value={currentAnswer || initialCode}
          onChange={(newCode) => setAnswers?.(prev => ({ ...prev, [index]: newCode }))}
          language="python"
        />

        <div className="mt-6 space-y-4">
          <button
            onClick={() => setShowTests(!showTests)}
            className={`text-sm ${linkColor} underline`}
          >
            {showTests ? 'Hide Test Cases' : 'Show Test Cases'}
          </button>

          {showTests && (
            <div className={`border-t ${testCaseBorder} pt-4`}>
              <h3 className={`text-lg font-semibold mb-4 ${themeStyles.subheading}`}>Test Cases</h3>
              {question.test_cases?.map((testCase, i) => (
                <div key={i} className={`mb-4 p-4 ${testCaseBg} rounded-lg`}>
                  <div className={`font-medium text-sm mb-2 ${themeStyles.text.secondary}`}>Test Case {i + 1}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className={`text-xs ${themeStyles.text.light} mb-1`}>Input:</div>
                      <code className={`block p-2 rounded text-sm font-mono border ${codeBg}`}>
                        {testCase.input}
                      </code>
                    </div>
                    <div>
                      <div className={`text-xs ${themeStyles.text.light} mb-1`}>Expected:</div>
                      <code className={`block p-2 rounded text-sm font-mono border ${codeBg}`}>
                        {testCase.expected_output}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => onSubmit?.(currentAnswer)}
          className={`w-full mt-6 py-2 px-4 rounded-lg transition-colors ${buttonPrimary}`}
        >
          Submit Code
        </button>
      </div>
    </Card>
  );
};

export default CodeAssessment;