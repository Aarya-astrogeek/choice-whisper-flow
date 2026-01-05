import { useState } from "react";

interface AnalysisResult {
  role: "assistant";
  content: string;
}

export function useIngredientAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeIngredients = async (
    ingredients: string,
    productName?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://backend-whisperflow.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `
Product: ${productName || "Unknown"}
Ingredients: ${ingredients}

Explain what matters, trade-offs, and uncertainty.
Do not list ingredients.
                `,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data: AnalysisResult = await response.json();
      setResult(data.content);
      return data.content;
    } catch (err) {
      console.error(err);
      setError("Failed to analyze ingredients");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeIngredients,
    loading,
    result,
    error,
  };
}


