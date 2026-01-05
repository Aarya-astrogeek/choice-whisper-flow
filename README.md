# Choice Whisper Flow

AI-Native Ingredient Reasoning at Decision Time  
Live App: https://choice-whisper-flow.vercel.app/

Choice Whisper Flow rethinks how people understand food ingredients.  
Instead of acting as a database, label scanner, or scoring tool, it behaves like a reasoning companion that explains ingredient information in a clear, decision-ready way.

This project prioritizes **experience, intent inference, and explanation quality** over data scale, scraping pipelines, or rigid interfaces.

---

## Project Motivation

Food labels are optimized for regulation, not human understanding.  
Most existing tools overwhelm users with raw ingredient lists, scores, or dense databases.

Choice Whisper Flow answers a simpler, more human question:

**What actually matters here, and why?**

The system explains:
- Why certain ingredients are relevant
- What trade-offs exist
- Where uncertainty remains
- What a reasonable takeaway is

No filters. No forms. No ingredient encyclopedias.

---

## Core Features

### Voice-First Ingredient Input
Instead of forcing users to configure complex dietary settings or rigid filters, the system builds a soft dietary profile over time based on how the user reacts and asks follow-up questions.

Users can optionally state preferences like:

“I avoid palm oil”

“I’m okay with sugar occasionally”

“I care more about additives than calories”

These signals are inferred from conversation, not selected from checkboxes.

The profile acts as a contextual lens, subtly shaping explanations:

What risks are emphasized

Which trade-offs are highlighted

How cautious or permissive the guidance sounds

Importantly:

No permanent medical claims are stored

No hard exclusions are enforced

Users can override or ignore suggestions at any time

This keeps the interaction human, flexible, and low-friction, while still personalizing reasoning — aligning with the goal of using less data well rather than more data poorly
---

### Intent-First Interaction
Users provide minimal input via:
- Text
- Voice
- Image

The system infers what the user likely cares about without requiring:
- preference forms
- filters
- manual configuration

---

### Reasoning-Driven Output
Instead of listing ingredients, the AI explains:
- What stood out
- Why it matters
- Trade-offs involved
- Known uncertainty
- A concise bottom-line verdict

This shifts the AI from a lookup tool to a reasoning interface.

---

## UI Preview

### Home and Input Experience
![Home Screen](./assets/ui-home.png)

### Voice Ingredient Input
![Voice Input](./assets/ui-voice.png)

### Ingredient Analysis Result
![Analysis Result](./assets/ui-analysis.png)

> Place screenshots inside an `/assets` folder at the root of the repository.

---

## How It Works (High Level)

1. User provides input via text, voice, or image
2. The system infers intent from minimal context
3. AI generates structured explanations instead of raw data
4. Output focuses on clarity, reasoning, and decision support

---

## Architecture Overview



Frontend
└── React (Lovable-generated UI)
├── Text Input Panel
├── Voice Input Integration
├── Image Upload Panel
└── Result Explanation Cards

Backend
└── LLM-powered reasoning engine
├── Context inference
├── Explanation structuring
└── Follow-up conversation handling



No large-scale datasets.  
No OCR optimization.  
No scraping pipelines.

---

## Code Structure



src/
├── components/
│   ├── AnalysisInput.tsx
│   ├── TextInputPanel.tsx
│   ├── ImageUploadPanel.tsx
│   ├── ProductSearchPanel.tsx
│   └── AnalysisResultCard.tsx
├── pages/
│   └── Index.tsx
├── hooks/
│   ├── useIngredientAnalysis.ts
│   └── useAnalysisHistory.ts
└── main.tsx

`

---

## Running Locally

### Requirements
- Node.js 16+
- LLM API key (e.g., Groq)



## Why This Project Is Different

This is not:

* a database browser
* an ingredient encyclopedia
* a scoring or ranking system
* AI layered on top of a traditional app

Choice Whisper Flow explores **new interaction paradigms** where AI removes complexity instead of adding to it.

---

## Demo

Live App: [https://choice-whisper-flow.vercel.app/](https://choice-whisper-flow.vercel.app/)
Demo Video: Add link here


---

## Team

Aarya Shisode and Ankit Sinha

---



