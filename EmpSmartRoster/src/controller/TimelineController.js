// create new timeline
async function createNewTimeline (userID, values) {
    // console.log(`boID: ${userID}\n`, values)
    const body = {
        business_owner_id: userID,
        title: values.title.trim(),
        timeLineDescription: values.timeLineDescription.trim()
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for create new timeline: \n`, error);
        throw new Error(`Failed to create new timeline: ${error.message}`);
    }
}

function getTimelineSelected (allTimelines, timelineID){
    // console.log(allTimelines, timelineID)
    const selectedTimeline = allTimelines.find((timeline) => 
        timeline.timeLineID === Number(timelineID)
    )
    // console.log(selectedTimeline)
    return selectedTimeline
} 

// get all timeline
async function getTimelines (boUID) {
    const body = {
        business_owner_id: boUID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/return-timeline-table', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for fetch timelines: \n`, error);
        throw new Error(`Failed to fetch timelines: ${error.message}`);
    }
}

async function getAllTasksInATimeline(boUID, timelineID) {
    const body = {
        business_owner_id: boUID,
        timelineID: timelineID
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/group-task-to-timeline', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for fetch tasks in ${timelineID}: \n`, error);
        throw new Error(`Failed to fetch tasks in ${timelineID}: ${error.message}`);
    }
}

