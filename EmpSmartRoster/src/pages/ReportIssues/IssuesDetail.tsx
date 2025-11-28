import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../../components/PromptAlert/AlertContext"
import ReportIssuesController from "../../controller/ReportIssuesController"


import { IoArrowBack } from '../../../public/Icons.js'
import './ReportIssues.css'
import '../../../public/styles/common.css'

interface IssueDetailProps {
    issue?: any;
    user?: any;
}

const { updateReportedIssuesStatus, 
        updateReportedIssuesProgress } = ReportIssuesController

const IssueDetail = ({ issue, user } : IssueDetailProps) => {
    console.log(user)
    const navigate = useNavigate()

    if (!issue) {
        return (
            <div className="App-content">
                <div className="content">
                    <p>No issue data found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="App-content">
            <div className="content">
                <div className='App-header'>
                    <IoArrowBack 
                        onClick={() => navigate(-1)}
                        className="icons"
                    />
                    <h1>Issues Detail: {issue.title}</h1>
                </div>
            </div>
        </div>
    )
}

export default IssueDetail