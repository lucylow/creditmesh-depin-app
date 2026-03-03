import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const faqs = [
  {
    question: "What is CreditMesh?",
    answer: "CreditMesh is a Decentralized Physical Infrastructure Network (DePIN) built on Creditcoin that enables IoT device owners to monetize sensor data, bandwidth, and connectivity through a decentralized, incentivized network.",
  },
  {
    question: "How do I start earning with CreditMesh?",
    answer: "Register an IoT device (sensor, gateway, or verifier), stake CTC tokens, and begin contributing data or bandwidth. You'll earn CMESH tokens each epoch based on your device type, stake amount, and contribution quality.",
  },
  {
    question: "What are the minimum stake requirements?",
    answer: "Sensors require a minimum of 10 CTC, gateways require 50 CTC, and verifier nodes require 100 CTC. Maximum stakes are 500, 750, and 1000 CTC respectively.",
  },
  {
    question: "What is an epoch?",
    answer: "An epoch is a 24-hour reward cycle. At the end of each epoch, the network distributes CMESH tokens to active contributors based on their device type, stake amount, and proof-of-contribution verification.",
  },
  {
    question: "How are rewards calculated?",
    answer: "Rewards are calculated using a base rate multiplied by your stake amount. Sensors earn 5% APY, gateways earn 15% APY, and verifiers earn 50% APY. Use the Simulator to estimate your specific earnings.",
  },
  {
    question: "What is Proof-of-Contribution?",
    answer: "Proof-of-Contribution (PoC) is a verification mechanism where random verifier nodes validate the quality and authenticity of data submitted by other devices. This ensures network integrity and prevents malicious behavior.",
  },
  {
    question: "What happens if my device goes offline?",
    answer: "Devices that are offline during an epoch will not earn rewards for that period. However, your stake remains locked and you can resume earning once your device comes back online.",
  },
  {
    question: "Can I unstake my CTC?",
    answer: "Yes, you can unstake your CTC after the current epoch completes. There is no early withdrawal penalty, but you must wait until the epoch ends to process the unstaking transaction.",
  },
  {
    question: "What is slashing?",
    answer: "Slashing is a penalty mechanism that reduces your stake if your device submits invalid data or fails verification checks. This incentivizes honest behavior and maintains network quality.",
  },
  {
    question: "How do I become a verifier?",
    answer: "Deploy a verifier node with a minimum stake of 100 CTC. Verifiers are randomly selected each epoch to validate data from other devices and earn higher rewards (50% APY base rate).",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about CreditMesh, device types, rewards, and the network.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card-blueprint">
              <div className="relative z-10">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left flex items-center justify-between py-4"
                >
                  <h3 className="text-lg font-bold text-slate-900 pr-4">{faq.question}</h3>
                  <span
                    className={`text-2xl text-cyan-600 transition-transform flex-shrink-0 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {openIndex === index && (
                  <div className="border-t-2 border-slate-200 pt-4 pb-2">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 card-blueprint bg-slate-50 text-center">
          <div className="relative z-10 py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h2>
            <p className="text-slate-600 mb-6">
              Check out the documentation or reach out to the community for more information.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/simulator">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3">
                  Try Simulator
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-2 border-slate-300 text-slate-900 font-bold px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
