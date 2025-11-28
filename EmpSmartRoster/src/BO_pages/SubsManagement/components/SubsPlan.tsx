import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { generateSGDateTimeForPaymentRequestRef, SUB_STATUS } from '../../../controller/Variables'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import SubscribtionController from '../../../controller/SubscribtionController'

import { GoAlertFill } from '../../../../public/Icons.js'
import '../SubsMgts.css'
import '../../../../public/styles/common.css'

interface SubsPlansProps {
    displaySubsPlans: any;
    allTransactions: any;
    onSubsPlans: any;
    currentPlan?: any;
    company: any;
    user: any;
    updateCancelSubs?: (updatedData: any) => void;
    addNewTrans?: (newData: any) => void
}

const { makeSubsPayment, cancelSubscription } = SubscribtionController

const SubsPlan = ({ 
    displaySubsPlans, allTransactions, onSubsPlans, 
    user, company, updateCancelSubs, addNewTrans
}: SubsPlansProps) => {
    // console.log(onSubsPlans)
    const { showAlert } = useAlert();
    const [ allSubsPlans, setAllSubsPlans ] = useState<any>(displaySubsPlans);
    const [ selectedPlan, setSelectedPlan ] = useState<any>();
    const now = new Date()
    const [ reasonOfUnsubscribe, setReasonOfUnsubscribe ] = useState<string>('')
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ allowedPay, setAllowedPay ] = useState(true);

    // Prompt user confirmation for update
    function toggleConfirmation (plan: any) {
        setSelectedPlan(plan)
        setShowConfirmation(!showConfirmation)
    }

    function generateReference() {
        // Format: YYYYMMDD-HHMMSS
        const timestamp = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        // Add randomness: 6-char alphanumeric
        const randomStr = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `REF-${timestamp}-${randomStr}_${allTransactions.length + 1}`;
    };

    const isAbleToPay = () => {
        const start = new Date(onSubsPlans.startDate); // e.g. "2025-04-15T00:00:00.000Z"
        const end = new Date(onSubsPlans.endDate);     // e.g. "2025-05-15T00:00:00.000Z"
        // console.log(`start: ${start} \n end: ${end}`)
        
        if (now < start || now > end) {
            setAllowedPay(true);  // Allow payment outside the subscription period
        } else {
            setAllowedPay(false); // Block during the subscription period
        }
    }
    useEffect(() => {
        if(onSubsPlans.subscription_name !== 'Free')
            isAbleToPay()
    }, [onSubsPlans])

    const triggerCreatePaymentRequest = async() => {
        try {
            const ref = generateReference()
            // console.log(ref)
            if(allowedPay){
                const response = await makeSubsPayment(
                    ref, selectedPlan.price, user.email, company, 
                    onSubsPlans.cID, selectedPlan.subsPlanID
                )
                // console.log(response)
                if (response.payment_url !== ''){
                    toggleConfirmation([])
                    window.open(response.payment_url)

                    if(addNewTrans)
                        addNewTrans(response.rows[0])
                }
            }
        } catch(error) {
            showAlert(
                "triggerMakePayment",
                "Payment Request Create Error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            ) 
        }
    }

    const triggerCancelSubscription = async() => {
        try {
            const response = await cancelSubscription(onSubsPlans.subsTransID, reasonOfUnsubscribe)
            // console.log(response)
            if(response.message === 'Subscription Transaction Status successfully cancelled') {
                const updatedData = {
                    ...onSubsPlans,
                    subsStatus: SUB_STATUS[3],
                    reasonOfCancel: reasonOfUnsubscribe
                }
                toggleConfirmation([])
                showAlert(
                    "Subscription Plan Cancelled",
                    `${reasonOfUnsubscribe}`,
                    ``,
                    { type: 'success' }
                );
                if(updateCancelSubs)
                    updateCancelSubs(updatedData)
            }

        } catch(error) {
            showAlert(
                "triggerCancelSubscription",
                "Cancel Subscription Plan Error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            ) 
        }
    }

    if (showConfirmation && selectedPlan) return (
        <div className="App-popup" onClick={() => toggleConfirmation({})}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                {selectedPlan.price === "0.00" ? (
                    <>
                    <h3 className="App-prompt-confirmation-title App-header">
                        Confirm Unsubscribe?
                    </h3>
                    <span className='subs-plan-warning-message-text'>
                        <GoAlertFill />
                        All employees beyond the first 5 will be suspended.
                    </span>
                    <input type='text' 
                        placeholder='Reason of Unsubscribe' 
                        value={reasonOfUnsubscribe}
                        onChange={(e) => setReasonOfUnsubscribe(e.target.value)}
                        required
                    />
                    </>
                ) : (
                    <>
                    <h3 className="App-prompt-confirmation-title App-header">
                        {selectedPlan.subscription_name}
                    </h3>
                    <span>{selectedPlan.subscription_plan_description}</span>
                    </>
                )}
                <div className="btns-grp">
                    {selectedPlan.price === "0.00" ? (
                        <PrimaryButton 
                            text="Confirm" 
                            disabled={!reasonOfUnsubscribe}
                            onClick={() => triggerCancelSubscription()}
                        />
                    ) : (
                        <PrimaryButton 
                            text="Confirm" 
                            disabled={!allowedPay}
                            onClick={() => triggerCreatePaymentRequest()}
                        />
                    )}
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation({})}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <>
        {(allSubsPlans && company) ? (
            <div className='subscription-plan-container'>
                <h3 className='App-header'>Subscription Plans</h3>
                <div className="subs-plan-container">
                    {allSubsPlans.map((subsPlan: any, index: number) => (
                        <div key={subsPlan.subsPlanID} 
                            className={`subs-plan-detail 
                                        ${index % 2 === 1 ? 'odd-row' : ''}`}
                            onClick={() => toggleConfirmation(subsPlan)}
                        >
                            <h4>{subsPlan.subscription_name}</h4> 
                            <p className="main-data">{subsPlan.subscription_plan_description}</p>
                        </div>
                    ))}
                </div>
            </div>
        ):(<p>Loading...</p>)}
        </>
    )
}

export default SubsPlan