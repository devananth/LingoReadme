const LOCALE_MAP = {
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  fa: "fa-IR",
  vi: "vi-VN",
  tr: "tr-TR",
  pt: "pt-BR",
  ru: "ru-RU",
  hi: "hi-IN",
  id: "id-ID",
  th: "th-TH",
  en: "en-US",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  sv: "sv-SE",
  uk: "uk-UA",
  cs: "cs-CZ",
  ro: "ro-RO",
  hu: "hu-HU",
  el: "el-GR",
  he: "he-IL",
  bn: "bn-BD",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  gu: "gu-IN",
  pa: "pa-IN",
  ur: "ur-PK",
  ms: "ms-MY",
  tl: "tl-PH",
  sw: "sw-KE",
};

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  const statusMsg = document.getElementById("statusMsg");

  chrome.storage.local.get(["targetLang"], (result) => {
    console.log("Storage check - result found:", result);
    if (result.targetLang) {
      langSelect.value = result.targetLang;

      console.log("Setting dropdown to saved value:", result.targetLang);

      if (langSelect.value !== result.targetLang) {
        langSelect.value = "es";
      }
    } else {
      // Default to Spanish if nothing is selected
      console.log("No value found in storage, defaulting to 'es'");
      langSelect.value = "es";
      chrome.storage.local.set({ targetLang: "es" });
    }
  });

  langSelect.addEventListener("change", () => {
    const selectedLang = LOCALE_MAP[langSelect.value];
    chrome.storage.local.set({ targetLang: selectedLang.substr(0, 2) }, () => {
      statusMsg.innerText = "✅ Preference updated!";
      statusMsg.style.color = "#1a7f37";
      setTimeout(() => {
        statusMsg.innerText = "Preference saved automatically";
        statusMsg.style.color = "#57606a";
      }, 2000);
    });
  });
});
