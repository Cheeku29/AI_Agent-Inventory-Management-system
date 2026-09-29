"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  Boxes, 
  ShoppingCart, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal,
  ChevronDown,
  ChevronRight,
  Database
} from "lucide-react";
import { api } from "@/lib/api";

export default function CopilotPage() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Inventory Copilot. I analyze real-time replenishment needs, stockout risks, catalog product availability, and inventory anomalies using deterministic ML and optimization tools.\n\nAsk me anything like:\n• **\"Is Pepsi in stock or not?\"**\n• **\"How many items are out of stock?\"**\n• **\"What should I order today?\"**",
      tool_calls: []
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "Is Pepsi in stock or not?",
    "How many items are out of stock?",
    "Is Coke available?",
    "What products should I order today?",
    "Show me products with critical stockout risk"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getDatasets().then((list) => {
      setDatasets(list);
      const storedId = localStorage.getItem("active_dataset_id");
      if (storedId && list.some((d: any) => d.id === storedId)) {
        setActiveDatasetId(storedId);
      } else if (list.length > 0) {
        setActiveDatasetId(list[0].id);
        localStorage.setItem("active_dataset_id", list[0].id);
      }
    }).catch(() => {});
  }, []);

  const handleDatasetChange = (newId: string) => {
    setActiveDatasetId(newId);
    localStorage.setItem("active_dataset_id", newId);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Switched active store context to **${datasets.find(d => d.id === newId)?.name || newId}**. Ready for inventory queries.`,
        tool_calls: []
      }
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    if (!activeDatasetId) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: q },
        {
          role: "assistant",
          content: "Please select or upload a dataset first so I can inspect live store inventory data.",
          tool_calls: []
        }
      ]);
      setInput("");
      return;
    }

    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatWithCopilot(activeDatasetId, q, messages);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.response,
          tool_calls: res.tool_calls || []
        }
      ]);
      if (res.suggested_questions && res.suggested_questions.length > 0) {
        setSuggestedPrompts(res.suggested_questions);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error communicating with the analytical decision engine: " + (err.message || "Unknown error"),
          tool_calls: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1 flex flex-col justify-between">
      {/* Copilot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Inventory Intelligence Copilot
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-700/50">
                Live Store Intelligence
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Natural language inventory assistant verified against live stock levels, demand, and suppliers
            </p>
          </div>
        </div>

        {/* Dataset selector */}
        {datasets.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 self-start sm:self-auto">
            <Database className="h-4 w-4 text-indigo-400 shrink-0" />
            <select
              value={activeDatasetId}
              onChange={(e) => handleDatasetChange(e.target.value)}
              className="bg-transparent text-xs text-gray-200 outline-none cursor-pointer pr-2 font-medium"
            >
              {datasets.map((d) => (
                <option key={d.id} value={d.id} className="bg-gray-900 text-gray-200">
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 my-6 space-y-5 overflow-y-auto max-h-[58vh] pr-2">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-br-sm shadow-md"
                    : "glass-panel border border-gray-800 text-gray-200 rounded-bl-sm"
                }`}
              >
                {/* Markdown text output */}
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Friendly Verification Sources (Collapsible) */}
                {m.tool_calls && m.tool_calls.length > 0 && (
                  <details className="mt-3.5 pt-2.5 border-t border-gray-800/80 group">
                    <summary className="text-[11px] text-gray-400 hover:text-gray-200 cursor-pointer flex items-center gap-1.5 select-none font-medium transition">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Verified against live inventory engine ({m.tool_calls.length} check{m.tool_calls.length > 1 ? "s" : ""} performed)</span>
                      <ChevronDown className="h-3 w-3 text-gray-500 group-open:rotate-180 transition-transform ml-auto" />
                    </summary>
                    <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-emerald-500/30 text-xs text-gray-300">
                      {m.tool_calls.map((tc: any, tcIdx: number) => {
                        const nameMap: Record<string, string> = {
                          search_product: `Checked product catalog & on-hand inventory${tc.arguments?.query ? ` for '${tc.arguments.query}'` : ''}`,
                          get_inventory_summary: "Calculated storewide stock levels & exact out-of-stock count",
                          get_replenishment_recommendations: "Calculated purchase order requirements & supplier constraints",
                          get_action_queue: "Queried prioritized inventory action queue",
                          get_product_details: "Retrieved product specifications & current stock level",
                          get_stockout_risk: "Analyzed stockout probabilities and hourly depletion rates",
                          get_stockout_risks: "Analyzed stockout probabilities and hourly depletion rates",
                          get_anomalies: "Checked for phantom inventory & physical count discrepancies",
                          get_data_quality: "Evaluated dataset quality and schema integrity",
                        };
                        const label = nameMap[tc.tool_name] || tc.tool_name.replace(/_/g, " ");
                        return (
                          <div key={tcIdx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            <span>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-gray-400 text-xs pl-1">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 animate-pulse">
              <Cpu className="h-4 w-4" />
            </div>
            <span>Analyzing live store stock, demand forecasts, and supplier lead times...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-indigo-500 text-gray-300 hover:text-white transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask e.g. 'Is Pepsi in stock or not?', 'How many items are out of stock?'..."
          className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-gray-900/90 border border-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
