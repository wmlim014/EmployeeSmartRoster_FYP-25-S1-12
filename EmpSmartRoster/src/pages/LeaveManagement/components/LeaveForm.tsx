import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { LEAVE_STATUS, LEAVE_TYPE, formatTextForDisplay } from '../../../controller/Variables'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import LeaveMgtController from '../../../controller/LeaveMgtController'

import { IoClose } from '../../../../public/Icons.js'
import '../LeaveManagement.css'
import '../../../../public/styles/common.css'

interface LeaveFormProps {
    isCreate: boolean;
    user: any;
    leaveValue?: any;
    onClose?: () => void;
    onUpdate?: (value: any) => void;
    onCreate?: (value: any, status: string) => void;
}

const { empSubmitLeave, empSubmitMC } = LeaveMgtController;

const LeaveForm = ({
    isCreate, leaveValue, user, onClose, onUpdate, onCreate
}: LeaveFormProps) => {
    // console.log(user)
    const { showAlert } = useAlert();
    const [ showConfirmation, setShowConfirmation ] = useState(false)
    const [ mcFile, setMcFile ] = useState<File | null>()
    const [ fileStatus, setFileStatus ] = useState<
        'initial' | 'uploading' | 'success' | 'fail'
    >('initial');
    const [ values, setValues ] = useState({
        leaveID: new Date(), // Temp ID
        type: LEAVE_TYPE[0],
        description: '',
        leaveStart: new Date().toISOString().split('T')[0],
        leaveEnd: new Date().toISOString().split('T')[0],
    })

    const handleInputChange = (event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = event.target;
        
        setValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle Registration Submission with File Upload:
    // https://uploadcare.com/blog/how-to-upload-file-in-react/#show-upload-result-indicator
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileStatus('initial');
            setMcFile(e.target.files[0]);
        }
    };

    // Check if create/edit employee form
    const isFormIncomplete = () => {
        const requiredFields: (keyof typeof values)[] = [
            'leaveID',
            'type',
            'description',
            'leaveStart',
            'leaveEnd',
        ];
        
        // Check if any required field is empty
        const hasEmptyFields = requiredFields.some(field => !values[field]);
        
        // Special handling for MC leave type
        if (values.type === LEAVE_TYPE[4]) { // MC Leave
            return hasEmptyFields || !mcFile; // Return either completed or non MC File uploaded
        }
        return hasEmptyFields;
    };
    
    function toggleSubmitLeaveOrMc() {
        const empInfo = user.employeeProfile
        // Calculate difference in milliseconds
        const diffInMs = new Date(values.leaveEnd).getTime() - new Date(values.leaveStart).getTime()
        // Convert to days (adding 1 to include both start and end dates)
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        if(values.type !== LEAVE_TYPE[4]){
            if(diffInDays > empInfo.noOfLeaveAvailable) {
                // Prompt alert to inform user on insuffiecient leave in 3 second
                setTimeout(() => {
                    showAlert(
                        "Insufficient Leave Available",
                        `Your annual leave for "${values.type}" is insufficient`,
                        `You left with ${empInfo.noOfLeaveAvailable} annual leave(s)`,
                        { type: 'info' }
                    );
                }, 3000) 
            }
            triggerSubmitLeaveRequest(empInfo)
        } else {
            if(diffInDays > empInfo.noOfLeaveAvailable) {
                // Prompt alert to inform user on insuffiecient mc in 3 second
                setTimeout(() => {
                    showAlert(
                        "Insufficient MC Available",
                        `Your MC for "${values.type}" is insufficient`,
                        `You left with ${empInfo.noOfLeaveAvailable} MC(s)`,
                        { type: 'info' }
                    );
                }, 3000) 
            }
            triggerSubmitMCRequest(empInfo)
        }  

    }

    const triggerSubmitLeaveRequest = async(empInfo: any) => {
        try {
            // console.log(empInfo)
            // If current user still having available leave
            const submitLeave = await empSubmitLeave(empInfo[0].user_id, empInfo[0].business_owner_id, values)
            // console.log(submitLeave)
            if(submitLeave.message === 'Leave Request successfully added') {
                showAlert(
                    "Leave Request Submitted",
                    `"${values.type}" had submitted for approval `,
                    ``,
                    { type: 'success' }
                );
                toggleConfirmation()

                if(onCreate)
                    onCreate(values, LEAVE_STATUS[0])

                if(onClose)
                    onClose()
            } else {
                showAlert(
                    "Leave Request Failed Submitted",
                    `"${values.type}" is unable to submit`,
                    ``,
                    { type: 'error' }
                );
            }
        } catch(error) {
            showAlert(
                "triggerSubmitLeaveRequest",
                `Failed to Submit "${values.type}" Request `,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const triggerSubmitMCRequest = async(empInfo: any) => {
        try {
            // console.log(empInfo)
            // If current user still having available leave
            const submitMC = await empSubmitMC(mcFile, empInfo[0].user_id, empInfo[0].business_owner_id, values)
            // console.log(submitMC)
            if(submitMC.message === 'File uploaded successfully') {
                showAlert(
                    "Leave Request Submitted",
                    `"${values.type}" had submitted for approval `,
                    ``,
                    { type: 'success' }
                );
                toggleConfirmation()

                if(onCreate)
                    onCreate(values, LEAVE_STATUS[1])

                if(onClose)
                    onClose()
            } else {
                showAlert(
                    "Leave Request Failed Submitted",
                    `"${values.type}" is unable to submit`,
                    ``,
                    { type: 'error' }
                );
            }
        } catch(error) {
            showAlert(
                "triggerSubmitLeaveRequest",
                `Failed to Submit "${values.type}" Request `,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleConfirmation() {
        setShowConfirmation(!showConfirmation)
    }

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    <h3>
                        {isCreate ? (
                            "Confirm Leave Request Information"
                        ):("Confirm The Updated Leave Request Information")}  
                    </h3>
                </div>

                <div className="leave-request-confirmation">
                    <div className="leave-request-confirmation-detail">
                        <p className="title">Leave Category</p>
                        <p className="main-data">{values.type}</p>
                    </div>
                    <div className="leave-request-confirmation-detail odd-row">
                        <p className="title">Description</p>
                        <p dangerouslySetInnerHTML={{ __html: formatTextForDisplay(values.description) }}
                            className="main-data"
                        />
                    </div>
                    <div className="leave-request-confirmation-detail">
                        <p className="title">Leave Start</p>
                        <p className="main-data">{values.leaveStart}</p>
                    </div>
                    <div className="leave-request-confirmation-detail odd-row">
                        <p className="title">Leave End</p>
                        <p className="main-data">{values.leaveEnd}</p>
                    </div>
                    {values.type === LEAVE_TYPE[4] && (
                        <div className="leave-request-confirmation-detail">
                            <p className="title">File Name</p>
                            <p className="main-data">{mcFile?.name}</p>
                        </div>
                    )}
                </div>

                <div className="btns-grp">
                    {isCreate ? (
                        <PrimaryButton 
                            text='Confirm'
                            onClick={toggleSubmitLeaveOrMc}
                        />
                    ) : (
                        <PrimaryButton 
                            text='Confirm'
                        />
                    )}
                    <SecondaryButton 
                        text='Cancel'
                        onClick={toggleConfirmation}
                    />
                </div>
            </div>
        </div>
    )

    return(
        <div className="App-popup" onClick={onClose}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    <h1>Submit Leave Request</h1>
                    <IoClose 
                        className='icons'
                        onClick={onClose}
                    />
                </div>
                <div className="App-popup-main-content leave-create-edit-form">
                    <div className='forms-input'>
                        <strong>
                            Leave Category <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            {/* Leave Type Dropdown*/}
                            <select 
                                name="type"
                                value={values.type}
                                onChange={(e) => handleInputChange(e)}
                            >
                                {LEAVE_TYPE.map((leave:any) => (
                                <option key={leave} value={leave}>
                                    {leave}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Input Leave Description */}
                    <div className='forms-input'>
                        <strong>
                            Description <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <textarea name='description'
                            maxLength={500}
                            rows={4}
                            placeholder='Leave Description' 
                            value={values.description}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                    {/* MC File */}
                    {values.type === LEAVE_TYPE[4] && (
                        <div className='forms-input'>
                            <strong>
                                Upload MC File <span style={{ color: 'red' }}>*</span>
                            </strong>
                            <div className="fields">
                                <input type='file' 
                                    name='mcFile'
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                        </div>
                    )}
                    {/* Select start and end date */}
                    <div className="leave-create-n-edit-start-n-end">
                        {/* Input Leave Start */}
                        <div className='forms-input'>
                            <strong>
                                {values.type === LEAVE_TYPE[4] ? <>Leave</> : <>MC</>}
                                &nbsp;Start <span style={{ color: 'red' }}>*</span>
                            </strong>
                            <div className="fields">
                                <input type='date' 
                                    name='leaveStart' 
                                    value={values.leaveStart}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />
                            </div>
                        </div>
                        {/* Input Leave End */}
                        <div className='forms-input'>
                            <strong>
                                {values.type === LEAVE_TYPE[4] ? <>MC</> : <>Leave</>}
                                &nbsp;End <span style={{ color: 'red' }}>*</span>
                            </strong>
                            <div className="fields">
                                <input type='date' 
                                    name='leaveEnd' 
                                    min={values.leaveStart}
                                    value={values.leaveEnd}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="btns-grp">
                        <PrimaryButton 
                            text='Submit'
                            disabled={isFormIncomplete()}
                            onClick={toggleConfirmation}
                        />
                        <SecondaryButton 
                            text='Cancel'
                            onClick={onClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaveForm