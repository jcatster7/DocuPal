import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function FL200PetitionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-gavel text-2xl legal-blue"></i>
              <Link href="/">
                <span className="text-xl font-semibold legal-gray hover:legal-blue cursor-pointer">
                  CA Legal Forms
                </span>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Form Filler
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold legal-gray mb-4">
            FL-200 California Response — Divorce & Legal Separation Response Form
          </h1>
          <p className="text-lg legal-gray leading-relaxed">
            The FL-200 Response is the California court form you need to respond to a divorce, legal separation, or annulment petition. 
            This page explains what the FL-200 is, when you need it, and how you can complete it online quickly. 
            Fill it in instantly using our secure form-filler tool — no legal experience required.
          </p>
        </div>

        {/* What is FL-200 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">What is the FL-200 Form?</h2>
          <p className="legal-gray mb-4">
            The FL-200 Response is issued by the Judicial Council of California. It allows you to respond to a petition for:
          </p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-4">
            <li>Dissolution of Marriage (Divorce Response)</li>
            <li>Legal Separation Response</li>
            <li>Nullity (Annulment) Response</li>
          </ul>
          <p className="legal-gray">
            This form includes your response to your spouse's requests and any counter-requests you want to make.
          </p>
        </section>

        {/* When to Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">When to Use FL-200</h2>
          <p className="legal-gray mb-4">You'll need to file FL-200 if:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2">
            <li>You've been served with an FL-100 divorce or separation petition</li>
            <li>You want to respond to your spouse's requests</li>
            <li>You want to make your own requests for custody, support, or property</li>
            <li>You must file within 30 days of being served</li>
          </ul>
        </section>

        {/* How to Fill */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">How to Fill FL-200 in California</h2>
          
          <h3 className="text-xl font-medium legal-gray mb-3">Step 1 — Review the Petition</h3>
          <p className="legal-gray mb-4">Carefully read the FL-100 petition you received to understand what your spouse is requesting.</p>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 2 — Complete Your Response</h3>
          <p className="legal-gray mb-4">
            With our online form-filler, you answer simple questions about whether you agree or disagree with each request, 
            and the system fills in FL-200 automatically.
          </p>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 3 — File With the Court</h3>
          <p className="legal-gray mb-6">
            Print, sign, and file the completed form at the same court where the petition was filed.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold legal-blue mb-4">Fill Out FL-200 Instantly Online</h2>
          <p className="legal-gray mb-4">Use our secure online tool. It:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-6">
            <li>Walks you through each response in plain English</li>
            <li>Auto-fills the official FL-200 PDF</li>
            <li>Lets you download a ready-to-file copy instantly</li>
          </ul>
          <Link href="/?form=FL-200">
            <Button className="bg-legal-blue text-white hover:bg-opacity-90 text-lg px-8 py-3">
              <i className="fas fa-edit mr-2"></i>
              Fill FL-200 Form Now
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">Common Questions About FL-200</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">How long do I have to file FL-200?</h3>
              <p className="legal-gray">
                You have 30 days from when you were served with the petition to file your response.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">What happens if I don't file FL-200?</h3>
              <p className="legal-gray">
                If you don't respond, the court may grant everything your spouse requested by default.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">Can I disagree with the petition?</h3>
              <p className="legal-gray">
                Yes, FL-200 allows you to disagree with requests and make your own counter-requests.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center bg-legal-light p-6 rounded-lg">
          <h2 className="text-xl font-semibold legal-gray mb-3">Ready to Complete Your FL-200?</h2>
          <p className="legal-gray mb-4">
            Get your California divorce or separation response filed on time.
          </p>
          <Link href="/?form=FL-200">
            <Button className="bg-legal-green text-white hover:bg-opacity-90 mr-4">
              Start FL-200 Form
            </Button>
          </Link>
          <Link href="/library">
            <Button variant="outline">
              View All Forms
            </Button>
          </Link>
        </section>
      </main>

      {/* Disclaimer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> This site is not a law firm and does not provide legal advice. 
            We provide self-help document preparation software.
          </p>
        </div>
      </footer>
    </div>
  );
}