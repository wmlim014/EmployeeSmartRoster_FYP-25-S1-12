import './ViewProfile.css'
import '../../../public/styles/common.css'
import VPBody from "./VPBody"


const BOViewProfile = () => {

    return (
        <div className="App-content">
            <div className="content">
                <h1 className="EmpRosterlogo">EmpRoster</h1>
                <div className="main-contents">
                    <VPBody />
                </div>
            </div>
        </div>

    );
}

export default BOViewProfile;