import { useState } from "react";
import { AnalysisResult, ConversationMessage } from "@/types";

const BACKEND_URL = "https://backend-whisperflow.onrender.com/chat";

export function useIngredientAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // MAIN INGREDIENT ANALYSIS
  // =========================
  const analyzeIngredients = async (
    ingredients: string,
    productName?: string,
    dietaryProfile?: any
  ) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `
You are a food ingredient analyst.

Product name: ${productName || "Unknown"}
Ingredients list: ${ingredients}

User dietary preferences:
${dietaryProfile ? JSON.stringify(dietaryProfile) : "None"}

Give a clear, consumer-friendly verdict.
Avoid listing every ingredient.
Focus on safety, red flags, and dietary compatibility.
              `,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Backend analysis failed");
      }

      const data = await response.json();

      const analysisResult: AnalysisResult = {
        verdict: data.content,
        whatStoodOut: "",
        whyMatters: "",
        whatsUncertain: "",
        bottomLine: "",
      };

      setResult(analysisResult);

      setConversation([
        {
          role: "user",
          content: ingredients,
        },
        {
          role: "assistant",
          content: data.content,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong while analyzing ingredients.");
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================
  // FOLLOW-UP CHAT
  // =========================
  const sendFollowUp = async (message: string) => {
    if (!conversation.length) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "Continue the previous food analysis conversation. Be concise and do not repeat the full verdict.",
            },
            ...conversation.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Follow-up failed");
      }

      const data = await response.json();

      setConversation((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to send follow-up message.");
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzeIngredients,
    sendFollowUp,
    analyzing,
    result,
    conversation,
    error,
  };
}

