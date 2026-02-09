'use client';

import { TranscriptChat } from '@/components/transcript-chat';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  getTrainingVideoById,
  QuizQuestion,
  TrainingVideoType,
} from '@/lib/services/trainingVideos';
import {
  ArrowLeft,
  Loader2,
  Maximize,
  MessageCircle,
  Minimize,
  Pause,
  Play,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function VideoPlayerClient({ id }: { id: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<TrainingVideoType | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null,
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;
      try {
        const data = await getTrainingVideoById(id);
        setVideo(data);
        if (data?.questions) {
          console.log(data.questions);
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Failed to fetch video', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();

    // Mark as started in local storage
    if (id) {
      const savedStatuses = localStorage.getItem('training_video_statuses');
      const statuses = savedStatuses ? JSON.parse(savedStatuses) : {};

      // Only update if not already there (or upgrade from Pending, though default is implicit Pending)
      if (!statuses[id]) {
        statuses[id] = 'Started';
        localStorage.setItem(
          'training_video_statuses',
          JSON.stringify(statuses),
        );
      }
    }
  }, [id]);

  // Video Time Update Handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    console.log(answeredQuestions);
    // Check for questions
    const questionToTrigger = questions.find((q) => {
      return (
        time >= q.timestamp &&
        time < q.timestamp + 1 &&
        !answeredQuestions.has(q.timestamp) &&
        !currentQuestion
      );
    });

    if (questionToTrigger) {
      pauseVideo();
      setCurrentQuestion(questionToTrigger);
    }
  };

  const playVideo = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) pauseVideo();
    else playVideo();
  };

  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleAnswer = (optionKey: string) => {
    if (!currentQuestion) return;

    setSelectedAnswer(optionKey);
    const isCorrect = optionKey === currentQuestion.correctAnswer;

    if (isCorrect) {
      setFeedback('Correct! Well done.');
      // Auto resume after 1.5s only if correct
      setTimeout(() => {
        setAnsweredQuestions((prev) =>
          new Set(prev).add(currentQuestion.timestamp),
        );
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setFeedback(null);
        playVideo();
      }, 1500);
    } else {
      setFeedback('Incorrect. Please try again.');
      // We allow them to select another answer, so we don't clear selectedAnswer immediately
      // effectively just showing the red state.
      // If they click another option, `handleAnswer` will fire again and update `selectedAnswer`.
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#219E82]" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-8 text-center text-slate-500">
        Video not found
        <button
          onClick={() => router.back()}
          className="mx-auto mt-4 block font-semibold text-[#219E82]">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="line-clamp-1 text-xl font-bold text-slate-800">
          {video.title}
        </h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Video & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Video Player Container */}
          <div
            ref={containerRef}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="h-full w-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() =>
                setDuration(videoRef.current?.duration || 0)
              }
              onClick={togglePlay}
            />

            {/* Controls Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 ${!isPlaying ? 'opacity-100' : ''}`}>
              {/* Big Play Button (when paused) */}
              {!isPlaying && !currentQuestion && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Play size={40} className="ml-2 fill-white text-white" />
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4">
                {/* Seek Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#219E82]"
                />

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="transition-colors hover:text-[#219E82]">
                      {isPlaying ? (
                        <Pause size={24} className="fill-current" />
                      ) : (
                        <Play size={24} className="fill-current" />
                      )}
                    </button>
                    <span className="text-sm font-medium tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    onClick={toggleFullScreen}
                    className="transition-colors hover:text-[#219E82]">
                    {isFullScreen ? (
                      <Minimize size={24} />
                    ) : (
                      <Maximize size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Question Modal Overlay */}
            {currentQuestion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm md:absolute md:inset-0 md:z-20 md:p-4">
                <div className="custom-scrollbar flex h-full w-full max-w-none flex-col justify-center overflow-y-auto rounded-none bg-white p-6 shadow-2xl animate-in zoom-in-95 md:block md:h-auto md:max-h-full md:max-w-2xl md:rounded-2xl">
                  <div className="mb-6 text-center">
                    <span className="mb-3 inline-block rounded-full bg-[#219E82]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#219E82]">
                      Pop Quiz
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(currentQuestion.options).map(
                      ([key, value]) => {
                        const isSelected = selectedAnswer === key;
                        const isGameComplete =
                          selectedAnswer === currentQuestion.correctAnswer;

                        let buttonClass =
                          'w-full text-left p-4 rounded-xl border-2 transition-all font-medium ';

                        if (isSelected) {
                          // This is the button the user just clicked
                          if (key === currentQuestion.correctAnswer) {
                            // Correct!
                            buttonClass +=
                              'border-[#2ECC71] bg-[#2ECC71]/10 text-[#2ECC71]';
                          } else {
                            // Incorrect
                            buttonClass +=
                              'border-red-500 bg-red-50 text-red-600';
                          }
                        } else {
                          // This button is NOT selected
                          if (isGameComplete) {
                            // Game is over (correct answer found), dim these
                            buttonClass +=
                              'border-slate-100 text-slate-400 opacity-50';
                          } else {
                            // Game is still active (wrong answer or no answer yet), keep these clickable
                            buttonClass +=
                              'border-slate-100 hover:border-[#219E82] hover:bg-[#219E82]/5 text-slate-700';
                          }
                        }

                        return (
                          <button
                            key={key}
                            onClick={() => handleAnswer(key)}
                            // Disable only if the game is complete (correct answer found)
                            disabled={isGameComplete}
                            className={buttonClass}>
                            <span className="mr-2 font-bold">{key}.</span>{' '}
                            {value}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {feedback && (
                    <div
                      className={`mt-6 rounded-lg p-3 text-center font-bold ${
                        feedback.includes('Correct')
                          ? 'text-[#2ECC71]'
                          : 'text-red-500'
                      }`}>
                      {feedback}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {video.title}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {video.category}
                  </span>
                  {video.createdAt && (
                    <span className="text-sm text-slate-400">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {video.description && (
              <div className="prose prose-slate mt-6 max-w-none text-slate-600">
                <p>{video.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Interface - Desktop Only */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-6 flex h-[450px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <h3 className="font-bold text-slate-700">AI Assistant</h3>
              </div>
              <span className="text-xs text-slate-400">
                Powered by Polymath
              </span>
            </div>
            <TranscriptChat
              transcript={video.Transcript}
              className="min-h-0 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Chat Button & Bottom Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#219E82] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1B8A71]">
              <MessageCircle size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
            <SheetHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <SheetTitle className="font-bold text-slate-700">
                    AI Assistant
                  </SheetTitle>
                </div>
                <span className="text-xs text-slate-400">
                  Powered by Polymath
                </span>
              </div>
            </SheetHeader>
            <div className="h-[calc(85vh-60px)]">
              <TranscriptChat transcript={video.Transcript} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
