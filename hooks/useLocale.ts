"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function useLocaleDetection() {
  useEffect(() => {
    detectAndSetLocale();
  }, []);

  const detectAndSetLocale = async () => {
    // Tarayıcı dilini al
    const browserLang = navigator.language || navigator.languages?.[0] || "en";
    const locale = browserLang.startsWith("tr") ? "tr" : "en";

    // Cookie'ye kaydet (next-intl okuyacak)
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;

    // Kullanıcı giriş yapmışsa DB'ye de kaydet
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ language: locale })
        .eq("id", user.id);
    }
  };
}

export async function setLocale(locale: "en" | "tr") {
  // Cookie güncelle
  document.cookie = `locale=${locale}; path=/; max-age=31536000`;

  // DB güncelle
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("profiles")
      .update({ language: locale })
      .eq("id", user.id);
  }

  // Sayfayı yenile
  window.location.reload();
}
