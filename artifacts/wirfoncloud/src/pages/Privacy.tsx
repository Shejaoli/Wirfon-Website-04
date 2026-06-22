import { useSite } from "@/hooks/useSite";

export default function Privacy() {
  const site = useSite();
  const title = site.privacyPolicy?.title || "Privacy Policy";
  const body = site.privacyPolicy?.body || "";

  return (
    <>
      <section
        className="page-banner"
        style={{ background: "linear-gradient(135deg, #0199ef 0%, #005fa3 100%)" }}
      >
        <div className="container">
          <h1>{title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          {body ? (
            <div
              className="custom-section-body"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
            <div className="custom-section-body">
              <p>
                <strong>WirfonCloud</strong> ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
              </p>
              <h2>Information We Collect</h2>
              <p>We may collect information you provide directly to us when you:</p>
              <ul>
                <li>Fill out our contact form</li>
                <li>Subscribe to our newsletter</li>
                <li>Book a meeting or consultation</li>
                <li>Enrol in a course or training programme</li>
              </ul>
              <p>This may include your name, email address, and any message content you provide.</p>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your enquiries and provide customer support</li>
                <li>Send you newsletters and updates you have subscribed to</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              <h2>Data Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, subject to confidentiality agreements.</p>
              <h2>Cookies</h2>
              <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>
              <h2>Your Rights</h2>
              <p>You have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, please contact us at <a href="mailto:contact@wirfoncloud.com">contact@wirfoncloud.com</a>.</p>
              <h2>Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page.</p>
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@wirfoncloud.com">contact@wirfoncloud.com</a>.</p>
              <p><em>Last updated: June 2026</em></p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
