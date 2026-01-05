import { useState } from "react";
import { INGREDIENT_KNOWLEDGE } from "@/lib/ingredientKnowledge";

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
      const input = ingredients.toLowerCase();
      const explanations: string[] = [];

      Object.entries(INGREDIENT_KNOWLEDGE).forEach(
        ([ingredient, explanation]) => {
          if (input.includes(ingredient)) {
            explanations.push(`• ${explanation}`);
          }
        }
      );

      if (explanations.length === 0) {
        const fallback =
          "No known ingredients detected from the supported set. This product appears relatively simple based on the limited ingredient knowledge available.";
        setResult(fallback);
        return fallback;
      }

      const finalResult = `
Product: ${productName || "Unknown"}

Key insights:
${explanations.join("\n\n")}

Overall note:
Health impact depends on quantity, frequency, and individual sensitivity.
      `.trim();

      setResult(finalResult);
      return finalResult;
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




