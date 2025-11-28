import { useState, useEffect } from "react";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import { REG_STATUS } from '../../controller/Variables'
import RegisReq from "./components/RegisReq";
import RegisReq_m from './components/RegisReq_m';
import RegisReqTitle from './components/Title';
import RegisReqController from "../../controller/RegisReqController";

import "./RegisRequests.css"
import "../../../public/styles/common.css";

// Access the function from the RegisReqController default export
const { getRegistrationRequests, 
        handleFilterRegsStatus, 
        handleFilterRegReqUENBizName, } = RegisReqController;

const RegisRequests = () => {
    const { showAlert } = useAlert();
    const [ allRegisRequest, setAllRegisRequest ] = useState<any>([]);
    const [ filterStatus, setFilterStatus ] = useState(REG_STATUS[0]); // Default display by pending
    const [ filterUENOBizName, setFilterUENOBizName ] = useState('');   // Default empty
    const [ filteredRegisRequest, setFilteredRegisRequest ] = useState<any>([]);

    const fetchRegisReqsData = async () => {
        try {
            const data = await getRegistrationRequests();
            const regReqList = data.RegistrationRequestList || [];
            // console.log(regReqList)
            setAllRegisRequest(Array.isArray(regReqList) ? regReqList : []);
            // console.log(allRegisRequest)
        } catch (error) {
            showAlert(
                "fetchRegisReqsData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    // Auto trigger when allRegisRequest length change
    useEffect(() => { 
        fetchRegisReqsData();
    }, [allRegisRequest.length]); 

    const triggerFilterRegReq = async () => {
        try{
            // Filter registration request status
            let filtered = handleFilterRegsStatus(allRegisRequest, filterStatus);
            // Filter UEN or BizName
            filtered = handleFilterRegReqUENBizName(filtered, filterUENOBizName);
            // console.log(filtered)
            setFilteredRegisRequest(filtered);
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
    useEffect(() => { triggerFilterRegReq(); }, [
        filterStatus, 
        filterUENOBizName,
        allRegisRequest
    ])
  
    const handleDataUpdate = (updatedData:any) => {
        // console.log("Updated Registration Request: \n", updatedData)

        const updatedItem = allRegisRequest.map((request: any) => 
            request.registrationID === updatedData.registrationID
            ? updatedData
            : request
        )
        setAllRegisRequest(updatedItem); // Update data locally
        // console.log("Updated State: \n", updatedItem)
    };

    return (
        <div className="content">
            <RegisReqTitle />
            
            <div className="App-filter-search-component">
                <div className="App-filter-container">
                    <p className='App-filter-title'>Reg.Request Status</p>
                    <select 
                        value={filterStatus}
                        onChange={(e) => {
                            // console.log("Target value: ", e.target.value)
                            setFilterStatus(e.target.value);
                        }}
                    >
                        {REG_STATUS.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="App-filter-container">
                    <p className='App-filter-title'>UEN/Company Name</p>
                    <input type='text' 
                        placeholder='Search UEN / Company Name' 
                        onChange={(e) => {
                            setFilterUENOBizName(e.target.value);
                        }}
                    />
                </div>
            </div>

            {/* Desktop View */}
            <RegisReq 
                data={filteredRegisRequest}
                onUpdate={handleDataUpdate}/>

            {/* Mobile View */}
            <RegisReq_m 
                data={filteredRegisRequest}
                onUpdate={handleDataUpdate}/>
        </div>
    )
}

export default RegisRequests;