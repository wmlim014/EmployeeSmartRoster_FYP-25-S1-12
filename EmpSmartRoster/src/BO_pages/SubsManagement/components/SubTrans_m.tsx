import Header from '../../../components/table/Header';
import Cell from '../../../components/table/Cell';
import { formatDateTime } from '../../../controller/Variables';

import './SubTrans.css'
import '../../../../public/styles/common.css'

interface SubsTransactionProps {
    subsTrans: any[];
}

const SubsTransactions_m = ({ subsTrans }:SubsTransactionProps) => {

    return (
        <>
        <div className="App-mobile-responsive-table">
            {subsTrans.map((transaction: any) => (
                <div key={transaction.subsTransID} className="App-mobile-responsive-table-card">
                    <div className="App-mobile-responsive-table-card-title subs-transaction-title">
                        <h2>{transaction.subscription_name}</h2>
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
        </>
    )
}

export default SubsTransactions_m