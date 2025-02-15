import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    {
      icon: 'fas fa-user-graduate',
      value: '10,000+',
      label: 'Students'
    },
    {
      icon: 'fas fa-book-open',
      value: '200+',
      label: 'Courses'
    },
    {
      icon: 'fas fa-chalkboard-teacher',
      value: '50+',
      label: 'Expert Instructors'
    },
    {
      icon: 'fas fa-star',
      value: '95%',
      label: 'Satisfaction Rate'
    }
  ];

  return (
    <>
      <section className="py-20 bg-[#1a1f2e]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>
      {/* Spacer with gradient */}
      <div className="h-20 bg-gradient-to-b from-[#1a1f2e] to-[#131720]"></div>
    </>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="stat-card counter bg-[#232836] rounded-lg p-6 text-center border border-gray-700 hover:border-amber-300 transition-all duration-300 group">
    <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
      <i className={`${icon} text-amber-300 text-3xl`}></i>
    </div>
    <div className="text-3xl font-bold text-amber-300 mb-2">{value}</div>
    <div className="text-gray-300">{label}</div>
  </div>
);

export default Stats;