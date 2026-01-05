import { useState } from "react";

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
      // ✅ LOCAL ANALYSIS (NO BACKEND, NO API)
      const text = ingredients.toLowerCase();

      let reply = "This product appears relatively safe.";

      if (text.includes("palm oil")) {
        reply =
          "Palm oil raises environmental concerns and may indicate heavy processing.";
      }

      if (text.includes("refined sugar")) {
        reply =
          "Refined sugar contributes little nutrition and may impact metabolic health.";
      }

      if (text.includes("emulsifier")) {
        reply =
          "Emulsifiers can affect gut health and usually indicate ultra-processed food.";
      }

      if (text.includes("artificial flavor")) {
        reply =
          "Artificial flavors signal heavy processing and low ingredient transparency.";
      }

      setResult(reply);
      return reply;
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





