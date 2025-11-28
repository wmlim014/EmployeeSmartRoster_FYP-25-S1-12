import { useState } from 'react';
import SubsTransDetail from './SubsTransDetail';

import '../SubsTrans.css'
import '../../../../public/styles/common.css'

interface SubsTransViewProps {
    transactions: any;
}

const SubsTrans_m = ({transactions}: SubsTransViewProps) => {
    const [ showDetail, setShowDetail ] = useState(false);
    const [ selectedTrans, setSelectedTrans ] = useState<any>();

    function toggleShowDetail(selectedTrans: any){
        setSelectedTrans(selectedTrans)
        setShowDetail(!showDetail)
    }

    return (
        <>
        <div className="App-mobile-responsive-table">
            {transactions.map((transaction: any) => (
                <div 
                    key={transaction.subsTransID} 
                    className="App-mobile-responsive-table-card sa-view-subtransaction-item-view"
                    onClick={() => toggleShowDetail(transaction)}
                >
                    <div className="App-mobile-responsive-table-card-title subs-transaction-title">
                        <h2>{transaction.bizName}</h2>
                        <p>{transaction.reference_number}</p>
                    </div>
                    <div className="App-mobile-responsive-table-card-data">
                        <div className="App-mobile-responsive-table-card-data-detail">
                            <p className="App-mobile-responsive-table-card-data-title">
                                START
                            </p>
                            <p>{String(transaction.startDate).split("T")[0]}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail even-row">
                            <p className="App-mobile-responsive-table-card-data-title">
                                END
                            </p>
                            <p>{String(transaction.endDate).split("T")[0]}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail">
                            <p className="App-mobile-responsive-table-card-data-title">
                                PRICE (SGD)
                            </p>
                            <p>{transaction.price}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail even-row">
                            <p className="App-mobile-responsive-table-card-data-title">
                                PAYMENT STATUS
                            </p>
                            <p>{transaction.subsStatus}</p>
                        </div>
                        {transaction.reasonOfCancel === '' && 
                            <div className="App-mobile-responsive-table-card-data-detail">
                                <p className="App-mobile-responsive-table-card-data-title">
                                    REASON OF CANCEL
                                </p>
                                <p>{transaction.reasonOfCancel}</p>
                            </div>
                        }
                    </div>
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
export default SubsTrans_m
