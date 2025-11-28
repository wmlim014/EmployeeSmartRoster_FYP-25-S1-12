import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from '../../components/PromptAlert/AlertContext.js';
import { FaInfoCircle, GoAlertFill, TiTick } from '../../../public/Icons.js'
import PasswordController from '../../controller/User/PasswordController.js';
import Header from './Header';
import PwRule from './PwRule';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';

import './style.css'
import './style_responsive.css'
import '../../../public/styles/common.css'

const { handleResetPassword, 
        validateConfirmNewPassword,
        validateNewPassword, } = PasswordController

const ResetPassword: React.FC = () => {
    const { email, } = useParams<{ 
        email: string; 
        // token: string;
    }>(); // SubString the token to URL link for token
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [ newPassword, setNewPassword ] = useState<string>('');
    const [ confirmNewPw, setConfirmNewPw ] = useState<string>('');
    const [ showPwRule, setShowPwRule ] = useState(false);
    const triggerClosePwRuleOutsite = useRef<HTMLDivElement>(null);
    const [ errors, setErrors ] = useState<{ 
        password?: string; 
        confirm_password?:string;
    }>({})

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (triggerClosePwRuleOutsite.current && !triggerClosePwRuleOutsite.current.contains(event.target as Node)) {
            setShowPwRule(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function togglePwRule() {
        setShowPwRule(!showPwRule);
    }

    const triggerPwValidation = (value:string) => {
        setNewPassword(value);
        const error = validateNewPassword(value);
        setErrors(prev => ({
            ...prev,
            password: error
        }))
    }

    const triggerConfirmPwValidation = (value:string) => {
        setConfirmNewPw(value);
        const error = validateConfirmNewPassword(newPassword, value)
        setErrors(prev => ({
            ...prev,
            confirm_password: error
        }))
    }

    const triggerResetPassword = async () => {
        try {
            const decodedEmail = decodeURIComponent(email ?? '')
            // console.log(decodedEmail)
            await handleResetPassword(decodedEmail, confirmNewPw)
            showAlert(
                'Password Reset',
                '',
                'Password Reset Completed',
                { type: 'success' }
            );
            navigate('/login')
        } catch (error) {
            showAlert(
                'triggerResetPassword',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    return (
        <div className="App-form-content">
            <Header />
            <form 
                action=""
                className='reset-password-form'
                onSubmit={(e) => {
                    e.preventDefault();
                    triggerResetPassword();
                }}
            >
                
                {/* Request User Input New Password */}
                <div className='forms-input'>
                    <div className="pw-information">
                        <strong>
                            New Password 
                            <span style={{ color: 'red' }}>*</span>
                        </strong>
                        {/* Password Rules */}
                        <div className={`pw-info ${showPwRule ? 'active' : ''}`}
                             ref={triggerClosePwRuleOutsite}
                        >
                            <FaInfoCircle 
                                className='pw-info-icon'
                                onClick={togglePwRule}
                            />
                            <div className="pw-info-content">
                                <PwRule password={newPassword} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="fields">
                        <input type='password' 
                            name='password'
                            placeholder='New Password' 
                            value={newPassword}
                            onChange={(e) => triggerPwValidation(e.target.value)}
                            onBlur={() => triggerPwValidation(newPassword)}
                            required
                        />
                        {errors.password && (
                            <span className='error-message'>
                                <GoAlertFill /> 
                                <span className='error-message-text'>{errors.password}</span>
                            </span>
                        )}
                        {!errors.password && newPassword && (
                            <span className='valid-message'>
                                <TiTick className='valid-icon'/>Valid Password
                            </span>
                        )}
                    </div>
                </div>

                {/* Request User Input Confirmed New Password */}
                <div className='forms-input'>
                    <strong>
                        Confirm New Password <span style={{ color: 'red' }}>*</span>
                    </strong>
                    <div className="fields">
                        <input type='password' 
                            name='password'
                            placeholder='Confirm New Password' 
                            value={confirmNewPw}
                            onChange={(e) => triggerConfirmPwValidation(e.target.value)}
                            onBlur={() => triggerPwValidation(confirmNewPw)}
                            required
                        />
                        {errors.confirm_password && (
                            <span className='error-message'>
                                <GoAlertFill />
                                <span className='error-message-text'>{errors.confirm_password}</span>
                            </span>
                        )}
                        {!errors.confirm_password && confirmNewPw && (
                            <span className='valid-message'>
                                <TiTick className='valid-icon'/>
                                <span>Valid Confirm Password</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="reset-pw-btn">
                    <PrimaryButton 
                        text='Reset Password'
                        type='submit'
                        disabled = {
                            !newPassword ||
                            !confirmNewPw ||
                            !!errors.password ||
                            !!errors.confirm_password
                        }
                    />
                </div>
                
                
            </form>
        </div>
    )
}

export default ResetPassword;