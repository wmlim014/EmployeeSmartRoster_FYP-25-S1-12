import { useState, useEffect } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { NO_DATA_MATCHED } from '../../controller/Variables'
import CreateFAQForm from './components/CreateNewFaq'
import FAQ_t from './components/FAQ_t'
import FAQ_m from './components/FAQ_m'
import SAFAQController from '../../controller/SAFAQController'

import './FAQMgt.css'
import '../../../public/styles/common.css'

const { getAllFaqs, deleteFaq, editFaq, handleFilterFAQs } = SAFAQController
const FAQManagement = () => {
    const { showAlert } = useAlert()
    const [ allFAQs, setAllFAQs ] = useState<any>([]);
    const [ searchedFaq, setSearchedFaq ] = useState<any>([]);
    const [ isCreateFaq, setIsCreateFaq ] = useState(true);
    const [ selectedFaq, setSelectedFaq ] = useState<any>([]);
    const [ filterString, setFilterString ] = useState<string>('');

    const fetchAllFAQ = async () => {
        try {
            let faqs = await getAllFaqs();

            if(faqs.message === 'Succesfully retrieved FAQ List') {
                faqs = faqs.FAQList || []
                console.log(faqs)
                setAllFAQs(faqs)
            }
        } catch (error) {
            showAlert(
                "fetchAllFAQ",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    // Auto trigger when allRegisRequest length change
    useEffect(() => { 
        fetchAllFAQ();
    }, [allFAQs.length]); 

    const triggerFilterFAQs = async () => {
        try{
            // Filter FAQs to display
            let filtered = handleFilterFAQs(allFAQs, filterString);
            // console.log(filtered)
            setSearchedFaq(filtered);
        }catch (error) {
            showAlert(
                "triggerFilterRegReq", 
                "Failed to apply filter", 
                error instanceof Error ? error.message : String(error), 
                { type: 'error' }
            );
        }
    }
    // Auto trigger when filter status, uen bizName and allRegisRequest change
    useEffect(() => { triggerFilterFAQs(); }, [
        filterString, 
        allFAQs
    ])

    // Update created faq locally
    function handleCreateFAQ(newData: any) {
        const newAllFaq = [ ...allFAQs, newData]
        setAllFAQs(newAllFaq)
    }

    const triggerDeleteFAQ = async(faqID: number) => {
        try {
            let response = await deleteFaq(faqID);
            // console.log(response)
            if(response.message === 'Succesfully deleted FAQ') {
                handleDeleteFAQ(faqID)
            }
        } catch (error) {
            showAlert(
                "triggerDeleteFAQ",
                "Failed to Delete FAQ",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Update Delete locally
    function handleDeleteFAQ(faqID: number) {
        const deletedFaqs = allFAQs.filter((faq:any) => {
            return faq.faqID !== faqID
        })
        setAllFAQs(deletedFaqs)
    }

    // Function update FAQ
    function toggleCreateOrEdit(faq: any) {
        // console.log(faq)
        if(faq)
            setIsCreateFaq(false)
        else
            setIsCreateFaq(true)

        setSelectedFaq(faq)
    }

    function toggleDisplayOnLanding(faq: any, isShown: number) {
        if (isShown === 0)
            triggerUpdateFAQ(faq, 1)
        else
            triggerUpdateFAQ(faq, 0)
    }

    const triggerUpdateFAQ = async(faq: any, isShown: number) => {
        // console.log(faq)
        try {
            const showFaq = {
                ...faq,
                isShown: isShown
            }
            console.log(showFaq)
            let response = await editFaq(showFaq);
            if(response.message === 'Successfully updated and retrieved FAQ list.') {
                response = response.FAQList || [];
                // console.log(response)
                setAllFAQs(response)
                toggleCreateOrEdit('')
            }
        } catch (error) {
            showAlert(
                "triggerUpdateFAQ",
                "Failed to Update FAQ",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    return (
        <div className="App-content">
            <div className="content">
                <h1>FAQ Management</h1>
                <CreateFAQForm 
                    isCreate={isCreateFaq}
                    selectedFAQ={selectedFaq}
                    handleCreateFAQ={handleCreateFAQ}
                    triggerUpdateFAQ={triggerUpdateFAQ}
                />
                {/* Input Filter Question */}
                <input type='text' 
                    className='sa-filter-faq-input'
                    name='filter-faq'
                    placeholder='Search for Question...' 
                    value={filterString}
                    onChange={(e) => setFilterString(e.target.value)}
                    required
                />
                    
                {searchedFaq.length > 0 ? (
                    <>
                    <FAQ_t 
                        allFAQs={searchedFaq}
                        toggleCreateOrEdit={toggleCreateOrEdit}
                        triggerDeleteFAQ={triggerDeleteFAQ}
                        toggleDisplayOnLanding={toggleDisplayOnLanding}
                    />
                    <FAQ_m 
                        allFAQs={searchedFaq}
                        toggleCreateOrEdit={toggleCreateOrEdit}
                        triggerDeleteFAQ={triggerDeleteFAQ}
                        toggleDisplayOnLanding={toggleDisplayOnLanding}
                    />
                    </>
                ) : (
                    <p>{NO_DATA_MATCHED}</p>
                )}
            </div>
        </div>
    )
}

export default FAQManagement