export default function TermeOfConditions() {
    return (
        <div className="p-10 w-5xl mx-auto text-gray-800 text-sm">
            <h2 className="text-3xl font-semibold text mb-5 ">
                {"Fraud Alert"}
            </h2>
            <p className="mb-5">
                {"At Industrielle RH, your privacy and security are a top priority. We never ask job seekers to:"}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Pay any fees to obtain a job or receive payment from us."}
                </li>
                <li className="ml-7">
                    {"Advance cash or checks to us or to any third party."}
                </li>
                <li className="ml-7">
                    {"Cash checks from unknown sources."}
                </li>
                <li className="ml-7">
                    {"Purchase products, services, or gift cards."}
                </li>
                <li className="ml-7">
                    {"Provide sensitive financial details like credit card numbers or bank PINs."}
                </li>
            </ul>
            <p className="mb-5">
                {"We do not make job offers or request applications via instant messaging apps like Telegram. We also never ask for government ID numbers, such as Social Insurance Numbers (SIN), or banking/payment details through these platforms."}
            </p>
            <p className="mb-5">
                {"We do not post jobs or recruit via freelance platforms such as Fiverr or Upwork, and we will not contact applicants through these channels."}
            </p>
            <p className="mb-5">
                {"We never send or request money via mobile apps or digital wallets like GCash, Skrill, Shopify, or Google Pay, nor do we request or send payments using cryptocurrency."}
            </p>
            <p className="mb-5">
                {"Industrielle RH only recruits in regions where we are legally authorized to operate."}
            </p>
            <p className="mb-5">
                {"What to Do If You Suspect Fraud"}
            </p>
            <p className="mb-5">
                {"If you receive any suspicious messages claiming to be from Industrielle RH, please contact us immediately at "} <a href="mailto:contact@industrielle-rh.com.au">contact@industrielle-rh.com.au</a>
            </p>
            <p className="mb-5 font-bold text-lg">
                {"Suspicious signs include requests for: "}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Personal or financial information via email, messaging apps, or social media."}
                </li>
                <li className="ml-7">
                    {"Payments in exchange for job offers or interviews."}
                </li>
            </ul>
            <p className="mb-5 font-bold text-lg">
                {"Useful Resources:"}
            </p>

            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Canadian Anti-Fraud Centre – Report fraud: "}
                    <a className="text-blue-600 underline" target="_blank" href="https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm">https://antifraudcentre-centreantifraude.ca/report-signalez-eng.htm</a>
                </li>
                <li className="ml-7">
                    {"What to do if you’re a victim of fraud: "}
                    <a className="text-blue-600 underline" target="_blank" href="https://www.antifraudcentre-centreantifraude.ca/scams-fraudes/victim-victime-eng.htm">https://www.antifraudcentre-centreantifraude.ca/scams-fraudes/victim-victime-eng.htm</a>
                </li>
                <li className="ml-7">
                    {"Office of Consumer Affairs (Canada) – Identity theft & fraud:"}
                    <a className="text-blue-600 underline" target="_blank" href="https://ised-isde.canada.ca/site/office-consumer-affairs/en/identity-theft-spam-and-fraud">https://ised-isde.canada.ca/site/office-consumer-affairs/en/identity-theft-spam-and-fraud</a>
                </li>
                <li className="ml-7">
                    {"RCMP – Frauds and scams:"}
                    <a className="text-blue-600 underline" target="_blank" href="https://bc-cb.rcmp-grc.gc.ca/ViewPage.action?siteNodeId=2081&languageId=1&contentId=-1">https://bc-cb.rcmp-grc.gc.ca/ViewPage.action?siteNodeId=2081&languageId=1&contentId=-1</a>
                </li>
            </ul>
        </div>
    );
}