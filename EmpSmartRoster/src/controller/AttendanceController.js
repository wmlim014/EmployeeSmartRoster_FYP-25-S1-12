// Check in
async function submitAttendance (uid) {
    const body = {
        employee_user_id: uid,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/attendance/register', {
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
// Check out
async function submitCheckOut (attendanceID) {
    const body = {
        attendanceID: attendanceID,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/attendance/clock-out', {
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

async function empViewMyAttendances (uid) {
    const body = {
        employee_user_id: uid,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/attendance/view', {
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

async function boViewMyEmpAttendances (uid) {
    const body = {
        business_owner_id: uid,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/attendancelist/view', {
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

// Sort Record by Descending Order
function sortAttendanceRecords(allAttendances) {
    const sortedByStartTimeDesc = [...allAttendances].sort((a, b) => 
        new Date(b.startTime) - new Date(a.startTime)
    );
    return sortedByStartTimeDesc
}

// Filter by Start Time
function handleFilterByStartTime(allAttendances, dateStart, dateEnd) {
  if (!dateStart || !dateEnd) return allAttendances;

  // Convert filter dates to UTC
  const startUTC = new Date(dateStart);
  startUTC.setUTCHours(0, 0, 0, 0);

  const endUTC = new Date(dateEnd);
  endUTC.setUTCHours(23, 59, 59, 999);

  return allAttendances.filter((attendance) => {
    const attendanceDate = new Date(attendance.startTime);
    return attendanceDate >= startUTC && attendanceDate <= endUTC;
  });
}

function handleFilterEmpName (allAttendances, filterString){
  const filteredData = allAttendances.filter((attendance) => {
      const search = filterString.trim().toLowerCase();
      if (!search) return true;

      const nameMatch = attendance.fullName.toLowerCase().includes(search);

      return nameMatch;
  })
  return filteredData
}


export default {
    submitAttendance,
    submitCheckOut,
    empViewMyAttendances,
    boViewMyEmpAttendances,
    sortAttendanceRecords,
    handleFilterByStartTime,
    handleFilterEmpName
}