import { useEffect, useState } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { formatTextForDisplay, ISSUES_CATEGORY } from '../../../controller/Variables.js'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';
import ReportIssuesController from '../../../controller/ReportIssuesController';

import { IoClose, FaRegListAlt } from '../../../../public/Icons.js'
import '../ReportIssues.css'
import '../../../../public/styles/common.css'

interface CreateReportIssuesProps {
    isCreate: boolean
    user?: any,
    handleCreateIssue: (values: any) => void;
    onClose: () => void;
}
const { createNewIssueReport } = ReportIssuesController

const CreateReportIssue = ({isCreate, user, handleCreateIssue, onClose}: CreateReportIssuesProps) => {
    const { showAlert } = useAlert()
    const [ showConfirmation, setShowConfirmation ] = useState(false)
    const [ values, setValues ] = useState({
        issueID: new Date(), // Declare temp ID
        title: '',
        issue_description: '',
        issuesCategory: ISSUES_CATEGORY[0],
    })

    // Update values changed
    const handleInputChange = (event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = event.target;
        setValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Check if create form all filled
    const isCreateIssueIncomplete = () => {
        const requiredFields: (keyof typeof values)[] = [
            'title',
            'issue_description',
            'issuesCategory'
        ];
        return requiredFields.some(field => !values[field]);
    };

    // Submit new issue
    const triggerCreateIssue = async() => {
        try {
            const response = await createNewIssueReport(user.UID, values)
            console.log(response)
            if(response.message === 'Issue successfully added') {
                if(handleCreateIssue)
                    handleCreateIssue(values);
                toggleConfirmation();
                // reset values
                setValues({
                    issueID: new Date(), // Declare temp ID
                    title: '',
                    issue_description: '',
                    issuesCategory: ISSUES_CATEGORY[0],
                })
            }
        } catch(error) {
            showAlert(
                "triggerCreateIssue",
                `Failed to create new issue`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleConfirmation(){
        setShowConfirmation(!showConfirmation)
    }

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    {isCreate ? (
                        <>Confirm to Report New Issue</>
                    ) : (
                        <>Confirm to Update Issue</>
                    )} 
                    
                </p>
                <div className="confirmation-detail issue-prompt-confirmation-form-title-n-category">
                    <div className="App-popup-main-content issue-prompt-confirmation-form-title">
                        <p className="title">Issue Title</p>
                        <p className="main-data">{values.title}</p>
                    </div>
                    <div className="App-popup-main-content issue-prompt-confirmation-form-category">
                        <p className="title">Issue Category</p>
                        <p className="main-data">{values.issuesCategory}</p>
                    </div>
                </div>

                <div className="App-popup-main-content issue-prompt-confirmation-form-issue-des odd-row">
                    <p className="title">
                        <FaRegListAlt className='App-popup-content-icon'/>
                        Issue Description: 
                    </p>
                    <p 
                        className="main-data confirmation-prompt-ans-preview"
                        dangerouslySetInnerHTML={{ __html: formatTextForDisplay(values.issue_description) }}
                    />
                </div>
                <div className="btns-grp">
                    {isCreate ? (
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerCreateIssue()}
                        />
                    ) : (
                        <PrimaryButton 
                            text="Confirm" 
                            // onClick={() => {processConfirmUpdate()}}
                        />
                    )} 
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="App-popup" onClick={onClose}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className='App-header'>
                    {isCreate ? <h1>Report New Issue</h1>
                        : <h1>Update Issue</h1>
                    }
                    <IoClose className='icons' onClick={onClose} />
                </div>
                <div className="App-popup-main-content">
                    {isCreate ? (
                        <div className="issue-form-title-n-category">
                            {/* Issues Category */}
                            <div className='forms-input'>
                                <strong>
                                    Issue Category <span style={{ color: 'red' }}>*</span>
                                </strong>
                                <div className="fields">
                                    {/* Issue category dropdown */}
                                    <select 
                                        name="issuesCategory"
                                        value={values.issuesCategory}
                                        onChange={(e) => handleInputChange(e)}
                                    >
                                        {ISSUES_CATEGORY.map((category:any) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Issues Title */}
                            <div className='forms-input'>
                                <strong>
                                    Issue Title <span style={{ color: 'red' }}>*</span>
                                </strong>
                                <input type='text' 
                                    name='title'
                                    placeholder='Issue Title' 
                                    value={values.title}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />
                            </div>
                        </div>
                    ) : (null)}
                </div>
                <div className="App-popup-main-content">
                    {/* Input for Issue Description */}
                    <div className='forms-input'>
                        <strong>
                            Task Description <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <textarea name='issue_description'
                            maxLength={500}
                            rows={4}
                            placeholder='Issue Description' 
                            value={values.issue_description}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                </div>
                <div className="btns-grp">
                    {isCreate ? (
                    <PrimaryButton 
                        text="Report Issue"
                        disabled={isCreateIssueIncomplete()}
                        onClick={() => toggleConfirmation()}
                    />
                    ) : (
                    <PrimaryButton 
                        text="Update Issue"
                        disabled={!values.issue_description}
                        onClick={() => toggleConfirmation()}
                    />
                    )}
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => onClose()}
                    />
                </div>
                
            </div>
        </div>
    )
}

export default CreateReportIssue
