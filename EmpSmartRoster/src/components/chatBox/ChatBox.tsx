import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import ChatBot from 'react-simple-chatbot';
import SAFAQController from "../../controller/SAFAQController";

import { BsChatLeftDotsFill } from "react-icons/bs";
import { IoClose, FiRefreshCw } from '../../../public/Icons.js';
import './ChatBox.css'
import '../../../public/styles/common.css'

// API call handler
const { handleSubmitQuesToChatBox } = SAFAQController;


// Custom component to fetch and display API answer
const ApiResponse = ({ previousStep, triggerNextStep }: any) => {
    const { showAlert } = useAlert();
    const [ answer, setAnswer ] = useState("Let me check for you...");


    const triggerSendQuestion = async() => {
        try {
                const response = await handleSubmitQuesToChatBox(previousStep.value);
                if (response?.answer) {
                    setAnswer(response.answer);
                } else {
                    setAnswer("Sorry, I couldn’t find an answer.");
                }
            } catch (error: any) {
                showAlert("Error", error.message || "Something went wrong.", "", { type: "error" });
                setAnswer("Sorry, something went wrong.");
            } finally {
                // Automatically move to the next step after 2 seconds
                setTimeout(() => {
                    triggerNextStep();
                }, 2000);
            }
    }
    useEffect(() => {triggerSendQuestion()}, [previousStep, answer])

    return <div>{answer}</div>;
};

const CustomHeader = ({ toggleChat, resetChat }: { 
    toggleChat: () => void, 
    resetChat: () => void 
}) => (
    <div className="custom-chat-header">
        <span>EmpRoster Assistant</span>
        <div className="custom-chat-header-btns-grp">
            <FiRefreshCw 
                className="chatbot-header-btn" 
                onClick={resetChat}
            />
            <IoClose 
                className="chatbot-header-close-box" 
                onClick={toggleChat} 
            />
        </div>
    </div>
);

const EmpRosterChat = () => {
    const [ showChat, setShowChat ] = useState(false);
    const [ chatKey, setChatKey ] = useState(0);
    const location = useLocation()
    const isOnLanding = location.pathname.includes('home');
    const isOnLogin = location.pathname.includes('login');
    const isOnRegister = location.pathname.includes('register');
    const isOnReqResetEmail = location.pathname.includes('request-reset-pw-email');
    const isOnResetPw = location.pathname.includes('reset-pw');
    const isOnPreviewLanding = location.pathname.includes('preview-landing-page');

    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ 
    x: window.innerWidth - 82,
    y: window.innerHeight - 82
});
    const isDraggingRef = useRef(false);
    const initialMouseXRef = useRef(0);
    const initialMouseYRef = useRef(0);
    const initialPosXRef = useRef(0);
    const initialPosYRef = useRef(0);
    const isDragRef = useRef(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const deltaX = e.clientX - initialMouseXRef.current;
        const deltaY = e.clientY - initialMouseYRef.current;

        let newX = initialPosXRef.current + deltaX;
        let newY = initialPosYRef.current + deltaY;

        // Boundary checks
        const buttonWidth = buttonRef.current?.offsetWidth || 50;
        const buttonHeight = buttonRef.current?.offsetHeight || 50;
        
        // Restrict to left edge
        newX = Math.max(0, newX);
        // Restrict to top edge
        newY = Math.max(0, newY);
        // Restrict to right edge (window width - button width)
        newX = Math.min(window.innerWidth - buttonWidth, newX);
        // Restrict to bottom edge (window height - button height)
        newY = Math.min(window.innerHeight - buttonHeight, newY);

        setPosition({ x: newX, y: newY });

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isDragRef.current = true;
        }
    }, []);

    // Set initial position when button mounts
    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top });
        }
    }, [buttonRef.current]);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleClick = useCallback(() => {
        if (isDragRef.current) {
            isDragRef.current = false;
            return;
        }
        toggleShowChatBox();
    }, []);
    
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        initialPosXRef.current = rect.left;
        initialPosYRef.current = rect.top;
        initialMouseXRef.current = e.clientX;
        initialMouseYRef.current = e.clientY;
        isDraggingRef.current = true;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp]);
    

    const steps = [
        {
            id: '1',
            message: `Welcome to EmpRoster. We are from FYP-25-S1-12. What can I help you? (^_^)`,
            trigger: 'user_input',
        },
        {
            id: 'user_input',
            user: true,
            trigger: 'processing',
        },
        {
            id: 'processing',
            component: <ApiResponse />,
            asMessage: true,
            waitAction: true,
            trigger: 'other-question',
        },
        {
            id: 'other-question',
            options: [
                { value: 'yes', label: 'Yes', trigger: 'update-yes' },
                { value: 'no', label: 'No', trigger: 'end-message' },
            ],
        },
        {
            id: 'update-yes',
            message: 'How can I help you with?',
            trigger: 'user_input',
        },
        {
            id: 'end-message',
            message: 'Thanks! Have a nice day (^_^)',
            end: true,
        },
    ];

    function toggleShowChatBox() {
        setShowChat(!showChat);
    }

    function resetChat(){
        setChatKey(prev => prev + 1);
    };

    if (!showChat 
        && !isOnLanding
        && !isOnLogin
        && !isOnRegister
        && !isOnReqResetEmail
        && !isOnResetPw 
        && !isOnPreviewLanding
    ) {
        return (
            <button 
                className={`chatbot-toggle ${showChat ? 'open' : ''}`}
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                ref={buttonRef}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            >
                {!showChat  
                    ? <BsChatLeftDotsFill className="chatbot-toggle-icon"/> 
                    : <></>
                }
            </button>
        );
    }

    return (
        <>
        {!isOnLanding
         && !isOnLogin
         && !isOnRegister
         && !isOnReqResetEmail
         && !isOnResetPw 
         && !isOnPreviewLanding 
         && (
            <div className="custom-chat-container">
                {/* Your custom header */}
                <CustomHeader 
                    toggleChat={() => toggleShowChatBox()}
                    resetChat={() => resetChat()}
                />
                
                {/* The actual chatbot */}
                <ChatBot
                    key={chatKey}
                    steps={steps}
                    hideHeader={true}
                    recognitionEnable={true}

                />
            </div>
        )}
        </>
    );
}

export default EmpRosterChat;
