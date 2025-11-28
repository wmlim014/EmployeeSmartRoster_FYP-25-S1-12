import { useEffect, useState } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { formatTextForDisplay } from '../../../controller/Variables.js'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';
import SAFAQController from '../../../controller/SAFAQController'

import { FaQuestionCircle } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";
import '../FAQMgt.css'
import '../../../../public/styles/common.css'

interface CreateFAQProps {
    isCreate: boolean
    allFAQs?: any
    selectedFAQ?: any
    handleCreateFAQ: (values: any) => void;
    triggerUpdateFAQ: (faq: any, isShown: number) => void;
}

const { createNewFaq } = SAFAQController

const CreateFAQForm = ({
    isCreate, allFAQs, selectedFAQ, handleCreateFAQ,
    triggerUpdateFAQ
} : CreateFAQProps) => {
    // console.log(selectedFAQ)
    const { showAlert } = useAlert()
    const [ showConfirmation, setShowConfirmation ] = useState(false)
    const [ values, setValues ] = useState({
        faqID: new Date(), // Declare temp ID
        question_desc: '',
        answer: '',
        isShown: 0
    })
    useEffect(() => {
        if(!isCreate)
            setValues(selectedFAQ)
    }, [selectedFAQ])

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
    const isCreateFaqIncomplete = () => {
        const requiredFields: (keyof typeof values)[] = [
            'question_desc',
            'answer'
        ];
        return requiredFields.some(field => !values[field]);
    };

    // Submit new faq
    const triggerCreateFAQ = async() => {
        try {
            const response = await createNewFaq(values)
            // console.log(response)
            if(response.message === 'Succesfully added FAQ') {
                if(handleCreateFAQ)
                    handleCreateFAQ(values);
                toggleConfirmation();
                // reset values
                setValues({
                    faqID: new Date(), // Declare temp ID
                    question_desc: '',
                    answer: '',
                    isShown: 0
                })
            }

        } catch(error) {
            showAlert(
                "triggerCreateFAQ",
                `Failed to create new faq`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleConfirmation(){
        setShowConfirmation(!showConfirmation)
    }

    function processConfirmUpdate(){
        triggerUpdateFAQ(values, 0)
        // reset values
        setValues({
            faqID: new Date(), // Declare temp ID
            question_desc: '',
            answer: '',
            isShown: 0
        })
        toggleConfirmation()
    }

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    {isCreate ? (
                        <>Confirm to Create New FAQ</>
                    ) : (
                        <>Confirm to Edit New FAQ</>
                    )} 
                    
                </p>
                <div className="confirmation-detail">
                    <div className="App-popup-main-content">
                        <p className="title">
                            <FaQuestionCircle className='App-popup-content-icon'/>
                            Qeustion: 
                        </p>
                        <p className="main-data">{values.question_desc}</p>
                    </div>
                    <div className="App-popup-main-content odd-row">
                        <p className="title">
                            <RiQuestionAnswerFill className='App-popup-content-icon'/>
                            Answer: 
                        </p>
                        <p 
                            className="main-data confirmation-prompt-ans-preview"
                            dangerouslySetInnerHTML={{ __html: formatTextForDisplay(values.answer) }}
                        />
                    </div>
                </div>
                <div className="btns-grp">
                    {isCreate ? (
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerCreateFAQ()}
                        />
                    ) : (
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => {processConfirmUpdate()}}
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
        <div className="create-faq-container">
            {isCreate ? (
                <h3>Create New FAQ</h3>
            ) : (
                <h3>Edit FAQ</h3>
            )} 
            {/* Input New Question */}
            <input type='text' 
                name='question_desc'
                placeholder='Question' 
                value={values.question_desc}
                onChange={(e) => handleInputChange(e)}
                required
            />
            {/* <div className="fields"> */}
                {/* Role dropdown */}
                {/* <select 
                    name="roleID"
                    value={taskValues.roleID}
                    onChange={(e) => handleInputChange(e)}
                    disabled={isTaskAssigned}
                >
                    {allRoles.map((role:any) => (
                    <option key={role.roleID} value={role.roleName}>
                        {role.roleName}
                    </option>
                    ))}
                </select>
            </div> */}
            {/* Input Answer */}
            <textarea name='answer'
                maxLength={500}
                rows={4}
                placeholder='Answer' 
                value={values.answer}
                onChange={(e) => handleInputChange(e)}
                required
            />
            {isCreate ? (
            <PrimaryButton 
                text="Create New FAQ"
                disabled={isCreateFaqIncomplete()}
                onClick={() => toggleConfirmation()}
            />
            ) : (
            <PrimaryButton 
                text="Edit FAQ"
                disabled={isCreateFaqIncomplete()}
                onClick={() => toggleConfirmation()}
            />
            )}
    </div>
    )
}

export default CreateFAQForm