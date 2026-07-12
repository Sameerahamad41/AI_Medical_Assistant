import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../services/services'
import ChatBubble from '../components/ChatBubble'
import { TypingIndicator } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { FiSend, FiTrash2, FiMic, FiMicOff, FiVolumeX } from 'react-icons/fi'

const QUICK_PROMPTS = [
  'I have a headache and fever',
  'What causes high blood pressure?',
  'Tips for better sleep',
  'What are symptoms of diabetes?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      isUser: false,
      text: '👋 Hello! I\'m your AI medical assistant powered by Groq. I can help you with health questions, symptoms, and general medical information.\n\n**How can I help you today?**'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Voice State
  const [isVoiceMode, setIsVoiceMode] = useState(false) // Toggle between Text and Voice
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + (prev ? ' ' : '') + transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please allow it in your browser settings.')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [])

  // Speech Synthesis (Text-to-Speech)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel() // Stop any ongoing speech

    // Remove markdown symbols to make speech sound natural
    const cleanText = text.replace(/[*_#`~]/g, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'en-US'
    utterance.rate = 1.05
    utterance.pitch = 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleListen = () => {
    if (!recognitionRef.current) {
      toast.error('Voice input is not supported in this browser.')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const messageText = text || input.trim()
    if (!messageText) return

    setMessages(prev => [...prev, { id: Date.now(), isUser: true, text: messageText }])
    setInput('')
    setLoading(true)
    stopSpeaking() // Stop talking when sending a new message

    try {
      const res = await chatService.sendMessage(messageText)
      let aiText = res.data.data.aiResponse
      
      let shouldRedirect = false
      if (aiText.includes('[REDIRECT_TO_APPOINTMENT]')) {
        shouldRedirect = true
        aiText = aiText.replace('[REDIRECT_TO_APPOINTMENT]', '').trim()
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, isUser: false, text: aiText }])
      
      if (isVoiceMode) {
        speakText(aiText) // Auto-speak AI response only in voice mode
      }
      
      if (shouldRedirect) {
        setTimeout(() => {
          navigate('/appointments', { state: { symptoms: messageText } })
        }, 2000)
      }
    } catch (err) {
      toast.error('Failed to get response. Please try again.')
      setMessages(prev => [...prev, {
        id: Date.now() + 1, isUser: false,
        text: '❌ Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    stopSpeaking()
    setMessages([{
      id: 'welcome',
      isUser: false,
      text: '👋 Chat cleared. How can I help you today?'
    }])
  }

  return (
    <div className="flex flex-col h-screen p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-3">
            AI Health Chat
            {isSpeaking && (
              <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs animate-pulse">
                🔊 Speaking...
              </span>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-1">Powered by Groq LLaMA 3.3 70B & Web Speech API</p>
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white transition-colors glass-card px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-500/30">
            <input 
              type="checkbox" 
              className="cursor-pointer accent-blue-500"
              checked={isVoiceMode}
              onChange={(e) => {
                setIsVoiceMode(e.target.checked)
                if (!e.target.checked) stopSpeaking()
              }}
            />
            Voice Mode
          </label>
          <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
          {isSpeaking && (
            <button onClick={stopSpeaking} className="btn-danger flex items-center gap-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 px-3 py-1.5 rounded-lg transition-all">
              <FiVolumeX size={14} /> Stop
            </button>
          )}
          <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-sm">
            <FiTrash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_PROMPTS.map(prompt => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full glass-card text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 hover:border-blue-500/30 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 glass-card rounded-2xl p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card rounded-2xl p-3 flex items-end gap-3 relative">
        {isVoiceMode && (
          <button
            onClick={toggleListen}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
            title={isListening ? "Stop listening" : "Click to speak"}
          >
            {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </button>
        )}

        <textarea
          ref={inputRef}
          rows={1}
          className="flex-1 bg-transparent resize-none text-white placeholder-white/30 text-sm focus:outline-none py-2 max-h-32"
          placeholder={isListening ? "Listening... Speak now" : "Ask anything about your health..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ overflowY: 'auto' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || (!input.trim() && !isListening)}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 text-white"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <FiSend size={16} />
          }
        </button>
      </div>
    </div>
  )
}