// return all tasks
async function getAllTasks (boID) {
    const body = {
        business_owner_id: boID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// return task's detail for BO
async function boGetTaskDetail (taskID) {
    // console.log(taskID)
    const body = {
        taskID: taskID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// Create Task
async function createTask (boID, values, timelineID) {
    // console.log(timelineID)
    // const start = new Date(values.startDate).toISOString();
    // const end = new Date(values.endDate).toISOString()
    const startDateTime = values.startDate.split("T")
    const start = startDateTime.join(" ")
    const endDateTime = values.endDate.split("T")
    const end = endDateTime.join(" ")
    // console.log("Start time: ", start)
    // console.log("End time: ", end)
    // console.log(values.noOfEmp)

    if(timelineID === '') {
        timelineID = null
    }

    const body = {
        business_owner_id: boID,
        title: values.title,
        taskDescription: values.taskDescription,
        roleID: values.roleID,
        skillSetID: values.skillSetID,
        startDate: start,
        endDate: end, 
        timelineID: timelineID,
        noOfEmp: values.noOfEmp
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// Edit Task
async function editTask (values) {
    // console.log(values)
    // const start = new Date(values.startDate).toISOString();
    // const end = new Date(values.endDate).toISOString()
    const startDateTime = values.startDate.split("T")
    const start = startDateTime.join(" ")
    const endDateTime = values.endDate.split("T")
    const end = endDateTime.join(" ")
    // console.log("Start time: ", start)
    // console.log("End time: ", end)
    // console.log(values.noOfEmp)

    const body = {
        taskID: Number(values.taskID),
        title: values.title,
        taskDescription: values.taskDescription,
        roleID: Number(values.roleID),
        skillSetID: Number(values.skillSetID),
        startDate: start,
        endDate: end, 
        noOfEmp: Number(values.noOfEmp)
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/update', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to edit task: ${error.message}`);
    }
}

// Auto tasks allocation
async function handleTaskAutoAllocation(boUID) {
    const body = {
        business_owner_id: boUID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/allocation/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// Manual Reassign Employee to Task
async function handleManualUpdateTaskAllocation(user_id, taskAllocationID, taskName) {
    const body = {
        user_id: user_id,
        taskAllocationID: taskAllocationID
    };
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/allocation/reassign', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Failed to re-allocate employee to task ${taskName}: \n`, error);
        throw new Error(`Failed to re-allocate employee to task ${taskName}: ${error.message}`);
    }
}

async function getAvailableEmployees (roleID, skillSetID, boID) {
    const body = {
        roleID: roleID,
        skillSetID: skillSetID,
        business_owner_id: boID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/available/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Failed to delete task ${taskID}: \n`, error);
        throw new Error(`Failed to delete task ${taskID}: ${error.message}`);
    }
}

// return delete tasks's detail for BO
async function deleteTaskDetail (taskID) {
    const body = {
        taskID: taskID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/delete', {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Failed to delete task ${taskID}: \n`, error);
        throw new Error(`Failed to delete task ${taskID}: ${error.message}`);
    }
}

// return get allocated task's detail
async function getTaskDetail (userID) {
    const body = {
        employee_user_id: userID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/task/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to fetch task detail: ${error.message}`);
    }
}

function getRoleNeededForTask (allRoles, roleNeededID){
    // console.log(roleNeededID)
    const roleNeeded = allRoles.filter((role) => 
        role.roleID === roleNeededID
    )
    return roleNeeded
} 

function getSkillNeededForTask (allSkills, skillNeededID){
    // console.log(skillNeededID)
    const skillNeeded = allSkills.filter((skill) => 
        skill.skillSetID === skillNeededID
    )
    return skillNeeded
}

function isSameTimelineCreated(allTimelines, timelineName) {
    const filteredData = allTimelines.filter((timeline) => {
        return timeline.timelineTitle.toUpperCase().trim() === timelineName.toUpperCase().trim()
    })
    return filteredData
}

////////////////////////////////////////////////////////////////////////////
// Employee Timeline Control function below
async function empGetAllTask (uid) {
    // console.log(uid)
    const body = {
        user_id: uid
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/timeline/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to fetch all tasks: ${error.message}`);
    }
}

async function empUpdateTaskProgress (uid, taskID, status) {
    const body = {
        employee_user_id: uid,
        taskID: taskID,
        status: status
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/task/status/update', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// Swap Time Management
/////////////////////////////////////////////////////////////////////////////////////
// Fetch other tasks for showing to swap
async function viewOtherTasksToSwap (boUID, roleID, skillSetID, empUID) {
    
    const body = {
        business_owner_id: boUID,
        roleID: roleID,
        skillsetID: skillSetID,
        employee_user_id: empUID
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/task/view/sameroleandskillset', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}
// All received swap time
async function viewAllIncomingSwapTime (uid) {
    const body = {
        employee_user_id: uid,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/swaprequest/incoming/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}
// All submitted swap time
async function viewAllSwapTime (uid) {
    const body = {
        employee_user_id: uid,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/swaprequest/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

async function submitSwapTime (uid, requestTo, taskID, target_taskID, reason) {
    const body = {
        employee_user_id: uid,
        target_employee_user_id: requestTo,
        employee_task_id: taskID,
        target_employee_task_id: target_taskID,
        swapReason: reason
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/swaprequest/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

async function updateSwapTimeStatus (uid, swapID, status, targetUID, taskID, target_taskID) {
    const body = {
        swapReqID: swapID,
        status: status,
        user_id: uid,
        target_swap_user_id: targetUID,
        taskID: taskID,
        target_taskID: target_taskID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/swaprequest/status/update', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

function filterStatus(allSwapRequest, filterStatus) {
    const filteredData = allSwapRequest.filter((swapRequest) => {
      return swapRequest.senderDetails.status === filterStatus;
  })
  return filteredData;
}

// Google Calendar Functions
async function googleCalendarGetAuth(){
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/googlecalendar/auth-url', {
            method: 'GET',
            //body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        const URL = data.URL;
        console.log(URL);
        return  {authUrl: URL};
    }catch(error){
        throw new Error ('Failed to oAuth')
    }
}

async function googleCalendarSync({code,business_owner_id}){
    const body = {
        code,
        business_owner_id
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/googlecalendar/sync', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        //console.log(data);
        return data;
    }catch(error){
        throw new Error ('Failed to oAuth')
    }
}

async function googleCalendarSyncEmployee({code,user_id}){
    const body = {
        code,
        user_id
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/googlecalendar/employee-sync', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        //console.log(data);
        return data;
    }catch(error){
        throw new Error ('Failed to oAuth')
    }
}

async function googleCalendarGetAuthEmployee(){
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/googlecalendar/employee-auth-url', {
            method: 'GET',
            //body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        const URL = data.URL;
        console.log(URL);
        return  {authUrl: URL};
    }catch(error){
        throw new Error ('Failed to oAuth')
    }
}

export default {
    createNewTimeline, 
    getTimelines,
    getTimelineSelected,
    getAllTasksInATimeline,
    getAllTasks, 
    boGetTaskDetail,
    createTask, 
    editTask,
    handleTaskAutoAllocation,
    handleManualUpdateTaskAllocation,
    getAvailableEmployees,
    deleteTaskDetail, 
    getTaskDetail,
    getRoleNeededForTask,
    getSkillNeededForTask,
    empGetAllTask,
    empUpdateTaskProgress,
    isSameTimelineCreated,
    viewOtherTasksToSwap,
    viewAllIncomingSwapTime,
    viewAllSwapTime,
    submitSwapTime,
    updateSwapTimeStatus,
    filterStatus,
    googleCalendarGetAuth,
    googleCalendarSync,
    googleCalendarSyncEmployee,
    googleCalendarGetAuthEmployee
}