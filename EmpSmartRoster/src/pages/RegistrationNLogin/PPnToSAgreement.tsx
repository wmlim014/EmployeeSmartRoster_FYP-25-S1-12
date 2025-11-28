import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab } from 'react-tabs';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import TermsOfService from './PPnToS/TermOfService';
import PrivacyPolicy from './PPnToS/PrivacyPolicy';

import { MdPrivacyTip } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import 'react-tabs/style/react-tabs.css';
import './PPnToS/LegalAgreement.css'
import '../../../public/styles/common.css'

interface PPnToSAgreementProps {
  isCheck: (isCheck: boolean) => void;
}

const PPnToSAgreement = ({ isCheck }: PPnToSAgreementProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isPrivacyPolicyScrolled, setIsPrivacyPolicyScrolled] = useState(false);
    const [isTermsScrolled, setIsTermsScrolled] = useState(false);
    const [isPrivacyPolicyAgreed, setIsPrivacyPolicyAgreed] = useState(false)
    const [isToSAgreed, setIsToSAgreed] = useState(false)

    const privacyPolicyRef = useRef<HTMLDivElement>(null);
    const termsRef = useRef<HTMLDivElement>(null);
  
    // Generic scroll handler with correct ref type
    const handleScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            return scrollTop + clientHeight >= scrollHeight - 10;
        }
        return false;
    };

    // Update scroll states when tab changes or content loads
    useEffect(() => {
        const currentRef = activeTab === 0 ? privacyPolicyRef : termsRef;
        const callback = activeTab === 0 ? setIsPrivacyPolicyScrolled : setIsTermsScrolled;
        
        if (currentRef.current) {
            callback(handleScroll(currentRef));
        }
    }, [activeTab]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };
  
    return (
        <div className='policy-terms-container'>
            <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
                {/* Tab list */}
                <Tab className={`react-tabs__tab ${activeTab === 0 ? 'react-tabs__tab--selected' : ''}`}> {/* Tab 1 */}
                    <div className="policy-terms-tab">
                        <MdPrivacyTip />
                        <span>Privacy Policy</span>
                    </div>
                </Tab>
                <Tab className={`react-tabs__tab ${activeTab === 1 ? 'react-tabs__tab--selected' : ''}`}> {/* Tab 2 */}
                    <div className="policy-terms-tab">
                        <FaClipboardList />
                        <span>Term of Service</span>
                    </div>
                </Tab>
            </Tabs>
    
            {/* Tab 1: Privacy Policy */}
            <div hidden={activeTab !== 0}>
                <div
                    className='policy-terms-content'
                    ref={privacyPolicyRef}
                    onScroll={() => setIsPrivacyPolicyScrolled(handleScroll(privacyPolicyRef))}
                >
                    <PrivacyPolicy />
                    <label className="checkbox-container">
                        I agree to the Privacy Policy
                        <input 
                            type="checkbox" 
                            disabled={!isPrivacyPolicyScrolled}
                            checked={isPrivacyPolicyAgreed} 
                            onChange={(e) => setIsPrivacyPolicyAgreed(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
    
            {/* Tab 2: Terms of Service */}
            <div hidden={activeTab !== 1}>
                <div
                    className='policy-terms-content'
                    ref={termsRef}
                    onScroll={() => setIsTermsScrolled(handleScroll(termsRef))}
                >
                    <TermsOfService />
                    <label className="checkbox-container">
                        I agree to the Terms of Service
                        <input 
                            type="checkbox" 
                            disabled={!isTermsScrolled}
                            checked={isToSAgreed} 
                            onChange={(e) => setIsToSAgreed(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
    
            <PrimaryButton 
                text='Continue to Registration'
                disabled={!isPrivacyPolicyAgreed 
                            || !isToSAgreed
                        } 
                onClick={() => isCheck(isPrivacyPolicyAgreed && isToSAgreed)}
            />
      </div>
    );
};

export default PPnToSAgreement;