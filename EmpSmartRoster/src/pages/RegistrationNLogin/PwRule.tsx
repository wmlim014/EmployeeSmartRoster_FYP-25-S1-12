import { FaClipboardList, TiTick, FaCircle } from '../../../public/Icons.js'

import './style.css'
import './PwRule.css'
import '../../../public/styles/common.css'

export default function PwRule ({ password = '' }) {
    const rules = [
        {
            text: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            text: "Contains a number (0-9)",
            valid: /\d/.test(password),
        },
        {
            text: "Contains lowercase letter (a-z)",
            valid: /[a-z]/.test(password),
        },
        {
            text: "Contains uppercase letter (A-Z)",
            valid: /[A-Z]/.test(password),
        },
        {
            text: "Contains special character (!@#$%^&*)",
            valid: /[\W_]/.test(password),
        },
    ]

    return(
        <div>
            <div className="pw-rules-title">
                <FaClipboardList className='pw-rules-title-icon'/>
                <h3 className='pw-rules-title-text'>Password Rule</h3>
            </div>
            <div className="pw-rule-list">
                {rules.map((rule, index) => (
                <div key={index} className={`rule-item ${rule.valid ? "valid" : ""}`}>
                    {rule.valid ? (
                        <span className="valid-icon"><TiTick /></span>
                    ) : (
                        <span className="invalid-icon"><FaCircle /></span>
                    )}
                    <span className='rule-item-text'>{rule.text}</span>
                </div>
                ))}
            </div>
        </div>
    )
}