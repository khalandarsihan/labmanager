import React, { useEffect, useState } from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Clock, BookOpen, Trophy, Calendar, Users, Target, CheckCircle,
  ChevronDown, Play, FileText, Code, LinkIcon
} from 'lucide-react';
import PreviewSection from './PreviewSection';
import { formatPrice } from '../../utils/priceFormat';
import { User } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeContext';

const CourseDetails = ({ courseCode }) => {
  const { useLightTheme, themeStyles } = useTheme();
  const [showEnrollment, setShowEnrollment] = useState(false);
  const { data, error, isLoading } = useFrappeGetCall(
    'labmanager.api.api.get_course_details',
    { course_code: courseCode }
  );

  const { data: outcomeData } = useFrappeGetCall(
    'labmanager.api.api.get_course_outcomes',
    { course_code: courseCode }
  );

  const { data: resourceData, error: resourceError } = useFrappeGetCall(
    'labmanager.api.api.get_lesson_resources',
    { course_code: courseCode }
  );

  const { data: quizData, error: quizError } = useFrappeGetCall(
    'labmanager.api.api.get_lesson_quiz',
    { course_code: courseCode }
  );

  // Define theme-specific tab styles
  const tabListBg = useLightTheme ? "bg-purple-100/50" : "bg-gray-800";
  const activeTabBg = useLightTheme ? "bg-white" : "bg-gray-700";
  const activeTabBorder = useLightTheme ? "border-b-2 border-purple-500" : "border-b-2 border-amber-400";
  const tabTextColor = useLightTheme ? "text-gray-600" : "text-gray-400";
  const activeTabTextColor = useLightTheme ? "text-purple-700" : "text-amber-300";

  // Define decoration colors based on theme with increased opacity
  const decorationBorderColor = useLightTheme ? "border-purple-400" : "border-amber-300";
  const decorationOpacity = useLightTheme ? "opacity-35" : "opacity-30";
  const lineBorderColor = useLightTheme ? "border-purple-300" : "border-amber-300";
  const lineOpacity = useLightTheme ? "opacity-35" : "opacity-30";

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className={`text-lg ${themeStyles.text.primary}`}>Loading course details...</div>
      </div>
    );
  }

  if (error) {
    console.error('API Error:', error);
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className="text-lg text-red-500">Error loading course: {error.message}</div>
      </div>
    );
  }

  if (resourceError) {
    console.error('Resource Error:', resourceError);
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error loading resources. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const course = data?.message || data;
  const instructorData = course?.instructordata || course?.instructor || {};
  const outcomes = outcomeData?.message?.message || { roles: [], skills: [] };

  if (!course) {
    return <div>No course data available</div>;
  }

  return (
    <div className={`min-h-screen ${themeStyles.background} pb-20 relative overflow-hidden`}>
      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Clear geometric lines with animation */}
        <div className={`absolute h-full w-[1px] ${lineBorderColor} ${lineOpacity} left-1/5 transform -skew-x-12 animate-pulse`} />
        <div className={`absolute h-full w-[1px] ${lineBorderColor} ${lineOpacity} left-2/5 transform skew-x-12 animate-pulse delay-500`} />
        <div className={`absolute h-full w-[1px] ${lineBorderColor} ${lineOpacity} left-3/5 transform -skew-x-12 animate-pulse delay-1000`} />
        <div className={`absolute h-full w-[1px] ${lineBorderColor} ${lineOpacity} left-4/5 transform skew-x-12 animate-pulse delay-1500`} />
        
        <div className={`absolute w-full h-[1px] ${lineBorderColor} ${lineOpacity} top-1/6 transform -skew-y-12 animate-pulse delay-300`} />
        <div className={`absolute w-full h-[1px] ${lineBorderColor} ${lineOpacity} top-1/3 transform skew-y-12 animate-pulse delay-800`} />
        <div className={`absolute w-full h-[1px] ${lineBorderColor} ${lineOpacity} top-2/3 transform -skew-y-12 animate-pulse delay-1300`} />
        <div className={`absolute w-full h-[1px] ${lineBorderColor} ${lineOpacity} top-5/6 transform skew-y-12 animate-pulse delay-1800`} />
        
        {/* Left side decorations with floating animation - position optimized */}
        <div className={`absolute top-36 left-[10%] w-16 h-16 border-2 ${decorationBorderColor} rounded-lg transform rotate-45 ${decorationOpacity} animate-float-slow`} />
        <div className={`absolute top-1/6 left-[10%] w-10 h-10 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-300`} />
        <div className={`absolute top-1/3 left-20 w-14 h-14 border-2 ${decorationBorderColor} transform rotate-12 ${decorationOpacity} animate-float-slow delay-600`} />
        <div className={`absolute top-1/2 left-40 w-12 h-12 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-900`} />
        <div className={`absolute top-2/3 left-24 w-18 h-18 border-2 ${decorationBorderColor} transform -rotate-12 ${decorationOpacity} animate-float-slow delay-1200`} />
        <div className={`absolute bottom-1/6 left-36 w-14 h-14 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-1500`} />
        <div className={`absolute bottom-32 left-16 w-10 h-10 border-2 ${decorationBorderColor} transform rotate-30 ${decorationOpacity} animate-float-slow delay-1800`} />
        
        {/* Additional left side decorations - position optimized */}
        <div className={`absolute top-2/5 left-10 w-8 h-8 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-400`} />
        <div className={`absolute bottom-2/5 left-28 w-12 h-12 border-2 ${decorationBorderColor} transform rotate-45 ${decorationOpacity} animate-float-slow delay-700`} />
        
        {/* Right side decorations with floating animation - position optimized */}
        <div className={`absolute top-32 right-[35%] w-14 h-14 border-2 ${decorationBorderColor} transform rotate-45 ${decorationOpacity} animate-float-slow delay-200`} />
        <div className={`absolute top-1/6 right-[35%] w-12 h-12 border-2 ${decorationBorderColor} rounded-lg ${decorationOpacity} animate-float-slow delay-500`} />
        <div className={`absolute top-1/3 right-[35%] w-18 h-18 border-2 ${decorationBorderColor} transform -rotate-12 ${decorationOpacity} animate-float-slow delay-800`} />
        <div className={`absolute top-1/2 right-[35%] w-10 h-10 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-1100`} />
        <div className={`absolute top-2/3 right-[35%] w-14 h-14 border-2 ${decorationBorderColor} transform rotate-30 ${decorationOpacity} animate-float-slow delay-1400`} />
        <div className={`absolute bottom-1/4 right-[25%] w-12 h-12 border-2 ${decorationBorderColor} rounded-lg transform rotate-45 ${decorationOpacity} animate-float-slow delay-1700`} />
        <div className={`absolute bottom-1/6 right-[25%] w-8 h-8 border-2 ${decorationBorderColor} rounded-full ${decorationOpacity} animate-float-slow delay-2000`} />
        
        {/* Additional right side decorations - position optimized */}
        <div className={`absolute top-2/5 right-36 w-10 h-10 border-2 ${decorationBorderColor} transform -rotate-20 ${decorationOpacity} animate-float-slow delay-250`} />
        <div className={`absolute bottom-2/5 right-20 w-16 h-16 border-2 ${decorationBorderColor} rounded-lg transform rotate-15 ${decorationOpacity} animate-float-slow delay-750`} />
        
        {/* Add some large, very low opacity shapes in the background with slow animation */}
        <div className={`absolute top-1/3 left-1/4 w-64 h-64 border-2 ${decorationBorderColor} rounded-full opacity-5 animate-float-very-slow`} />
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 border-2 ${decorationBorderColor} rounded-full opacity-5 animate-float-very-slow delay-1000`} />
        <div className={`absolute top-1/2 left-1/2 w-80 h-80 border-2 ${decorationBorderColor} transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-5 animate-float-very-slow delay-2000`} />
      </div>
      
      {/* Main content */}
      <div className="max-w-[90rem] mx-auto p-6 relative z-10"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2">
            {/* Featured Image */}
            {course.featured_image && (
              <div className="mb-6 -mx-6">
                <img
                  src={course.featured_image.startsWith('/files/') ? course.featured_image : `/files/${course.featured_image}`}
                  alt={course.title}
                  className="w-full rounded-lg shadow-md"
                  style={{ maxWidth: '800px', margin: '0 auto' }}
                />
              </div>
            )}
  
            {/* Title */}
            <h1 className={`text-3xl font-bold mb-4 ${themeStyles.heading}`}>{course.title}</h1>
  
            {/* Description */}
            <div
              className={`text-lg mb-4 ${themeStyles.text.primary}`}
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
  
            {/* Course Metadata */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className={`flex items-center gap-2 ${themeStyles.text.secondary}`}>
                <Clock className="w-5 h-5" />
                <span>{`${course.duration} ${course.unit}`}</span>
              </div>
              <div className={`flex items-center gap-2 ${themeStyles.text.secondary}`}>
                <BookOpen className="w-5 h-5" />
                <span>{course.level}</span>
              </div>
              <div className={`flex items-center gap-2 ${themeStyles.text.secondary}`}>
                <Calendar className="w-5 h-5" />
                <span>{course.start_date}</span>
              </div>
              <div className={`flex items-center gap-2 ${themeStyles.text.secondary}`}>
                <Users className="w-5 h-5" />
                <span>{course.status}</span>
              </div>
            </div>
  
            {/* Instructor Section */}
            {instructorData && (
              <Card className={`mb-8 ${themeStyles.card.bg} ${themeStyles.card.border}`}>
                <CardHeader>
                  <CardTitle className={themeStyles.subheading}>Your Instructor</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={instructorData.image ?
                        (() => {
                          const imagePath = instructorData.image.startsWith('/files/') ?
                            instructorData.image : `/files/${instructorData.image}`;
                          return imagePath;
                        })()
                        : "/api/placeholder/96/96"}
                      alt={instructorData.full_name}
                      className="w-24 h-24 rounded-full"
                    />
                    <div>
                      <h3 className={`text-xl font-semibold ${themeStyles.subheading}`}>{instructorData.full_name}</h3>
                      <p className={themeStyles.text.light}>{instructorData.title}</p>
                      <p className={`mt-2 ${themeStyles.text.primary}`}>{instructorData.experience}</p>
                      {instructorData.bio && (
                        <div
                          className={`mt-2 text-sm ${themeStyles.text.secondary}`}
                          dangerouslySetInnerHTML={{ __html: instructorData.bio }}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
  
            {/* Tabs Section - Updated with theme-specific styling */}
            <div className="w-full">
  <Tabs defaultValue="overview">
    <div className="overflow-x-auto">
      <TabsList className={`w-full flex min-w-max rounded-t-lg ${tabListBg}`}>
        <TabsTrigger 
          value="overview" 
          className={`py-2 px-4 flex-shrink-0 transition-all data-[state=active]:${activeTabBg} data-[state=active]:${activeTabBorder} data-[state=active]:${activeTabTextColor} ${tabTextColor}`}
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="curriculum" 
          className={`py-2 px-4 flex-shrink-0 transition-all data-[state=active]:${activeTabBg} data-[state=active]:${activeTabBorder} data-[state=active]:${activeTabTextColor} ${tabTextColor}`}
        >
          Curriculum
        </TabsTrigger>
        <TabsTrigger 
          value="preview" 
          className={`py-2 px-4 flex-shrink-0 transition-all data-[state=active]:${activeTabBg} data-[state=active]:${activeTabBorder} data-[state=active]:${activeTabTextColor} ${tabTextColor}`}
        >
          Sample Lesson
        </TabsTrigger>
        <TabsTrigger 
          value="outcomes" 
          className={`py-2 px-4 flex-shrink-0 transition-all data-[state=active]:${activeTabBg} data-[state=active]:${activeTabBorder} data-[state=active]:${activeTabTextColor} ${tabTextColor}`}
        >
          Outcomes
        </TabsTrigger>
        <TabsTrigger 
          value="certificate" 
          className={`py-2 px-4 flex-shrink-0 transition-all data-[state=active]:${activeTabBg} data-[state=active]:${activeTabBorder} data-[state=active]:${activeTabTextColor} ${tabTextColor}`}
        >
          Certificate
        </TabsTrigger>
      </TabsList>
    </div>

    <TabsContent value="overview" className="p-0">
      <Card className={`mt-0 rounded-t-none ${themeStyles.card.bg} ${themeStyles.card.border}`}>
        <CardHeader>
          <CardTitle className={themeStyles.subheading}>Course Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {course.prerequisites?.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${themeStyles.subheading}`}>Prerequisites</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className={`flex items-center gap-2 px-4 ${themeStyles.text.primary}`}>
                      <CheckCircle className={`w-4 h-4 ${useLightTheme ? 'text-purple-600' : 'text-amber-300'}`} />
                      <div dangerouslySetInnerHTML={{ __html: prereq }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.learning_objectives?.length > 0 && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${themeStyles.subheading}`}>Learning Objectives</h3>
                <ul className="space-y-2">
                  {course.learning_objectives.map((objective, index) => (
                    <li key={index} className={`flex items-center gap-2 px-4 ${themeStyles.text.primary}`}>
                      <Target className={`w-4 h-4 ${useLightTheme ? 'text-purple-600' : 'text-amber-300'}`} />
                      <div dangerouslySetInnerHTML={{ __html: objective }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="curriculum" className="p-0">
      <Card className={`mt-0 rounded-t-none ${themeStyles.card.bg} ${themeStyles.card.border}`}>
        <CardHeader>
          <CardTitle className={themeStyles.subheading}>Course Syllabus</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {course.syllabus?.map((module) => (
              <Collapsible key={module.name}>
                <CollapsibleTrigger className="w-full">
                  <Card className={`border-2 ${useLightTheme ? 'hover:border-purple-200' : 'hover:border-amber-300'} ${themeStyles.card.bg}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className={`text-lg ${themeStyles.subheading}`}>{module.title}</CardTitle>
                          <CardDescription className={`mt-1 ${themeStyles.text.light}`}>
                            {`${module.duration} ${module.unit}`}
                          </CardDescription>
                        </div>
                        <ChevronDown className={`w-5 h-5 ${themeStyles.text.secondary}`} />
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-4 ml-4">
                    <div className={themeStyles.text.primary} dangerouslySetInnerHTML={{ __html: module.description }} />
                    {module.lessons?.map((lesson, index) => (
                      <div
                        key={`${module.name}-${index}`}
                        className={`flex items-center justify-between p-2 mt-2 rounded ${useLightTheme ? 'bg-gray-50' : 'bg-gray-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Play className={`w-4 h-4 ${useLightTheme ? 'text-purple-600' : 'text-amber-300'}`} />
                          <div>
                            <p className={`font-medium ${themeStyles.text.primary}`}>{lesson.title}</p>
                            <p className={`text-sm ${themeStyles.text.light}`}>{`${lesson.duration} ${lesson.unit}`}</p>
                          </div>
                        </div>
                        {lesson.preview_enabled && (
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="preview" className="p-0">
      <PreviewSection
        resourceData={resourceData}
        quizData={quizData?.message}
        onError={(error) => console.error('Preview Section Error:', error)}
      />
    </TabsContent>

    <TabsContent value="outcomes" className="p-0">
      <Card className={`mt-0 rounded-t-none ${themeStyles.card.bg} ${themeStyles.card.border}`}>
        <CardHeader>
          <CardTitle className={themeStyles.subheading}>Career Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Potential Roles Section */}
            <div>
              <h3 className={`text-xl font-semibold mb-4 ${themeStyles.subheading}`}>Potential Roles</h3>
              <div className="space-y-3">
                {outcomeData?.message?.message?.roles?.map((role, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 ${themeStyles.text.primary}`}
                  >
                    <User className={`w-5 h-5 ${useLightTheme ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className="text-base">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Skills Section */}
            <div className="mt-8">
              <h3 className={`text-xl font-semibold mb-4 ${themeStyles.subheading}`}>Industry Skills</h3>
              <div className="flex flex-wrap gap-2">
                {outcomeData?.message?.message?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 ${useLightTheme ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/30 text-blue-300'} rounded-full text-sm font-medium`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="certificate" className="p-0">
      <Card className={`mt-0 rounded-t-none ${themeStyles.card.bg} ${themeStyles.card.border}`}>
        <CardHeader>
          <CardTitle className={themeStyles.subheading}>Course Certificate</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className={themeStyles.text.primary}>Certificate content here</p>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

</div>
  
          {/* Right Column - Price Card */}
          <div className="md:col-span-1">
          <Card className={`shadow-lg sticky top-6 ${themeStyles.card.bg} ${themeStyles.card.border}`}>
          <CardHeader>
            <CardTitle className={themeStyles.subheading}>
              Course Fee: {formatPrice(course.price)}
            </CardTitle>
            <CardDescription className={themeStyles.text.light}>
              Includes lifetime access & certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button
              className={`w-full mb-4 ${useLightTheme ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-amber-300 hover:bg-amber-400 text-gray-900'}`}
              onClick={() => window.location.href = '/student-registration/new'}
            >
              Enroll Now
            </Button>
            <p className={`text-sm text-center ${useLightTheme ? 'text-purple-600' : 'text-amber-300'}`}>
              30-day money-back guarantee
            </p>
          </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default CourseDetails;