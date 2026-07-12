export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeMap[size]} border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin`} />
      {text && <p className="text-white/40 text-sm">{text}</p>}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-sm">
        🤖
      </div>
      <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
        <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full block" />
        <span className="typing-dot w-2 h-2 bg-blue-400 rounded-full block" />
      </div>
    </div>
  )
}
