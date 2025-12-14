import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - Quick Poll Creator',
  description: 'Privacy policy for Quick Poll Creator - Learn how we handle your data',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-accent to-accent-secondary border-5 border-text rounded-[20px] shadow-brutal-xl p-8 md:p-12 mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading leading-tight text-text">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl font-semibold text-text-muted mt-4">
            Last Updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white border-4 border-text rounded-2xl shadow-brutal-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Introduction
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              Welcome to Quick Poll Creator. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our polling service.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Data We Collect
            </h2>
            <div className="space-y-4">
              <div className="bg-background border-3 border-text rounded-xl p-6">
                <h3 className="text-xl font-bold text-text mb-2">Poll Data</h3>
                <p className="text-base text-text-muted leading-relaxed">
                  When you create a poll, we store your poll question, options, and vote counts. This data is stored
                  temporarily in our database and is automatically deleted after 30 days.
                </p>
              </div>
              <div className="bg-background border-3 border-text rounded-xl p-6">
                <h3 className="text-xl font-bold text-text mb-2">Voting Data</h3>
                <p className="text-base text-text-muted leading-relaxed">
                  To prevent duplicate voting, we store a unique voter ID in a browser cookie and a hashed version
                  of your IP address. We never store your actual IP address in plain text.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              How We Use Your Data
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  To provide and maintain the polling service
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  To prevent duplicate votes and ensure poll integrity
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  To display real-time voting results
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  To improve and optimize our service
                </p>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Cookies
            </h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              We use a single, essential cookie called <code className="bg-background px-2 py-1 rounded font-mono text-sm">poll_voter_id</code>
              to prevent duplicate voting. This cookie:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Is strictly necessary for the service to function
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Contains a random identifier with no personal information
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Expires after 30 days
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Is not used for tracking or advertising purposes
                </p>
              </li>
            </ul>
          </section>

          {/* IP Addresses */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              IP Address Handling
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              We use IP addresses solely to prevent vote manipulation. Your IP address is immediately hashed using
              a cryptographic algorithm (SHA-256 with a salt), and only the hash is stored. We cannot reverse this
              process to determine your original IP address. The hashed IP is automatically deleted after 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Data Retention
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              All poll data, including questions, options, votes, voter IDs, and hashed IP addresses, are automatically
              deleted from our database after 30 days. This ensures that your data is not retained longer than necessary.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Your Rights
            </h2>
            <p className="text-base text-text-muted leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Delete your browser cookie at any time
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Use the service without creating an account
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <p className="text-base text-text-muted leading-relaxed">
                  Know that all your data will be automatically deleted after 30 days
                </p>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl font-bold font-heading text-text mb-4">
              Contact Us
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              If you have any questions about this privacy policy or how we handle your data, please contact us
              through our website or create an issue on our GitHub repository.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-accent-secondary border-3 border-text rounded-xl p-6">
            <h2 className="text-2xl font-bold font-heading text-text mb-3">
              Changes to This Policy
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting
              the new privacy policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="bg-primary border-4 border-text rounded-xl px-8 py-4 text-lg font-bold text-white shadow-brutal-lg cursor-pointer transition-all hover:bg-primary-hover hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0px_rgba(10,10,10,1)] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
