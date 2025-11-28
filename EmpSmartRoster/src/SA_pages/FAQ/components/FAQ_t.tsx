import { useState } from "react";
import Header from "../../../components/table/Header";
import Cell from "../../../components/table/Cell";
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';

import { FaQuestionCircle } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { MdDeleteForever, FaRegEdit, IoFlagSharp } from '../../../../public/Icons.js'
import '../FAQMgt.css'
import '../../../../public/styles/common.css'

interface FAQ_TProps {
    allFAQs: any;
    toggleCreateOrEdit: (faq: any) => void; 
    toggleDisplayOnLanding: (faq: any, isShown: number) => void;
    triggerDeleteFAQ: (faqID: number) => void;
}

const FAQ_t = ({
    allFAQs, triggerDeleteFAQ, toggleCreateOrEdit, toggleDisplayOnLanding
} : FAQ_TProps) => {

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
        <div className="App-desktop-responsive-table">
            <div className="App-desktop-table-row desktop-table-header">
                <div className="App-desktop-table-row desktop-table-header">
                    <Header className='header-sa-view-faq-question' text='Question' />
                    <Header className='header-sa-view-faq-ans' text='Answer' />
                    <Header className='App-header-icon-gap' text=''/>
                </div>
            </div>
            {allFAQs.map((faq:any) => (
            <div className='App-desktop-table-row sa-view-faq-row' key={faq.faqID}>
                <Cell className='body-sa-view-faq-question' text={faq.question_desc} />
                <Cell className='body-sa-view-faq-ans' text={faq.answer} />
                <div 
                    className="App-desktop-table-icon sa-view-faq-edit-icon" 
                    onClick={() => {
                        toggleDisplayOnLanding(faq, faq.isShown)
                    }}
                >
                    <IoFlagSharp style={{ color: faq.isShown === 1 ? '#b565ff' : '#a0a0a0' }}/>
                </div>
                <div 
                    className="App-desktop-table-icon sa-view-faq-edit-icon" 
                    onClick={() => {
                        toggleCreateOrEdit(faq)
                    }}
                >
                    <FaRegEdit />
                </div>
                <div 
                    className="App-desktop-table-icon sa-view-faq-delete-icon" 
                    onClick={() => toggleDeleteConfirmation(faq)}
                >
                    <MdDeleteForever />
                </div>
            </div>
            ))}
        </div>
    )
}

export default FAQ_t