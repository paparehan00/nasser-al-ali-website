import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import { useI18n } from "../context/I18nContext.jsx";
import LegalPage from "../components/LegalPage.jsx";

export default function Terms() {
  useDocumentTitle(ROUTE_TITLES["/terms"]);
  const { t, lang } = useI18n();
  return (
    <LegalPage crumb={t("legal.crumb.terms")} title={t("legal.title.terms")}>
      {lang === "ar" ? <ArabicBody /> : <EnglishBody />}
    </LegalPage>
  );
}

function EnglishBody() {
  return (
    <>
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
    </>
  );
}

function ArabicBody() {
  return (
    <>
      <h2>1. القبول</h2>
      <p>باستخدامك أو دخولك هذا الموقع ("الموقع") الذي تُشغّله <strong>ناصر العلي للمقاولات</strong> ("نحن")، فإنك توافق على شروط الاستخدام هذه و<a href="/privacy">سياسة الخصوصية</a>. في حال عدم الموافقة، يُرجى عدم استخدام الموقع.</p>

      <h2>2. عن الشركة</h2>
      <p>ناصر العلي للمقاولات شركة مُسجّلة في قطر، متخصّصة في المقاولات الثقيلة والإنشاءات. المكتب: طريق سلوى، مبنى 155، المنطقة 43، الدوحة، دولة قطر. ص.ب 13115، الدوحة، قطر.</p>

      <h2>3. استخدام الموقع</h2>
      <p>يُسمح لك بتصفّح الموقع للأغراض التجارية المشروعة والإعلامية. لا يجوز لك استخدام الموقع بأي شكل يُخالف القوانين المعمول بها، أو محاولة الوصول غير المُصرَّح به، أو إدخال برامج ضارة، أو رفع ملفات ضارة، أو نسخ الموقع دون موافقة كتابية، أو انتحال هوية.</p>

      <h2>4. المحتوى وحقوق الملكية الفكرية</h2>
      <p>جميع محتويات هذا الموقع من نصوص وشعارات وصور ومقاطع فيديو وأكواد وعناصر تصميم هي ملك لـ ناصر العلي للمقاولات أو الجهات المُرخّصة لها. تبقى شعارات العملاء والشركاء ملكًا لأصحابها وتُعرض بالإسناد المناسب.</p>

      <h2>5. المساعد الذكي - ليس استشارة مهنية</h2>
      <p>مساعدنا الذكي أداة معلوماتية مدعومة بمزوّد ذكاء اصطناعي من طرف ثالث، وقد يُقدّم أحيانًا إجابات غير مكتملة أو غير دقيقة. لا يُعتبر بديلًا عن الاستشارة المتخصصة. يُرجى عدم مشاركة أي معلومات شخصية حساسة (أرقام الهوية/جوازات السفر، البيانات الصحية أو المالية) عبر المساعد.</p>

      <h2>6. الاستفسارات وعروض الأسعار</h2>
      <p>أي مناقشات حول التسعير أو الجدول الزمني أو نطاق العمل عبر الموقع هي <strong>إرشادية فقط</strong> ولا تُشكّل عرضًا مُلزمًا. الشروط المُلزمة تُحدَّد حصريًا في عقد مكتوب موقّع من قِبل ناصر العلي للمقاولات.</p>

      <h2>7. الرفع وتقديم الملفات</h2>
      <p>إذا قمت برفع ملفات، فإنك تُقرّ بأن لديك الحق في مشاركتها، وأنها خالية من البرامج الضارة، وسيتم معالجتها بواسطة مُزوّدينا وفقًا لفترة الاحتفاظ المذكورة في سياسة الخصوصية.</p>

      <h2>8. خدمات وروابط الأطراف الثالثة</h2>
      <p>يحتوي الموقع على روابط أو تضمينات لمنصّات الأطراف الثالثة (WhatsApp، Facebook، خرائط Google، Calendly، ومزوّد الذكاء الاصطناعي المستخدم في المساعد الذكي). يخضع استخدامك لهذه الخدمات لشروطها الخاصة.</p>

      <h2>9. إخلاء المسؤولية</h2>
      <p>يُقدَّم الموقع "كما هو" و"كما هو مُتاح". إلى أقصى حد يُسمح به بموجب القانون القطري، لا نُقدّم أي ضمانات بشأن الدقة أو الاكتمال أو التوفر دون انقطاع أو الملاءمة لغرض معيّن.</p>

      <h2>10. تحديد المسؤولية</h2>
      <p>إلى أقصى حد يُسمح به بموجب القانون، مسؤوليتنا الإجمالية الناشئة عن هذه الشروط، لأي سبب، محدودة بمبلغ 1,000 ريال قطري.</p>

      <h2>11. القانون الواجب التطبيق والاختصاص القضائي</h2>
      <p>تخضع هذه الشروط لقوانين <strong>دولة قطر</strong>. تُحال أي نزاع ينشأ عن الموقع أو هذه الشروط إلى الاختصاص القضائي الحصري لمحاكم دولة قطر.</p>

      <h2>12. التعديلات</h2>
      <p>قد نُحدّث هذه الشروط من وقت لآخر. الاستمرار في استخدام الموقع بعد نشر التغييرات يُعدّ قبولًا لها.</p>

      <h2>13. تواصل معنا</h2>
      <p>للاستفسار حول هذه الشروط: <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728 · طريق سلوى، مبنى 155، المنطقة 43، الدوحة، دولة قطر · ص.ب 13115، الدوحة، قطر.</p>
    </>
  );
}
