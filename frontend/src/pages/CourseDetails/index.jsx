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
import { User } from 'lucide-react';


const CourseDetails = ({ courseCode }) => {
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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    console.error('API Error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading course: {error.message}</div>
      </div>
    );
  }

  if (resourceError) {
    console.error('Resource Error:', resourceError);
    return (
      <Card>
        <CardContent>
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

// Add this before the return statement to debug
console.log('Course Code:', courseCode);
console.log('Outcome Data:', outcomeData);
console.log('Extracted Outcomes:', outcomes);


  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div
              className="text-lg mb-4"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{`${course.duration} ${course.unit}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{course.start_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.status}</span>
              </div>
            </div>
          </div>
          
          {/* Price Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Course Fee: ${course.price}</CardTitle>
              <CardDescription>Includes lifetime access & certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full mb-4"
                onClick={() => setShowEnrollment(true)}
              >
                Enroll Now
              </Button>
              <p className="text-sm text-center">30-day money-back guarantee</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructor Section */}
      {instructorData && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Instructor</CardTitle>
          </CardHeader>
          <CardContent>
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
                <h3 className="text-xl font-semibold">{instructorData.full_name}</h3>
                <p className="text-gray-600">{instructorData.title}</p>
                <p className="mt-2">{instructorData.experience}</p>
                {instructorData.bio && (
                  <div
                    className="mt-2 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: instructorData.bio }}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <div className="w-full">
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-5 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-white">Curriculum</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white">Sample Lesson</TabsTrigger>
            <TabsTrigger value="outcomes" className="data-[state=active]:bg-white">Outcomes</TabsTrigger>
            <TabsTrigger value="certificate" className="data-[state=active]:bg-white">Certificate</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {course.prerequisites?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
                      <ul className="space-y-2">
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <div dangerouslySetInnerHTML={{ __html: prereq }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {course.learning_objectives?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Learning Objectives</h3>
                      <ul className="space-y-2">
                        {course.learning_objectives.map((objective, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
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

          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.syllabus?.map((module) => (
                    <Collapsible key={module.name}>
                      <CollapsibleTrigger className="w-full">
                        <Card className="border-2 hover:border-blue-200">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription className="mt-1">
                                  {`${module.duration} ${module.unit}`}
                                </CardDescription>
                              </div>
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="mt-4 ml-4">
                          <div dangerouslySetInnerHTML={{ __html: module.description }} />
                          {module.lessons?.map((lesson, index) => (
                            <div
                              key={`${module.name}-${index}`}
                              className="flex items-center justify-between p-2 mt-2 rounded bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <Play className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-sm text-gray-600">{`${lesson.duration} ${lesson.unit}`}</p>
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

<TabsContent value="preview">
            <PreviewSection
              resourceData={resourceData}
              quizData={quizData?.message}
              onError={(error) => console.error('Preview Section Error:', error)}
            />
          </TabsContent>


          <TabsContent value="outcomes">
  <Card>
    <CardHeader>
      <CardTitle>Career Outcomes</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        {/* Potential Roles Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Potential Roles</h3>
          <div className="space-y-3">
            {outcomeData?.message?.message?.roles?.map((role, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-gray-700"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-base">{role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Skills Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Industry Skills</h3>
          <div className="flex flex-wrap gap-2">
            {outcomeData?.message?.message?.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
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


          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Course Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                Certificate content here
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetails;