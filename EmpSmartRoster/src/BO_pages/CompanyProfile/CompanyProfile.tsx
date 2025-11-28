import { useEffect, useState } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { useAuth } from '../../AuthContext'
import { formatPhoneNumber, formatTextForDisplay } from '../../controller/Variables.js'
import CompanyController from '../../controller/CompanyController'
import EditCompanyProfile from './components/EditCompanyPr'

import { FaRegBuilding } from "react-icons/fa";
import { FaFilePdf, FaRegEdit, 
         MdDeleteForever, FaPlusCircle, 
         IoClose, FiRefreshCw } from '../../../public/Icons.js'
import './CompanyProfile.css'
import '../../../public/styles/common.css'

const { getCompany, getCompanyRoles, 
        getCompanySkillsets, getCompanyBizFile,
        createSkillset, createRole,
        removeRole, removeSkillset,
        checkIfRoleCreated, checkIfSkillsetCreated,
        getSkillsetsForARole } = CompanyController;

const BOCompanyProfile = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [ companyInfo, setCompanyInfo ] = useState<any>([]);
    const [ bizFileURL, setBizFileURL ] = useState<string>('');
    const [ allRoles, setAllRoles ] = useState<any>([]);
    const [ allSkillsets, setAllSkillsets ] = useState<any>([]);
    const [ newRole, setNewRole ] = useState<string>('');
    const [ selectedRoleForNewSkill, setSelectedRoleForNewSkill ] = useState<string>('');
    const [ newSkillset, setNewSkillset ] = useState<string>('');
    const [ showEditCompanyProfile, setShowEditCompanyProfile ] = useState(false);
    const [ roleSelectedToShow, setRoleSelectedToShow ] = useState<any>({})
    const [ skillsetsForSelectedRole, setSkillsetForSelectedRole ] = useState<any>([])
    const [ isExpendRole, setIsExpendRole ] = useState(false);
    const isMobile = window.innerWidth <= 768;

    const fetchCompanyProfile = async() => {
        if (!user?.UID) return;
        try {
            const companyData = await getCompany(user?.UID);
            // console.log(companyData)
            setCompanyInfo(companyData)

            let companyRoles = await getCompanyRoles(user?.UID);
            companyRoles = companyRoles.roleName || [];
            // console.log(companyRoles)
            setAllRoles(companyRoles);

            let companySkillsets = await getCompanySkillsets(user?.UID);
            companySkillsets = companySkillsets.skillSets || [];
            // console.log(companySkillsets)
            setAllSkillsets(companySkillsets);

            // Get company biz file
            await fetchBizFilePDF();
        } catch (error) {
            showAlert(
                "fetchCompanyProfile",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    useEffect(() => {
        if(user?.UID)
            fetchCompanyProfile();
    }, [user?.UID])

    const fetchBizFilePDF = async () => {
        try {
            const fileData = await getCompanyBizFile (user?.email);
            // Decode base64 to binary string
            const byteCharacters = atob(fileData.fileData);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
                byteCharacters.charCodeAt(i)
            );
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(blob);
            // console.log(pdfUrl)
            setBizFileURL(pdfUrl)
        } catch (error) {
            showAlert(
                'fetchBizFilePDF',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Create new role
    const triggerCreateRole = async () => {
        let isSameRoleCreated = allRoles;
        // console.log(allRoles)
        if(isSameRoleCreated)
            isSameRoleCreated = await checkIfRoleCreated(allRoles, newRole)
        // console.log(isSameRoleCreated)
        if(isSameRoleCreated.length > 0) { // If the role is created before
            showAlert(
                'Create Role',
                `Create Role Failed`,
                `"${newRole}" is created before`,
                { type: 'error' }
            );
        } else {
            try {
                const response = await createRole (newRole, user?.UID)
                // console.log(response)
                if(response.message === "Role successfully added") {
                    const lastRoleNo = response.roleID.length - 1
                    const newRoleID = response.roleID[lastRoleNo].roleID
                    const newRoleObj = {
                        roleName: newRole,
                        roleID: newRoleID,
                    };
    
                    setAllRoles((prevRoles: any) => [
                        ...prevRoles, 
                        newRoleObj
                    ]);

                    showAlert(
                        'Create Role',
                        ``,
                        `Role: "${newRole}" Created successfully`,
                        { type: 'success' }
                    );

                    setNewRole('')
                }
            } catch(error) {
                showAlert(
                    'triggerCreateRole',
                    '',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
    }

    // Create new skillset
    const triggerCreateSkillset = async () => {
        let isSameSkillsetCreated = [];
        if(allSkillsets)
            isSameSkillsetCreated = await checkIfSkillsetCreated(allSkillsets, newSkillset)
        // console.log(isSameSkillsetCreated)
        if(isSameSkillsetCreated.length > 0) { // If the role is created before
            showAlert(
                'Create Skillset',
                `Create Skillset Failed`,
                `"${newSkillset}" is created before`,
                { type: 'error' }
            );
        } else {
            try {
                const response = await createSkillset (newSkillset, user?.UID, selectedRoleForNewSkill)
                // console.log(response)
                if(response.message === "Skillset added successfully") {
                    const lastSkillNo = response.skillSetID.length - 1
                    const newSkillSetID = response.skillSetID[lastSkillNo].skillSetID
                    const newSkillSetObj = {
                        skillSetName: newSkillset,
                        skillSetID: newSkillSetID,
                        roleID: Number(selectedRoleForNewSkill)
                    };
    
                    setAllSkillsets((prevSkills: any) => [
                        ...prevSkills, 
                        newSkillSetObj
                    ]);

                    if(Number(selectedRoleForNewSkill) === roleSelectedToShow.roleID){
                        setSkillsetForSelectedRole((prevSkills: any) => [
                            ...prevSkills,
                            newSkillSetObj
                        ])
                    }

                    showAlert(
                        'Create Skillset',
                        ``,
                        `Skillset: "${newSkillset}" Created successfully`,
                        { type: 'success' }
                    );

                    setNewSkillset('')
                }
            } catch(error) {
                showAlert(
                    'triggerCreateSkillset',
                    '',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
    }

    // Remove role
    const triggerRemoveRole = async(roleName: string) => {
        try {
            const response = await removeRole(roleName, user?.UID)
            // console.log(response)

            if(response?.message === 'Role deleted successfully') {
                // Update removal locally
                const removedRole = allRoles.filter((role: any) => 
                    role.roleName !== roleName
                )
                setAllRoles(removedRole)
                showAlert(
                    'Role Removed',
                    ``,
                    `Role: "${roleName}" Removed successfully`,
                    { type: 'success' }
                );
            } else {
                showAlert(
                    'Failed to Remove Role',
                    `Role: "${roleName}"`,
                    `Contained Skillset(s)`,
                    { type: 'warning' }
                );
            }

        } catch (error) {
            showAlert(
                'triggerRemoveRole',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    if(!companyInfo) return "Company Information is Loading..."

    function toggleEditCompanyProfile() {
        setShowEditCompanyProfile(!showEditCompanyProfile)
    }

    // Update Company Profile Locally
    function handleUpdateCompanyProfile(updatedData: any) {
        setCompanyInfo(updatedData)
    }

    // This is for mobile to show/close 
    // the skillset contained by a selected role
    function triggerExpendRole(role: any) {
        setRoleSelectedToShow(role);
        const skillToRole = getSkillsetsForARole(role.roleID, allSkillsets)
        setSkillsetForSelectedRole(skillToRole);
        setIsExpendRole(true);
    }
    function triggerCloseRole() {
        setIsExpendRole(false);
        setSkillsetForSelectedRole({});
        setRoleSelectedToShow({});
    }

    // Toggle show/hide skillsets for a role
    // This is for desktop and tablet only
    function toggleExpendRole(role?: any) {
        if(role?.roleID !== roleSelectedToShow?.roleID){
            setRoleSelectedToShow(role);
            const skillToRole = getSkillsetsForARole(role.roleID, allSkillsets)
            setSkillsetForSelectedRole(skillToRole);
            setIsExpendRole(true);
        } else {
            setIsExpendRole(false);
            setSkillsetForSelectedRole({});
            setRoleSelectedToShow({});
        }
    }

    // Update all skillset if a skill is removed 
    function updateRemoveSkill(newSkills: any){
        setAllSkillsets(newSkills)
        if(Number(selectedRoleForNewSkill) === roleSelectedToShow.roleID){
            setSkillsetForSelectedRole(newSkills)
        }
    }

    return (
        <>
        {companyInfo && (
            <>
            <div className="content company-profile-page-container">
                <div className='company-profile-page-header'>
                    <h1>My Company</h1>
                    <FiRefreshCw 
                        className='refresh-page-icon'
                        onClick={() => location.reload()}
                    />
                </div>
                <div className="company-profile-page-top">
                    <div className="company-profile card">
                        <div className="company-profile-title">
                                <FaRegBuilding className='company-profile-icon'/>
                            <div className="company-profile-title-end">
                                <a href={bizFileURL}
                                    target="_blank"
                                    onClick={bizFileURL ? undefined : (e) => {
                                        e.preventDefault();
                                    }}
                                    className="icons"
                                >
                                    <FaFilePdf />
                                </a>
                                <FaRegEdit 
                                    className='icons edit-company-profile'
                                    onClick={() => toggleEditCompanyProfile()}
                                />
                            </div>
                        </div>
                        <div className="company-profile-data uen odd-row">
                            <p className="title">UEN</p>
                            <p className="main-data">{companyInfo.UEN}</p>
                        </div>
                        <div className="company-profile-data company-name ">
                            <p className="title">Company Name</p>
                            <p className="main-data">{companyInfo.bizName}</p>
                        </div>
                        <div className="company-profile-data company-address odd-row">
                            <p className="title">Address</p>
                            <p 
                                className="main-data"
                                dangerouslySetInnerHTML={{ __html: formatTextForDisplay(companyInfo.address)}}
                            />
                        </div>
                        <div className="company-profile-data company-contact">
                            <p className="title">Contact Number</p>
                            <p className="main-data">{formatPhoneNumber(String(companyInfo.contactNo))}</p>
                        </div>
                    </div> 
    
                    <div className="create-new-role-n-skill card">
                        <h3>Create New Role</h3>
                        <div className="add-new-role">
                            <input type='text' 
                                name='role'
                                placeholder='Input New Role Here...' 
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                required
                            />
                            <button 
                                className="add-role-skill"
                                onClick={() => triggerCreateRole()}
                                disabled = {!newRole}
                            >
                                <FaPlusCircle/>
                            </button>
                        </div>
                        <div className="create-new-skillset-card">
                            <h3>Create New Skillset</h3>
                            {/* Role */}
                            <div className='forms-input'>
                                {/* Role dropdown */}
                                <select 
                                    name="roleID"
                                    value={selectedRoleForNewSkill}
                                    onChange={(e) => setSelectedRoleForNewSkill(e.target.value)}
                                >
                                    <option value={''}>No Role Selected</option>
                                    {allRoles.map((role:any) => (
                                    <option key={role.roleID} value={role.roleID}>
                                        {role.roleName}
                                    </option>
                                    ))}
                                </select>
                            </div>

                            <div className="add-new-skillset">
                                <input type='text' 
                                    name='skillset'
                                    placeholder='Input New Skillset Here...' 
                                    value={newSkillset}
                                    onChange={(e) => setNewSkillset(e.target.value)}
                                    required
                                />
                                <button 
                                    className={`add-role-skill 
                                        ${!newSkillset || !selectedRoleForNewSkill ? 'disabled' : ''}`}
                                    onClick={() => triggerCreateSkillset()}
                                    disabled = {!newSkillset || !selectedRoleForNewSkill}
                                >
                                    <FaPlusCircle/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="roles-n-skillsets-container">
                    <div className={`roles card ${isMobile ? 'mobile' :''}`}>
                        <h3>Roles</h3>
                        {!allRoles || allRoles.length === 0 ? (
                            <p className='role-n-skillset-text even-row'>
                                No Role Added
                            </p>
                        ) : (
                            allRoles?.map((role:any, index: any) => (
                                <p key={role.roleID}
                                    className={`role-text-content role-n-skillset-text 
                                    ${index % 2 === 0 ? 'even-row' : ''}
                                    ${roleSelectedToShow.roleID === role.roleID
                                        ? 'selected' : ''
                                    }`}
                                    onClick={() => {
                                        if(isMobile)
                                            triggerExpendRole(role)
                                        else
                                            toggleExpendRole(role)
                                    }}
                                >
                                    {role.roleName}
                                    <MdDeleteForever 
                                        className='icons remove-role-n-skillset-icon'
                                        onClick={() => triggerRemoveRole(role.roleName)}
                                    />
                                </p>
                            ))
                        )}
                    </div>
    
                    {isExpendRole 
                        && !isMobile 
                        && roleSelectedToShow
                        && skillsetsForSelectedRole
                        && (
                        <SkillsetToRole 
                            allSkillsets={allSkillsets}
                            skillSets={skillsetsForSelectedRole}
                            roleSelected={roleSelectedToShow}
                            updateRemoveSkill={updateRemoveSkill}
                        />
                    )}
                    
                </div>
            </div>
            {showEditCompanyProfile && (
                <EditCompanyProfile 
                    companyData={companyInfo}
                    onClose={toggleEditCompanyProfile}
                    onUpdate={handleUpdateCompanyProfile}
                />
            )}
            {isMobile 
                && isExpendRole 
                && roleSelectedToShow
                && skillsetsForSelectedRole
                && (  
                <div className="App-popup" 
                    onClick={triggerCloseRole}>
                    <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                        <div className='App-header'>
                            <h1>Skillsets for {roleSelectedToShow.roleName}</h1>
                            <IoClose 
                                className='icons'
                                onClick={triggerCloseRole}
                            />
                        </div>
                        <SkillsetToRole 
                            allSkillsets={allSkillsets}
                            skillSets={skillsetsForSelectedRole}
                            roleSelected={roleSelectedToShow}
                            updateRemoveSkill={updateRemoveSkill}
                        />
                    </div>
                </div>
            )}
            </>
        )}
        </>
    );
}

////////////////////////////////////////////////////////////////////////////////////
interface SkillsetProps {
    allSkillsets: any;
    skillSets: any;
    roleSelected: any;
    updateRemoveSkill: (newSkills: any) => void;
}
const SkillsetToRole = ({
    allSkillsets, skillSets, roleSelected, updateRemoveSkill 
}: SkillsetProps) => {
    // console.log(skillSets)
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const isMobile = window.innerWidth <= 768;
    
    // Remove skillset
    const triggerRemoveSkillset = async(skillSetName: string) => {
        try {
            const response = await removeSkillset(skillSetName, user?.UID)
            // console.log(response)

            if(response?.message === 'Skillset deleted successfully') {
                // Update removal locally
                const removedSkillset = allSkillsets.filter((skill: any) => 
                    skill.skillSetName !== skillSetName
                )
                skillSets = removedSkillset
                if(updateRemoveSkill)
                    updateRemoveSkill(removedSkillset)

                showAlert(
                    'Skillset Removed',
                    ``,
                    `Skillset: "${skillSetName}" Removed successfully`,
                    { type: 'success' }
                );
            } else {
                showAlert(
                    'Failed to Remove Skillset',
                    `Skillset: "${skillSetName}"`,
                    `Some Employee Contained this Skillset`,
                    { type: 'warning' }
                );
            }

        } catch (error) {
            showAlert(
                'triggerRemoveSkillset',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    return(
        <div className="skillsets card">
            {!isMobile && (<h3>Skillsets for {roleSelected.roleName}</h3>)}
            
            {!skillSets || skillSets.length === 0 ? (
                <p className='role-n-skillset-text even-row'>
                    No Skillset Added
                </p>
            ) : (
                skillSets?.map((skillset:any, index:number) => (
                    <p key={skillset.skillSetID}
                        className={`role-n-skillset-text 
                                    ${index % 2 === 0 ? 'even-row' : ''}`}
                    >
                        {skillset.skillSetName}
                        <MdDeleteForever 
                            className='icons remove-role-n-skillset-icon'
                            onClick={() => triggerRemoveSkillset(skillset.skillSetName)}
                        />
                    </p>
                ))
            )}
        </div>
    )
}
export default BOCompanyProfile;