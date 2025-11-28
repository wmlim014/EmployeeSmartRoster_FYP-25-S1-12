import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { SUB_STATUS } from '../../controller/Variables'
import SubsPlan from './components/SubsPlan'
import SubsTransactions_t from './components/SubTrans_t'
import SubsTransactions_m from './components/SubTrans_m'
import SubscribtionController from '../../controller/SubscribtionController'
import CompanyController from '../../controller/CompanyController'

import { GrSchedules } from "react-icons/gr";
import { FaChevronCircleDown, FaChevronCircleUp, FaRegListAlt,
         FaCircle, FiRefreshCw } from '../../../public/Icons.js'
import './SubsMgts.css'
import '../../../public/styles/common.css'

const { getSubsPlans, boGetSubscribedPlan, getActivatedPlan } = SubscribtionController
const { getCompany } = CompanyController

const SubsMgts = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ allSubsPlans, setAllSubsPlans ] = useState<any[]>([]);
    const [ subsTrans, setSubsTrans ] = useState<any>([]);
    const [ onSubs, setOnSubs ] = useState<any>()
    const [ company, setCompany ] = useState<any>();
    const [ showSubsPlan, setShowSubsPlan ] = useState(false)

    const fetchSubsPlans = async() => {
        try {
            let data = await getSubsPlans();
            data = data.SubscriptionPlan
            // console.log(data)
            setAllSubsPlans(data)
        } catch (error) {
            showAlert(
                "fetchSubsPlans",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )   
        }
    }
    useEffect(() => { fetchSubsPlans() }, [user])

    const fetchBoSubsTransaction = async() => {
        try {
            let company = await getCompany(user?.UID)
            // console.log(company)
            setCompany(company)

            let data = await boGetSubscribedPlan(company.UEN);
            data = data.BOSubscribedPlan || [];

            if (data.length > 0) {
                let subs = await getActivatedPlan (data[0].cID)
                subs = subs.BOCurrentSubscribedPlan || [];
                // console.log(subs);
                setOnSubs(subs)

                // Filter out the free plan
                data = data.filter((transaction: any) => {
                    return transaction.subscription_name !== 'Free'
                })
                // console.log(data)
                setSubsTrans(data)
            }
        } catch(error) {
            showAlert(
                "fetchBoSubsTransaction",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )   
        }
    }
    useEffect(() => {fetchBoSubsTransaction()}, [user])

    function toggleShowSubsPlan() {
        setShowSubsPlan(!showSubsPlan)
    }
    // Cancel Subscription update locally
    function handleSubsUpdate (updatedData: any) {
        const updatedItem = subsTrans.map((data:any) => 
            data.subsTransID === updatedData.subsTransID
            ? updatedData
            : data
        )
        setSubsTrans(updatedItem);
    }
    // Add new transaction locally
    function handleNewSubsTrans(newTrans: any) {
        const data = [
            ...subsTrans,
            newTrans
        ]
        // console.log("add subscription transaction\n", data)
        setSubsTrans(data);
    }

    return (
        <div className='content'>
            <div className='sub-management-header'>
                <h1>Subscription Management</h1>
                <button className='view-subs-plan-button'
                    onClick={() => toggleShowSubsPlan()}
                >
                    {showSubsPlan ? (
                        <FaChevronCircleUp />
                    ):(
                        <FaChevronCircleDown />
                    )}
                     View Subscription Plans
                </button>
            </div>
            {showSubsPlan && 
                <SubsPlan 
                    displaySubsPlans={allSubsPlans}
                    allTransactions={subsTrans}
                    onSubsPlans={onSubs}
                    user={user}
                    company={company}
                    updateCancelSubs={handleSubsUpdate}
                    addNewTrans={handleNewSubsTrans}
                />
            }
            {/* Display Subscriping Plan */}
            {onSubs && (
            <div className="subscribed-plan-container card">
                <div className='subscribed-plan-title'>
                    <h3>Subscribed Plan: {onSubs.subscription_name}</h3>
                    <div className="view-subs-plan-btn-grps">
                        <FiRefreshCw 
                            className='icons view-subs-plan-icon'
                            onClick={() => {window.location.reload();}}
                        />
                        {onSubs.subscription_name !== 'Free' && 
                            <FaCircle className={`subscribed-plan-title-icon
                                ${
                                    onSubs.subsStatus === SUB_STATUS[0]
                                      ? 'pending'
                                      : onSubs.subsStatus === SUB_STATUS[4]
                                      || onSubs.subsStatus === SUB_STATUS[3]
                                      || onSubs.subsStatus === SUB_STATUS[2]
                                      ? 'expired'
                                      : ''
                                  }
                                `} />
                        }
                    </div>
                </div>
                <div className="subscribed-plan-data plan-description even-row">
                    <p className="title"><FaRegListAlt /></p>
                    <p className="main-data">{onSubs.subscription_plan_description}</p>
                </div>
                {onSubs.subscription_name !== 'Free' && (
                    <>
                    <div className="subscribed-plan-data plan-description">
                        <p className="title"><GrSchedules /></p>
                        <p className="main-data">
                            {String(onSubs.startDate).split("T")[0]} ~&nbsp;
                            {String(onSubs.endDate).split("T")[0]}
                        </p>
                    </div>
                    </>
                )}
            </div>
            )}
            {subsTrans.length > 0 
                ? (
                <>
                    <SubsTransactions_t subsTrans={subsTrans}/>
                    <SubsTransactions_m subsTrans={subsTrans}/>
                </>
                ) : (<span>No Transaction History...</span>)
            }
        </div>
    )
}

export default SubsMgts