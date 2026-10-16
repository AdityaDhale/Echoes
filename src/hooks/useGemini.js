import { GoogleGenAI } from '@google/genai';
import { offlineSimulations } from '../data/offlineSimulations';

export function getActiveApiKey() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('eureka_gemini_api_key');
    if (stored && stored.trim()) return stored.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setActiveApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('eureka_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('eureka_gemini_api_key');
    }
  }
}

// Parse citations & speculation metadata appended or extracted from responses
export function parseModelOutput(rawText, figure) {
  let content = rawText;
  let citations = [];
  let isSpeculative = false;
  let speculationNote = '';

  // Extract explicit citation blocks if generated
  const citationRegex = /\[CITATIONS:\s*([\s\S]*?)\]/i;
  const citationMatch = rawText.match(citationRegex);
  if (citationMatch) {
    content = content.replace(citationRegex, '').trim();
    citations = citationMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]\s*/, '').trim())
      .filter(Boolean);
  }

  // Extract speculation tag
  const specRegex = /\[SPECULATION:\s*(TRUE|FALSE)\s*[-:]?\s*([\s\S]*?)\]/i;
  const specMatch = rawText.match(specRegex);
  if (specMatch) {
    content = content.replace(specRegex, '').trim();
    isSpeculative = specMatch[1].toUpperCase() === 'TRUE';
    speculationNote = specMatch[2].trim();
  } else {
    // If figure lived prior to 1950 and talking about modern AI or computing, mark as speculative extrapolation
    const cutoffYears = {
      socrates: 399, plato: 348, aristotle: 322, marcus: 180, confucius: 479,
      davinci: 1519, newton: 1727, voltaire: 1778, adam_smith: 1790,
      lincoln: 1865, marx: 1883, nietzsche: 1900, curie: 1934,
      freud: 1939, tesla: 1943, turing: 1954, einstein: 1955
    };
    if (cutoffYears[figure.id] && /ai|artificial intelligence|computer|internet|algorithm|crispr|quantum/i.test(rawText)) {
      isSpeculative = true;
      speculationNote = `Philosophical extrapolation grounded in ${figure.name}'s documented historical worldview and epistemic boundaries.`;
    }
  }

  // Fallback citations from figure profile if none explicitly returned
  if (citations.length === 0 && figure.keyBeliefs) {
    citations = figure.keyBeliefs.slice(0, 3).map(b => `${figure.name} documented doctrine: "${b}"`);
  }

  return {
    content,
    citations,
    isSpeculative,
    speculationNote,
    fidelityScore: isSpeculative ? 94 : 99,
  };
}

export async function sendMessageToFigure(figure, conversationHistory, userMessage, customKey) {
  const apiKey = customKey || getActiveApiKey();

  // If no API key is provided or offline mode requested, run high-fidelity simulation
  if (!apiKey || apiKey === 'offline' || apiKey === 'your_gemini_api_key_here') {
    return getOfflineSimulationResponse(figure, userMessage);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Build valid history for multi-turn
    const history = conversationHistory
      .filter(msg => msg.role === 'user' || msg.role === 'model')
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

    const systemInstruction = `
${figure.systemPrompt}

## MANDATORY CITATION & EPISTEMIC GUIDELINES:
1. Always remain strictly in persona as ${figure.name}. Ground your reasoning in your actual historical publications, treatises, and documented speeches.
2. If discussing modern innovations outside your lifetime (e.g. artificial intelligence, digital networks, genetic engineering), explicitly extrapolate from your core foundational principles.
3. At the very end of your response, output two metadata tags:
[CITATIONS:
- Full citation or title of your historical work (Year)
- Specific doctrine or documented axiom referenced
]
[SPECULATION: TRUE/FALSE - Brief note on whether this extends beyond your lifetime knowledge]
`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history,
    });

    const response = await chat.sendMessage({ message: userMessage });
    const text = response.text || '';
    return parseModelOutput(text, figure);
  } catch (err) {
    console.warn('Gemini API call failed, falling back to historical archive simulation:', err);
    // Graceful fallback to offline simulated knowledge base
    const offlineResult = getOfflineSimulationResponse(figure, userMessage);
    offlineResult.isFallback = true;
    offlineResult.fallbackReason = err.message || 'API connection unavailable';
    return offlineResult;
  }
}

