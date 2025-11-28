import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { formatDateTime } from '../../../controller/Variables.js'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton.js'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton'
import UserController from '../../../controller/User/UserController.js'
import CompanyController from '../../../controller/CompanyController.js'
import './BODetail.css'
import '../../../../public/styles/common.css'
import { IoClose, 
         GiRotaryPhone, 
         MdContactPhone, 
         FaFilePdf,
         MdOutlineMailOutline,
         FaCircle,
         MdOutlineLocationOn, } from '../../../../public/Icons.js'

const { handleSuspendUser,
        handleUsuspendUser, } = UserController

const { getCompanyBizFile } = CompanyController

interface BODetailProps {
    company?: any;
    onClose?: () => void;
    onUpdate?: (updatedData:any) => void
}

const BODetail = ({company = [], onClose, onUpdate }: BODetailProps) => {
    // console.log(company)
    const { showAlert } = useAlert();
    const [ bizFileURL, setBizFileURL ] = useState<string>('');
    const [ suspend, setSuspend ] = useState(false);
    const [ reasonSuspend, setReasonSuspend ] = useState<string>('');

    const fetchBizFilePDF = async () => {
        try {
            const fileData = await getCompanyBizFile (company.owner.email);
            // Decode base64 to binary string
            const byteCharacters = atob(fileData.fileData);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
                byteCharacters.charCodeAt(i)
            );
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(blob);
            // console.log(pdfUrl)
            setBizFileURL(pdfUrl)
        } catch (error) {
            showAlert(
                'fetchBizFilePDF',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        fetchBizFilePDF()
    }, [company])

    const triggerSuspendUser = async () => {
        try {
            // Set updated data as old data
            const updatedData = {
                ...company,
                lastUpdate: new Date().toISOString(),   // Add last update date time
            }

            updatedData.owner.isSuspended = 1
            updatedData.owner.reasonOfSuspend = reasonSuspend

            const response = await handleSuspendUser(updatedData.owner.UID, reasonSuspend);

            if(onUpdate)
                onUpdate(updatedData)

            if(onClose)
                onClose()

            // Prompt user on user action output
            showAlert(
                'Suspend user account successfully',
                `${updatedData.owner.fullName}`,
                `${response.message}`,
                { type: 'success' }
            );

        } catch (error) {
            showAlert(
                'BODetail: suspend user fail',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    const triggerUnsuspendUser = async () => {
        try {
            // Set updated data as old data
            const updatedData = {
                ...company,
                lastUpdate: new Date().toISOString(),   // Add last update date time
            }

            updatedData.owner.isSuspended = 0
            updatedData.owner.reasonOfSuspend = ""

            const response = await handleUsuspendUser(updatedData.owner.UID);

            // Update updatedData locally from parent page
            if(onUpdate)
                onUpdate(updatedData)

            if(onClose)
                onClose()

            // Prompt user on user action output
            showAlert(
                'Activate user account successfully',
                `${updatedData.owner.fullName}`,
                `${response.message}`,
                { type: 'success' }
            );

        } catch (error) {
            showAlert(
                'BODetail: unSuspend user fail',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    function triggerCancelSuspend(){
        setReasonSuspend("")
        setSuspend(false)
    }

    if (suspend) return (
        <div className="App-popup" onClick={triggerCancelSuspend}>
            <div className='App-popup-prompt-content suspend-bo'  onClick={(e) => e.stopPropagation()}>
                <div>
                    <p className='App-prompt-confirmation-title'>
                        Confirm to Suspend {company.UEN}'s Owner: 
                    </p>
                    <p className='App-prompt-confirmation-title-highlighted-text'>
                        {company.owner.fullName}
                    </p>
                </div>
                <input type="text"
                    placeholder='Reason of Suspend'
                    onChange={(e) => {
                        setReasonSuspend(e.target.value)
                    }} 
                    required 
                />
                <div className="suspend-btn ">
                    <PrimaryButton 
                        text='Confirm'
                        onClick={() => triggerSuspendUser()}
                        disabled = {!reasonSuspend}
                    />
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => triggerCancelSuspend()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
            <div className="App-header">
                <h1>{company.owner.fullName}</h1>
                <button className="icons" onClick={onClose}>
                    <IoClose />
                </button>
            </div>
            <div className="App-popup-main-content">
                <div className="company-info">
                    <div className="bo-detail-company-info-header">
                        <h3>{company.bizName}</h3>
                        <a href={bizFileURL}
                            target="_blank"
                            onClick={bizFileURL ? undefined : (e) => {
                                e.preventDefault();
                            }}
                            className="icons"
                        >
                            <FaFilePdf />
                        </a>
                    </div>
                    
                    <p className="Bo-detail-title">{company.UEN}</p>
                    
                    <div className="company-info-detail-contact">
                        <MdOutlineLocationOn className='App-popup-content-icon'/>
                        <p>{company.address}</p>
                    </div>

                    <div className="company-info-detail-contact">
                        <GiRotaryPhone className='App-popup-content-icon'/>
                        <p>{company.contactNo}</p>
                    </div>
                </div>
                <div className="bo-info">
                    <h3>Business Owner Information</h3>
                    
                    <div className='bo-info-data'>
                        <p className="title">
                            <MdOutlineMailOutline className='App-popup-content-icon'/>
                        </p>
                        <p className="main-data">{company.owner.email}</p>
                    </div>
                    <div className='bo-info-data'>
                        <p className="title">
                            <MdContactPhone className='App-popup-content-icon'/>
                        </p>
                        <p className="main-data">{company.owner.hpNo}</p>
                    </div>
                    <div className="bo-info-data">
                        {company.owner?.isSuspended === 1 ? (
                            <>
                                <FaCircle className='App-popup-content-icon title bo-suspended'/>
                                <p className="main-data">Suspended</p>
                            </>
                        ):(
                            <>
                                <FaCircle className='App-popup-content-icon title bo-activated'/>
                                <p className="main-data">Activated</p>
                            </>
                        )}
                    </div>
                </div>
                
                {company.owner?.isSuspended === 1 && (
                    <div className="data-content">
                        <p className="title">Reason Of Reject:</p>
                        <p className="main-data">{company.owner.reasonOfSuspend}</p>
                    </div>
                )}
                {company.transactions[0]?.subsPlanID === 2 && (
                    <div className="subs-info">
                        <div className="subs-info-data">
                            <p className="title">Subscription Status: </p>
                            <p className="main-data">
                                {company.transactions[0]?.subsStatus || 'Unsubscribed'}
                            </p>
                        </div>
                        {company.transactions.length > 0 ? (
                        <div className="subs-info-data">
                            <p className="title">Subscription Period: </p>
                            <p className="main-data">
                                {formatDateTime(company.transactions[0].startDate)}
                                &nbsp;to&nbsp;
                                {formatDateTime(company.transactions[0].endDate)}
                            </p>
                        </div>
                        ):(
                            <></>
                        )}
                    </div>
                )}
                
            </div>
            <div className="suspend-btn">
                {company.owner?.isSuspended === 1 ? (
                    <PrimaryButton 
                        text='Activate User'
                        onClick={() => triggerUnsuspendUser()}
                    />
                ):(
                    <SecondaryButton 
                        text='Suspend'
                        onClick={() => setSuspend(true)}
                    />
                )}
            </div>
        </div>
    )
}

export default BODetail;