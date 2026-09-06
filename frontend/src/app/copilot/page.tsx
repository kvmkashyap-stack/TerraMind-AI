"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CopilotChatDrawer from "../../components/CopilotChatDrawer";

export default function CopilotPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF8] text-[#14281D]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#E8F3E9] text-[#14281D] border border-[#C2DEC6]">
            AI COPILOT & SCHEME RAG
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14281D]">
            AI Conservation Copilot & Document RAG
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl">
            Ask questions about government schemes (Jal Shakti Abhiyan, PMKSY, CAMPA, AMRUT 2.0), desilting cost breakdowns, or timber smuggling alerts. Upload custom PDF policy documents for instant vector search.
          </p>
        </div>

        <CopilotChatDrawer projectId="IND-KAR-02" />
      </main>

      <Footer />
    </div>
  );
}
