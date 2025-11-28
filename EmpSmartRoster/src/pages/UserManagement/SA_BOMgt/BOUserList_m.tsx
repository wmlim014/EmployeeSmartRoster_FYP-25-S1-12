import { useState } from 'react';
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { BiSolidUserDetail } from '../../../../public/Icons.js';
import { SUB_PLAN } from "../../../controller/Variables.js"
import BODetail from './BODetail';
import CompanyController from '../../../controller/CompanyController';

import './BOUserList_m.css'
import '../../../../public/styles/common.css'

const { handleSelectedDetail } = CompanyController;

interface BOListMobileProps {
    companies?: any;
    onUpdate?: (updatedData: any) => void;
}

const BOUserList_m = ({ companies = [], onUpdate }: BOListMobileProps) => {
    const { showAlert } = useAlert();
    const [ selectedCompany, setSelectedCompany ] = useState<any>([]);
    const [ showDetail, setShowDetail ] = useState(false);
    const [ error, setError ] = useState("");
    
    const handleDetailClick = async (company: any) => {
        try{
            // Get Business onwers user list
            const selectedCompany = handleSelectedDetail(company)
            setSelectedCompany(selectedCompany)
            setShowDetail(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            setSelectedCompany([]);
            setShowDetail(false);
        }

        if(error)
            showAlert(
                "handleDetailClick in BOUserList",
                '',
                error,
                { type: 'error' }
            )
    }
    // useEffect(() => {console.log(selectedUser)}, [selectedUser.length])   // Debug to check the latest json Object

    function triggerCloseDetail () {
        setSelectedCompany([]);
        setShowDetail(false);
    }
    
    return (
        <>
        <div className="App-mobile-responsive-table">
        {companies.map((company:any) => (
        <div 
            key={company.UEN}
            className='App-mobile-responsive-table-card'
        >
            <div className="App-mobile-responsive-table-card-title">
                <h2>{company.bizName}</h2>
                <div className="App-mobile-table-icon"
                    onClick={() => {
                        handleDetailClick(company)
                    }}>
                    <BiSolidUserDetail />
                </div>
            </div>

            <div className='App-mobile-responsive-table-card-data'>
                <div className='App-mobile-responsive-table-card-data-detail'>
                    <p className='App-mobile-responsive-table-card-data-title'>
                        UEN
                    </p>
                    <p>{company.UEN}</p>
                </div>
                <div className='App-mobile-responsive-table-card-data-detail'>
                    <p className='App-mobile-responsive-table-card-data-title'>
                        Email
                    </p>
                    <p>{company.owner.email}</p>
                </div>
                <div className='App-mobile-responsive-table-card-data-detail'>
                    <p className='App-mobile-responsive-table-card-data-title'>
                        Subs.To
                    </p>
                    <p>{company.transactions[0]?.subsPlanID === 1 ? SUB_PLAN[0] : SUB_PLAN[1]}</p>
                </div>
            </div>
        </div>
        ))}
        </div>
        {showDetail && selectedCompany && (
            <div className='App-popup' onClick={triggerCloseDetail}>
                <BODetail
                    company={selectedCompany}
                    onClose={() => triggerCloseDetail()}
                    onUpdate={onUpdate}
                />
            </div>
        )}
        </>
    )
}

export default BOUserList_m;