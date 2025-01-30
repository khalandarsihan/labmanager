import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Code, FileText, AlertCircle } from 'lucide-react';

const PreviewSection = ({ resourceData, quizData }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    console.log('Resource Data received:', resourceData);
    console.log('Quiz Data received:', quizData);
  }, [resourceData, quizData]);

  // Extract resources from the nested structure
  // const resources = resourceData?.message?.resources || [];
  const resources = resourceData?.message?.message?.resources || 
                 resourceData?.message?.resources || [];

  // Helper function to format YouTube URL
  const formatYouTubeUrl = (url) => {
    if (!url) return null;
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Helper function to format file URL
  const formatFileUrl = (file) => {
    if (!file) return null;
    if (!file.startsWith('http') && !file.startsWith('/')) {
      return `/${file}`;
    }
    return file;
  };

  const handleSubmit = () => {
    const newFeedback = {};
    
    quizData?.questions?.forEach((question, index) => {
      const userAnswer = answers[index];
      
      switch (question.question_type) {
        case 'MCQ':
          const correctOption = question.options.findIndex(opt => opt.is_correct);
          newFeedback[index] = parseInt(userAnswer) === correctOption;
          break;
          
        case 'True/False':
          newFeedback[index] = userAnswer === question.correct_answer.toString();
          break;
          
        case 'Fill in the Blank':
          newFeedback[index] = userAnswer?.toLowerCase() === question.correct_answer?.toLowerCase();
          break;
          
        case 'Matching':
          const pairs = question.matching_pairs || [];
          newFeedback[index] = pairs.every((pair, pairIndex) => 
            answers[`${index}-${pairIndex}`]?.toLowerCase() === pair.right_item.toLowerCase()
          );
          break;
          
        case 'Code Assessment':
          newFeedback[index] = 'Submitted for review';
          break;
      }
    });
    
    setFeedback(newFeedback);
    setShowResults(true);
  };

  const renderQuestion = (question, index) => {
    if (!question) return null;

    switch (question.question_type) {
      case 'MCQ':
        return (
          <div className="space-y-4">
            <RadioGroup
              key={`mcq-${index}-${showResults}`}
              value={answers[index]}
              onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
            >
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={optIndex.toString()} 
                    id={`q${index}-${optIndex}`}
                  />
                  <Label htmlFor={`q${index}-${optIndex}`}>
                    {option.option_text}
                  </Label>
                  {showResults && parseInt(answers[index]) === optIndex && (
                    <span className={feedback[index] ? "text-green-600" : "text-red-600"}>
                      {feedback[index] ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'True/False':
        return (
          <div className="space-y-4">
            <RadioGroup
              key={`tf-${index}-${showResults}`}
              value={answers[index]}
              onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
            >
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`q${index}-true`} />
                  <Label htmlFor={`q${index}-true`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`q${index}-false`} />
                  <Label htmlFor={`q${index}-false`}>False</Label>
                </div>
              </div>
            </RadioGroup>
            {showResults && answers[index] && (
              <div className={feedback[index] ? "text-green-600" : "text-red-600"}>
                {feedback[index] ? "Correct!" : "Incorrect"}
              </div>
            )}
          </div>
        );

      case 'Fill in the Blank':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Type your answer"
              value={answers[index] || ''}
              onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
              className="max-w-sm"
            />
            {showResults && answers[index] && (
              <div className={feedback[index] ? "text-green-600" : "text-red-600"}>
                {feedback[index] ? "Correct!" : "Incorrect"}
              </div>
            )}
          </div>
        );
case 'Matching':
  return (
    <div className="space-y-4">
      {question.matching_pairs?.map((pair, pairIndex) => (
        <div key={pairIndex} className="flex items-center gap-4">
          <span className="min-w-[120px] font-medium">{pair.left_item}</span>
          <select
            value={answers[`${index}-${pairIndex}`] || ''}
            onChange={(e) => setAnswers({
              ...answers,
              [`${index}-${pairIndex}`]: e.target.value
            })}
            className="w-full max-w-[200px] p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Match with right item</option>
            {question.matching_pairs.map((rightPair) => (
              <option key={rightPair.right_item} value={rightPair.right_item}>
                {rightPair.right_item}
              </option>
            ))}
          </select>
          {showResults && answers[`${index}-${pairIndex}`] && (
            <span className={
              answers[`${index}-${pairIndex}`].toLowerCase() === pair.right_item.toLowerCase()
                ? "text-green-600"
                : "text-red-600"
            }>
              {answers[`${index}-${pairIndex}`].toLowerCase() === pair.right_item.toLowerCase()
                ? "✓"
                : "✗"
              }
            </span>
          )}
        </div>
      ))}
    </div>
  );

      case 'Code Assessment':
        return (
          <div className="space-y-4">
            {question.initial_code && (
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm font-mono">{question.initial_code}</pre>
              </div>
            )}
            <Textarea
              className="w-full min-h-[200px] font-mono"
              placeholder="Write your code here..."
              value={answers[index] || ''}
              onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
            />
            {showResults && answers[index] && (
              <div className="text-blue-600">
                {feedback[index]}
              </div>
            )}
            {question.test_cases && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Test Cases:</h4>
                <div className="space-y-2">
                  {question.test_cases.map((test, testIndex) => (
                    <div key={testIndex} className="text-sm">
                      <span className="font-medium">Input:</span> {test.input}
                      <br />
                      <span className="font-medium">Expected Output:</span> {test.expected_output}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported question type: {question.question_type}</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Lesson Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No preview resources available
              </div>
            ) : (
              resources.map((resource, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{resource.title}</h3>
                  {resource.type === 'Video' && (
                    <>
                      {resource.url ? (
                        <div className="relative w-full pt-[56.25%]">
                          <iframe
                            src={formatYouTubeUrl(resource.url)}
                            className="absolute top-0 left-0 w-full h-full rounded"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : resource.file && (
                        <video
                          controls
                          className="w-full rounded"
                          src={formatFileUrl(resource.file)}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </>
                  )}
                  {resource.type === 'Link' && resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <Code className="w-4 h-4" />
                      View Code Sample
                    </a>
                  )}
                  {resource.type === 'PDF' && resource.file && (
                    <a
                      href={formatFileUrl(resource.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View PDF
                    </a>
                  )}
                  {resource.description && (
                    <p className="mt-2 text-gray-600 text-sm">{resource.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {quizData?.error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {quizData.error}
          </AlertDescription>
        </Alert>
      ) : quizData?.questions?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quizData.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                  {renderQuestion(question, index)}
                </div>
              ))}
<div className="space-y-4">
  {!showResults ? (
    <Button
      onClick={handleSubmit}
      className="w-full"
    >
      Submit Answers
    </Button>
  ) : (
    <>
      <Button
        className="w-full"
        disabled
      >
        Quiz Submitted
      </Button>
      <Button
        onClick={() => {
          setShowResults(false);
          setFeedback({});
          setAnswers({}); // This will clear all answers
          // For radio buttons specifically
          const radioInputs = document.querySelectorAll('input[type="radio"]');
          radioInputs.forEach(input => {
            input.checked = false;
          });
        }}
        variant="outline"
        className="w-full"
      >
        Try Again
      </Button>
    </>
  )}
</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreviewSection;