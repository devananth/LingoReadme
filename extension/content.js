(function () {
  const injectButton = () => {
    // Check if context is still valid
    if (!chrome.runtime?.id) return;

    const readmeContainer = document.querySelector(".markdown-body");
    if (!readmeContainer || document.getElementById("lingo-translate-btn"))
      return;

    const btn = document.createElement("button");
    btn.id = "lingo-translate-btn";
    btn.innerText = "🌐 Translate README";
    btn.style =
      'margin-bottom: 15px; padding: 8px 16px; cursor: pointer; border-radius: 6px; border: 1px solid #d0d7de; background-color: #f6f8fa; font-weight: 600; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;';

    readmeContainer.parentNode.insertBefore(btn, readmeContainer);

    btn.addEventListener("click", async () => {
      if (!chrome.runtime?.id) {
        alert("Extension updated. Please refresh the page to continue.");
        return;
      }

      const totalStartTime = performance.now();

      btn.innerText = "⏳ Translating...";
      btn.disabled = true;

      try {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const [owner, repo] = pathParts;

        let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
        let response = await fetch(rawUrl);

        if (!response.ok) {
          rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
          response = await fetch(rawUrl);
        }

        if (!response.ok)
          throw new Error("Could not fetch README.md from main or master.");

        const markdownText = await response.text();

        const data = await chrome.storage.local.get(["targetLang"]);
        const locale = data.targetLang || "es-ES";

        const apiResponse = await fetch(
          "https://lingoreadme.onrender.com/api/translate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              markdown: markdownText,
              targetLocale: locale,
            }),
          },
        );

        if (!apiResponse.ok) {
          const errorMsg = await apiResponse.json();
          throw new Error(errorMsg.message || "Server Error");
        }

        const result = await apiResponse.json();

        if (result.translatedMarkdown) {
          const html = marked.parse(result.translatedMarkdown);
          document.querySelector(".markdown-body").innerHTML = html;
          btn.innerText = "✅ Translated";
          // CALCULATE TOTAL TIME
          //   const totalEndTime = performance.now();
          //   const totalDuration = (
          //     (totalEndTime - totalStartTime) /
          //     1000
          //   ).toFixed(2);

          // Show time on the button
          //   btn.innerText = `✅ Done (${totalDuration}s)`;
          //   console.log(
          //     `Total extension process took ${totalDuration}s. Server reported ${result.duration}s for AI processing.`,
          //   );
        }
      } catch (err) {
        console.error("Translation Client Error:", err);
        alert("Error: " + err.message);
        btn.innerText = "❌ Error";
      } finally {
        btn.disabled = false;
        setTimeout(() => {
          if (btn.innerText !== "✅ Translated")
            btn.innerText = "🌐 Translate README";
        }, 3000);
      }
    });
  };

  injectButton();

  const observer = new MutationObserver(() => injectButton());
  observer.observe(document.body, { childList: true, subtree: true });
})();
