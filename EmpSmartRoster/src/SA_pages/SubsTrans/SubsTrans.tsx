import { useState, useEffect } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDateTime, SUB_STATUS } from '../../controller/Variables.js'
import SubsTrans_t from './components/SubsTrans_t'
import SubsTrans_m from './components/SubsTrans_m'
import SubscribtionController from '../../controller/SubscribtionController.js'

import './SubsTrans.css'
import '../../../public/styles/common.css'

const { saGetSubscriptionTransactions, filterTransactionsBaseOnPlan, handleFilterPaymentStatus,
        handleFilterTransactionsByString } = SubscribtionController;
const SubsTransactions = () => {
    const { showAlert } = useAlert()
    const [ allTransactions, setAllTransactions ] = useState<any>([]);
    const [ displayTrans, setDisplayTrans ] = useState<any>([])
    const [ filterStatus, setFilterStatus ] = useState(SUB_STATUS[1]); // Default display by Completed
    const [ filterString, setFilterString ] = useState('');   // Default empty

    const fetchAllTransactions = async () => {
        try {
            let response = await saGetSubscriptionTransactions();
            // console.log(response)
            if(response.message === 'Succesfully retrieved Subscription Details'){
                response = response.SubscriptionDetails || []
                
                let filterOutFreePlan = filterTransactionsBaseOnPlan(response, 2)
                filterOutFreePlan = filterOutFreePlan || [];
                // console.log(filterOutFreePlan)

                filterOutFreePlan = filterOutFreePlan.map((trans: any) => {
                    return {
                        ...trans,
                        startDate: formatDateTime(trans.startDate),
                        endDate: formatDateTime(trans.endDate)
                    }
                })
                setAllTransactions(filterOutFreePlan);
                setDisplayTrans(filterOutFreePlan);
            }
        } catch (error) {
            showAlert(
                "fetchAllTransactions",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    // Auto trigger when allRegisRequest length change
    useEffect(() => { 
        fetchAllTransactions();
    }, [allTransactions.length]); 

    const handleFilterTransactions = async() => {
        try{
            // Filter Transactions Base on User Input
            let filtered = handleFilterPaymentStatus(allTransactions, filterStatus);
            filtered = handleFilterTransactionsByString(filtered, filterString)
            // console.log(filtered)
            setDisplayTrans(filtered);
        }catch (error) {
            showAlert(
                "triggerFilterTranscations", 
                "Failed to apply filter", 
                error instanceof Error ? error.message : String(error), 
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        handleFilterTransactions();
    }, [filterStatus, filterString, allTransactions])

    return(
        <div className="App-content">
            <div className="content">
                <h1>View Subscription Transactions</h1>

                <div className="App-filter-search-component">
                    <div className="App-filter-container">
                        <p className='App-filter-title'>Payment Status</p>
                        <select 
                            value={filterStatus}
                            onChange={(e) => {
                                // console.log("Target value: ", e.target.value)
                                setFilterStatus(e.target.value);
                            }}
                        >
                            {SUB_STATUS.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="App-filter-container">
                        <p className='App-filter-title'>UEN/Company Name/REF</p>
                        <input type='text' 
                            placeholder='Search UEN / Company Name / REF' 
                            onChange={(e) => {
                                setFilterString(e.target.value);
                            }}
                        />
                    </div>
                </div>
                {displayTrans.length > 0 ? (
                    <>
                    <SubsTrans_t transactions={displayTrans}/>
                    <SubsTrans_m transactions={displayTrans}/>
                    </>
                ):(
                    <span>No Subscription Transactions Match...</span>
                )}
            </div>
        </div>
    )
}

export default SubsTransactions;