import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function FL100PetitionPage() {
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
            FL-100 California Petition — Divorce & Legal Separation Form
          </h1>
          <p className="text-lg legal-gray leading-relaxed">
            The FL-100 Petition is the California court form you need to start a divorce, legal separation, or annulment. 
            This page explains what the FL-100 is, when you need it, and how you can complete it online quickly. 
            At the bottom, you can fill it in instantly using our secure form-filler tool — no legal experience required.
          </p>
        </div>

        {/* What is FL-100 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">What is the FL-100 Form?</h2>
          <p className="legal-gray mb-4">
            The FL-100 Petition is issued by the Judicial Council of California. It begins the legal process for:
          </p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-4">
            <li>Dissolution of Marriage (Divorce)</li>
            <li>Legal Separation</li>
            <li>Nullity (Annulment) of Marriage or Domestic Partnership</li>
          </ul>
          <p className="legal-gray">
            This form includes information about you, your spouse, your marriage, and what you're requesting from the court.
          </p>
        </section>

        {/* When to Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">When to Use FL-100</h2>
          <p className="legal-gray mb-4">You'll need to file FL-100 if:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2">
            <li>You've lived in California for at least 6 months (and your county for 3 months)</li>
            <li>You're starting a divorce or legal separation in California</li>
            <li>You want to request orders on property division, custody, or spousal support</li>
          </ul>
        </section>

        {/* How to Fill */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">How to Fill FL-100 in California</h2>
          
          <h3 className="text-xl font-medium legal-gray mb-3">Step 1 — Gather Your Information</h3>
          <p className="legal-gray mb-4">You'll need:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-6">
            <li>Full legal names, addresses, and dates of birth</li>
            <li>Marriage date and location</li>
            <li>Grounds for divorce or separation</li>
            <li>Details on minor children (if applicable)</li>
          </ul>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 2 — Complete the Form</h3>
          <p className="legal-gray mb-4">
            Normally, you can print and handwrite FL-100 or type into a PDF. 
            With our online form-filler, you answer simple questions, and the system fills in FL-100 automatically.
          </p>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 3 — File With the Court</h3>
          <p className="legal-gray mb-6">
            Print, sign, and file the completed form at your county Superior Court.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold legal-blue mb-4">Fill Out FL-100 Instantly Online</h2>
          <p className="legal-gray mb-4">Use our secure online tool below. It:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-6">
            <li>Walks you through each question in plain English</li>
            <li>Auto-fills the official FL-100 PDF</li>
            <li>Lets you download a ready-to-file copy instantly</li>
          </ul>
          <Link href="/?form=FL-100">
            <Button className="bg-legal-blue text-white hover:bg-opacity-90 text-lg px-8 py-3">
              <i className="fas fa-edit mr-2"></i>
              Fill FL-100 Form Now
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">Common Questions About FL-100</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">Do I need a lawyer to file FL-100?</h3>
              <p className="legal-gray">
                No, you can file it yourself. Our tool helps you prepare it without legal advice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">How much is the filing fee?</h3>
              <p className="legal-gray">
                Filing fees vary by county but are typically around $435.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">Where do I file FL-100?</h3>
              <p className="legal-gray">
                At the Superior Court in the county where you or your spouse lives.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center bg-legal-light p-6 rounded-lg">
          <h2 className="text-xl font-semibold legal-gray mb-3">Ready to Complete Your FL-100?</h2>
          <p className="legal-gray mb-4">
            Get your California divorce or separation petition filled out in minutes.
          </p>
          <Link href="/?form=FL-100">
            <Button className="bg-legal-green text-white hover:bg-opacity-90 mr-4">
              Start FL-100 Form
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