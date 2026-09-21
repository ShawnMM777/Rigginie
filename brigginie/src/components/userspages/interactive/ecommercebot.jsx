import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { productAPI } from '../../../services/api';

const CHATBOT_RESPONSES = {
    product_recommendation: {
        trigger: ['recommend', 'suggest', 'best', 'popular', 'what should'],
        responses: [
            "Our bestselling GPUs include NVIDIA RTX 4080 and RTX 4070. For CPUs, Intel Core i9 and AMD Ryzen 9 are top choices. What type of PC are you building?",
            "🎮 **Popular Choices**: NVIDIA RTX 4060Ti, Intel i7-13700K, ASUS ROG Motherboards. What's your budget?"
        ]
    },
    shipping: {
        trigger: ['shipping', 'delivery', 'how long', 'when arrive', 'track order'],
        responses: [
            "📦 We offer free shipping on orders over ₱5,000! Standard delivery is 3-5 business days. Express shipping available for ₱500.",
            "You can track your order in the Account section using your Order ID. Need help finding it?"
        ]
    },
    returns: {
        trigger: ['return', 'refund', 'exchange', 'warranty', 'broken'],
        responses: [
            "✅ We offer 30-day returns on most products, 1-year warranty on all items. Contact our support team with your Order ID.",
            "Defective items can be exchanged within 7 days. Please provide a photo and description of the issue."
        ]
    },
    payment: {
        trigger: ['payment', 'pay', 'accept', 'card', 'gcash', 'installment'],
        responses: [
            "💳 We accept: Credit Cards, Debit Cards, GCash, PayMaya, Bank Transfer, and Installment Plans (0% interest available).",
            "For installment plans, orders over ₱10,000 qualify for 3-12 month payment plans. Apply at checkout!"
        ]
    },
    account: {
        trigger: ['account', 'login', 'password', 'profile', 'sign up', 'register'],
        responses: [
            "📝 New here? Click Register at the top-right to create an account. Takes less than 2 minutes!",
            "Forgot your password? Click 'Forgot Password' on the login page to reset it via email."
        ]
    },
    build_help: {
        trigger: ['build', 'pc build', 'compatible', 'specs', 'configuration'],
        responses: [
            "🖥️ Check out our **AI Build** tool - it recommends components based on your needs & budget! Visit the 'AI Build' section.",
            "Need help? Our **PC Compatibility Checker** ensures all parts work together. Ask specific components!"
        ]
    },
    sales: {
        trigger: ['sale', 'discount', 'coupon', 'promo', 'deal'],
        responses: [
            "🎉 Current promotions: 15% off GPUs, Free shipping on orders over ₱5,000, Loyalty rewards on every purchase!",
            "Subscribe to our newsletter for exclusive deals and early access to flash sales!"
        ]
    },
    contact: {
        trigger: ['contact', 'support', 'help', 'phone', 'email', 'call us'],
        responses: [
            "📞 **Customer Support**: Email: support@rigginie.com | Phone: (02) XXXX-XXXX | Chat: Available 9am-6pm",
            "Our support team is here to help! For urgent issues, call us directly."
        ]
    },
    default: {
        responses: [
            "I'm here to help! You can ask me about products, shipping, returns, payments, or anything else. What can I assist with?",
            "Feel free to ask about: Product Recommendations, Shipping & Delivery, Returns, Payment Options, PC Builds, or Our Policies.",
            "Not sure what to ask? Try: 'Recommend a GPU', 'Shipping info', 'Return policy', or 'Payment options'."
        ]
    }
};

function EcommerceBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "👋 Hi! I'm Rigginie Bot. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const findMatchingResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [key, config] of Object.entries(CHATBOT_RESPONSES)) {
            if (key === 'default') continue;
            if (config.trigger.some(trigger => lowerMessage.includes(trigger))) {
                return config.responses[0];
            }
        }
        
        return CHATBOT_RESPONSES.default.responses[0];
    };

    const PRODUCT_TERMS = ['gpu', 'graphics', 'rtx', 'radeon', 'cpu', 'processor', 'laptop', 'monitor', 'keyboard', 'mouse', 'ram', 'ssd', 'hdd', 'motherboard', 'power supply', 'case'];

    const getProductSearchTerm = (message) => {
        const normalizedMessage = message
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, ' ')
            .replace(/\b(show|find|me|my|the|please|available|products?|recommend|suggest|best|for|a|an|what|is|are|in|stock)\b/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const hasProductTerm = PRODUCT_TERMS.some(term => normalizedMessage.includes(term));
        const hasModelNumber = /\d{3,}/.test(normalizedMessage);
        return hasProductTerm || hasModelNumber ? normalizedMessage : '';
    };

    const searchProducts = async (searchTerm) => {
        const productSearchTerm = getProductSearchTerm(searchTerm);
        if (!productSearchTerm) return [];

        const response = await productAPI.getAll(null, productSearchTerm);
        return response.data;
    };

    const handleSendMessage = async (message = null) => {
        const textToSend = message || inputValue.trim();
        if (!textToSend) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setIsTyping(true);
        try {
            const products = await searchProducts(textToSend);
            const botMessage = {
                id: messages.length + 2,
                text: products.length
                    ? `Available products matching "${textToSend}":`
                    : findMatchingResponse(textToSend),
                products: products.length ? products : [],
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch {
            setMessages(prev => [...prev, {
            id: messages.length + 2,
                text: 'I could not load products right now. Please try again in a moment.',
                sender: 'bot',
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickReplies = [
        '🎮 Recommend a product',
        '📦 Shipping info',
        '💳 Payment options',
        '↩️ Return policy',
        '🖥️ PC Build help',
        '📞 Contact support'
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <FaRobot className="text-lg" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Rigginie Bot</h3>
                                <p className="text-xs text-white/80">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Close chat"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                                        msg.sender === 'user'
                                            ? 'bg-orange-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                    }`}
                                >
                                    <div className="leading-relaxed whitespace-pre-wrap break-words">
                                        {msg.text.split('\n').map((line, i) => (
                                            <div key={i}>{line}</div>
                                        ))}
                                    </div>
                                    {msg.products?.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.products.map((product) => (
                                                <div key={product.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-900">
                                                    <div className="font-semibold">{product.name}</div>
                                                    <div className="text-orange-600 font-medium">₱{Number(product.price).toLocaleString()}</div>
                                                    <div className="text-xs text-gray-500">{product.stock} in stock</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                    <span className="text-xs">🤖</span>
                                </div>
                                <div className="flex gap-1 items-center bg-white px-3 py-2 rounded-lg border border-gray-200">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {!isTyping && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-white max-h-24 overflow-y-auto">
                            <p className="text-xs text-gray-500 mb-2 font-semibold">Quick replies:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(reply)}
                                        className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors border border-orange-200 whitespace-nowrap"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                            aria-label="Send message"
                        >
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 ${
                    isOpen
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : 'bg-orange-500 hover:bg-orange-600'
                } text-white text-2xl`}
                aria-label="Open chat"
            >
                {isOpen ? <FaTimes /> : <FaComments />}
            </button>
        </div>
    );
}

export default EcommerceBot;
