

import { useState } from 'react'
import { MessageSquare, Phone, Mail, Clock, ChevronDown, ChevronUp, HelpCircle, AlertTriangle, FileQuestion, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

const Support = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [activeFaq, setActiveFaq] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to SkyWay support. How can I help you today?',
      time: new Date()
    }
  ])
  const [chatLoading, setChatLoading] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    bookingRef: '',
    subject: '',
    message: ''
  })
  const [ticketSubmitted, setTicketSubmitted] = useState(false)

  // FAQs data
  const faqs = [
    {
      id: 1,
      category: 'Booking',
      questions: [
        {
          id: 'booking-1',
          question: 'How do I change my flight?',
          answer: 'You can change your flight through the "Manage Booking" section. Enter your booking reference and last name to retrieve your booking, then select "Modify Booking". Please note that fare differences and change fees may apply depending on your fare conditions.'
        },
        {
          id: 'booking-2',
          question: 'What is your cancellation policy?',
          answer: 'Cancellation policies vary depending on the fare type you purchased. Generally, refundable tickets can be fully refunded, while non-refundable tickets may incur fees or provide a partial refund. To view the specific cancellation policy for your booking, go to "Manage Booking" and check the fare rules.'
        },
        {
          id: 'booking-3',
          question: 'How can I add baggage to my booking?',
          answer: 'You can add extra baggage to your booking through the "Manage Booking" section. After retrieving your booking, select "Add Services" and then "Baggage". You can add baggage up to 4 hours before your flight departure.'
        }
      ]
    },
    {
      id: 2,
      category: 'Check-in',
      questions: [
        {
          id: 'checkin-1',
          question: 'When can I check in online?',
          answer: 'Online check-in typically opens 24 hours before your scheduled departure time and closes 1 hour before departure. You can check in through our website or mobile app by entering your booking reference and last name.'
        },
        {
          id: 'checkin-2',
          question: 'How do I get my boarding pass?',
          answer: 'After completing the online check-in process, you can download or print your boarding pass, or have it sent to your email. You can also save it to your mobile wallet or access it from the SkyWay mobile app.'
        }
      ]
    },
    {
      id: 3,
      category: 'Baggage',
      questions: [
        {
          id: 'baggage-1',
          question: 'What are the baggage allowance limits?',
          answer: 'Baggage allowance varies by route, fare class, and frequent flyer status. Economy passengers typically get 1 checked bag (23kg), Premium Economy gets 2 bags, and Business/First Class get 2-3 bags. Carry-on allowance is typically one bag (8kg) plus a personal item.'
        },
        {
          id: 'baggage-2',
          question: 'What items are prohibited in checked baggage?',
          answer: 'Prohibited items include hazardous materials (flammables, explosives, toxic substances), firearms and weapons (without proper documentation), perishable items, and valuables (jewelry, cash, electronics). We recommend carrying valuables, medications, and essential documents in your carry-on.'
        }
      ]
    },
    {
      id: 4,
      category: 'Refunds',
      questions: [
        {
          id: 'refunds-1',
          question: 'How long do refunds take to process?',
          answer: 'Refund processing times vary depending on your payment method. Credit card refunds typically take 7-10 business days to appear on your statement, while bank transfers may take 10-15 business days. Some fare types may only provide airline credit instead of a monetary refund.'
        },
        {
          id: 'refunds-2',
          question: 'Can I get a refund for a missed flight?',
          answer: 'Generally, no refunds are issued for missed flights unless you have a fully flexible ticket. If you know in advance that you will miss your flight, contact customer support as soon as possible. In some cases, we may be able to rebook you on a later flight (fees may apply).'
        }
      ]
    },
    {
      id: 5,
      category: 'Special Assistance',
      questions: [
        {
          id: 'special-1',
          question: 'How do I request special assistance for my flight?',
          answer: 'To request special assistance (such as wheelchair service, assistance for visual or hearing impairments, or help with medical equipment), you can add it during the booking process or later through the "Manage Booking" section. For specific medical requirements, please contact our Special Assistance team at least 48 hours before your flight.'
        },
        {
          id: 'special-2',
          question: 'Can I travel with my service animal?',
          answer: 'Yes, service animals are permitted on our flights. Please notify us at least 48 hours before your flight and bring appropriate documentation. Service animals must remain on the floor at your feet and not obstruct aisles or emergency exits. For international travel, additional requirements may apply based on destination country regulations.'
        }
      ]
    }
  ]

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    // Add user message to chat
    const newUserMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      text: chatMessage,
      time: new Date()
    }
    
    setChatHistory([...chatHistory, newUserMessage])
    setChatMessage('')
    setChatLoading(true)

    // Simulate bot response after delay
    setTimeout(() => {
      // Simple keyword-based responses for demo
      let botResponse = "I'm not sure I understand. Could you please provide more details or try asking a different question?"
      
      const message = chatMessage.toLowerCase()
      
      if (message.includes('change') && message.includes('flight')) {
        botResponse = "You can change your flight through the 'Manage Booking' section. Enter your booking reference and last name, then select 'Modify Booking'. Please note that fare differences and change fees may apply."
      } 
      else if (message.includes('cancel') || message.includes('refund')) {
        botResponse = "Our cancellation policy varies depending on your fare type. To check your specific options, go to 'Manage Booking' and view your booking details. You can initiate a cancellation from there if eligible."
      }
      else if (message.includes('baggage') || message.includes('luggage')) {
        botResponse = "You can add extra baggage to your booking through the 'Manage Booking' section up to 4 hours before departure. Economy fares typically include 1 checked bag (23kg), while Premium Economy and Business Class include more."
      }
      else if (message.includes('check-in') || message.includes('checkin')) {
        botResponse = "Online check-in opens 24 hours before your flight and closes 1 hour before departure. You can check in via our website or mobile app by entering your booking reference and last name."
      }
      else if (message.includes('boarding pass')) {
        botResponse = "After completing online check-in, you can download or print your boarding pass, or have it sent to your email. You can also save it to your mobile wallet or access it from the SkyWay mobile app."
      }
      else if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
        botResponse = "You can reach our customer service team at +1 (800) SKY-WAYS or email support@skyway-flights.com. Our agents are available 24/7 to assist you."
      }
      
      const newBotMessage = {
        id: chatHistory.length + 2,
        sender: 'bot',
        text: botResponse,
        time: new Date()
      }
      
      setChatHistory(prev => [...prev, newBotMessage])
      setChatLoading(false)
    }, 1500)
  }

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    
    // Simulate form submission
    setTimeout(() => {
      setTicketSubmitted(true)
    }, 1000)
  }

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target
    setTicketForm({
      ...ticketForm,
      [name]: value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
          <p className="text-gray-600 mb-6">We're here to help with any questions or concerns you may have.</p>
          
          {/* Support Tabs */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-4 text-center font-medium ${
                  activeTab === 'chat'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <div className="flex items-center justify-center">
                  <MessageSquare size={18} className="mr-2" />
                  Live Chat
                </div>
              </button>
              
              <button
                className={`flex-1 py-4 px-4 text-center font-medium ${
                  activeTab === 'ticket'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('ticket')}
              >
                <div className="flex items-center justify-center">
                  <FileQuestion size={18} className="mr-2" />
                  Support Ticket
                </div>
              </button>
              
              <button
                className={`flex-1 py-4 px-4 text-center font-medium ${
                  activeTab === 'faq'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('faq')}
              >
                <div className="flex items-center justify-center">
                  <HelpCircle size={18} className="mr-2" />
                  FAQs
                </div>
              </button>
            </div>
            
            <div className="p-6">
              {/* Live Chat */}
              {activeTab === 'chat' && (
                <div className="h-[500px] flex flex-col">
                  <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                    {chatHistory.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white shadow-sm'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {chatLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700"
                      disabled={!chatMessage.trim() || chatLoading}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Support Ticket */}
              {activeTab === 'ticket' && (
                <div>
                  {ticketSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                        <Check size={32} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Ticket Submitted Successfully</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for contacting us. Your ticket has been submitted successfully. Our support team will respond to your inquiry within 24 hours.
                      </p>
                      <p className="font-medium">Reference: TCKT-{Math.floor(100000 + Math.random() * 900000)}</p>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setTicketSubmitted(false)
                            setTicketForm({
                              name: '',
                              email: '',
                              bookingRef: '',
                              subject: '',
                              message: ''
                            })
                          }}
                          className="btn btn-outline"
                        >
                          Submit Another Ticket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={ticketForm.name}
                              onChange={handleTicketInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={ticketForm.email}
                              onChange={handleTicketInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="bookingRef" className="block text-sm font-medium text-gray-700 mb-1">
                            Booking Reference (optional)
                          </label>
                          <input
                            type="text"
                            id="bookingRef"
                            name="bookingRef"
                            value={ticketForm.bookingRef}
                            onChange={handleTicketInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={ticketForm.subject}
                            onChange={handleTicketInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={ticketForm.message}
                            onChange={handleTicketInputChange}
                            rows="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            required
                          ></textarea>
                        </div>
                        
                        <div className="text-right">
                          <button
                            type="submit"
                            className="btn btn-primary"
                          >
                            Submit Ticket
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
              
              {/* FAQs */}
              {activeTab === 'faq' && (
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {faqs.map((category) => (
                      <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 font-medium">
                          {category.category}
                        </div>
                        
                        <div className="p-4 space-y-3">
                          {category.questions.map((faq) => (
                            <div key={faq.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                              <button
                                className="w-full flex justify-between items-center text-left font-medium py-2"
                                onClick={() => toggleFaq(faq.id)}
                              >
                                <span>{faq.question}</span>
                                {activeFaq === faq.id ? (
                                  <ChevronUp size={18} className="text-gray-500" />
                                ) : (
                                  <ChevronDown size={18} className="text-gray-500" />
                                )}
                              </button>
                              
                              {activeFaq === faq.id && (
                                <div className="mt-2 text-gray-600 pl-4">
                                  <p>{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Phone size={28} className="text-primary-600 mb-3" />
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-2">24/7 Customer Service</p>
                <p className="font-medium">+1 (800) SKY-WAYS</p>
                <p className="text-sm text-gray-500 mt-2">International: +1 (123) 456-7890</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Mail size={28} className="text-primary-600 mb-3" />
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-gray-600 mb-2">Response within 24 hours</p>
                <p className="font-medium">support@skyway-flights.com</p>
                <p className="text-sm text-gray-500 mt-2">For urgent matters, please call</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Clock size={28} className="text-primary-600 mb-3" />
                <h3 className="font-medium mb-2">Hours of Operation</h3>
                <p className="text-gray-600 mb-2">Live Chat & Phone</p>
                <p className="font-medium">24 hours / 7 days</p>
                <p className="text-sm text-gray-500 mt-2">Including holidays</p>
              </div>
            </div>
          </div>
          
          {/* Emergency Support */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle size={24} className="text-red-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Travel Support</h3>
                <p className="text-red-700 mb-4">
                  If you're currently traveling and experiencing an urgent situation requiring immediate assistance, please use our emergency hotline.
                </p>
                <p className="font-medium text-red-800">Emergency Hotline: +1 (800) 999-9999</p>
              </div>
            </div>
          </div>
          
          {/* Self-Service Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link 
              to="/manage-booking" 
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">Manage Your Booking</h3>
              <p className="text-gray-600 mb-4">
                Change flights, select seats, add extras, or update passenger information.
              </p>
              <div className="text-primary-600 font-medium">
                Go to Manage Booking →
              </div>
            </Link>
            
            <Link 
              to="/flight-status" 
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">Check Flight Status</h3>
              <p className="text-gray-600 mb-4">
                Get real-time updates about your flight, including delays and gate information.
              </p>
              <div className="text-primary-600 font-medium">
                Check Flight Status →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
