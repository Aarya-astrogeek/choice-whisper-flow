import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  ingredients: string;
  productName?: string;
  dietaryProfile?: {
    restrictions: string[];
    allergies: string[];
    preferences: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, productName, dietaryProfile } = await req.json() as AnalysisRequest;
    
    if (!ingredients || ingredients.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Ingredients text is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an AI-native ingredient understanding copilot for food & beverages.

Your job is to reduce cognitive load at decision time. Given ingredient lists, you provide clear, actionable analysis.

${dietaryProfile ? `
User's dietary profile:
- Restrictions: ${dietaryProfile.restrictions.join(', ') || 'None'}
- Allergies: ${dietaryProfile.allergies.join(', ') || 'None'}
- Preferences: ${dietaryProfile.preferences.join(', ') || 'None'}

Flag any ingredients that conflict with this profile.
` : ''}

You MUST respond with valid JSON in this exact format:
{
  "verdict": "pass" | "caution" | "avoid",
  "whatStoodOut": "2-3 notable ingredients or patterns (concise)",
  "whyMatters": "Health, dietary, or environmental implications (1-2 sentences)",
  "whatsUncertain": "Gaps in knowledge or ambiguous ingredients (1 sentence)",
  "bottomLine": "Actionable recommendation (1 sentence)"
}

Verdict meanings:
- "pass": Generally safe, no major concerns
- "caution": Some concerning ingredients, use discretion
- "avoid": Contains ingredients to avoid based on health/diet/allergies

Be direct, practical, and honest about uncertainty. Focus on what the user needs to know to make a decision.`;

    const userPrompt = productName 
      ? `Analyze these ingredients from "${productName}":\n\n${ingredients}`
      : `Analyze these ingredients:\n\n${ingredients}`;

    console.log('Sending request to Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const errorText = await response.text();
      console.error('Error details:', errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI response received:', content);

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      console.error('Failed to parse AI response as JSON:', content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-ingredients:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
