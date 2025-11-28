import { useState } from 'react';
import Header from '../../../components/table/Header';
import Cell from '../../../components/table/Cell';
import SubsTransDetail from './SubsTransDetail';

import '../SubsTrans.css'
import '../../../../public/styles/common.css'

interface SubsTransViewProps {
    transactions: any;
}

const SubsTrans_t = ({transactions}: SubsTransViewProps) => {

    const [ showDetail, setShowDetail ] = useState(false);
    const [ selectedTrans, setSelectedTrans ] = useState<any>();

    function toggleShowDetail(selectedTrans: any){
        setSelectedTrans(selectedTrans)
        setShowDetail(!showDetail)
    }

    return(
        <>
        <div className="App-desktop-responsive-table">
            <div className="App-desktop-table-row desktop-table-header">
                <Header className="header-sa-subtransaction-REF" text="REF" />
                <Header className="header-sa-subtransaction-UEN" text="UEN" />
                <Header className="header-sa-subtransaction-bizName" text="BIZ NAME" />
                <Header className="header-sa-subtransaction-startDate" text="START" />
                <Header className="header-sa-subtransaction-endDate" text="END" />
                <Header className="header-sa-subtransaction-subsStatus" text="PAYMENT STATUS" />
                <Header className="header-sa-subtransaction-reason" text="REASON OF CANCEL" />
            </div>

            {transactions.map((transaction: any) => (
            <div 
                className="App-desktop-table-row table-body sa-view-subtransaction-item-view" 
                key={transaction.subsTransID}
                onClick={() => toggleShowDetail(transaction)}
            >
                <Cell className="cell-sa-subtransaction-REF" text={transaction.reference_number} />
                <Cell className="cell-sa-subtransaction-UEN" text={transaction.UEN} />
                <Cell className="cell-sa-subtransaction-bizName" text={transaction.bizName} />
                <Cell className="cell-sa-subtransaction-startDate" text={transaction.startDate} />
                <Cell className="cell-sa-subtransaction-endDate" text={transaction.endDate} />
                <Cell className="cell-sa-subtransaction-subsStatus" text={transaction.subsStatus} />
                <Cell className="cell-sa-subtransaction-reason" text={transaction.reasonOfCancel} />
            </div>
            ))}
        </div>
        {showDetail && selectedTrans && (
            <SubsTransDetail 
                selectedTrans={selectedTrans}
                onClose={() => toggleShowDetail([])}   
            />
        )}
        </>
    )
}

export default SubsTrans_t