import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";
import { useI18n } from "../context/I18nContext.jsx";
import LegalPage from "../components/LegalPage.jsx";

export default function Privacy() {
  useDocumentTitle(ROUTE_TITLES["/privacy"]);
  const { t, lang } = useI18n();
  return (
    <LegalPage crumb={t("legal.crumb.privacy")} title={t("legal.title.privacy")}>
      {lang === "ar" ? <ArabicBody /> : <EnglishBody />}
    </LegalPage>
  );
}

function EnglishBody() {
  return (
    <>
      <h2>1. Who we are</h2>
      <p>This Privacy Policy explains how <strong>Nasser Al Ali Enterprises</strong> ("we", "us", "our") collects, uses, stores and protects personal information you share with us through this website, our related digital services (chat assistant, appointment booking, forms), and our contact channels.</p>
      <p>We are a Qatar-registered construction and contracting company.</p>
      <ul>
        <li><strong>Office:</strong> Salwa Road, Building-155, Zone 43, Doha, State of Qatar</li>
        <li><strong>Postal:</strong> P.O. Box 13115, Doha, Qatar</li>
        <li><strong>Email:</strong> <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></li>
        <li><strong>Phone / WhatsApp:</strong> +974 6655 7728</li>
        <li><strong>Landlines:</strong> +974 4435 4422 · +974 4435 1112</li>
        <li><strong>Fax:</strong> +974 4431 1474</li>
      </ul>
      <div className="callout"><strong>Data-protection contact:</strong> <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></div>

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
      <p>We use trusted third parties to operate our website and services. They process personal data on our instructions under written terms, including: our website host, a third-party AI provider (used only by the chat assistant), Google Maps (embedded office pin), Calendly (appointment booking), Meta/WhatsApp (if you initiate a WhatsApp chat), and Google Analytics 4 (aggregate analytics, only after consent).</p>
      <div className="callout"><strong>Chatbot notice:</strong> Our AI chat assistant is an informational aid powered by a third-party AI provider and may occasionally produce incomplete or incorrect answers. It is not a substitute for professional advice. Please do not share sensitive personal information (ID/passport numbers, health data, financial credentials) through the chat assistant.</div>

      <h2>7. International transfers</h2>
      <p>Some of the providers above (our website host, Google, Calendly, Meta) may process personal data outside Qatar. Where this happens, we require them to apply protections equivalent to Qatari standards, in line with Article 18 of the PDPPL, and to comply with their own applicable data-protection regimes (e.g. GDPR, EU-U.S. Data Privacy Framework).</p>

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
      <p>We may update this policy from time to time. Material changes will be highlighted at the top of this page.</p>

      <h2>14. Contact us</h2>
      <p>Nasser Al Ali Enterprises · Salwa Road, Building-155, Zone 43, Doha, State of Qatar · P.O. Box 13115, Doha, Qatar · <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728</p>
    </>
  );
}

