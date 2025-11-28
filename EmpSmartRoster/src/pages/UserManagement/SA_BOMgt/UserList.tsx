import { useState, useEffect } from 'react';
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { SUB_PLAN, SUB_STATUS, IS_ACC_SUSPENDED, NO_DATA_MATCHED } from '../../../controller/Variables';
import CompanyController from '../../../controller/CompanyController';
import SubscribtionController from '../../../controller/SubscribtionController';
import UserController from '../../../controller/User/UserController';
import BOUserList_t from './BOUserList_t';
import BOUserList_m from './BOUserList_m';
import './UserList.css';
import '../../../../public/styles/common.css';

// import functions needed from UserController
const { handleUserAccStatusFilter, } = UserController;
// import functions needed from CompanyController
const { handleFilterUENBizName, } = CompanyController;
// import functions needed from SubscribtionController
const { saGetSubscriptionTransactions, 
        getSubsTransForACompany,
        getSortedSubsTransactions,
        handleFilterSubsStatus, } = SubscribtionController;

interface BOListProps {
    boUsers?: any;
}

const BOUserList = ({boUsers = []}: BOListProps) => {
    // console.log(boUsers)
    const { showAlert } = useAlert();
    const [ filterSubsStatus, setFilterSubsStatus ] = useState(SUB_PLAN[0]);
    const [ filterAccStatus, setFilterAccStatus ] = useState(IS_ACC_SUSPENDED[0]);
    const [ filterUENOBizName, setFilterUENOBizName ] = useState('');
    const [ allCompanies, setAllCompanies ] = useState<any>([])
    const [ companies, setCompanies ] = useState<any>([]);  // Data to Display

    const fetchCompaniesData = async() => {
        if(!boUsers) return; // If no boUsers return nothing
        
        try{            
            let transactions = await saGetSubscriptionTransactions();
            transactions = transactions.SubscriptionDetails || []
            // console.log(transactions);

            if (transactions.length > 0){
                const fullCompaniesDataPromises = boUsers.map(async (company:any) => {
                    // Get all transactions for current company
                    const transactionsForACompany = await getSubsTransForACompany(transactions, company.UEN);
                    // Get latest transactions for current company
                    const sortedTransactions = await getSortedSubsTransactions(transactionsForACompany)
                    // console.log(sortedTransactions) // Debug line
                    return{
                        ...company, // All data for current company
                        transactions: sortedTransactions, // Include new transactions data
                    }
                })
                // console.log(fullCompaniesDataPromises)
                const fullCompaniesData = await Promise.all(fullCompaniesDataPromises)
                // console.log(`Full company data: \n`, fullCompaniesData)
                setAllCompanies(Array.isArray(fullCompaniesData) ? fullCompaniesData : [])
            } else {
                const boData = boUsers.map((company:any) => ({
                    ...company,
                    transactions: []
                }));
                setAllCompanies(boData)
            }
            
        } catch(error) {
            setCompanies([]);
            showAlert(
                "Fetch Company Data Error",
                'Failed to fetch company data BOUserList',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Auto trigger when boUsers changed
    useEffect(() => { fetchCompaniesData(); }, [boUsers]);
    // useEffect(() => {console.log(allCompanies)})   // Debug to check the latest json Object
    
    const triggerFilterBOData = async () => {
        // console.log("Data received in filter subscription status:\n", allCompanies)
        try {
            // Fiter with Subscribing Status
            let filtered = handleFilterSubsStatus(allCompanies, filterSubsStatus);
            // Filter with Business Owner Acc Status
            filtered = handleUserAccStatusFilter(filtered, filterAccStatus);
            
            // Filter with UEN or BizName
            filtered = handleFilterUENBizName(filtered, filterUENOBizName);
            setCompanies(filtered);
        } catch (error) {
            showAlert(
                "triggerFilterBOData", 
                "Failed to apply filter", 
                error instanceof Error ? error.message : String(error), 
                { type: 'error' }
            );
        }
    }


    // Auto trigger when filter subscription status, account status, and all companies data change
    useEffect(() => { triggerFilterBOData(); }, [
        filterSubsStatus, 
        filterAccStatus, 
        filterUENOBizName, 
        allCompanies
    ])

    const handleDataUpdate = (updatedData:any) => {
        const updatedItem = allCompanies.map((data:any) => 
            data.owner?.UID === updatedData.owner?.UID
            ? { ...data, 
                owner: updatedData.owner
              }
            : data
        )
        // console.log(updatedItem)
        setAllCompanies(updatedItem) // Update data locally
    }

    return (
        <>
        <div className="App-filter-search-component">
            <div className="App-filter-container subscription-status">
                <p className='App-filter-title'>Subscribed To</p>
                {/* Subscription Status dropdown */}
                <select 
                    value={filterSubsStatus}
                    onChange={(e) => setFilterSubsStatus(e.target.value)}
                >
                {SUB_PLAN.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
                </select>
            </div>
            <div className="App-filter-container account-status">
                <p className='App-filter-title'>Account Status</p>
                {/* Account Status dropdown */}
                <select 
                    value={filterAccStatus}
                    onChange={(e) => setFilterAccStatus(e.target.value)}
                >
                {IS_ACC_SUSPENDED.map(accStatus => (
                    <option key={accStatus} value={accStatus}>
                        {accStatus}
                    </option>
                ))}
                </select>
            </div>
            <div className="App-filter-container uen-company-name">
                <p className='App-filter-title'>UEN/Company Name</p>
                <input type='text' 
                    className='search-input'
                    placeholder='Search UEN / Company Name' 
                    onChange={(e) => setFilterUENOBizName(e.target.value)}
                />
            </div>
        </div>
        {companies.length > 0 ? (
        <>
            {/* Desktop Table */}
            <BOUserList_t 
                companies={companies}
                onUpdate={handleDataUpdate} />

            {/* Tablet and Mobile Table */}
            <BOUserList_m 
                companies={companies}
                onUpdate={handleDataUpdate} />
        </>
        ):(NO_DATA_MATCHED)}
        </>
    )
}

export default BOUserList;