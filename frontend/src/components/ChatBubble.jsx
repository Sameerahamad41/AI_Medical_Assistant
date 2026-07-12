import ReactMarkdown from 'react-markdown'

export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold
        ${isUser
          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
          : 'bg-gradient-to-br from-cyan-500 to-teal-600'
        }`}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
          : 'glass-card text-white/90 rounded-tl-sm'
      }`}>
        {isUser ? (
          <p className="text-sm leading-relaxed">{message}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
