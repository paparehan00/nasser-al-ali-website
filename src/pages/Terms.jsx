import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import LegalPage from "../components/LegalPage.jsx";

export default function Terms() {
  useDocumentTitle(ROUTE_TITLES["/terms"]);
  return (
    <LegalPage crumb="Terms of Use" title="Terms of Use" updated="[DATE]">
      <h2>1. Acceptance</h2>
      <p>By accessing or using this website (the "Site") operated by <strong>Nasser Al Ali Enterprises</strong> ("we", "us", "our"), you agree to these Terms of Use and our <a href="/privacy">Privacy Policy</a>. If you do not agree, please do not use the Site.</p>

      <h2>2. About us</h2>
      <p>Nasser Al Ali Enterprises is a Qatar-registered heavy-construction and contracting company. Office: Salwa Road, Building-155, Zone 43, Doha, State of Qatar. Postal: P.O. Box 13115, Doha, Qatar.</p>

      <h2>3. Use of the Site</h2>
      <p>You may browse the Site for lawful business and informational purposes. You must not use the Site in any way that breaches applicable law, attempt to gain unauthorised access, introduce malware, upload malicious files, scrape or mirror the Site without written consent, or misrepresent your identity.</p>

      <h2>4. Content and intellectual property</h2>
      <p>All content on this Site - text, logos, images, project photography, videos, code, and design elements - is the property of Nasser Al Ali Enterprises or its licensors. Client and partner logos remain the property of their respective owners and are shown with attribution.</p>

      <h2>5. AI chat assistant - no professional advice</h2>
      <p>Our AI chat assistant is an informational aid powered by a third-party AI provider and may occasionally produce incomplete or incorrect answers. It is not a substitute for professional advice. Please do not share sensitive personal information (ID/passport numbers, health data, financial credentials) through the chat assistant.</p>

      <h2>6. Enquiries, quotes, and lead capture</h2>
      <p>Any pricing, timeline, or scope discussion via the Site is <strong>indicative only</strong> and does not constitute a binding offer. Binding terms are set out only in a signed written contract issued by Nasser Al Ali Enterprises.</p>

      <h2>7. Uploads and file submissions</h2>
      <p>If you upload files, you confirm you have the right to share them, that they are free of malware, and that they will be processed by our providers under the retention period stated in our Privacy Policy.</p>

      <h2>8. Third-party services and links</h2>
      <p>The Site links to or embeds third-party platforms (WhatsApp, Facebook, Google Maps, Calendly, and a third-party AI provider used by our chat assistant). Your use of those services is governed by their own terms.</p>

      <h2>9. Disclaimer</h2>
      <p>The Site is provided "as is" and "as available". To the fullest extent permitted by Qatari law, we make no warranties as to accuracy, completeness, uninterrupted availability, or fitness for a particular purpose.</p>

      <h2>10. Limitation of liability</h2>
      <p>To the fullest extent permitted by law, our total liability arising out of these Terms, for any cause, is limited to QAR 1,000.</p>

      <h2>11. Governing law and jurisdiction</h2>
      <p>These Terms are governed by the laws of the <strong>State of Qatar</strong>. Any dispute arising in connection with the Site or these Terms will be submitted to the exclusive jurisdiction of the courts of Qatar.</p>

      <h2>12. Changes</h2>
      <p>We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>

      <h2>13. Contact</h2>
      <p>For questions about these Terms: <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728 · Salwa Road, Building-155, Zone 43, Doha, State of Qatar · P.O. Box 13115, Doha, Qatar.</p>
    </LegalPage>
  );
}
