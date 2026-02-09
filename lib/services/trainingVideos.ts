import videosData from '@/lib/training_videos.json';

export type QuizQuestion = {
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  timestamp: number;
};

export type TrainingVideoType = {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  Transcript?: string;
  createdAt?: Date;
  updatedAt?: Date;
  questions?: QuizQuestion[];
  language: string;
};

// 🔹 Read All
export const getAllTrainingVideos = async (
  language: string,
): Promise<TrainingVideoType[]> => {
  // Default to Hindi/English if no language provided, or filter by language if needed.
  // The JSON has mixed languages. If language arg is passed, we filter.
  const lang = language || 'Hindi';

  // Parse the JSON data
  // Use 'any' cast for initial data if types don't perfectly align (like string dates vs Date objects)
  const videos = (videosData as any[]).map((video) => ({
    ...video,
    createdAt: video.createdAt ? new Date(video.createdAt) : new Date(),
    updatedAt: video.updatedAt ? new Date(video.updatedAt) : new Date(),
  })) as TrainingVideoType[];

  if (!language) return videos;

  // Optional: Filter by language if required, but for now returning all might be safer
  // or filtering exactly as properly requested.
  // The user's JSON has "Kannada", "Bangla", "English", "Tamil".
  // Let's filter if a specific language is requested, otherwise return all
  // (or maybe strictly filter like the firebase query did).

  return videos.filter((v) => v.language === lang);
};

// 🔹 Read One
export const getTrainingVideoById = async (
  id: string,
): Promise<TrainingVideoType | null> => {
  const video = (videosData as any[]).find((v) => v.id === id);

  if (!video) return null;

  return {
    ...video,
    createdAt: video.createdAt ? new Date(video.createdAt) : new Date(),
    updatedAt: video.updatedAt ? new Date(video.updatedAt) : new Date(),
  } as TrainingVideoType;
};
