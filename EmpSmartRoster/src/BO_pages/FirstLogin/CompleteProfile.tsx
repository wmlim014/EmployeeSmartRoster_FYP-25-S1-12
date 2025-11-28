import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import { formatPhoneNumber, formatPosterCode, formatNRIC } from '../../controller/Variables.js';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import CompanyController from '../../controller/CompanyController';
import UserController from '../../controller/User/UserController';

import { GoAlertFill, TiTick } from '../../../public/Icons.js';
import './CompleteProfile.css';
import '../../../public/styles/common.css';

interface CompleteProfileProps {
    userID: number;
    onDataUpdate: (
        companyContact: string, 
        companyAdd: string, 
        nric: string, 
        hpNo: string, 
        fullName: string
    ) => void;
}

const { setBOCompleteProfile, validateVirtualPhoneNo } = CompanyController
const { validatePhoneNo, validateNRICofFIN } = UserController

const CompleteProfile = ({ userID, onDataUpdate }: CompleteProfileProps) => {
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [companyContact, setCompanyContact] = useState<string>('');
    const [companyAdd, setCompanyAdd] = useState<any>('');
    const [posterCode, setPosterCode] = useState<any>('');
    const [nric, setNRIC] = useState<string>('');
    const [hpNo, setHpNo] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [errNRICFormat, seterrNRICFormat] = useState<string>('');
    const [errVirtualPhoneFormat, seterrVirtualPhoneFormat] = useState<string>('');
    const [errPhoneFormat, seterrPhoneFormat] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const triggerSubmitCompleteProfile = async() => {
        const fullAddress = companyAdd.trim().toUpperCase() + ", Singapore " + posterCode
        // console.log(fullAddress)

        try{
            const response = await setBOCompleteProfile(
                userID, 
                companyContact.trim(), 
                fullAddress, 
                nric.trim(), 
                hpNo.trim(), 
                fullName.trim()
            )
            // console.log(response)
            if(response.message === "NRIC , hpNo , fullName , BusinessContactNo , address successfully updated"){
                if(onDataUpdate)
                    onDataUpdate(companyContact, companyAdd, nric, hpNo, fullName)

                showAlert(
                    "Complete Profile Successfully",
                    "The information had been updated",
                    "",
                    { type: 'success' }
                );

                toggleConfirmation()
                navigate('/business-dashboard');
            }
        } catch(error) {
            showAlert(
                "triggerSubmitCompleteProfile",
                "Submit Complete Profile Failed",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const handleVirtualPhoneInput = async(contactNo: string) => {
        // Format the phone number with spaces
        const formattedNumber = formatPhoneNumber(contactNo);
        setCompanyContact(formattedNumber)

        const error = validateVirtualPhoneNo(contactNo)
        seterrVirtualPhoneFormat(error)
    }

    const handlePhoneInput = async(contactNo: string) => {
        // Format the phone number with spaces
        const formattedNumber = formatPhoneNumber(contactNo);
        setHpNo(formattedNumber)

        const error = validatePhoneNo(contactNo)
        seterrPhoneFormat(error)
    }

    const handlePosterCode = async(posterCode: string) => {
        const formattedPosterCode = formatPosterCode(posterCode)
        setPosterCode(formattedPosterCode)
    }

    const handleNRICInput = async(nric: string) => {
        const formattedNRIC = formatNRIC(nric);
        setNRIC(formattedNRIC)

        const error = validateNRICofFIN(formattedNRIC)
        seterrNRICFormat(error)
    }

    function toggleConfirmation () {
        setShowConfirmation(!showConfirmation)
    }

    // Prompt user to confirm the information
    if (showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Complete the Profile
                </p>

                <span className='warning-message warining-message-in-confirmatiom-prompt'>
                    <div className="title">
                        <GoAlertFill />
                        <strong>Make sure your NRIC/FIN is accurate.</strong> 
                    </div>
                    <span className='warning-message-text'>
                        Edits will not be allowed after submission.
                    </span>
                </span>

                <div className="confirmation-detail">
                    <div className="company-info">
                        <h4>Filled Company Information</h4>
                        <div className="display-filled-information">
                            <p className="title">Contact No: </p>
                            <p className="main-data">{companyContact}</p>
                        </div>
                        <div className="display-filled-information">
                            <p className="title">Address: </p>
                            <p className="main-data">{companyAdd}, S{posterCode}</p>
                        </div>
                    </div>
                    <div className="personal-info">
                        <h4>Filled Personal Information</h4>
                        <div className="display-filled-information">
                            <p className="title">NRIC: </p>
                            <p className="main-data">{nric.toUpperCase()}</p>
                        </div>
                        <div className="display-filled-information">
                            <p className="title">Contact No: </p>
                            <p className="main-data">{hpNo}</p>
                        </div>
                        <div className="display-filled-information">
                            <p className="title">Full Name: </p>
                            <p className="main-data">{fullName}</p>
                        </div>
                    </div>
                </div>

                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggerSubmitCompleteProfile()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return(
        <div className="content">
            <form 
                action=""
                className='complete-profile-form'
                onSubmit={(e) => {
                    e.preventDefault();
                    toggleConfirmation();
                }}
            >
                <div className="compley-company-info">
                    {/* Request User to Complete Company Information */}
                    <h4>Complete Company Information</h4>
                    <div className='forms-input'>
                        <strong>
                            Contact No. <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='tel'
                                name='company-contact'
                                placeholder='Company Contact No.' 
                                value={companyContact}
                                onChange={(e) => handleVirtualPhoneInput(e.target.value)}
                                onBlur={() => handleVirtualPhoneInput(companyContact)}
                                required
                            />
                            {errVirtualPhoneFormat && (
                                <span className='error-message'>
                                    <GoAlertFill /> 
                                    <span className='error-message-text'>{errVirtualPhoneFormat}</span>
                                </span>
                            )}
                            {!errVirtualPhoneFormat && companyContact && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>Valid Phone Number
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Request User Input Confirmed New Password */}
                    <div className='forms-input'>
                        <strong>
                            Address <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields address-input-fields">
                            <textarea
                                rows={3} 
                                name='company-add'
                                placeholder='Company Address' 
                                value={companyAdd}
                                onChange={(e) => setCompanyAdd(e.target.value)}
                                required
                            />
                            <input type='text' 
                                name='poster-code'
                                placeholder='123456' 
                                value={posterCode}
                                onChange={(e) => handlePosterCode(e.target.value)}
                                required
                            />
                            {/* {!companyAdd && (
                                <span className='error-message'>
                                    <GoAlertFill />
                                    <span className='error-message-text'>Company Address is Required</span>
                                </span>
                            )} */}
                            {/* {!errors.confirm_password && confirmNewPw && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>
                                    <span>Valid Confirm Password</span>
                                </span>
                            )} */}
                        </div>
                    </div>
                </div>

                <div className="complete-personal-info">
                    {/* Request User to Complete Personal Information */}
                    <h4>Complete Personal Information</h4>
                    {/* NRIC */}
                    <div className='forms-input'>
                        <strong>
                            NRIC <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='text'
                                name='nric'
                                placeholder='NRIC' 
                                value={nric}
                                onChange={(e) => handleNRICInput(e.target.value)}
                                onBlur={() => handleNRICInput(nric)}
                                required
                            />
                            {errNRICFormat && (
                                <span className='error-message'>
                                    <GoAlertFill /> 
                                    <span className='error-message-text'>{errNRICFormat}</span>
                                </span>
                            )}
                            {!errNRICFormat && nric && (
                                <>
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>Valid NRIC/FIN Format
                                </span>
                                <span className='warning-message'>
                                    <GoAlertFill /> 
                                    <span className='warning-message-text'>
                                        Make sure your NRIC/FIN is accurate.<br/> 
                                    </span>
                                </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* HpNo */}
                    <div className='forms-input'>
                        <strong>
                            Contact No <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='tel' 
                                name='hpNo'
                                placeholder='Personal Contact No' 
                                value={hpNo}
                                onChange={(e) => handlePhoneInput(e.target.value)}
                                onBlur={() => handlePhoneInput(hpNo)}
                                required
                            />
                            {errPhoneFormat && (
                                <span className='error-message'>
                                    <GoAlertFill /> 
                                    <span className='error-message-text'>{errPhoneFormat}</span>
                                </span>
                            )}
                            {!errPhoneFormat && hpNo && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>Valid Phone Number
                                </span>
                            )}
                        </div>
                    </div>

                    {/* HpNo*/}
                    <div className='forms-input'>
                        <strong>
                            Full Name <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            <input type='text' 
                                name='fullName'
                                placeholder='Full Name' 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            {/* {!companyAdd && (
                                <span className='error-message'>
                                    <GoAlertFill />
                                    <span className='error-message-text'>Company Address is Required</span>
                                </span>
                            )} */}
                            {/* {!errors.confirm_password && confirmNewPw && (
                                <span className='valid-message'>
                                    <TiTick className='valid-icon'/>
                                    <span>Valid Confirm Password</span>
                                </span>
                            )} */}
                        </div>
                    </div>
                </div>

                <div className="complete-profile-btn">
                    <PrimaryButton 
                        text='Complete Profile'
                        type='submit'
                        disabled = {
                            !companyContact ||
                            !companyAdd ||
                            !nric ||
                            !hpNo ||
                            !fullName ||
                            !posterCode ||
                            !!errVirtualPhoneFormat ||
                            !!errPhoneFormat ||
                            !!errNRICFormat
                        }
                    />
                </div>
            </form>
        </div>
    )
}


export default CompleteProfile;