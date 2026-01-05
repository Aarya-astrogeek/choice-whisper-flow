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
      const text = ingredients.toLowerCase();
      let insights: string[] = [];

      if (text.includes("palm oil")) {
        insights.push(
          "Palm oil improves shelf life but is high in saturated fat and linked to environmental concerns."
        );
      }

      if (text.includes("refined sugar")) {
        insights.push(
          "Refined sugar enhances taste but can spike blood sugar and offers little nutrition."
        );
      }

      if (text.includes("emulsifier")) {
        insights.push(
          "Emulsifiers help texture but may indicate ultra-processed food."
        );
      }

      if (text.includes("artificial flavor")) {
        insights.push(
          "Artificial flavors provide consistency but reduce ingredient transparency."
        );
      }

      if (insights.length === 0) {
        const fallback =
          "No known ingredients detected from the supported set. Impact depends on quantity and frequency.";
        setResult(fallback);
        return fallback;
      }

      const finalText = `
Product: ${productName || "Unknown"}

Key insights:
${insights.map((i) => `• ${i}`).join("\n")}

Uncertainty:
Health effects depend on overall diet, quantity, and individual sensitivity.
      `.trim();

      setResult(finalText);
      return finalText;
    } catch (err) {
      console.error(err);
      setError("Failed to analyze ingredients");
      setResult("Something went wrong while analyzing.");
      return;
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