function ArabicBody() {
  return (
    <>
      <h2>1. من نحن</h2>
      <p>توضّح سياسة الخصوصية هذه كيف تقوم <strong>ناصر العلي للمقاولات</strong> ("نحن") بجمع واستخدام وحفظ وحماية المعلومات الشخصية التي تشاركها معنا عبر هذا الموقع، وخدماتنا الرقمية المرتبطة (المساعد الذكي، حجز المواعيد، النماذج)، وقنوات التواصل الأخرى.</p>
      <p>نحن شركة مقاولات وإنشاءات مُسجَّلة في دولة قطر.</p>
      <ul>
        <li><strong>المكتب:</strong> طريق سلوى، مبنى 155، المنطقة 43، الدوحة، دولة قطر</li>
        <li><strong>البريدي:</strong> ص.ب 13115، الدوحة، قطر</li>
        <li><strong>البريد الإلكتروني:</strong> <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></li>
        <li><strong>الهاتف / واتساب:</strong> +974 6655 7728</li>
        <li><strong>الخطوط الأرضية:</strong> +974 4435 4422 · +974 4435 1112</li>
        <li><strong>الفاكس:</strong> +974 4431 1474</li>
      </ul>
      <div className="callout"><strong>جهة اتصال حماية البيانات:</strong> <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a></div>

      <h2>2. الأساس القانوني</h2>
      <p>نُعالج البيانات الشخصية وفقًا لأحكام <strong>القانون القطري رقم 13 لسنة 2016</strong> بشأن حماية خصوصية البيانات الشخصية ("قانون حماية البيانات")، والقرارات التنفيذية الصادرة عن إدارة الامتثال وحماية البيانات في وزارة المواصلات والاتصالات وتقنية المعلومات. كما نلتزم بأفضل ممارسات اللائحة العامة لحماية البيانات (GDPR) للزائرين من الدول الأخرى.</p>
      <p>الأسس القانونية التي نعتمد عليها:</p>
      <ul>
        <li><strong>الموافقة</strong> - لملفات تعريف الارتباط الاختيارية والتحليلات ورسائل التسويق.</li>
        <li><strong>المصلحة التجارية المشروعة</strong> - للرد على الاستفسارات، وتقييم طلبات التوظيف، وتقديم الخدمات المتعاقد عليها، وحماية أنظمتنا.</li>
        <li><strong>الالتزام القانوني</strong> - حيثما تُلزم القوانين القطرية أو المتطلبات المحاسبية أو التدقيقية بحفظ البيانات.</li>
        <li><strong>العقد</strong> - عندما تكون المعالجة ضرورية للتفاوض على عقد أو تنفيذه معك.</li>
      </ul>

      <h2>3. البيانات التي نجمعها</h2>
      <p>نجمع فقط ما نحتاج إليه. قد تشمل البيانات:</p>
      <ul>
        <li><strong>بيانات الهوية والتواصل</strong> - الاسم، الشركة، المسمى الوظيفي، البريد الإلكتروني، رقم الهاتف.</li>
        <li><strong>بيانات الاستفسار</strong> - محتوى أي رسالة، ملخص المشروع، الجدول الزمني، مؤشر الميزانية.</li>
        <li><strong>بيانات طلب عرض السعر</strong> - الملفات المرفوعة (جداول الكميات، الرسومات، المواصفات، مستندات المناقصات).</li>
        <li><strong>بيانات التوظيف</strong> - السيرة الذاتية، خطاب التقديم، تاريخ العمل، المراجع، وأي معلومات تُدرجها في طلبك.</li>
        <li><strong>بيانات المواعيد</strong> - موضوع الاجتماع، الوقت المفضّل، المنطقة الزمنية، والبيانات الوصفية للتقويم.</li>
        <li><strong>بيانات محادثات المساعد الذكي</strong> - الرسائل المتبادلة مع مساعدنا الذكي. تُحفظ في جلسة المتصفح؛ إذا أرسلت نموذج التواصل داخل المحادثة، قد يُحفظ نص المحادثة في سجلاتنا.</li>
        <li><strong>البيانات التقنية</strong> - عنوان IP، معرّفات الجهاز/المتصفح، الرابط المُحيل، الصفحات المُشاهدة، وبيانات التحليلات (بعد الموافقة).</li>
      </ul>

      <h2>4. كيف نجمع البيانات</h2>
      <ul>
        <li><strong>نماذج الموقع</strong> - نموذج التواصل، طلب عرض السعر (مع رفع ملفات)، رفع السيرة الذاتية، ونماذج حجز المواعيد.</li>
        <li><strong>حجز المواعيد</strong> - عبر أداة الجدولة (Calendly) عند حجز استشارة.</li>
        <li><strong>المساعد الذكي</strong> - عند كتابة رسالة داخل شاشة المحادثة على موقعنا.</li>
        <li><strong>التواصل المباشر</strong> - عبر البريد الإلكتروني أو الهاتف أو واتساب.</li>
        <li><strong>تلقائيًا</strong> - عبر سجلات الخادم، ملفات تعريف الارتباط الأساسية، وملفات التحليلات (بعد الموافقة).</li>
      </ul>

      <h2>5. لماذا نستخدم البيانات</h2>
      <ul>
        <li>للرد على الاستفسارات، وإعداد عروض الأسعار، والتفاوض على العقود.</li>
        <li>لتقييم طلبات التوظيف وإدارة عملية الاختيار.</li>
        <li>لجدولة وإجراء الاستشارات والاجتماعات الميدانية.</li>
        <li>للإجابة على الأسئلة عبر مساعدنا الذكي.</li>
        <li>لتقديم خدماتنا وإدارتها وتحسينها.</li>
        <li>للوفاء بالالتزامات القانونية والتنظيمية والتدقيقية في قطر.</li>
        <li>لحماية أمن وسلامة موقعنا وأنظمتنا.</li>
        <li>بموافقتك: لإرسال رسائل تسويقية وقياس استخدام الموقع.</li>
      </ul>

      <h2>6. الأطراف الثالثة والمُعالِجون</h2>
      <p>نستعين بأطراف ثالثة موثوقة لتشغيل موقعنا وخدماتنا، وهم يُعالجون البيانات وفق تعليماتنا وبموجب اتفاقيات مكتوبة، وتشمل: مزوّد استضافة الموقع، مزوّد الذكاء الاصطناعي (يُستخدم فقط للمساعد الذكي)، خرائط Google (خريطة المكتب المُضمَّنة)، Calendly (حجز المواعيد)، Meta/WhatsApp (إذا بدأت محادثة عبر واتساب)، وGoogle Analytics 4 (تحليلات تجميعية بعد الموافقة).</p>
      <div className="callout"><strong>إشعار المساعد الذكي:</strong> مساعدنا الذكي أداة معلوماتية مدعومة بمزوّد ذكاء اصطناعي من طرف ثالث، وقد يُقدّم أحيانًا إجابات غير مكتملة أو غير دقيقة. لا يُعتبر بديلًا عن الاستشارة المتخصصة. يُرجى عدم مشاركة أي معلومات شخصية حساسة (أرقام الهوية/جوازات السفر، بيانات صحية، بيانات مالية) عبر المساعد.</div>

      <h2>7. النقل الدولي للبيانات</h2>
      <p>قد تُعالج بعض شركات الطرف الثالث المذكورة أعلاه (مزوّد الاستضافة، Google، Calendly، Meta) البيانات خارج قطر. في هذه الحالة، نطلب منهم تطبيق حماية مُكافئة للمعايير القطرية بما يتماشى مع المادة 18 من قانون حماية البيانات، والامتثال لأنظمتهم الخاصة (GDPR وإطار خصوصية البيانات بين الاتحاد الأوروبي والولايات المتحدة).</p>

      <h2>8. مدة الاحتفاظ بالبيانات</h2>
      <p>نحتفظ بالبيانات فقط للفترة اللازمة للغرض الذي جُمعت لأجله، مضافًا إليها أي فترة يتطلبها القانون. للاطلاع على جدول الاحتفاظ الحالي، راسلنا على <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a>.</p>

      <h2>9. حقوقك</h2>
      <p>وفقًا لقانون حماية البيانات القطري (والأنظمة الدولية المعادلة)، يحق لك: الاطلاع، الحصول على نسخة من بياناتك، طلب التصحيح، الاعتراض على المعالجة، طلب الحذف، وسحب الموافقة. راسلنا على <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> مع عنوان الرسالة "طلب بيانات". نستهدف الرد خلال 30 يومًا.</p>

      <h2>10. ملفات تعريف الارتباط والتحليلات</h2>
      <p>نستخدم عددًا محدودًا من العناصر الأساسية و(بموافقتك) Google Analytics. للتفاصيل، راجع <a href="/cookies">سياسة الكوكيز</a>.</p>

      <h2>11. الأمن</h2>
      <p>نستخدم التشفير أثناء النقل (HTTPS/TLS)، والصلاحيات الأقل امتيازًا، وضوابط استضافة معيارية. إذا اشتبهت بأي خرق، يُرجى التواصل معنا فورًا.</p>

      <h2>12. الأطفال</h2>
      <p>خدماتنا موجّهة للشركات والمهنيين البالغين. لا نجمع عمدًا أي بيانات شخصية لمن هم دون الثامنة عشرة.</p>

      <h2>13. التعديلات على هذه السياسة</h2>
      <p>قد نُحدّث هذه السياسة من وقت لآخر. سيتم إبراز أي تغييرات جوهرية في أعلى الصفحة.</p>

      <h2>14. تواصل معنا</h2>
      <p>ناصر العلي للمقاولات · طريق سلوى، مبنى 155، المنطقة 43، الدوحة، دولة قطر · ص.ب 13115، الدوحة، قطر · <a href="mailto:info@nasseralaligroup.com">info@nasseralaligroup.com</a> · +974 6655 7728</p>
    </>
  );
}
