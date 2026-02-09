'use client';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { type PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { useVoiceToText } from '@/hooks/use-voice-to-text';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Check,
  Copy,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  StopCircle,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TranscriptChatProps {
  transcript?: string;
  className?: string;
  apiEndpoint?: string;
}

export function TranscriptChat({
  transcript,
  className,
  apiEndpoint = '/api/chat',
}: TranscriptChatProps) {
  const [text, setText] = useState('');
  const transcriptRef = useRef(transcript);
  // @ts-ignore
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: apiEndpoint,
      prepareSendMessagesRequest: async ({ id, messages, trigger }) => {
        return {
          body: {
            messages,
            transcript: cleanTranscript(transcriptRef.current),
          },
        };
      },
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    sendMessage({
      text: message.text,
    });
    setText('');
    setText('');
  };

  const { isListening, toggleListening, hasSupport } = useVoiceToText({
    onTranscript: (newText) => {
      setText((prev) => {
        const prefix = prev.trim() ? prev.trim() + ' ' : '';
        return prefix + newText;
      });
    },
  });

  // --- Message Actions Logic ---
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [reactions, setReactions] = useState<
    Record<string, 'like' | 'dislike' | null>
  >({});

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSpeak = async (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      // Stop
      audioRef.current?.pause();
      setPlayingMessageId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      setIsLoadingAudio(messageId);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS Failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => setPlayingMessageId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingMessageId(messageId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAudio(null);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReaction = (id: string, type: 'like' | 'dislike') => {
    setReactions((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  return (
    <div className={`flex h-full flex-col ${className || ''}`}>
      <Conversation className="flex-1">
        <ConversationContent className="p-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageCircle className="size-12 text-[#219E82]" />}
              title="AI Video Assistant"
              description="Ask me anything about this video!"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`}>
                            <MessageResponse>{part.text}</MessageResponse>
                            {message.role === 'assistant' && (
                              <MessageActions className="mt-2 gap-3 text-slate-400">
                                <MessageAction
                                  tooltip={
                                    playingMessageId === message.id
                                      ? 'Stop'
                                      : 'Listen'
                                  }
                                  onClick={() =>
                                    handleSpeak(message.id, part.text)
                                  }>
                                  {isLoadingAudio === message.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : playingMessageId === message.id ? (
                                    <StopCircle className="size-4 text-red-500" />
                                  ) : (
                                    <Volume2 className="size-4" />
                                  )}
                                </MessageAction>
                                <div className="mx-2 h-4 w-px bg-slate-200" />
                                <MessageAction
                                  tooltip="Helpful"
                                  onClick={() =>
                                    handleReaction(message.id, 'like')
                                  }>
                                  <ThumbsUp
                                    className={`size-4 ${reactions[message.id] === 'like' ? 'fill-blue-500 text-blue-500' : ''}`}
                                  />
                                </MessageAction>
                                <MessageAction
                                  tooltip="Not helpful"
                                  onClick={() =>
                                    handleReaction(message.id, 'dislike')
                                  }>
                                  <ThumbsDown
                                    className={`size-4 ${reactions[message.id] === 'dislike' ? 'fill-red-500 text-red-500' : ''}`}
                                  />
                                </MessageAction>
                                <MessageAction
                                  tooltip="Copy"
                                  onClick={() =>
                                    handleCopy(message.id, part.text)
                                  }>
                                  {copiedId === message.id ? (
                                    <Check className="size-4 text-green-500" />
                                  ) : (
                                    <Copy className="size-4" />
                                  )}
                                </MessageAction>
                              </MessageActions>
                            )}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === 'submitted' && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="bg-white/50 p-4 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ text, files: [] });
          }}
          className="flex w-full items-center rounded-2xl border border-slate-200 bg-white pr-2 shadow-lg">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about the video..."
            className="max-h-[200px] min-h-[48px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm shadow-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (text.trim()) {
                  handleSubmit({ text, files: [] });
                }
              }
            }}
          />

          {hasSupport && (
            <button
              type="button"
              onClick={toggleListening}
              className={`mr-2 flex size-8 items-center justify-center rounded-full p-0 transition-all ${isListening ? 'animate-pulse bg-red-100 text-red-600' : 'text-slate-500 hover:bg-slate-100'}`}
              title={isListening ? 'Stop recording' : 'Start recording'}>
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim() && status !== 'streaming'}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#219E82] p-0 text-white transition-all hover:bg-[#1B8A71] disabled:bg-slate-200 disabled:opacity-50">
            {status === 'streaming' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-square">
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up">
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Helper function to clean transcript
function cleanTranscript(raw?: string): string {
  if (!raw) return '';
  try {
    return JSON.parse(JSON.parse(raw))
      .map((t: { text: string }) => t.text)
      .join(', ');
  } catch {
    return raw;
  }
}