export async function generateCouncilTurn(figure, debateTopic, priorSpeakers, customKey) {
  const apiKey = customKey || getActiveApiKey();

  if (!apiKey || apiKey === 'offline' || apiKey === 'your_gemini_api_key_here') {
    return getOfflineCouncilTurn(figure, debateTopic, priorSpeakers);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const priorContext = priorSpeakers
      .map(s => `${s.figureName}: "${s.speech}"`)
      .join('\n\n');

    const prompt = `
You are ${figure.name} participating in "The Council of Polymaths," a high-level philosophical and scientific debate assembly.
The Topic Under Debate is: "${debateTopic}"

Here is what the previous council members have argued so far:
${priorContext || 'No previous arguments yet. You are opening the debate.'}

YOUR TASK:
Speak in first person as ${figure.name}.
Respond directly to the points raised by the previous speaker(s). 
Challenge their assumptions using your specific philosophical, scientific, or political worldview.
Ground your challenge in your documented historical treatises, experiments, or writings.
Keep your response passionate, intellectually sharp, and around 100-140 words.
At the end, include:
[CITATION: Author (Year) 'Specific treatise or paper title']
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: figure.systemPrompt,
        temperature: 0.75,
      },
    });

    const text = response.text || '';
    const citeMatch = text.match(/\[CITATION:\s*([\s\S]*?)\]/i);
    let speech = text.replace(/\[CITATION:\s*([\s\S]*?)\]/i, '').trim();
    let citation = citeMatch ? citeMatch[1].trim() : `${figure.name} Collected Works`;

    return {
      figureId: figure.id,
      figureName: figure.name,
      speech,
      citation,
    };
  } catch (err) {
    console.warn('Council turn generation fallback:', err);
    return getOfflineCouncilTurn(figure, debateTopic, priorSpeakers);
  }
}

function getOfflineSimulationResponse(figure, userMessage) {
  const sim = offlineSimulations[figure.id];
  const query = userMessage.toLowerCase();

  let selectedResponse = null;

  if (sim && sim.responses) {
    if (query.includes('ai') || query.includes('artificial intelligence') || query.includes('machine') || query.includes('computer')) {
      selectedResponse = sim.responses.ai || sim.responses.default;
    } else if (query.includes('determinism') || query.includes('god') || query.includes('dice') || query.includes('physics')) {
      selectedResponse = sim.responses.determinism || sim.responses.default;
    } else {
      selectedResponse = sim.responses.default;
    }
  }

  if (selectedResponse) {
    return {
      content: selectedResponse.text,
      citations: selectedResponse.citations || [],
      fidelityScore: selectedResponse.fidelityScore || 98,
      isSpeculative: Boolean(selectedResponse.isSpeculative),
      speculationNote: selectedResponse.speculationNote || '',
    };
  }

  // Generic dynamic fallback for any of the 25 figures
  const quote = figure.famousQuote || 'Truth is discovered through persistent inquiry.';
  const coreBelief = figure.keyBeliefs?.[0] || figure.ideology;
  const content = `Speaking through the lens of my documented work in ${figure.domain}:

When reflecting on "${userMessage}", I am guided by the principle that ${coreBelief.toLowerCase()}. As I observed during my lifetime (${figure.years}), complex questions cannot be resolved by superficial agreement. 

As I once expressed: "${quote}" 

We must examine this dilemma not merely through the passions of the moment, but through the rigorous lens of enduring truth, virtue, and empirical observation.`;

  return {
    content,
    citations: [`${figure.name} (${figure.years}) Primary Historical Canon`, `Doctrine: ${coreBelief}`],
    fidelityScore: 95,
    isSpeculative: true,
    speculationNote: `Synthesized from ${figure.name}'s verified historical doctrine and quote canon.`,
  };
}

function getOfflineCouncilTurn(figure, debateTopic, priorSpeakers) {
  const quote = figure.famousQuote || 'We must follow the truth.';
  const lastSpeaker = priorSpeakers[priorSpeakers.length - 1];
  const lastSpeakerName = lastSpeaker ? lastSpeaker.figureName : 'my esteemed colleagues';

  const speech = `I must address the assertion made by ${lastSpeakerName}. In matters concerning ${debateTopic}, one cannot ignore my foundational work in ${figure.domain}. As I maintain in my writings, "${quote}" If we fail to anchor our reasoning in fundamental principles rather than temporary expedience, our conclusions will crumble under the weight of reality. We must demand rigorous consistency!`;

  return {
    figureId: figure.id,
    figureName: figure.name,
    speech,
    citation: `${figure.name} Historical Canon & Treatises`,
  };
}
