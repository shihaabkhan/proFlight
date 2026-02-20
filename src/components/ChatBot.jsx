import { useState, useRef, useEffect } from 'react'
import { X, Send, Mic, User } from 'lucide-react'
import Markdown from 'react-markdown';

const ChatBot = ({ onClose }) => {  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm FlightBot, your personal flight assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`) // Create a unique session ID

  // Quick actions for common queries
  const quickActions = [
    { id: 1, text: 'Book my Flight' },
    { id: 2, text: 'Rechedule my booking' },
    { id: 3, text: 'Can i reschedule my flight ?' }
  ]

  // Scroll to bottom of message container when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const callFlightAssistantAPI = async (message) => {
    try {
      setIsLoading(true)

      // 'http://74.225.169.115:6389/api/v1/vanij/playground/qdnazngjavfv',
      const response = await fetch(
        'http://74.225.169.115:3006/api/v1/vanij/playground/hesyxwneliyf',
       {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Vanij-Token': 'ZFRmxYLHYrInWHlLICaHXTRyFuqauNDTQyrbMObYcKLkfPVruEXcsvTySUmgpqBrQJCZmgKJFIaqqdqjhITcSbSrpVhpfPYDRoaZugfDtjxYacMPNopyAkbLftBaLevx'
        },
        body: JSON.stringify({
          data: {
            session_id: sessionId,
            message: message,
            extra_details: {}
          }
        
        })
      })

      const result = await response.json()

      if (result.meta.status) {
        // Process successful response
        if (result.data.messages && result.data.messages.length > 0) {
          // Handle array of messages from the API
          const apiMessages = result.data.messages.map(msg => {
            // If message is an object, convert to string as needed
            const messageText = typeof msg === 'object' ? JSON.stringify(msg) : msg.toString();
            return {
              id: messages.length + Math.random(),
              text: messageText,
              sender: 'bot',
              timestamp: new Date()
            };
          });
          
          setMessages(prev => [...prev, ...apiMessages]);
        } else {
          // Fallback if no messages are returned
          setMessages(prev => [
            ...prev, 
            {
              id: messages.length + 2,
              text: "I'm having trouble processing your request right now. Please try again later.",
              sender: 'bot',
              timestamp: new Date(),
            }
          ]);
        }
      } else {
        // Handle error response
        console.error("API Error:", result.meta.message)
        setMessages(prev => [
          ...prev, 
          {
            id: messages.length + 2,
            text: "Sorry, I encountered an error while processing your request. Please try again.",
            sender: 'bot',
            timestamp: new Date(),
          }
        ]);
      }
    } catch (error) {
      console.error("Error calling Flight Assistant API:", error);
      setMessages(prev => [
        ...prev, 
        {
          id: messages.length + 2,
          text: "Connection error. Please check your internet connection and try again.",
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSend = () => {
    if (input.trim() === '') return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setInput('')
    
    // Call the Flight Assistant API with the user's message
    callFlightAssistantAPI(input)
  }

  const handleQuickAction = (action) => {
    // Add user message from quick action
    const userMessage = {
      id: messages.length + 1,
      text: action.text,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    
    // Call the Flight Assistant API with the quick action text
    callFlightAssistantAPI(action.text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const toggleRecording = () => {
    // In a real app, this would use the Web Speech API
    setIsRecording(!isRecording)
    if (isRecording) {
      // Simulate end of recording and transcription
      setTimeout(() => {
        setInput('I need help with my booking')
        setIsRecording(false)
      }, 1500)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-full max-w-sm bg-white rounded-xl shadow-xl z-50 overflow-hidden flex flex-col h-[500px] md:h-[600px]">
      {/* ChatBot Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">FlightBot</h3>
            <p className="text-xs text-primary-100">Online | Always ready to help</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-primary-200">
          <X size={24} />
        </button>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg  whitespace-pre-wrap break-words  ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-white shadow-md rounded-tl-none'
              }`}
            >
            <Markdown >
                {message.text}
            </Markdown>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white p-3 rounded-lg shadow-md rounded-tl-none max-w-[80%]">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="px-3 py-1 rounded-full border border-gray-300 bg-white text-sm hover:bg-gray-100"
              onClick={() => handleQuickAction(action)}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={`p-2 ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={toggleRecording}
          >
            <Mic size={20} />
          </button>
          <button
            className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700"
            onClick={handleSend}
            disabled={input.trim() === ''}
          >
            <Send size={20} />
          </button>
        </div>
        {isRecording && (
          <p className="text-center text-sm text-red-500 mt-2 animate-pulse">
            Listening... Speak now
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatBot