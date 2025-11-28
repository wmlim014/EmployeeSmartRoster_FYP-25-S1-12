import Header from "../../../components/table/Header";
import Cell from "../../../components/table/Cell";

import { FaRegListAlt } from '../../../../public/Icons.js'
import '../ReportIssues.css'
import '../../../../public/styles/common.css'

interface ISSUES_TProps {
    allIssues: any;
    toggleViewDetail: (issue: any) => void,
}

const Issues_t = ({allIssues, toggleViewDetail }: ISSUES_TProps) => {

    return(
        <div className="App-desktop-responsive-table">
            <div className="App-desktop-table-row desktop-table-header">
                <div className="App-desktop-table-row desktop-table-header">
                    <Header className='header-sa-view-issues-title' text='Title' />
                    <Header className='header-sa-view-issues-desc' text='Description' />
                    <Header className='header-sa-view-issues-category' text='Issues Category' />
                    <Header className='header-sa-view-issues-status' text='Status' />
                    <Header className='App-header-icon-gap' text=''/>
                </div>
            </div>
            {allIssues.map((issue:any) => (
            <div className='App-desktop-table-row sa-view-issues-row' key={issue.issueID}>
                <Cell className='cell-sa-view-issues-title' text={issue.title} />
                <Cell className='cell-sa-view-issues-desc' text={issue.issue_description} />
                <Cell className='cell-sa-view-issues-category' text={issue.issuesCategory} />
                <Cell className='cell-sa-view-issues-status' text={issue.issuesStatus} />
                <div 
                    className="App-desktop-table-icon" 
                    onClick={() => {
                        toggleViewDetail(issue)
                    }}
                >
                    <FaRegListAlt className="sa-view-issues-decs-icon" />
                </div>
            </div> 
            ))}
        </div>
    )
}

export default Issues_t