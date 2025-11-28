import {ISSUES_CATEGORY, ISSUES_LOG_STATUS} from './Variables.js'

async function getAllReportedIssues(uid) {
    // console.log(uid)
    const body = {
        user_id: uid
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/issue/view',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data // Spread any additional fields from the API response
    } catch (error) {
        throw new Error(`Failed to fetch reported issues: ${error.message}`);
    }
}

async function createNewIssueReport(uid, values) {
    const body = {
        user_id: uid,
        title: values.title,
        issue_description: values.issue_description,
        issuesCategory: values.issuesCategory
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/issue/add',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data // Spread any additional fields from the API response
    } catch (error) {
        throw new Error(`Failed to create issue: ${error.message}`);
    }
}

async function updateReportedIssuesStatus(issueID, issuesStatus) {
    const body = {
        issueID: issueID,
        issuesStatus: issuesStatus
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/issue/update/status',
            {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data // Spread any additional fields from the API response
    } catch (error) {
        throw new Error(`Failed to update issue: ${error.message}`);
    }
}

async function updateReportedIssuesProgress(issueID, user_id, issue_description) {
    const body = {
        issueID: issueID,
        user_id: user_id,
        issue_description: issue_description
    }

    try {
        const response = await fetch(
            'https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/issue/update',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // console.log("API Response Status:", response);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data // Spread any additional fields from the API response
    } catch (error) {
        throw new Error(`Failed to update issue: ${error.message}`);
    }
}

function handleFilterIssuesCategory(allIssues, filterCategory) {
    const filteredData = allIssues.filter((issue) => {
        const DEFAULT_CATEGORY = ISSUES_CATEGORY[0];
        const category = issue.issuesCategory || DEFAULT_CATEGORY;
        return category === '' || category === filterCategory;
    });
    return filteredData;
}

function handleFilterIssuesStatus(allIssues, filterStatus) {
    // console.log("Filter Issues Status: ", filterStatus)
    const filteredData = allIssues.filter((issue) => {
        const DEFAULT_STATUS = ISSUES_LOG_STATUS[0];
        const status = issue.issuesStatus || DEFAULT_STATUS;
        return status === '' || status === filterStatus ;
    });
    return filteredData;
}

function handleFilterIssueTitle (allIssues, filterString){
    const filteredData = allIssues.filter((issue) => {
        const search = filterString.trim().toLowerCase();
        if(!search) return true;

        const uenMatch = issue.title.toLowerCase().includes(search);
        return uenMatch;
    })
    return filteredData;
}

export default {
    getAllReportedIssues,
    createNewIssueReport,
    updateReportedIssuesStatus,
    updateReportedIssuesProgress,
    handleFilterIssuesCategory,
    handleFilterIssuesStatus,
    handleFilterIssueTitle
}