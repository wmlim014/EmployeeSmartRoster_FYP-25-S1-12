declare module 'react-simple-chatbot' {
    import { ComponentType, ReactElement } from 'react';
    
    interface ChatBotProps {
      steps: Array<Step>;
      headerTitle?: string;
      recognitionEnable?: boolean;
      hideHeader?: boolean;
      // Add other props you use here
    }
  
    type Step = {
      id: string;
      message?: string;
      trigger?: string | ((value: any) => string);
      user?: boolean;
      validator?: (value: string) => boolean | string;
      component?: ReactElement;
      asMessage?: boolean;
      waitAction?: boolean;
      // Add other step properties you use
    };
  
    const ChatBot: ComponentType<ChatBotProps>;
    export default ChatBot;
  }