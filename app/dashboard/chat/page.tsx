import { TranscriptChat } from '@/components/transcript-chat';

export default async function ChatPage() {
  // Read the QA markdown file
  // The file is located at project root/pulse_demo_qa.md
  // We need to resolve the path correctly relative to the project root

  return (
    <div className="flex h-full flex-col space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-slate-500">
          Ask questions about the Two Wheeler Loan.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <TranscriptChat
          transcript={'qaContent'}
          apiEndpoint="/api/chat/qa"
          className="h-full flex-1"
        />
      </div>
    </div>
  );
}
