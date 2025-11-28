import { formatTextForDisplay } from '../../../controller/Variables.js'

import { FaRegListAlt } from '../../../../public/Icons.js'
import '../ReportIssues.css'
import '../../../../public/styles/common.css'

interface ISSUES_MProps {
    allIssues: any;
    toggleViewDetail: (issue: any) => void;
}

const Issues_m = ({allIssues, toggleViewDetail }: ISSUES_MProps) => {

    return (
        <div className="App-mobile-responsive-table">
            {allIssues.map((issue:any) => (
                <div 
                    className='App-mobile-responsive-table-card sa-view-faq-row-card'
                    key={issue.issueID}
                >
                    <div className="App-mobile-responsive-table-card-title">
                        <h2>
                            {issue.title}
                        </h2>
                        <div className="App-mobile-table-icon" 
                            onClick={() => {
                                toggleViewDetail(issue)
                            }}
                        >
                            <FaRegListAlt />
                        </div>
                    </div>
                    <div className="App-mobile-responsive-table-card-data">
                        <div className="App-mobile-responsive-table-card-data-detail even-row">
                            <p className="App-mobile-responsive-table-card-data-title">
                                Issue Description
                            </p>
                            <p dangerouslySetInnerHTML={{ __html: formatTextForDisplay(issue.issue_description) }} />
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail">
                            <p className="App-mobile-responsive-table-card-data-title">
                                Issue Category
                            </p>
                            <p>{issue.issuesCategory}</p>
                        </div>
                        <div className="App-mobile-responsive-table-card-data-detail even-row">
                            <p className="App-mobile-responsive-table-card-data-title">
                                Issue Status
                            </p>
                            <p>{issue.issuesStatus}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Issues_m
