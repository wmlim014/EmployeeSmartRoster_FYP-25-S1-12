import { useEffect, useState } from 'react'
import { useAuth } from '../../../AuthContext'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { SWAP_REQ_STATUS, NO_DATA_MATCHED, formatDisplayDateTime } from '../../../controller/Variables.js'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import TimelineController from '../../../controller/TimelineController'

import { FaRegListAlt, IoClose, TbTarget, TbTargetArrow, FaCircle } from '../../../../public/Icons'
import '../MySchedules.css'
import '../../../../public/styles/common.css'

interface SwapTimeDetailProps {
    swap: any;
    isIncomming: boolean;
    onUpdate?: (updatedData: any) => void;
    onClose: () => void;
}

const { updateSwapTimeStatus } = TimelineController
const SwapTimeDetail = ({swap, isIncomming, onUpdate, onClose}:SwapTimeDetailProps) => {
    const { showAlert } = useAlert()
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ isApprove, setIsApprove ] = useState(false);
    const [ showConfirmCancel, setShowConfirmCancel ] = useState(false)

    // Approve or reject incoming swap request
    function toggleShowApproval(isApprove: boolean) {
        setShowConfirmation(!showConfirmation)
        setIsApprove(isApprove)
    }
    const triggerUpdateSwapTimeStatus = async() => {
        try{
            let response = []
            if(isApprove){
                response = await updateSwapTimeStatus (
                    swap.senderDetails.user_id, swap.receiverDetails.swapReqID, 
                    SWAP_REQ_STATUS[1], swap.receiverDetails.target_swap_user_id,
                    swap.senderDetails.taskID, swap.senderDetails.target_taskID
                )
                // console.log(response)
            } else {
                response = await updateSwapTimeStatus (
                    swap.senderDetails.user_id, swap.receiverDetails.swapReqID, 
                    SWAP_REQ_STATUS[1], swap.receiverDetails.target_swap_user_id,
                    swap.senderDetails.taskID, swap.senderDetails.target_taskID
                )
            }

            if(response.message === 'Swap Request status successfully updated , Task Allocation swapped successfully') {
                if(isApprove){
                    const updatedValue = {
                        senderDetails: {
                            ...swap.senderDetails,
                            status: SWAP_REQ_STATUS[1]
                        },
                        receiverDetails: {
                            ...swap.receiverDetails,
                            status: SWAP_REQ_STATUS[1]
                        }
                    }
                    if(onUpdate)
                        onUpdate(updatedValue)

                    showAlert(
                        'Approved the Time Swap Request',
                        '',
                        `Successfully approve the request from ${swap.senderDetails.fullName}`,
                        { type: 'success' }
                    );
                } else {
                    const updatedValue = {
                        senderDetails: {
                            ...swap.senderDetails,
                            status: SWAP_REQ_STATUS[2]
                        },
                        receiverDetails: {
                            ...swap.receiverDetails,
                            status: SWAP_REQ_STATUS[2]
                        }
                    }
                    if(onUpdate)
                        onUpdate(updatedValue)

                    showAlert(
                        'Rejected the Time Swap Request',
                        '',
                        `Successfully reject the request from ${swap.senderDetails.fullName}`,
                        { type: 'success' }
                    );
                }

                toggleShowApproval(false)
                
                if(onClose)
                    onClose()
            }
        } catch(error) {
            showAlert(
                'triggerUpdateSwapTimeStatus',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Show Cancel Swap Request
    function toggleShowCancelSwapReq() {
        setShowConfirmCancel(!showConfirmCancel)
    }
    const triggerCancelSwapTime = async() => {
        try {
            const response = await updateSwapTimeStatus (
                swap.senderDetails.user_id, swap.receiverDetails.swapReqID, 
                SWAP_REQ_STATUS[3], swap.receiverDetails.target_swap_user_id,
                swap.senderDetails.taskID, swap.senderDetails.target_taskID
            )
            // console.log(response)
            if(response.message === 'Swap Request status successfully updated , Task Allocation did not swap') {
                const updatedValue = {
                    senderDetails: {
                        ...swap.senderDetails,
                        status: SWAP_REQ_STATUS[3]
                    },
                    receiverDetails: {
                        ...swap.receiverDetails,
                        status: SWAP_REQ_STATUS[3]
                    }
                }
                if(onUpdate)
                    onUpdate(updatedValue)

                showAlert(
                    'Cancelled the Time Swap Request',
                    '',
                    `Successfully cancel the request sent to ${swap.receiverDetails.fullName}`,
                    { type: 'success' }
                );
                
                if(onClose)
                    onClose()
            }
        } catch(error) {
            showAlert(
                'triggerCancelSwapTime',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Confirm to approve or reject the swap request
    if(showConfirmation) return (
        <div className="App-popup" onClick={() => toggleShowApproval(false)}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    {isApprove ? (
                        <>Confirm to Approve the Swap Time Request</>
                    ):(
                        <>Confirm to Cancel the Swap Time Request</>
                    )}
                </p>
                <div className="orginal-start-end-vs-swapped-start-end">
                    <div className="swapped-start-end card">
                        <h4>Current Task Duration:</h4>
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    {isIncomming ? (
                                        <p className="main-data">{formatDisplayDateTime(swap.receiverDetails.startDate)}</p>
                                    ):(
                                        <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    {isIncomming ? (
                                        <p className="main-data">{formatDisplayDateTime(swap.receiverDetails.startDate)}</p>
                                    ):(
                                        <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swapped-start-end card">
                        <h4>Selected Swap Task Duration:</h4>
                        <div className="start-date-detail">
                            <p className="title">Start Date:</p>
                            <div className="start-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="end-date-detail">
                            <p className="title">End Date:</p>
                            <div className="end-date-detail-data">
                                <div className="event-detail-date-display">
                                    <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                    <p className="main-data">{formatDisplayDateTime(swap.senderDetails.endDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggerUpdateSwapTimeStatus()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleShowApproval(false)}
                    />
                </div>
            </div>
        </div>
    )

    // Confirm to Cancel Swap Request
    if(showConfirmCancel) return (
        <div className="App-popup" onClick={toggleShowCancelSwapReq}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Cancel the Swap Request 
                </p>
                <div className="confirmation-detail">
                    <p className="main-data">Cancel the {swap.senderDetails.taskName}&#8594;{swap.receiverDetails.taskName} Swap Request</p>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => triggerCancelSwapTime()}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={toggleShowCancelSwapReq}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="App-popup" onClick={onClose}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className="App-header">
                    {isIncomming ? (
                        <h1>Time Swap Request From "{swap.senderDetails.fullName}"</h1>
                    ):(
                        <h1>Time Swap Request Sent To "{swap.receiverDetails.fullName}"</h1>
                    )}
                    <IoClose className='icons' onClick={onClose}/>
                </div>
                <div className="swap-task-reason-popup-content">
                    <div className="leave-info-data leave-info-data-type-header-text">
                        <p className="title">Swapping Task</p>
                        {isIncomming ? (
                            <p className="main-data">{swap.receiverDetails.taskName}&#8594;{swap.senderDetails.taskName}</p>
                        ):(
                            <p className="main-data">{swap.senderDetails.taskName}&#8594;{swap.receiverDetails.taskName}</p>
                        )}
                        <div className="swap-task-detail-status">
                            <FaCircle 
                                className={`swap-request-status
                                            ${swap.senderDetails.status === SWAP_REQ_STATUS[0] ? 'pending' : ''}
                                            ${swap.senderDetails.status === SWAP_REQ_STATUS[1] ? 'approved' : ''}`}
                                style={{ fontSize: '12px', minWidth: '12px', minHeight: '12px' }}
                            />
                            <p className='main-data'>{swap.senderDetails.status}</p>
                        </div>
                    </div>
                    <div className="orginal-start-end-vs-swapped-start-end">
                        <div className="swapped-start-end card">
                            <h4>Current Task Duration:</h4>
                            <div className="start-date-detail">
                                <p className="title">Start Date:</p>
                                <div className="start-date-detail-data">
                                    <div className="event-detail-date-display">
                                        <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                        {isIncomming ? (
                                            <p className="main-data">{formatDisplayDateTime(swap.receiverDetails.startDate)}</p>
                                        ):(
                                            <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="end-date-detail">
                                <p className="title">End Date:</p>
                                <div className="end-date-detail-data">
                                    <div className="event-detail-date-display">
                                        <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                        {isIncomming ? (
                                            <p className="main-data">{formatDisplayDateTime(swap.receiverDetails.startDate)}</p>
                                        ):(
                                            <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="swapped-start-end card">
                            <h4>Selected Swap Task Duration:</h4>
                            <div className="start-date-detail">
                                <p className="title">Start Date:</p>
                                <div className="start-date-detail-data">
                                    <div className="event-detail-date-display">
                                        <TbTarget className='App-popup-content-icon task-detail-description-icon'/>
                                        <p className="main-data">{formatDisplayDateTime(swap.senderDetails.startDate)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="end-date-detail">
                                <p className="title">End Date:</p>
                                <div className="end-date-detail-data">
                                    <div className="event-detail-date-display">
                                        <TbTargetArrow className='App-popup-content-icon task-detail-description-icon'/>
                                        <p className="main-data">{formatDisplayDateTime(swap.senderDetails.endDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isIncomming ? (
                        <>
                        {swap.senderDetails.status === SWAP_REQ_STATUS[0] && (
                        <div className='btns-grp'>
                            <PrimaryButton 
                                text='Approve'
                                onClick={() => toggleShowApproval(true)}
                            />
                            <SecondaryButton 
                                text='Reject'
                                onClick={() => toggleShowApproval(false)}
                            />
                        </div>
                        )}
                        </>
                    ):(
                        <div className='btns-grp'>
                            {swap.senderDetails.status === SWAP_REQ_STATUS[0] && (
                            <SecondaryButton 
                                text='Cancel'
                                onClick={() => toggleShowCancelSwapReq()}
                            />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default SwapTimeDetail