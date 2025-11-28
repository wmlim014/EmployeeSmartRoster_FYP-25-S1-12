import { useState, useEffect } from 'react';
import CompanyController from '../../../controller/CompanyController';
import { FaPlusCircle } from "../../../../public/Icons.js"
import './RoleNSkillset.css'
import '../../../public/styles/common.css'

// Access the function from the default export
// const { GetCompanyRoles, GetCompanySkillsets } = CompanyController;

const RoleNSkillset = () => {

    const roles = getCompanyRoles();
    const skillsets = getCompanySkillsets();
    const uen = "202017097M";
    const [ roleData, setRoleData ] = useState<any[]>([]);
    const [ skillsetData, setSkillsetData ] = useState<any[]>([]);
    const [ showPopup, setShowPopup ] = useState(false);

    function getCompanyRoles(){
        return GetCompanyRoles();
    }

    function getCompanySkillsets(){
        return GetCompanySkillsets();
    }

    function filterDisplayRole (allData: any, uen: string) {
        // console.log(allData)
        const filteredData = allData.filter((e:any) => {
            // console.log(e)
            return e.uen === uen
        })
        setRoleData(filteredData);
        // console.log(filteredData);
    }

    function filterDisplaySkillsets (allData: any, uen: string) {
        // console.log(allData)
        const filteredData = allData.filter((e:any) => {
            // console.log(e)
            return e.uen === uen
        })
        setSkillsetData(filteredData);
        // console.log(filteredData);
    }

    // Call function when page loaded
    useEffect(() => {filterDisplayRole(roles, uen);}, [])
    useEffect(() => {filterDisplaySkillsets(skillsets, uen);}, [])

    return (
        <div className="App-content">
            <div className="content">
                <h1 className="App-header">Role & Skillset Management</h1>
            
                <div className="main-content">
                    
                    
                    <div className="skills">
                        <div className="sub-header">
                            <h2>Skills</h2>
                            <button className="add-role-skill">
                                <FaPlusCircle />
                            </button>
                        </div>
                        {skillsetData.map((skill, index) => (
                        <div key={skill.uen}>
                            <p>{skill.skill}</p>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoleNSkillset;