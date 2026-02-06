const Loading = () => {
  return (
    <div className="absolute inset-0 z-[999] flex h-screen w-full items-center justify-center bg-background">
      <div className="animate-loader border-t-subtle size-8 rounded-full border-2 border-border" />
    </div>
  );
};

export default Loading;
