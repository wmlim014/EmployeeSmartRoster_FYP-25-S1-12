import { useState } from "react";
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';
import { formatTextForDisplay } from '../../../controller/Variables.js'

import { FaQuestionCircle } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { MdDeleteForever, FaRegEdit, IoFlagSharp } from '../../../../public/Icons.js'
import '../FAQMgt.css'
import '../../../../public/styles/common.css'

interface FAQ_MProps {
    allFAQs: any
    toggleCreateOrEdit: (faq: any) => void
    triggerDeleteFAQ: (faqID: number) => void,
    toggleDisplayOnLanding: (faq: any, isShown: number) => void;
}

const FAQ_m = ({
    allFAQs, triggerDeleteFAQ, toggleCreateOrEdit, toggleDisplayOnLanding
} : FAQ_MProps) => {

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false)
    const [ selectedFAQ, setSelectedFAQ ] = useState<any>({})

    function toggleDeleteConfirmation(faq: any){
        setSelectedFAQ(faq)
        setShowDeleteConfirmation(!showDeleteConfirmation)
    }

    if(showDeleteConfirmation) return (
        <div className="App-popup" onClick={toggleDeleteConfirmation}>
            <div className="App-popup-prompt-content confirm-user-profile-completion" onClick={(e) => e.stopPropagation()}>
                <p className="App-prompt-confirmation-title App-header">
                    Confirm to Create New FAQ
                </p>
                <div className="confirmation-detail">
                    <div className="App-popup-main-content">
                        <p className="title">
                            <FaQuestionCircle className='App-popup-content-icon'/>
                            Qeustion: 
                        </p>
                        <p className="main-data">{selectedFAQ.question_desc}</p>
                    </div>
                    <div className="App-popup-main-content odd-row">
                        <p className="title">
                            <RiQuestionAnswerFill className='App-popup-content-icon'/>
                            Answer: 
                        </p>
                        <p className="main-data">{selectedFAQ.answer}</p>
                    </div>
                </div>
                <div className="btns-grp">
                    <PrimaryButton 
                        text="Confirm" 
                        onClick={() => {
                            triggerDeleteFAQ(selectedFAQ.faqID)
                            toggleDeleteConfirmation({})
                        }}
                    />
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleDeleteConfirmation({})}
                    />
                </div>
            </div>
        </div>
    )

    return(
    <div className="App-mobile-responsive-table">
        {allFAQs.map((faq:any) => (
        <div key={faq.faqID}>
            <div className='App-mobile-responsive-table-card sa-view-faq-row-card'>
                <div className="App-mobile-responsive-table-card-title">
                    <h2>
                        {faq.question_desc}
                    </h2>
                    <div className="sa-view-faq-row-btns-grp">
                        <div 
                            className="App-mobile-table-icon sa-view-faq-flag-icon" 
                            onClick={() => {
                                toggleDisplayOnLanding(faq, faq.isShown)
                            }}
                        >
                           <IoFlagSharp style={{ color: faq.isShown === 1 ? '#b565ff' : '#a0a0a0' }}/>
                        </div>
                        
                        <div className="App-mobile-table-icon sa-view-faq-edit-icon" 
                            onClick={() => {
                                toggleCreateOrEdit(faq)
                            }}
                        >
                            <FaRegEdit />
                        </div>
                        <div className="App-mobile-table-icon sa-view-faq-delete-icon" 
                            onClick={() => {
                                toggleDeleteConfirmation(faq)
                            }}
                        >
                            <MdDeleteForever />
                        </div>
                    </div>
                </div>
                <div className="App-mobile-responsive-table-card-data">
                    <div className="App-mobile-responsive-table-card-data-detail">
                        <p dangerouslySetInnerHTML={{ __html: formatTextForDisplay(faq.answer) }} />
                    </div>
                </div>
            </div>
        </div>
        ))}
    </div>
    )
}

export default FAQ_m