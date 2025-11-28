import { useState, useEffect } from 'react'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import CompanyController from '../../../controller/CompanyController.js'
import UserController from '../../../controller/User/UserController.js'

import { MdOutlineLocationOn, GiRotaryPhone, CgProfile,
         MdOutlineMailOutline } from '../../../../public/Icons.js'
import './styles.css'
import '../../../../public/styles/common.css'
import { useResolvedPath } from 'react-router-dom'

interface EmpMoreUserProfileDetailProps {
    userData: any
}

const { getCompany } =  CompanyController
const { boGetUserProfile } = UserController

const EMP_UserPrEmployeerDetail = ({ userData }: EmpMoreUserProfileDetailProps) => {
    const { showAlert } = useAlert();
    const [ employeerInfo, setEmployeerInfo ] = useState<any>([]);

    const fetchEmployeerInfo = async() => {
        try {
            const company = await getCompany(Number(userData.business_owner_id));
            // console.log("Employed By (Company): ", company)
            let businessOwner = await boGetUserProfile(userData.business_owner_id);
            businessOwner = businessOwner.BOProfile || []
            // console.log("Employed By (Employeer): ", businessOwner[0])

            if(company && businessOwner){
                const combinedData = {
                    company: company, 
                    owner: businessOwner[0]
                }
                setEmployeerInfo(combinedData)
            }
            

        } catch (error) {
            showAlert(
                "fetchEmployeerInfo",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    useEffect(() => {fetchEmployeerInfo()}, [userData])

    return(
        <div className='emp-employeer-user-profile-main-content'>
            {employeerInfo && (
                <>
                <div className="emp-user-profile-other-and-employeer-container">
                    <div className='emp-uswr-profile-employeer-info'>
                        <h3>Employed By: {employeerInfo.company?.bizName}</h3>
                        <div className="user-profile-data employeer-name even-row">
                            <p className="icon-title"><CgProfile /></p>
                            <p className="main-data">{employeerInfo.owner?.fullName}</p>
                        </div>
                        <div className="user-profile-data company-email">
                            <p className="icon-title"><MdOutlineMailOutline /></p>
                            <p className="main-data">{employeerInfo.owner?.email}</p>
                        </div>
                        <div className="user-profile-data company-contact even-row">
                            <p className="icon-title"><GiRotaryPhone /></p>
                            <p className="main-data">{employeerInfo.company?.contactNo}</p>
                        </div>
                        <div className="user-profile-data company-address">
                            <p className="icon-title"><MdOutlineLocationOn /></p>
                            <p className="main-data">{employeerInfo.company?.address}</p>
                        </div>
                    </div>
                    <div className='emp-uswr-profile-other-info'>
                        <h3>Other Information</h3>
                        <div className="user-profile-data outpatient-leave even-row">
                            <p>Outpatient Leave (MC): </p>
                        </div>
                        <div className="no-of-leave">
                            <div className="user-profile-data company-email">
                                <p className="title">Total: </p>
                                <p className="main-data">{userData.noOfMC}</p>
                            </div>
                            <div className="user-profile-data company-email">
                                <p className="title other-info-title">Available: </p>
                                <p className="main-data other-info-data">{userData.noOfMCAvailable}</p>
                            </div>
                        </div>
                        <div className="user-profile-data annual-leave even-row">
                            <p>Annual Leave: </p>
                        </div>
                        <div className="no-of-leave">
                            <div className="user-profile-data company-email">
                                <p className="title">Total: </p>
                                <p className="main-data">{userData.noOfLeave}</p>
                            </div>
                            <div className="user-profile-data company-email">
                                <p className="title other-info-title">Available: </p>
                                <p className="main-data other-info-data">{userData.noOfLeaveAvailable}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}

export default EMP_UserPrEmployeerDetail