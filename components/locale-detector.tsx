"use client";

import { useLocaleDetection } from "@/hooks/useLocale";

export function LocaleDetector() {
  useLocaleDetection();
  return null;
}
