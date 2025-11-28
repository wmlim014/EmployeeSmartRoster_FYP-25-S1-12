import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { USER_ROLE, NO_DATA_MATCHED, ISSUES_CATEGORY, 
         ISSUES_LOG_STATUS, formatTextForDisplay } from '../../controller/Variables'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import CreateReportIssue from './components/CreateIssue'
import Issues_t from './components/Issues_t'
import Issues_m from './components/Issues_m'
import IssueDetail from './IssuesDetail'
import ReportIssuesController from '../../controller/ReportIssuesController'

import './ReportIssues.css'
import "../../../public/styles/common.css"

const { getAllReportedIssues, handleFilterIssuesCategory, handleFilterIssuesStatus,
        handleFilterIssueTitle, } = ReportIssuesController

const ReportIssues = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const navState = location.state as {
        issue?: any;
        user?: any;
    };
    const [ allIssues, setAllIssues]  = useState<any>([]);
    const [ filterCategory, setFilterCategory ] = useState<string>(ISSUES_CATEGORY[0]);
    const [ filterIssuesStatus, setFilterIssuesStatus ] = useState<string>(ISSUES_LOG_STATUS[0])
    const [ filterString, setFilterString ] = useState<string>('')
    const [ filteredIssues, setFilteredIssues ] = useState<any>([]);
    const [ showCreate, setShowCreate ] = useState(false);
    

    const fetchAllReportedIsses = async () => {
        try {
            let reportedIssues = await getAllReportedIssues (user?.UID)
            if(reportedIssues.message === 'Issue successfully retrieved') {
                reportedIssues = reportedIssues.Issues || []
                console.log(reportedIssues)
                setAllIssues(reportedIssues)
            }
        } catch (error) {
            showAlert(
                'fetchAllReportedIsses',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        fetchAllReportedIsses()
    }, [user])

    const triggerFilterIssuess = async () => {
        try{
            // Filter Issues(s) to display
            // Filter by category
            let filtered = handleFilterIssuesCategory(allIssues, filterCategory);
            // Filter by status
            filtered = handleFilterIssuesStatus(filtered, filterIssuesStatus)
            // Filter by issue status
            filtered = handleFilterIssueTitle(filtered, filterString)
            // console.log(filtered)
            setFilteredIssues(filtered);
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
    useEffect(() => { triggerFilterIssuess(); }, [
        filterCategory,
        filterIssuesStatus,
        filterString, 
        allIssues
    ])
    // console.log(filteredIssues)

    function toggleShowCreate() {
        setShowCreate(!showCreate)
    }

    // Update created issue locally
    function handleCreateIssue(newData: any) {
        console.log(newData)
        const newAllIssues = [ ...allIssues, newData];
        setAllIssues(newAllIssues);
        toggleShowCreate();
        showAlert(
            "Issue Created Successful",
            `Created: ${newData.title}`,
            `The issue is submitted as ${newData.issuesStatus}`,
            { type: 'success' }
        );
    }

    function toggleViewDetail(issueSelected: any) {
        if (!issueSelected) return;
        navigate('/issue-detail', {
            state: {
                issue: issueSelected,
                user: user
            }
        })
    }

    if(showCreate) return (
        <CreateReportIssue
            isCreate={true}
            user={user}
            handleCreateIssue={handleCreateIssue}
            onClose={toggleShowCreate}
        />
    )

    if (navState?.issue) return (
        <IssueDetail 
            issue={navState.issue}
            user={navState.user}
        />
    )

    return (
        <div className='App-content'>
            <div className="content">
                <div className="issues-page-header">
                    <h1>Reported Issues</h1>
                    {user?.role !== USER_ROLE[0] && (
                        <PrimaryButton 
                            text='Report New Issues'
                            onClick={() => toggleShowCreate()}
                        />
                    )}
                </div>
                <div className="App-filter-search-component">
                    <div className="App-filter-container">
                        <p className='App-filter-title'>Issues Category</p>
                        <select 
                            value={filterCategory}
                            onChange={(e) => {
                                // console.log("Target value: ", e.target.value)
                                setFilterCategory(e.target.value);
                            }}
                        >
                            {ISSUES_CATEGORY.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="App-filter-container">
                        <p className='App-filter-title'>Reported Issues Status</p>
                        <select 
                            value={filterIssuesStatus}
                            onChange={(e) => {
                                // console.log("Issues Status: ", e.target.value)
                                setFilterIssuesStatus(e.target.value);
                            }}
                        >
                            {ISSUES_LOG_STATUS.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="App-filter-container">
                    <p className='App-filter-title'>Search Case Title</p>
                    <input type='text' 
                        placeholder='Search Case Title' 
                        onChange={(e) => {
                            setFilterString(e.target.value);
                        }}
                    />
                </div>
                </div>
                {filteredIssues.length > 0 ? (
                    <>
                    <Issues_t 
                        allIssues={filteredIssues}
                        toggleViewDetail={toggleViewDetail}
                    />
                    <Issues_m 
                        allIssues={filteredIssues}
                        toggleViewDetail={toggleViewDetail}
                    />
                    </>
                ) : (
                    <p>{NO_DATA_MATCHED}</p>
                )}
            </div>
        </div>
    );
};

export default ReportIssues;