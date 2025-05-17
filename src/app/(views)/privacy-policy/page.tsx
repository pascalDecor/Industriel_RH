export default function PricacyPolicy() {
    return (
        <div className="p-10 w-5xl mx-auto text-gray-800 text-sm ">
            <h2 className="text-3xl font-semibold text mb-5 ">
                {"Pricacy Policy"}
            </h2>
            <p className="mb-5">
                {"Effective Date: " + new Date().toLocaleDateString()}
            </p>
            <p className="mb-5">
                {"At Industrielle RH, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our services."}
            </p>
            <p className="mb-5 font-bold text-lg">
                {"1. Information We Collect"}
            </p>
            <p className="mb-5">
                {"We may collect the following personal information:"}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Name, email address, phone number."}
                </li>
                <li className="ml-7">
                    {"Résumé/CV, work experience, education."}
                </li>
                <li className="ml-7">
                    {"Employment preferences and qualifications."}
                </li>
                <li className="ml-7">
                    {"Immigration status or documentation (when required for job placement)."}
                </li>
                <li className="ml-7">
                    {"Any other information you choose to provide."}
                </li>
            </ul>
            <p className="mb-5 font-bold text-lg">
                {"2. How We Use Your Information"}
            </p>
            <p className="mb-5">
                {"Your information is used to:"}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Provide recruitment and staffing services."}
                </li>
                <li className="ml-7">
                    {"Match you with potential employers."}
                </li>
                <li className="ml-7">
                    {"Communicate job opportunities and updates."}
                </li>
                <li className="ml-7">
                    {"Fulfill legal and regulatory requirements."}
                </li>
                <li className="ml-7">
                    {"Improve our services and your experience."}
                </li>
            </ul>
            <p className="mb-5 font-bold text-lg">
                {"3. Sharing Your Information"}
            </p>
            <p className="mb-5">
                {"We may share your data with:"}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Employers and partners looking to fill positions."}
                </li>
                <li className="ml-7">
                    {"Legal and immigration professionals (as required)."}
                </li>
                <li className="ml-7">
                    {"Service providers helping us deliver our services (e.g., IT support)."}
                </li>
                <li className="ml-7">
                    {"Authorities if required by law."}
                </li>
            </ul>
            <p className="mb-5">
                {"We do not sell or rent your personal information."}
            </p>
            <p className="mb-5 font-bold text-lg">
                {"4. Your Rights"}
            </p>
            <p className="mb-5">
                {"You have the right to:"}
            </p>
            <ul className="list-disc mb-5 space-y-3">
                <li className="ml-7">
                    {"Access your personal information."}
                </li>
                <li className="ml-7">
                    {"Request corrections or updates."}
                </li>
                <li className="ml-7">
                    {"Withdraw your consent at any time."}
                </li>
                <li className="ml-7">
                    {"Request deletion of your data, subject to legal limits."}
                </li>
            </ul>

            <p className="mb-5">
                {"To exercise your rights, contact us at privacy@industrielle-rh.com."}
            </p>
            <p className="mb-5 font-bold text-lg">
                {"5. Data Security"}
            </p>
            <p className="mb-5">
                {"We take reasonable measures to protect your information from unauthorized access, loss, or misuse."}
            </p>
            <p className="mb-5 font-bold text-lg">
                {"6. Retention of Data"}
            </p>
            <p className="mb-5">
                {"We retain your data as long as necessary to provide our services or as required by law."}
            </p>
            <p className="mb-5 font-bold text-lg">
                {"7. Contact Us"}
            </p>
            <p className="mb-5">
                {"If you have questions about this Privacy Policy or how we handle your data, please contact us:"} <br />
                <a href="mailto:privacy@industrielle-rh.com">📧 privacy@industrielle-rh.com</a>
                <br />
                <a href="tel:+819-919-8683"> 📞 + 819-919-8683</a>
            </p>
            <p className="mb-5 font-bold text-lg">
                {"8. Updates to This Policy"}
            </p>

            <p className="mb-5">
                {"We may update this policy from time to time. Any changes will be posted on our website with the updated date."} <br />
                {"By using our services, you agree to this Privacy Policy."}
            </p>

        </div>)
}