import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import LegalPage from "../components/LegalPage.jsx";

export default function Privacy() {
  useDocumentTitle(ROUTE_TITLES["/privacy"]);
  return (
    <LegalPage crumb="Privacy Policy" title="Privacy Policy" updated="[DATE]">
      <div className="callout">
        <strong>Legal review required.</strong> This policy is a working draft based on our current data flows. It should be reviewed by qualified legal counsel in Qatar before being relied upon as a binding legal document.
      </div>

      <h2>1. Who we are</h2>
      <p>This Privacy Policy explains how <strong>Nasser Al Ali Enterprises</strong> ("we", "us", "our") collects, uses, stores and protects personal information you share with us through this website, our related digital services (chat assistant, appointment booking, forms), and our contact channels.</p>
      <p>We are a Qatar-registered construction and contracting company. Commercial Registration: <span className="placeholder-token">[CR number - to be provided]</span>.</p>
      <ul>
        <li><strong>Office:</strong> Salwa Road, Building-155, Zone 43, Doha, State of Qatar</li>
        <li><strong>Postal:</strong> P.O. Box 13115, Doha, Qatar</li>
        <li><strong>Email:</strong> <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></li>
        <li><strong>Phone / WhatsApp:</strong> +974 6655 7728</li>
        <li><strong>Landlines:</strong> +974 4435 4422 · +974 4435 1112</li>
        <li><strong>Fax:</strong> +974 4431 1474</li>
      </ul>
      <div className="callout"><strong>Data-protection contact:</strong> <span className="placeholder-token">[data-protection contact name - to be provided]</span> · <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></div>

      <h2>2. Legal basis</h2>
      <p>We process personal data in accordance with <strong>Qatar Law No. 13 of 2016</strong> on the Protection of Personal Data Privacy (the "PDPPL") and its implementing decisions issued by the Compliance and Data Protection Department of the Ministry of Communications and Information Technology (MCIT). For visitors from other jurisdictions we also align with GDPR best practice.</p>
      <p>The lawful bases we rely on are:</p>
      <ul>
        <li><strong>Consent</strong> - for optional cookies, analytics, and marketing communications.</li>
        <li><strong>Legitimate business interest</strong> - for responding to enquiries, evaluating job applications, delivering contracted services, protecting our systems, and record-keeping.</li>
        <li><strong>Legal obligation</strong> - where Qatar law, accounting rules or audit requirements demand retention.</li>
        <li><strong>Contract</strong> - where processing is necessary to negotiate or perform a contract with you.</li>
      </ul>

      <h2>3. What personal data we collect</h2>
      <p>We collect only what we need. Data may include:</p>
      <ul>
        <li><strong>Identity &amp; contact data</strong> - name, company, job title, email address, phone number.</li>
        <li><strong>Enquiry data</strong> - the content of any message you send us, project brief, timeline, budget indication.</li>
        <li><strong>RFQ / tender data</strong> - files you upload for quotation requests (BOQ, drawings, specifications, tender documents).</li>
        <li><strong>Careers data</strong> - CV, cover letter, résumé attachments, professional history, references, and any information you include in your application.</li>
        <li><strong>Appointment data</strong> - meeting subject, preferred time, timezone, and any calendar / scheduling metadata created via our booking system.</li>
        <li><strong>Chatbot conversation data</strong> - the messages you exchange with our AI chat assistant. These are kept in your browser session; if you submit the in-chat lead form the transcript may also be saved in our lead records.</li>
        <li><strong>Technical data</strong> - IP address, device/browser identifiers, referring URL, pages viewed, and (with your consent) aggregate analytics.</li>
      </ul>

      <h2>4. How we collect it</h2>
      <ul>
        <li><strong>Website forms</strong> - contact, RFQ (with file upload), careers/CV upload, and appointment forms.</li>
        <li><strong>Appointment booking</strong> - via our scheduling tool (Calendly), when you book a consultation.</li>
        <li><strong>AI chat assistant</strong> - when you type into the chat widget on our site.</li>
        <li><strong>Direct communication</strong> - when you email, phone, or message us on WhatsApp.</li>
        <li><strong>Automatically</strong> - via server logs, essential cookies, and (with consent) analytics cookies.</li>
      </ul>

      <h2>5. Why we use it</h2>
      <ul>
        <li>To respond to enquiries, produce quotations, and negotiate contracts.</li>
        <li>To evaluate job applications and manage the recruitment process.</li>
        <li>To schedule and conduct consultations and site meetings.</li>
        <li>To answer questions asked through our AI chat assistant.</li>
        <li>To deliver, manage and improve our services.</li>
        <li>To meet legal, regulatory, and audit obligations in Qatar.</li>
        <li>To protect the security and integrity of our website and systems.</li>
        <li>With your consent, to send marketing communications and to measure how the site is used.</li>
      </ul>

      <h2>6. Third parties and processors</h2>
      <p>We use trusted third parties to operate our website and services. They process personal data on our instructions under written terms: Netlify (hosting, forms, serverless functions), Google Gemini API (chat assistant), Google Maps (embedded office pin), Calendly (appointment booking), Meta/WhatsApp (if you initiate a WhatsApp chat), Google Analytics 4 (aggregate analytics, only after consent).</p>
      <div className="callout"><strong>Chatbot notice:</strong> Messages sent to our AI chat assistant are processed by Google's Gemini API. Please do <strong>not</strong> share sensitive personal information (ID / passport numbers, health data, financial credentials) through the chatbot. If your enquiry needs sensitive information, please email us instead.</div>

      <h2>7. International transfers</h2>
      <p>Some of the providers above (Netlify, Google, Calendly, Meta) may process personal data outside Qatar. Where this happens, we require them to apply protections equivalent to Qatari standards, in line with Article 18 of the PDPPL, and to comply with their own applicable data-protection regimes (e.g. GDPR, EU-U.S. Data Privacy Framework).</p>

      <h2>8. How long we keep your data</h2>
      <p>We keep data only for as long as we need it for the purpose we collected it, plus any period required by law. Contact us at <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> for the current retention schedule.</p>

      <h2>9. Your rights</h2>
      <p>Under the PDPPL (and equivalent international regimes), you have the right to: be informed, access a copy of your data, request correction, object to processing, request deletion, and withdraw consent. Email <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> with the subject line "Data request". We aim to respond within 30 days.</p>

      <h2>10. Cookies and analytics</h2>
      <p>We use a small number of first-party items and (with your consent) Google Analytics. See our <a href="/cookies">Cookie Policy</a> for details.</p>

      <h2>11. Security</h2>
      <p>We use encryption in transit (HTTPS/TLS), least-privilege access, and industry-standard hosting controls. If you suspect a breach, please contact us immediately.</p>

      <h2>12. Children</h2>
      <p>Our services are directed at businesses and adult professionals. We do not knowingly collect personal data from anyone under 18.</p>

      <h2>13. Changes to this policy</h2>
      <p>We may update this policy from time to time. Material changes will be highlighted at the top of this page with a new "Last updated" date.</p>

      <h2>14. Contact us</h2>
      <p>Nasser Al Ali Enterprises · Salwa Road, Building-155, Zone 43, Doha, State of Qatar · P.O. Box 13115, Doha, Qatar · <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728</p>
    </LegalPage>
  );
}
