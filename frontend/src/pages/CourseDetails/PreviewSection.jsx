import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, Code } from 'lucide-react';


// const SampleLesson = ({ resourceData, quizData }) => {
//   const [answers, setAnswers] = useState({});
//   const [showResults, setShowResults] = useState(false);

//   const handleSubmit = () => setShowResults(true);

//   const renderQuestion = (question, index) => {
//     switch (question.question_type) {
//       case 'MCQ':
//         return (
//           <RadioGroup
//             value={answers[index]}
//             onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
//           >
//             {question.options.map((option, optIndex) => (
//               <div key={optIndex} className="flex items-center space-x-2">
//                 <RadioGroupItem value={optIndex.toString()} id={`q${index}-${optIndex}`} />
//                 <Label htmlFor={`q${index}-${optIndex}`}>{option.option_text}</Label>
//               </div>
//             ))}
//           </RadioGroup>
//         );

//       case 'True/False':
//         return (
//           <RadioGroup
//             value={answers[index]}
//             onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
//           >
//             <div className="flex gap-4">
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="true" id={`q${index}-true`} />
//                 <Label htmlFor={`q${index}-true`}>True</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="false" id={`q${index}-false`} />
//                 <Label htmlFor={`q${index}-false`}>False</Label>
//               </div>
//             </div>
//           </RadioGroup>
//         );

//       case 'Fill in the Blank':
//         return (
//           <Input
//             type="text"
//             placeholder="Type your answer"
//             value={answers[index] || ''}
//             onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
//             className="max-w-sm"
//           />
//         );

//       case 'Matching':
//         return (
//           <div className="space-y-2">
//             {question.matching_pairs?.map((pair, pairIndex) => (
//               <div key={pairIndex} className="flex items-center gap-4">
//                 <span className="min-w-[120px]">{pair.left_item}</span>
//                 <Input
//                   type="text"
//                   placeholder="Match with right item"
//                   value={answers[`${index}-${pairIndex}`] || ''}
//                   onChange={(e) => setAnswers({
//                     ...answers,
//                     [`${index}-${pairIndex}`]: e.target.value
//                   })}
//                   className="max-w-[200px]"
//                 />
//               </div>
//             ))}
//           </div>
//         );

//       case 'Code Assessment':
//         return (
//           <div className="space-y-4">
//             <div className="bg-gray-100 p-4 rounded">
//               <pre>{question.initial_code}</pre>
//             </div>
//             <textarea
//               className="w-full h-32 p-2 border rounded font-mono"
//               placeholder="Write your code here..."
//               value={answers[index] || ''}
//               onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
//             />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Resources Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Sample Lesson: Introduction to React Hooks</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {resourceData?.message?.resources?.map((resource, index) => (
//               <div key={index} className="border rounded-lg p-4">
//                 <h3 className="font-medium mb-2">{resource.title}</h3>
//                 {resource.type === 'Video' && (
//                   <>
//                     {resource.url ? (
//                       <iframe
//                         src={resource.url}
//                         className="w-full h-96 rounded"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                       />
//                     ) : resource.file && (
//                       <video
//                         controls
//                         className="w-full h-96 rounded"
//                         src={resource.file.startsWith('/') ? resource.file : `/${resource.file}`}
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                     )}
//                   </>
//                 )}
//                 {resource.type === 'Link' && (
//                   <a href={resource.url} target="_blank" rel="noopener noreferrer"
//                      className="flex items-center gap-2 text-blue-600 hover:underline">
//                     <Code className="w-4 h-4" />
//                     View Code Sample
//                   </a>
//                 )}
//                 {resource.type === 'PDF' && (
//                   <a href={resource.file} target="_blank" rel="noopener noreferrer"
//                      className="flex items-center gap-2 text-blue-600 hover:underline">
//                     <FileText className="w-4 h-4" />
//                     View PDF
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Quiz Section */}
//       {quizData?.questions?.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Sample Quiz</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-8">
//               {quizData.questions.map((question, index) => (
//                 <div key={index} className="space-y-4">
//                   <h3 className="font-medium text-lg">{question.question}</h3>
//                   {renderQuestion(question, index)}
//                 </div>
//               ))}
//               <Button onClick={handleSubmit} className="w-full bg-black hover:bg-gray-800">
//                 Submit Answers
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SampleLesson;

const PreviewSection = ({ resourceData }) => {
    if (!resourceData?.message?.resources) {
      return <Card><CardContent>Loading resources...</CardContent></Card>;
    }
  
    const resources = resourceData.message.resources;
    
    return (
      <Card>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{resource.title}</h3>
                {resource.type === 'Video' && (
                  <>
                    {resource.url ? (
                      <iframe
                        src={resource.url}
                        className="w-full h-96 rounded"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : resource.file && (
                      <video 
                        controls 
                        className="w-full h-96 rounded"
                        src={resource.file.startsWith('/') ? resource.file : `/${resource.file}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </>
                )}
                {resource.type === 'Link' && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Code className="w-4 h-4" />
                    View Code Sample
                  </a>
                )}
                {resource.type === 'PDF' && (
                  <a href={resource.file} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileText className="w-4 h-4" />
                    View PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default PreviewSection;