import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { GoAlertFill, TiTick, FaInfoCircle } from '../../../public/Icons.js'
import PPnToSAgreement from './PPnToSAgreement';
import PwRule from './PwRule';
import SignupController from '../../controller/User/SignupController';
import PasswordController from '../../controller/User/PasswordController.js';
import UserController from '../../controller/User/UserController';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import Header from "./Header";

import './style.css'
import './style_responsive.css'
import '../../../public/styles/common.css'

const { validateEmail } = UserController;

const { validateConfirmNewPassword,
        validateNewPassword, } = PasswordController

const { createRegisRequest } = SignupController

const Register = () => {
    const { showAlert } = useAlert();
    const navigate = useNavigate(); 
    const [ isReadPolicy, setIsReadPolicy ] = useState(false)
    const [ email, setEmail ] = useState<string>('');
    const [ UEN, setUEN ] = useState<string>('');
    const [ bizName, setBizName ] = useState<string>('');
    const [ bizFile, setBizFile ] = useState<File | null>(null);
    const [ fileStatus, setFileStatus ] = useState<
        'initial' | 'uploading' | 'success' | 'fail'
    >('initial');
    const [ password, setPassword ] = useState<string>('');
    const [ confirmPassword, setConfirmPassword ] = useState<string>('');
    const [ showPwRule, setShowPwRule ] = useState(false);
    const triggerClosePwRuleOutsite = useRef<HTMLDivElement>(null);
    const [ errors, setErrors ] = useState<{ 
        email?: string; 
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
        setPassword(value);
        const error = validateNewPassword(value);
        setErrors(prev => ({
            ...prev,
            password: error
        }))
    }

    const triggerConfirmPwValidation = (value:string) => {
        setConfirmPassword(value);
        const error = validateConfirmNewPassword(password, value)
        setErrors(prev => ({
            ...prev,
            confirm_password: error
        }))
    }

    const triggerEmailValidation = (value:string) => {
        setEmail(value);
        const error = validateEmail(value)
        setErrors(prev => ({
            ...prev,
            email: error
        }))
    }

    // Handle Registration Submission with File Upload:
    // https://uploadcare.com/blog/how-to-upload-file-in-react/#show-upload-result-indicator
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileStatus('initial');
            setBizFile(e.target.files[0]);
        }
    };

    const triggerRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Stop auto refresh for form submit
        if (bizFile) {
            // setFileStatus('uploading')
            const formData =  new FormData();
            formData.append('bizFile', bizFile);
    
            try {
                const response = await createRegisRequest (bizFile, email.toLowerCase(), UEN, bizName, password)
                // console.log(response)

                showAlert(
                    `${response.message}`,
                    'We had received your registration request',
                    'The account is Pending Approval', 
                    { type: 'success'}
                )
                navigate('/home')
            } catch (error) {
                setFileStatus('fail');
                showAlert(
                    'triggerRegistration',
                    'Failed to Submit Registration Request',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                )
            }
        }
    };

    function triggerLogIn() {
        navigate('/login')
    }

    function checkPPandTos (isCheck: boolean) {
        setIsReadPolicy(isCheck)
    }

    return (
        <div className='content'>
            {!isReadPolicy && (<PPnToSAgreement isCheck={checkPPandTos}/>)}
            {isReadPolicy && (
                <div className="registration-form">
                    <Header />
                    <form
                        action="" 
                        onSubmit={triggerRegistration}
                    >
                        <span className='warning-message warining-message-in-confirmatiom-prompt'>
                            <div className="title">
                                <GoAlertFill />
                                <strong>Registered Accounts Begin with Free Tier by Default</strong> 
                            </div>
                            <span className='warning-message-text'>
                                You may upgrade your subscription plan after your registration is approved
                            </span>
                        </span>
                        <div className="registration-form-content">
                            <div className="registration-form-company">
                                {/* BizFile */}
                                <div className='forms-input'>
                                    <strong>
                                        Upload BizFile <span style={{ color: 'red' }}>*</span>
                                    </strong>
                                    <div className="fields">
                                        <input type='file' 
                                            name='bizFile'
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* BizName */}
                                <div className='forms-input'>
                                    <strong>
                                        Company Name <span style={{ color: 'red' }}>*</span>
                                    </strong>
                                    <div className="fields">
                                        <input type='text' 
                                            name='bizName'
                                            value={bizName}
                                            placeholder='Enter Company Name' 
                                            onChange={(e) => setBizName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* UEN */}
                                <div className='forms-input'>
                                    <strong>
                                        Company UEN <span style={{ color: 'red' }}>*</span>
                                    </strong>
                                    <div className="fields">
                                        <input type='text' 
                                            name='UEN'
                                            value={UEN}
                                            placeholder='Enter Company UEN' 
                                            onChange={(e) => setUEN(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="registration-form-user-information">
                                {/* Company Email */}
                                <div className='forms-input'>
                                    <strong>
                                        Company Email <span style={{ color: 'red' }}>*</span>
                                    </strong>
                                    <div className="fields">
                                        <input type='email' 
                                            name='email'
                                            value={email}
                                            placeholder='Enter Company Email' 
                                            onChange={(e) => triggerEmailValidation(e.target.value)}
                                            required
                                        />
                                        {errors.email && (
                                            <span className='error-message'>
                                                <GoAlertFill />
                                                <span className='error-message-text'>{errors.email}</span>
                                            </span>
                                        )}
                                        {!errors.email && email && (
                                            <span className='valid-message'>
                                                <TiTick className='valid-icon'/>
                                                <span>Valid Email</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Password */}
                                <div className='forms-input'>
                                    <div className="pw-information">
                                        <strong>
                                            Password 
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
                                                <PwRule password={password} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fields">
                                        <input type='password' 
                                            name='password'
                                            value={password}
                                            placeholder='Enter Password' 
                                            onChange={(e) => triggerPwValidation(e.target.value)}
                                            required
                                        />
                                        {errors.password && (
                                            <span className='error-message'>
                                                <GoAlertFill />
                                                <span className='error-message-text'>{errors.password}</span>
                                            </span>
                                        )}
                                        {!errors.password && password && (
                                            <span className='valid-message'>
                                                <TiTick className='valid-icon'/>
                                                <span>Valid Password</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className='forms-input'>
                                    <strong>
                                        Confirm Password <span style={{ color: 'red' }}>*</span>
                                    </strong>
                                    <div className="fields">
                                        <input type='password' 
                                            name='confirm-password'
                                            value={confirmPassword}
                                            placeholder='Enter Confirm Password' 
                                            onChange={(e) => triggerConfirmPwValidation(e.target.value)}
                                            required
                                        />
                                        {errors.confirm_password && (
                                            <span className='error-message'>
                                                <GoAlertFill />
                                                <span className='error-message-text'>{errors.confirm_password}</span>
                                            </span>
                                        )}
                                        {!errors.confirm_password && confirmPassword && (
                                            <span className='valid-message'>
                                                <TiTick className='valid-icon'/>
                                                <span>Valid Confirm Password</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="register-btns-grp">
                            <PrimaryButton 
                                text='Register'
                                type='submit'
                                disabled={
                                    !bizFile
                                    || !bizName 
                                    || !UEN 
                                    || !email 
                                    || !password 
                                    || !confirmPassword 
                                    || !!errors.email 
                                    || !!errors.password 
                                    || !!errors.confirm_password
                                }
                            />
                            <div className="register-log-in">
                                <span>Already had an account? </span>
                                <SecondaryButton 
                                    text="Sign In"
                                    type='button'
                                    onClick={triggerLogIn}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Register
