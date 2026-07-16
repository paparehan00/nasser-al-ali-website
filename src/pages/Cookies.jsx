import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import { useI18n } from "../context/I18nContext.jsx";
import LegalPage from "../components/LegalPage.jsx";

export default function Cookies() {
  useDocumentTitle(ROUTE_TITLES["/cookies"]);
  const { t, lang } = useI18n();
  return (
    <LegalPage crumb={t("legal.crumb.cookies")} title={t("legal.title.cookies")}>
      {lang === "ar" ? <ArabicBody /> : <EnglishBody />}
    </LegalPage>
  );
}

function EnglishBody() {
  return (
    <>
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
    </>
  );
}

function ArabicBody() {
  return (
    <>
      <h2>1. ما هي ملفات تعريف الارتباط</h2>
      <p>ملفات تعريف الارتباط (الكوكيز) هي ملفات نصية صغيرة تُخزّنها المواقع على جهازك. يستخدم هذا الموقع أيضًا <strong>التخزين المحلي</strong> و<strong>تخزين الجلسة</strong> في المتصفح لعدد محدود من التفضيلات الأساسية. بعضها ضروري تمامًا؛ والبعض الآخر لا يُفعَّل إلا بموافقتك.</p>

      <h2>2. عناصر التخزين المستخدمة</h2>
      <h3>ضرورية تمامًا</h3>
      <p>مطلوبة للوظائف الأساسية ولا يمكن تعطيلها.</p>
      <table>
        <thead><tr><th>الاسم</th><th>النوع</th><th>الغرض</th><th>المدة</th></tr></thead>
        <tbody>
          <tr><td><code>naa-consent-v1</code></td><td>localStorage</td><td>يحفظ اختيارك للموافقة على الكوكيز.</td><td>12 شهرًا</td></tr>
          <tr><td><code>naa-chat-session-v1</code></td><td>sessionStorage</td><td>يحفظ محادثتك النشطة مع المساعد الذكي.</td><td>حتى إغلاق التبويب</td></tr>
          <tr><td><code>naa-lang</code></td><td>localStorage</td><td>يحفظ لغة الموقع (عربي / إنجليزي).</td><td>حتى المسح اليدوي</td></tr>
        </tbody>
      </table>

      <h3>طرف ثالث (تُحمَّل فقط بعد موافقتك)</h3>
      <table>
        <thead><tr><th>المزوّد</th><th>مكان الظهور</th><th>ما يتم تخزينه</th></tr></thead>
        <tbody>
          <tr><td><strong>خرائط Google</strong></td><td>خريطة المكتب المُضمَّنة في صفحة التواصل.</td><td>ملفات Google الخاصة.</td></tr>
          <tr><td><strong>Calendly</strong></td><td>أداة حجز المواعيد المُضمَّنة (عند تفعيلها).</td><td>ملفات Calendly الخاصة.</td></tr>
          <tr><td><strong>Google Analytics 4</strong></td><td>تحليلات تجميعية ومجهولة الهوية للزيارات.</td><td><code>_ga</code>، <code>_ga_*</code> - حتى سنتين.</td></tr>
        </tbody>
      </table>
      <p>سياسات المزوّدين الخاصة: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a> · <a href="https://calendly.com/pages/privacy" target="_blank" rel="noopener noreferrer">Calendly</a>.</p>

      <h2>3. إدارة تفضيلاتك</h2>
      <p>يمكنك تغيير موافقتك في أي وقت عبر رابط "إعدادات الكوكيز" في تذييل الصفحة.</p>

      <h2>4. أدوات التحكم في المتصفح</h2>
      <p>تسمح جميع المتصفحات الحديثة بحظر أو حذف الكوكيز. لاحظ أن حظر العناصر الأساسية قد يُعطّل بعض أجزاء الموقع (مثل المساعد الذكي).</p>

      <h2>5. التعديلات</h2>
      <p>عند إضافة عناصر تخزين جديدة أو تضمينات من طرف ثالث، سنُحدّث هذه الصفحة ونطلب موافقتك مجددًا حيثما لزم.</p>

      <h2>6. تواصل معنا</h2>
      <p>للاستفسار حول سياسة الكوكيز: <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728.</p>
    </>
  );
}
