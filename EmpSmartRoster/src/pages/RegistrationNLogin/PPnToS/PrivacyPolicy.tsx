import React, { useEffect, useState } from 'react';
import './LegalAgreement.css'

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>('');

  const fetchPrivacyPolicy = async () => {
      // Replace with your actual API call
      const docId = '1TCSe1LBCNS_V-7y64TBTBexAhjnyhrTo9XYHz_jDP4Q';
      const res = await fetch(
          `https://docs.googleapis.com/v1/documents/${docId}?key=YOUR_API_KEY`
      );
      const data = await res.json();
      
      // Convert Google Doc JSON to HTML (simplified example)
      let html = '';
      data.body.content.forEach((section: any) => {
          if (section.paragraph) {
          section.paragraph.elements.forEach((elem: any) => {
              if (elem.textRun) {
              html += elem.textRun.content;
              }
          });
          html += '<br/>';
          }
      });
      setContent(html);
  };
  useEffect(() => {
      fetchPrivacyPolicy();
  }, []);

  return (
    <div className="privacy-policy-terms-of-service-container">
      <body>

  <h1>Privacy Policy</h1>
  <p><strong>Effective Date (YYYY-MM-DD):</strong> 2025-05-02</p>
  <p>This Privacy Policy explains how EmpRoster ("we", "our", or "us") collects, uses, discloses, and protects personal and business information through our Employee Rostering Web Application ("the Platform").</p>

  <h2>1. Information We Collect</h2>
  <p>When you use our Platform, we may collect and process the following types of information:</p>

  <h3>a. Business Information</h3>
  <ul>
    <li>Business name</li>
    <li>Business registration number</li>
    <li>Business address</li>
    <li>Contact details</li>
    <li>Business-related documents</li>
  </ul>

  <h3>b. Employee Information</h3>
  <ul>
    <li>Full names</li>
    <li>NRIC or other identification numbers</li>
    <li>Email addresses and phone numbers</li>
    <li>Medical documents (if necessary for rostering)</li>
    <li>Employee role and job details</li>
  </ul>

  <h3>c. Rostering & Company Data</h3>
  <ul>
    <li>Shift schedules and patterns</li>
    <li>Work availability</li>
    <li>Company policies and internal documents</li>
  </ul>

  <h3>d. Authentication & Usage Data</h3>
  <ul>
    <li>Login credentials</li>
    <li>IP address</li>
    <li>Usage logs and access times</li>
  </ul>

  <h2>2. How We Use the Information</h2>
  <p>We use your information to:</p>
  <ul>
    <li>Provide and manage rostering and scheduling services</li>
    <li>Communicate with users and respond to inquiries</li>
    <li>Ensure compliance with HR and employment standards</li>
    <li>Improve our Platform and customer experience</li>
    <li>Maintain the security and integrity of our systems</li>
  </ul>

  <h2>3. Legal Basis for Processing</h2>
  <p>We rely on the following legal grounds to process your data:</p>
  <ul>
    <li><strong>Consent</strong> – when you give us permission to process your information</li>
    <li><strong>Contractual necessity</strong> – for providing our services to you or your business</li>
    <li><strong>Legal obligation</strong> – for compliance with employment and data protection laws</li>
    <li><strong>Legitimate interest</strong> – in managing, improving, and securing our platform</li>
  </ul>

  <h2>4. Sharing of Information</h2>
  <p>We do not sell your personal or business data. We may share information with:</p>
  <ul>
    <li>Authorized administrators or users within your organization</li>
    <li>Third-party service providers (e.g., hosting, analytics) under strict confidentiality agreements</li>
    <li>Government authorities or regulators where legally required</li>
  </ul>

  <h2>5. Data Retention</h2>
  <p>We retain your data only as long as necessary to:</p>
  <ul>
    <li>Fulfill our service obligations</li>
    <li>Comply with applicable laws</li>
    <li>Resolve disputes and enforce agreements</li>
  </ul>
  <p>You may request deletion of your data by contacting us at <a href="mailto:employeeroster421@gmail.com">employeeroster421@gmail.com</a>.</p>

  <h2>6. Security Measures</h2>
  <p>We implement administrative, technical, and physical safeguards to protect your information, including:</p>
  <ul>
    <li>Secure servers and firewalls</li>
    <li>Role-based access control</li>
    <li>Encryption of sensitive data</li>
  </ul>
  <p>Please note that no system is completely secure, and users are encouraged to safeguard their login credentials.</p>

  <h2>7. Your Rights</h2>
  <p>Depending on your jurisdiction, you may have the right to:</p>
  <ul>
    <li>Access and correct your data</li>
    <li>Request deletion of your data</li>
    <li>Withdraw your consent at any time</li>
    <li>Lodge a complaint with a relevant data protection authority</li>
  </ul>
  <p>To exercise these rights, please contact us at <a href="mailto:employeeroster421@gmail.com">employeeroster421@gmail.com</a>.</p>

  <h2>8. International Transfers</h2>
  <p>Your data may be stored or processed in countries outside your own. In such cases, we ensure appropriate protections are in place, consistent with applicable legal requirements.</p>

  <h2>9. Cookies and Tracking Technologies</h2>
  <p>Our Platform may use cookies and other tracking technologies to:</p>
  <ul>
    <li>Enhance the user experience</li>
    <li>Monitor performance and analytics</li>
    <li>Remember user preferences</li>
  </ul>
  <p>You can manage or disable cookies via your browser settings.</p>

  <h2>10. Changes to this Privacy Policy</h2>
  <p>We may revise this Privacy Policy from time to time. Any updates will be posted on our website with a revised effective date. You are encouraged to review this policy regularly.</p>

  <h2>11. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy or how your data is handled, please contact:</p>
  <p>
    <strong>EmpRoster</strong>
    <a href="mailto:employeeroster421@gmail.com">employeeroster421@gmail.com</a>
  </p>

</body>
      {/* <div 
        className="policy-content" 
        dangerouslySetInnerHTML={{ __html: content }}
      /> */}
    </div>
  );
};

export default PrivacyPolicy;