"use client";

import { workflowGraph, TERMINAL_TOOLS, type WorkflowStep } from "@/config/workflows";
import { getToolBySlug } from "@/config/tools";

const JOURNEY_KEY = "tp-journey";
const JOURNEY_MAX = 5; // remember last 5 visited tools

/**
 * Read the user's recent tool journey from localStorage.
 * Returns most-recent first.
 */
export function getJourney(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Record a tool visit. Stored client-side only (localStorage).
 * De-duplicates: if same tool revisited, it moves to the front instead of duplicating.
 */
export function recordVisit(toolSlug: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getJourney();
    const next = [toolSlug, ...current.filter((s) => s !== toolSlug)].slice(0, JOURNEY_MAX);
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be disabled (private mode etc.) — silently no-op
  }
}

export type Recommendation = {
  tool: {
    slug: string;
    name: string;
    shortDescription: string;
    icon: string;
    category: string;
  };
  reason: string;
};

/**
 * Get the top N next-step recommendations for the current tool.
 * - Filters out the current tool itself
 * - Filters out tools the user has recently used (loop prevention)
 * - Returns at most `limit` results (default 2)
 */
export function getNextSteps(currentTool: string, limit = 2): Recommendation[] {
  // Terminal tools intentionally show nothing
  if (TERMINAL_TOOLS.has(currentTool)) return [];

  const steps: WorkflowStep[] | undefined = workflowGraph[currentTool];
  if (!steps || steps.length === 0) return [];

  const journey = getJourney();
  // Don't recommend tools the user JUST used (avoid back-and-forth loops)
  const recentlyUsed = new Set(journey.slice(0, 2));
  recentlyUsed.add(currentTool);

  const results: Recommendation[] = [];
  for (const step of steps) {
    if (recentlyUsed.has(step.tool)) continue;
    const tool = getToolBySlug(step.tool);
    if (!tool) continue;
    results.push({
      tool: {
        slug: tool.slug,
        name: tool.name,
        shortDescription: tool.shortDescription,
        icon: tool.icon,
        category: tool.category,
      },
      reason: step.reason,
    });
    if (results.length >= limit) break;
  }

  // Fallback: if all recommendations were filtered out by journey, show the originals
  // (better to show something useful than nothing, even if user recently used it)
  if (results.length === 0) {
    for (const step of steps.slice(0, limit)) {
      if (step.tool === currentTool) continue;
      const tool = getToolBySlug(step.tool);
      if (!tool) continue;
      results.push({
        tool: {
          slug: tool.slug,
          name: tool.name,
          shortDescription: tool.shortDescription,
          icon: tool.icon,
          category: tool.category,
        },
        reason: step.reason,
      });
    }
  }

  return results;
}

/**
 * Clear the user's journey (privacy / reset).
 */
export function clearJourney(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(JOURNEY_KEY);
  } catch {
    // no-op
  }
}
