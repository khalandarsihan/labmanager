// src/pages/StudentDashboard/components/GoalsTracker.jsx
import React, { useState } from 'react';

export const GoalsTracker = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Improve Math grade to A', target: '90%+', current: '88%', dueDate: 'End of Semester', isCompleted: false },
    { id: 2, title: 'Memorize 3 more Surahs', target: '3 Surahs', current: '1 Surah', dueDate: 'Mar 30, 2025', isCompleted: false },
    { id: 3, title: 'Complete Science Fair Project', target: 'Submission', current: '70% complete', dueDate: 'Apr 10, 2025', isCompleted: false },
    { id: 4, title: 'Submit all homework on time', target: '100% on-time', current: '87% on-time', dueDate: 'Ongoing', isCompleted: false }
  ]);

  const [newGoal, setNewGoal] = useState('');

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? {...goal, isCompleted: !goal.isCompleted} : goal
    ));
  };

  const addGoal = () => {
    if (newGoal.trim() === '') return;
    
    const newGoalObj = {
      id: Date.now(),
      title: newGoal,
      target: 'Not set',
      current: 'Not started',
      dueDate: 'Not set',
      isCompleted: false
    };
    
    setGoals([...goals, newGoalObj]);
    setNewGoal('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Goals</h3>
      
      <div className="space-y-3 mb-4">
        {goals.map(goal => (
          <div key={goal.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              checked={goal.isCompleted}
              onChange={() => toggleGoalCompletion(goal.id)}
              className="mt-1 mr-3"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h4 className={`font-medium ${goal.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {goal.title}
                </h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 sm:mt-0">
                  Due: {goal.dueDate}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Target:</span> {goal.target}
                </div>
                <div>
                  <span className="text-gray-500">Current:</span> {goal.current}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex mt-4">
        <input 
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new goal..."
          className="flex-1 px-3 py-2 border rounded-l-lg text-sm"
        />
        <button 
          onClick={addGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};