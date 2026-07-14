import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import LegalPage from "../components/LegalPage.jsx";

export default function Cookies() {
  useDocumentTitle(ROUTE_TITLES["/cookies"]);
  return (
    <LegalPage crumb="Cookie Policy" title="Cookie Policy" updated="[DATE]">
      <div className="callout"><strong>Legal review required.</strong> This policy is a working draft. It should be reviewed by qualified legal counsel in Qatar before being relied upon as a binding legal document.</div>

      <h2>1. What cookies are</h2>
      <p>Cookies are small text files that websites store on your device. This site also uses browser <strong>local storage</strong> and <strong>session storage</strong> for a small number of essential preferences. Some are strictly necessary; others are set only with your consent.</p>

      <h2>2. Storage items we use</h2>
      <h3>Strictly necessary</h3>
      <p>Required for basic functionality and cannot be disabled.</p>
      <table>
        <thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Lifetime</th></tr></thead>
        <tbody>
          <tr><td><code>naa-consent-v1</code></td><td>localStorage</td><td>Records your cookie-consent choice.</td><td>12 months</td></tr>
          <tr><td><code>naa-chat-session-v1</code></td><td>sessionStorage</td><td>Keeps your active chat conversation while you browse.</td><td>Until browser tab closed</td></tr>
          <tr><td><code>naa-lang</code></td><td>localStorage</td><td>Remembers your site language (EN / AR).</td><td>Until cleared</td></tr>
        </tbody>
      </table>

      <h3>Third-party (only loaded after you accept)</h3>
      <table>
        <thead><tr><th>Provider</th><th>Where it appears</th><th>What it sets</th></tr></thead>
        <tbody>
          <tr><td><strong>Google Maps</strong></td><td>Embedded office-location map on the Contact page.</td><td>Google's own cookies.</td></tr>
          <tr><td><strong>Calendly</strong></td><td>Embedded appointment booking widget (when enabled).</td><td>Calendly's own cookies.</td></tr>
          <tr><td><strong>Google Analytics 4</strong></td><td>Aggregate, anonymised traffic analytics.</td><td><code>_ga</code>, <code>_ga_*</code> - up to 2 years.</td></tr>
        </tbody>
      </table>
      <p>You can read each provider's own policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a> · <a href="https://calendly.com/pages/privacy" target="_blank" rel="noopener noreferrer">Calendly</a>.</p>

      <h2>3. Managing your preferences</h2>
      <p>You can change your consent at any time via the "Cookie settings" link in the footer.</p>

      <h2>4. Browser controls</h2>
      <p>All major browsers let you block or delete cookies. Note that if you block essential storage items, some parts of the site (like the chat assistant) may not function correctly.</p>

      <h2>5. Changes</h2>
      <p>If we add new storage items or third-party embeds, we will update this page and, where required, ask for your consent again.</p>

      <h2>6. Contact</h2>
      <p>Questions about this Cookie Policy: <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728.</p>
    </LegalPage>
  );
}
