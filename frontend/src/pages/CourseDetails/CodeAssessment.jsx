import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Circle, Minus, X } from 'lucide-react';

const CodeEditor = ({ value, onChange, language = 'python' }) => {
  const lineNumbers = (value || '').split('\n').map((_, i) => i + 1);
  
  return (
    <div className="rounded-lg overflow-hidden">
      {/* Mac-style top bar */}
      <div className="bg-gray-800 px-3 py-2 flex items-center">
        <div className="flex gap-2">
          <X className="w-3 h-3 text-red-500" />
          <Minus className="w-3 h-3 text-yellow-500" />
          <Circle className="w-3 h-3 text-green-500" />
        </div>
        <span className="ml-auto px-2 py-0.5 text-xs bg-gray-700 rounded text-gray-300">{language}</span>
      </div>
      
      <div className="flex bg-gray-900">
        <div className="p-4 text-gray-500 select-none bg-gray-950 text-right min-w-[3rem]">
          {lineNumbers.map(num => (
            <div key={num} className="leading-6 text-sm">{num}</div>
          ))}
        </div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-6 resize-none outline-none min-h-[300px] w-full"
          spellCheck="false"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
};

const CodeAssessment = ({ question, onSubmit, index, answers = {}, setAnswers }) => {
  const [showTests, setShowTests] = useState(false);
  if (!question) return null;
  
  const currentAnswer = answers[index] || '';
  const initialCode = question?.initial_code || '';

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="p-6">
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: question.question }} />
        
        <CodeEditor 
          value={currentAnswer || initialCode}
          onChange={(newCode) => setAnswers?.(prev => ({ ...prev, [index]: newCode }))}
          language="python"
        />

        <div className="mt-6 space-y-4">
          <button
            onClick={() => setShowTests(!showTests)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            {showTests ? 'Hide Test Cases' : 'Show Test Cases'}
          </button>

          {showTests && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
              {question.test_cases?.map((testCase, i) => (
                <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm mb-2">Test Case {i + 1}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Input:</div>
                      <code className="block p-2 bg-white rounded text-sm font-mono border">
                        {testCase.input}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Expected:</div>
                      <code className="block p-2 bg-white rounded text-sm font-mono border">
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
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Code
        </button>
      </div>
    </Card>
  );
};

export default CodeAssessment;