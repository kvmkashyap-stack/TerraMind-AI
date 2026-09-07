"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendCopilotChat, uploadDocumentToRAG, CopilotChatResponse, ProjectMapHover } from "../services/api";
import { Bot, Send, Upload, Sparkles, BookOpen, User, Lightbulb } from "lucide-react";
import GlobalSiteHeader from "./GlobalSiteHeader";

interface CopilotChatDrawerProps {
  projectId: string;
  projects?: ProjectMapHover[];
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
  onAddDynamicProject?: (project: ProjectMapHover) => void;
}

const SUGGESTED_PROMPTS = [
  "Hi Dr. Mehta!",
  "What government schemes fit this site?",
  "This site is in critical condition — what should we do?",
  "Have you solved a similar timber smuggling crisis before?",
  "What is the best solution for dam siltation & water loss?",
];

export default function CopilotChatDrawer({
  projectId,
  projects = [],
  selectedProjectId = "",
  onSelectProject = () => {},
  onAddDynamicProject,
}: CopilotChatDrawerProps) {
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string; responseData?: CopilotChatResponse }>
  >([
    {
      sender: "bot",
      text: "Hello! I'm Dr. Arjun Mehta, Senior Conservation Intelligence Analyst (25+ years experience across FSI, MoEFCC, CWC & State Forest Depts).\n\nHow can I help you today? You can ask me for casual advice, historical case studies, technical corrective plans, or government scheme grants.",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendQuery = async (userQuery: string) => {
    if (!userQuery.trim() || loading) return;

    setQuery("");
    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setLoading(true);

    try {
      const res = await sendCopilotChat(userQuery, selectedProjectId || projectId);
      setMessages((prev) => [...prev, { sender: "bot", text: res.answer, responseData: res }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I encountered a minor issue pulling the latest field telemetry. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadStatus(`Indexing '${file.name}' into RAG...`);

    try {
      const res = await uploadDocumentToRAG(file);
      setUploadStatus(`✅ ${res.message}`);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `📄 **Custom Document Ingested:** Indexed '${file.name}' into my RAG knowledge base. You can now ask questions about this policy document!`,
        },
      ]);
    } catch (err) {
      setUploadStatus("❌ File upload failed.");
    }
  };

  // Enhanced Markdown Formatter with Link & Bold Support
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lIdx) => {
      const regex = /(\[.*?\]\(https?:\/\/[^\s\)]+\)|\*\*.*?\*\*)/g;
      const parts = line.split(regex);

      const formattedLine = parts.map((part, pIdx) => {
        if (!part) return null;

        // Match Markdown Link: [label](url)
        const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s\)]+)\)$/);
        if (linkMatch) {
          const rawLabel = linkMatch[1];
          const url = linkMatch[2];
          const cleanLabel = rawLabel.replace(/^\*\*/, "").replace(/\*\*$/, "");
          return (
            <a
              key={pIdx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-slate-900 underline hover:text-indigo-600 transition-colors inline-flex items-center gap-0.5 mx-0.5 cursor-pointer"
            >
              <span>{cleanLabel}</span>
              <span className="text-[10px] text-indigo-600">↗</span>
            </a>
          );
        }

        // Match Bold: **text**
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }

        return part;
      });

      return (
        <React.Fragment key={lIdx}>
          {formattedLine}
          {lIdx < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Global Site Header & Live GIS Search Bar */}
      {projects.length > 0 && (
        <GlobalSiteHeader
          projects={projects}
          selectedProjectId={selectedProjectId || projectId}
          onSelectProject={onSelectProject}
          onAddDynamicProject={onAddDynamicProject}
          sectionTitle="AI Copilot Intelligence Assistant"
          sectionIcon={Bot}
        />
      )}

      <div className="w-full bg-white border border-[#D5E2D6] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#D5E2D6] pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#0F172A] text-sky-400 border border-indigo-500/30 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#14281D]">Dr. Arjun Mehta</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  🟢 Senior Conservation Analyst
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Ex-FSI, MoEFCC & CWC Advisor • 25+ Years Field Intelligence
              </p>
            </div>
          </div>

          <label className="cursor-pointer px-3.5 py-2 bg-[#F6F8F3] hover:bg-[#E8F3E9] text-xs font-bold text-[#14281D] border border-[#D5E2D6] rounded-xl flex items-center space-x-2 transition-all shadow-2xs">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Upload Policy Document</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.txt,.md" />
          </label>
        </div>

        {uploadStatus && (
          <div className="text-xs bg-[#F6F8F3] p-3 rounded-xl border border-[#D5E2D6] text-emerald-800 font-bold">
            {uploadStatus}
          </div>
        )}

        {/* Suggested Quick Prompt Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Quick Ask:
          </span>
          {SUGGESTED_PROMPTS.map((pText, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(pText)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-[#F6F8F3] hover:bg-[#E8F3E9] text-[#14281D] border border-[#D5E2D6] hover:border-emerald-500 text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              {pText}
            </button>
          ))}
        </div>

        {/* Chat Messages Window */}
        <div className="w-full h-[450px] bg-[#FBFBF8] rounded-xl p-4 overflow-y-auto space-y-4 border border-[#D5E2D6] text-xs shadow-inner">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%]">
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-[#0F172A] text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1 border border-indigo-500/30">
                    👨‍🔬
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 space-y-2 text-xs leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-[#0F172A] text-sky-200 rounded-br-none font-medium border border-indigo-900/50"
                      : "bg-white text-stone-800 border border-[#D5E2D6] rounded-bl-none"
                  }`}
                >
                  <div className="font-sans leading-relaxed">{renderFormattedText(m.text)}</div>
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#0F172A] text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-indigo-500/30">
                👨‍🔬
              </div>
              <div className="bg-white border border-[#D5E2D6] text-stone-700 p-3.5 rounded-2xl rounded-bl-none text-xs flex items-center space-x-2.5 shadow-2xs">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="font-bold font-mono text-indigo-900">Thinking... Evaluating field telemetry & historical precedent data</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendQuery(query)}
            placeholder="Ask Dr. Mehta anything (e.g. 'Hi!', 'How to fix this site?', 'Previous solutions for smuggling')..."
            className="flex-1 bg-[#FBFBF8] border border-[#D5E2D6] text-[#14281D] text-xs px-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors font-medium shadow-2xs"
          />
          <button
            onClick={() => handleSendQuery(query)}
            disabled={loading || !query.trim()}
            className="px-5 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 text-sky-300 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-md cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
