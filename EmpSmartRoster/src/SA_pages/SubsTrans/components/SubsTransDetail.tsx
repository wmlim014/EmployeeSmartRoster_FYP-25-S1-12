import { SUB_STATUS } from '../../../controller/Variables.js'

import { IoClose, MdViewTimeline, FaCircle, MdAttachMoney } from '../../../../public/Icons.js';
import '../SubsTrans.css'
import '../../../../public/styles/common.css'

interface SubsTransProps {
    selectedTrans: any;
    onClose: () => void;
}

const SubsTransDetail = ({selectedTrans, onClose }: SubsTransProps) => {

    return (
        <div className="App-popup" onClick={onClose}>
            <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className='App-header'>
                    <h1 className='company-name'>
                        {selectedTrans.bizName}
                    </h1>
                    <button className='icons' onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <div className="App-popup-main-content">
                    <div className="reference-uen data-content">
                        <h2>{selectedTrans.UEN}</h2>
                        <p className="main-data">
                            {selectedTrans.reference_number}
                        </p>
                    </div>

                    <div className="data-content">
                        <p className="title">Payment Status: </p>
                        <div className="sa-view-trans-detail-subs-payment-status">
                            <div className="small-container">
                                <FaCircle className={`App-popup-content-icon payment-status-icon ${
                                    selectedTrans.subsStatus === SUB_STATUS[1]
                                    ? 'completed'
                                    : selectedTrans.subsStatus === SUB_STATUS[0]
                                    ? 'pending'
                                    : ''
                                }`}/>
                                <p className="main-data">{selectedTrans.subsStatus}</p>
                            </div>
                            <div className="small-container">
                                <MdAttachMoney className='App-popup-content-icon'/>
                                <p className="main-data">{selectedTrans.price}</p>
                            </div>
                        </div>
                    </div>

                    {selectedTrans.reasonOfCancel && (
                    <div className="data-content">
                        <p className="title">Reason Of Cancel:</p>
                        <p className="main-data">{selectedTrans.reasonOfCancel}</p>
                    </div>
                    )}

                    <div className="data-content">
                        <p className="title">Subs. Available Period</p>
                        <div className="subs-start-end-date-container">
                            <MdViewTimeline className='App-popup-content-icon'/>
                            <div className="subs-start-end-content">
                                <p className="main-data">{selectedTrans.startDate.split(' ')[0]}</p>
                                <p className='to'>~</p>
                                <p className="main-data">{selectedTrans.endDate.split(' ')[0]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubsTransDetail;