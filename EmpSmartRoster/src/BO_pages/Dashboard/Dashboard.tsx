import './Dashboard.css'
import '../../../public/styles/common.css'
import DashBody from "./DashBody"


const BODashboard = () => {

    return (
        <div className="App-content">
            <div className="content">
                <h1 className="logo">EmpRoster</h1>
                <div className="main-content">
                    <div>
                        <DashBody />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default BODashboard;

