import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import { USER_ROLE, formatTextForDisplay, LEAVE_STATUS, LEAVE_TYPE, generateSGDateTimeForDateTimeInput, formatDateTime } from '../../../controller/Variables'
import LeaveMgtController from '../../../controller/LeaveMgtController'

import { FaClipboardList, IoClose, TbTarget, TbTargetArrow,
         FaCircle, FaFilePdf } from '../../../../public/Icons.js'
import '../LeaveManagement.css'
import '../../../../public/styles/common.css'

interface LeaveMgtTableProps {
    leave: any;
    user: any;
    onUpdate: (updatedLeave: any) => void;
    onClose: (value: any) => void;
}

const { empCancelLeaveRequest, getMCFile, boApproveORejectLeave } = LeaveMgtController

const LeaveDetail = ({leave = {}, user, onUpdate, onClose}: LeaveMgtTableProps) => {
    // console.log(user)
    const { showAlert } = useAlert()
    const [ showConfirmCancelLeave, setShowConfirmCancelLeave ] = useState(false)
    const [ mcFileURL, setMCFileURL ] = useState<string>("");
    const [ statusUpdate, setStatusUpdate ] = useState<string>('');
    const [ showApprovalOReject, setShowApprovalOReject ] = useState(false)
    const [ reasonOfReject, setReasonOfReject ] = useState<string>('')

    const fetchMCFilePDF = async () => {
        try {
            const fileData = await getMCFile (leave.leaveID)
            // Decode base64 to binary string
            const byteCharacters = atob(fileData.fileData);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
                byteCharacters.charCodeAt(i)
            );
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(blob);
            // console.log(pdfUrl)
            setMCFileURL(pdfUrl)
        } catch (error) {
            showAlert(
                'fetchMCFilePDF',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Show / close cancel leave confirmation
    function toggleShowCancelLeave() {
        setShowConfirmCancelLeave(!showConfirmCancelLeave)
    }

    // Employee cancel submitted leave request
    const triggerCancelLeaveRequest = async() => {
        try {
            let response = await empCancelLeaveRequest (leave.leaveID)
            // console.log(response)
            if(response.message === 'Leave Request successfully cancelled') {
                const updatedLeave = {
                    ...leave,
                    status: LEAVE_STATUS[3]
                }
                toggleShowCancelLeave()

                if(onClose)
                    onClose({})

                if(onUpdate)
                    onUpdate(updatedLeave)

                showAlert(
                    'Leave Request Cancelled Successfully',
                    `You have cancelled an ${leave.type} Request`,
                    `From ${leave.leaveStart.split('T')[0]} to ${leave.leaveEnd.split('T')[0]}`,
                    { type: 'success' }
                )
            }
        } catch(error) {
            showAlert(
                'triggerCancelLeaveRequest',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Bussines Owner Approve or Reject Leave Request
    const triggerApproveOrRejectLeaveRequest = async() => {
        try {
            let response = await boApproveORejectLeave (leave.leaveID, statusUpdate, reasonOfReject)
            // console.log(response)
            if(response.message === 'Update successful') {
                const updatedLeave = {
                    ...leave,
                    status: statusUpdate,
                    reasonOfReject: reasonOfReject
                }
                toggleShowCancelLeave()

                if(onClose)
                    onClose({})

                if(onUpdate)
                    onUpdate(updatedLeave)

                if(statusUpdate === LEAVE_STATUS[1])
                    showAlert(
                        'Leave Request Approved Successfully',
                        `You have approved ${leave.fullName}'s ${leave.type} Request`,
                        `From ${leave.leaveStart.split('T')[0]} to ${leave.leaveEnd.split('T')[0]}`,
                        { type: 'success' }
                    )
                else
                    showAlert(
                        'Leave Request Rejected Successfully',
                        `You have rejected ${leave.fullName}'s ${leave.type} Request`,
                        `From ${leave.leaveStart.split('T')[0]} to ${leave.leaveEnd.split('T')[0]}`,
                        { type: 'success' }
                    )
            }
        } catch(error) {
            showAlert(
                'triggerCancelLeaveRequest',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleShowApproval(status: string) {
        setShowApprovalOReject(!showApprovalOReject)
        setStatusUpdate(status)
    }

    // Employee show confirmation popup for cancel leave
    if(showConfirmCancelLeave) return (
        <div className="App-popup" onClick={toggleShowCancelLeave}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Cancel the {leave.type} Request
                </p>
                <div className="confirmation-detail">
                    <div className="emp-view-task-detail-start-n-end">
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveStart.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveEnd.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggerCancelLeaveRequest()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleShowCancelLeave()}
                    />
                </div>
            </div>
        </div>
    )

    // Approval or Reject Leave Management
    if(showApprovalOReject && statusUpdate) return (
        <div className="App-popup" onClick={() => toggleShowApproval('')}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    {statusUpdate === LEAVE_STATUS[1] ? (
                        <>Confirm to Approve the {leave.fullName}'s {leave.type} Request</>
                    ):(
                        <>Confirm to Reject the {leave.fullName}'s {leave.type} Request</>
                    )}
                </p>
                <div className="confirmation-detail">
                    <div className="emp-view-task-detail-start-n-end">
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveStart.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveEnd.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {statusUpdate === LEAVE_STATUS[2] && (
                        <div className="App-filter-container uen-company-name">
                            <input type='text' 
                                className='reason-input'
                                placeholder='Reason of Reject' 
                                onChange={(e) => setReasonOfReject(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <div className="btns-grp">
                    {/* If BO want to approve */}
                    {statusUpdate === LEAVE_STATUS[1] ? (
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerApproveOrRejectLeaveRequest()}
                        />
                    ):( // If BO want to reject
                        <PrimaryButton 
                            text="Confirm" 
                            disabled={!reasonOfReject}
                            onClick={() => triggerApproveOrRejectLeaveRequest()}
                        />
                    )}
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleShowApproval('')}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className='App-popup' onClick={() => onClose({})}>
            <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    {user.role===USER_ROLE[1] && <h1>{leave.fullName}</h1>}
                    {user.role===USER_ROLE[2] && <h1>{leave.type}</h1>}
                    <div className="suspend-btn">
                        <button className="icons" onClick={onClose}>
                            <IoClose />
                        </button>
                    </div>
                </div>
                <div className="App-popup-main-content leave-detail-data-container">
                    <div className="leave-info-data-type-header">
                        <div className="leave-info-data leave-info-data-type-header-text">
                            <p className="title">Type</p>
                            <p className="main-data">{leave.type}</p>
                        </div>
                        {leave.type === LEAVE_TYPE[4] && (<a href={mcFileURL}
                            target="_blank"
                            onClick={mcFileURL ? undefined : (e) => {
                                e.preventDefault();
                            }}
                            className="icons"
                        >
                            <FaFilePdf onClick={fetchMCFilePDF}/>
                        </a>)}
                    </div>
                    <div className="task-detail-description">
                        <FaClipboardList className='App-popup-content-icon task-detail-description-icon'/>
                        <p 
                            className="main-data"
                            dangerouslySetInnerHTML={{ __html: formatTextForDisplay(leave.description) }}
                        />
                    </div>
                    <div className="leave-info-data">
                        <p className="title">Status</p>
                        <p className="main-data leave-detail-data-status">
                            <FaCircle 
                                className={`leave-status
                                            ${leave.status === LEAVE_STATUS[1] ? 'approved' : ''}
                                            ${leave.status === LEAVE_STATUS[0] ? 'pending' : ''}`}
                            />
                            {leave.status}
                        </p>
                    </div>
                    <div className="emp-view-task-detail-start-n-end">
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveStart.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{leave.leaveEnd.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="btns-grp">
                    {user.role === USER_ROLE[1] ? (
                        <>
                        {leave.status === LEAVE_STATUS[0] && (
                            <>
                            <PrimaryButton 
                                text='Approve'
                                onClick={() => toggleShowApproval(LEAVE_STATUS[1])}
                            />
                            <SecondaryButton 
                                text='Reject'
                                onClick={() => toggleShowApproval(LEAVE_STATUS[2])}
                            />
                            </>
                        
                        )}
                        </>
                    ):(
                        <>
                        {leave.status === LEAVE_STATUS[0] && (
                            <SecondaryButton 
                                text='Cancel Request'
                                onClick={toggleShowCancelLeave}
                            />
                        )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}
export default LeaveDetail