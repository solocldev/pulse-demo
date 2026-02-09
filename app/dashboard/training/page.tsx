'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getAllTrainingVideos,
  TrainingVideoType,
} from '@/lib/services/trainingVideos';
import { Filter, Loader2, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TrainingPage() {
  const [videos, setVideos] = useState<TrainingVideoType[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<TrainingVideoType[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Started'>(
    'All',
  );
  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const languages = [
    'All',
    'English',
    'Hindi',
    'Tamil',
    'Bangla',
    'Gujarati',
    'Kannada',
  ];

  // Local storage persistence
  const [videoStatuses, setVideoStatuses] = useState<
    Record<string, 'Pending' | 'Started' | 'Completed'>
  >({});

  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await getAllTrainingVideos(''); // Fetch all videos
        setVideos(data);

        // Load statuses from local storage
        const savedStatuses = localStorage.getItem('training_video_statuses');
        const parsedStatuses = savedStatuses ? JSON.parse(savedStatuses) : {};
        setVideoStatuses(parsedStatuses);

        // Initial filter will happen in next effect
        setFilteredVideos(data);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = videos;

    // Language Filter
    if (selectedLanguage !== 'All') {
      result = result.filter((v) => v.language === selectedLanguage);
    }

    // Tab Filter
    if (activeTab !== 'All') {
      result = result.filter((v) => {
        // If status exists, use it. If not, default to "Pending"
        const status = (v.id && videoStatuses[v.id]) || 'Pending';
        // Mapping: "Started" tab shows started/in-progress items. "Pending" shows unstarted.
        if (activeTab === 'Started') return status === 'Started'; // "Completed" could also go here if we had it
        if (activeTab === 'Pending') return status === 'Pending';
        return true;
      });
    }

    setFilteredVideos(result);
  }, [videos, activeTab, selectedLanguage, videoStatuses]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#219E82]" />
      </div>
    );
  }

  // Helper to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Started':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'; // Pending
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Training Library
          </h2>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Language:</span>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full space-x-1 rounded-xl bg-slate-100 p-1 md:w-fit">
        {(['All', 'Pending', 'Started'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 md:flex-none ${
              activeTab === tab
                ? 'bg-white text-[#219E82] shadow-sm ring-1 ring-black/5'
                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
            } `}>
            {tab}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {filteredVideos.map((video) => {
            const status = (video.id && videoStatuses[video.id]) || 'Pending';
            return (
              <Link
                key={video.id}
                href={`/dashboard/training/${video.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Thumbnail Container */}
                <div className="user-select-none relative aspect-video w-full bg-slate-900">
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800">
                      <Play className="h-12 w-12 text-white/20" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-14 w-14 scale-75 transform items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-100">
                      <Play className="ml-1 h-6 w-6 fill-white text-white" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                      {video.category}
                    </span>
                    {video.language && (
                      <span className="rounded-md border border-white/10 bg-[#219E82]/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                        {video.language}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-800 transition-colors group-hover:text-[#219E82]">
                      {video.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>

                  {video.description && (
                    <p className="mt-auto line-clamp-2 text-sm text-slate-500">
                      {video.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <span>
                        {video.createdAt
                          ? new Date(video.createdAt).toLocaleDateString()
                          : 'Recently added'}
                      </span>
                    </div>
                    <span className="font-semibold text-[#219E82] transition-transform group-hover:translate-x-1">
                      {status === 'Pending' ? 'Start' : 'Resume'} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Filter size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            No videos found
          </h3>
          <p className="mt-1 max-w-sm text-slate-500">
            We couldn't find any videos matching your filters.
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                setActiveTab('All');
                setSelectedLanguage('All');
              }}
              className="rounded-lg bg-[#219E82] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1B8A71]">
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
