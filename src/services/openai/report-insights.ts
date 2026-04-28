import OpenAI from "openai";
import { z } from "zod";
import { getEnv, getOptionalOpenAiKey } from "@/lib/env";
import type { WebsiteReport } from "@/types/report";

const aiInsightsSchema = z.object({
  whatBusinessDoes: z.string(),
  monetizationModel: z.string(),
  conversionAssessment: z.string(),
  improvements: z.array(z.string()).min(3).max(6),
  growthOpportunities: z.array(z.string()).min(3).max(6),
  trustIssues: z.array(z.string()).min(1).max(5),
  brandPositioning: z.string(),
  competitorSuggestions: z.array(z.string()).min(2).max(5),
});

let cachedClient: OpenAI | null | undefined;

function getOpenAiClient() {
  const apiKey = getOptionalOpenAiKey();
  if (!apiKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
}

export async function generateAiInsights(
  report: Omit<WebsiteReport, "aiInsights">,
): Promise<WebsiteReport["aiInsights"]> {
  const fallback = buildHeuristicInsights(report);
  const client = getOpenAiClient();

  if (!client) {
    return fallback;
  }

  try {
    const response = await client.responses.create({
      model: getEnv().OPENAI_REPORT_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a senior website strategist. Return strict JSON only with concise, specific, evidence-backed business insights.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(
                {
                  domain: report.domain,
                  overview: report.overview,
                  design: report.design,
                  seo: report.seo,
                  techStack: report.techStack,
                  performance: report.performance,
                  security: report.security,
                  content: report.content,
                  scorecards: report.scorecards,
                },
                null,
                2,
              ),
            },
          ],
        },
      ],
    });

    const outputText = (response as unknown as { output_text?: string }).output_text;
    if (!outputText) {
      return fallback;
    }

    const parsed = aiInsightsSchema.parse(JSON.parse(extractJson(outputText)));
    return parsed;
  } catch (error) {
    console.error("OpenAI report generation failed, using fallback insights", error);
    return fallback;
  }
}

function extractJson(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in model response.");
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function buildHeuristicInsights(
  report: Omit<WebsiteReport, "aiInsights">,
): WebsiteReport["aiInsights"] {
  return {
    whatBusinessDoes: report.content.summary || `Likely operates in ${report.content.niche}.`,
    monetizationModel:
      report.content.businessModel || "Revenue model appears to rely on direct conversions from the website.",
    conversionAssessment:
      report.scorecards.conversion >= 75
        ? "The conversion journey looks comparatively strong, with a clear primary CTA and a focused message."
        : "The conversion journey likely needs clearer urgency, sharper proof, and stronger CTA contrast.",
    improvements: [
      "Clarify the primary CTA earlier on the page and reinforce it in the header.",
      "Increase trust signals with stronger social proof, proof points, or customer evidence.",
      "Reduce friction in the first fold by sharpening the value proposition and action path.",
      "Tighten metadata and heading structure to improve discovery and information scent.",
      "Review heavy assets and script count to improve perceived speed.",
    ],
    growthOpportunities: [
      "Repurpose the website summary into sales-ready competitive positioning.",
      "Build category landing pages around the detected niche and target audience.",
      "Create benchmark comparisons against competitor reports to sharpen differentiation.",
    ],
    trustIssues:
      report.security.publicFormRiskNotes.length > 0
        ? report.security.publicFormRiskNotes
        : ["Review security headers, proof blocks, and trust messaging for stronger reassurance."],
    brandPositioning:
      report.design.uiStyleSummary || "The brand positions itself through a modern product-led website experience.",
    competitorSuggestions: [
      `${report.content.niche} leaders with stronger authority content`,
      `${report.content.niche} brands with faster landing pages`,
      `${report.content.niche} competitors with clearer conversion CTAs`,
    ],
  };
}
