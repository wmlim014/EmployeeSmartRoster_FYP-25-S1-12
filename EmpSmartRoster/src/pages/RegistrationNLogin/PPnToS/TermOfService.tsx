import React, { useEffect, useState } from 'react';
import './LegalAgreement.css'

const TermsOfService = () => {
  const [content, setContent] = useState<string>('');

  const fetchTermsOfService = async () => {
      // Replace with your actual API call
      const docId = '1poYdw0P5YJ1F_TIV0l_sejlKs8tITgex7ojE0GhdV-Q';
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
    fetchTermsOfService();
  }, []);

  return (
    <div className="privacy-policy-terms-of-service-container">
      <body>

  <h1>Terms of Service</h1>
  <p><strong>Effective Date (YYYY-MM-DD):</strong> 2025-05-02</p>
  <p>Welcome to EmpRoster ("we", "our", "us"). These Terms of Service ("Terms") govern your access to and use of our Employee Rostering Web Application ("the Platform"). By accessing or using the Platform, you agree to be bound by these Terms.</p>
  <p>If you do not agree to these Terms, you may not access or use the Platform.</p>

  <h2>1. Use of the Platform</h2>

  <h3>Eligibility:</h3>
  <p>To use our Platform, you must be at least 18 years of age and have the legal authority to bind your business or employer to these Terms.</p>

  <h3>Account Registration:</h3>
  <p>Users must register an account to access the Platform. You agree to provide accurate and complete information during registration and to keep it updated.</p>

  <h3>User Responsibilities:</h3>
  <p>You are responsible for:</p>
  <ul>
    <li>Maintaining the confidentiality of your login credentials</li>
    <li>All activity under your account</li>
    <li>Ensuring your use complies with applicable laws and internal policies</li>
  </ul>

  <h2>2. Acceptable Use</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use the Platform for any unlawful purpose</li>
    <li>Upload or distribute malicious software, viruses, or harmful code</li>
    <li>Interfere with the security or functionality of the Platform</li>
    <li>Attempt to gain unauthorized access to systems or data</li>
    <li>Misuse, copy, resell, or exploit the Platform without permission</li>
  </ul>
  <p>We reserve the right to suspend or terminate access if we suspect misuse or a breach of these Terms.</p>

  <h2>3. Data Ownership & Privacy</h2>
  <p>You retain ownership of any data or content you upload to the Platform.</p>
  <p>By using the Platform, you grant us a limited license to access, use, host, and store your data solely to operate and improve our services.</p>
  <p>Your data will be handled in accordance with our Privacy Policy, which is incorporated by reference into these Terms. You can review the full Privacy Policy at: <em>[Insert Privacy Policy URL or Page Reference]</em></p>

  <h2>4. Intellectual Property</h2>
  <p>All rights, titles, and interest in the Platform, including but not limited to software, design, text, graphics, and logos, are owned by or licensed to EmpRoster.</p>
  <p>You may not copy, distribute, modify, or create derivative works from any part of the Platform unless expressly permitted in writing.</p>

  <h2>5. Service Availability</h2>
  <p>We aim to provide continuous access to the Platform, but do not guarantee 100% uptime. We may temporarily suspend services for maintenance or updates.</p>
  <p>We are not liable for any loss or damage resulting from service interruptions or delays.</p>

  <h2>6. Payment & Subscription (if applicable)</h2>
  <p>If the Platform includes paid services:</p>
  <ul>
    <li>Fees and billing details will be clearly stated</li>
    <li>All payments are non-refundable unless otherwise agreed</li>
    <li>Late payments may result in suspension or termination of services</li>
  </ul>

  <h2>7. Termination</h2>
  <p>We may suspend or terminate your access to the Platform if you breach these Terms or if required by law.</p>
  <p>Upon termination:</p>
  <ul>
    <li>Your access will be revoked</li>
    <li>We may delete your account and associated data after a retention period unless required by law</li>
  </ul>
  <p>You may terminate your use of the Platform at any time by providing written notice.</p>

  <h2>8. Disclaimers</h2>
  <p>The Platform is provided "as is" and "as available." We disclaim all warranties, express or implied, including:</p>
  <ul>
    <li>Fitness for a particular purpose</li>
    <li>Non-infringement</li>
    <li>Reliability or availability of the Platform</li>
  </ul>

  <h2>9. Limitation of Liability</h2>
  <p>To the maximum extent permitted by law, EmpRoster shall not be liable for any:</p>
  <ul>
    <li>Indirect, incidental, or consequential damages</li>
    <li>Data loss, business interruption, or reputational harm</li>
    <li>Damages exceeding the total amount paid (if any) in the last 12 months</li>
  </ul>

  <h2>10. Indemnification</h2>
  <p>You agree to indemnify and hold harmless EmpRoster from any claims, losses, liabilities, damages, and expenses (including legal fees) arising from:</p>
  <ul>
    <li>Your use of the Platform</li>
    <li>Your breach of these Terms</li>
    <li>Your violation of any applicable law</li>
  </ul>

  <h2>11. Changes to Terms</h2>
  <p>We may update these Terms from time to time. Updated versions will be posted on our website, and continued use of the Platform constitutes acceptance of the changes.</p>

  <h2>12. Governing Law</h2>
  <p>These Terms shall be governed by and construed in accordance with the laws of <em>[Insert Governing Country/Region – e.g., Singapore]</em>, without regard to its conflict of laws principles.</p>

  <h2>13. Contact Us</h2>
  <p>For any questions or concerns regarding these Terms, please contact:</p>
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

export default TermsOfService;