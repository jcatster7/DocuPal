import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DE111PetitionPage() {
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
            DE-111 California Probate — Petition for Probate Form
          </h1>
          <p className="text-lg legal-gray leading-relaxed">
            The DE-111 Petition for Probate is the California court form you need to start probate proceedings after someone dies. 
            This page explains what the DE-111 is, when you need it, and how you can complete it online quickly. 
            Fill it in instantly using our secure form-filler tool — no legal experience required.
          </p>
        </div>

        {/* What is DE-111 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">What is the DE-111 Form?</h2>
          <p className="legal-gray mb-4">
            The DE-111 Petition for Probate is issued by the Judicial Council of California. It begins the probate process to:
          </p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-4">
            <li>Distribute the deceased person's assets</li>
            <li>Appoint an executor or administrator</li>
            <li>Pay debts and final expenses</li>
            <li>Transfer property to heirs or beneficiaries</li>
          </ul>
          <p className="legal-gray">
            This form includes information about the deceased, their assets, and who should be appointed to manage the estate.
          </p>
        </section>

        {/* When to Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">When to Use DE-111</h2>
          <p className="legal-gray mb-4">You'll need to file DE-111 if:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2">
            <li>Someone died owning property in California worth more than $166,250</li>
            <li>You're named as executor in their will</li>
            <li>You're the closest family member and there's no will</li>
            <li>You need court authority to manage the deceased person's affairs</li>
          </ul>
        </section>

        {/* How to Fill */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">How to Fill DE-111 in California</h2>
          
          <h3 className="text-xl font-medium legal-gray mb-3">Step 1 — Gather Estate Information</h3>
          <p className="legal-gray mb-4">You'll need:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-6">
            <li>Death certificate</li>
            <li>Original will (if one exists)</li>
            <li>List of assets and their approximate values</li>
            <li>Information about heirs and beneficiaries</li>
          </ul>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 2 — Complete the Petition</h3>
          <p className="legal-gray mb-4">
            With our online form-filler, you answer questions about the deceased person and their estate, 
            and the system fills in DE-111 automatically.
          </p>

          <h3 className="text-xl font-medium legal-gray mb-3">Step 3 — File With the Probate Court</h3>
          <p className="legal-gray mb-6">
            Print, sign, and file the completed form at the Superior Court in the county where the person died.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold legal-blue mb-4">Fill Out DE-111 Instantly Online</h2>
          <p className="legal-gray mb-4">Use our secure online tool. It:</p>
          <ul className="list-disc ml-6 legal-gray space-y-2 mb-6">
            <li>Guides you through probate requirements step by step</li>
            <li>Auto-fills the official DE-111 PDF</li>
            <li>Lets you download a ready-to-file copy instantly</li>
          </ul>
          <Link href="/?form=DE-111">
            <Button className="bg-legal-blue text-white hover:bg-opacity-90 text-lg px-8 py-3">
              <i className="fas fa-edit mr-2"></i>
              Fill DE-111 Form Now
            </Button>
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold legal-gray mb-4">Common Questions About DE-111</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">How long does probate take?</h3>
              <p className="legal-gray">
                Probate typically takes 8-12 months in California, depending on the complexity of the estate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">How much does probate cost?</h3>
              <p className="legal-gray">
                Filing fees are around $435, plus executor fees and court costs based on the estate's value.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium legal-gray mb-2">Do I need to hire a lawyer?</h3>
              <p className="legal-gray">
                While not required, probate can be complex. Our tool helps you prepare the forms yourself.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center bg-legal-light p-6 rounded-lg">
          <h2 className="text-xl font-semibold legal-gray mb-3">Ready to Start Probate?</h2>
          <p className="legal-gray mb-4">
            Get your California probate petition prepared properly.
          </p>
          <Link href="/?form=DE-111">
            <Button className="bg-legal-green text-white hover:bg-opacity-90 mr-4">
              Start DE-111 Form
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