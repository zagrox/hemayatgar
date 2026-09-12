import Anthropic from "@anthropic-ai/sdk";

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
export const AI_MODEL = "claude-sonnet-4-6";

export const isAiEnabled = Boolean(ANTHROPIC_API_KEY);

export const anthropic = ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  : null;
