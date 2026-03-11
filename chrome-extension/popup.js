const API_BASE = "http://localhost:8000/api";

document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url-input");
  const analyzeBtn = document.getElementById("analyze-btn");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const errorMsg = document.getElementById("error-msg");
  const resultsEl = document.getElementById("results");

  // Try to auto-detect URL from active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url) {
      const url = tabs[0].url;
      if (url.includes("amazon.") || url.includes("flipkart.")) {
        urlInput.value = url;
      }
    }
  });

  analyzeBtn.addEventListener("click", handleAnalyze);
  urlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAnalyze();
  });

  async function handleAnalyze() {
    const url = urlInput.value.trim();
    if (!url) return;

    showLoading();
    try {
      const response = await fetch(`${API_BASE}/analyze-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `API Error (${response.status})`);
      }

      const data = await response.json();
      showResults(data);
    } catch (err) {
      showError(err.message || "Failed to analyze. Is the backend running?");
    }
  }

  function showLoading() {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    resultsEl.classList.add("hidden");
    analyzeBtn.disabled = true;
    document.getElementById("status-badge").textContent = "Analyzing...";
  }

  function showError(msg) {
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");
    resultsEl.classList.add("hidden");
    errorMsg.textContent = msg;
    analyzeBtn.disabled = false;
    document.getElementById("status-badge").textContent = "Error";
  }

  function showResults(data) {
    loadingEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    resultsEl.classList.remove("hidden");
    analyzeBtn.disabled = false;
    document.getElementById("status-badge").textContent = "Done";

    // Stats
    document.getElementById("avg-rating").textContent = `⭐ ${data.avg_rating?.toFixed(1) || "—"}`;
    document.getElementById("review-count").textContent = data.review_count || "—";

    const sentLabel = data.overall_sentiment?.label || "—";
    const sentEl = document.getElementById("sentiment");
    sentEl.textContent = sentLabel;
    sentEl.style.color =
      sentLabel === "positive" ? "var(--green)" : sentLabel === "negative" ? "var(--red)" : "var(--yellow)";

    // Recommendation
    document.getElementById("recommendation").textContent = `🎯 ${data.recommendation || "No recommendation available"}`;

    // Pros
    const prosList = document.getElementById("pros-list");
    prosList.innerHTML = "";
    (data.pros || []).slice(0, 5).forEach((p) => {
      const el = document.createElement("div");
      el.className = "list-item pro";
      el.innerHTML = `<span>✓ ${capitalize(p.text)}</span><span class="freq">${p.frequency}×</span>`;
      prosList.appendChild(el);
    });
    if (!data.pros?.length) prosList.innerHTML = '<div style="color:var(--text-muted);font-size:11px">No pros detected</div>';

    // Cons
    const consList = document.getElementById("cons-list");
    consList.innerHTML = "";
    (data.cons || []).slice(0, 5).forEach((c) => {
      const el = document.createElement("div");
      el.className = "list-item con";
      el.innerHTML = `<span>✗ ${capitalize(c.text)}</span><span class="freq">${c.frequency}×</span>`;
      consList.appendChild(el);
    });
    if (!data.cons?.length) consList.innerHTML = '<div style="color:var(--text-muted);font-size:11px">No cons detected</div>';

    // AI Summary
    document.getElementById("ai-summary").textContent = data.ai_summary || "No summary available.";

    // Dashboard link
    const dashLink = document.getElementById("dashboard-link");
    dashLink.href = `http://localhost:3000/analyze?url=${encodeURIComponent(urlInput.value)}`;
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
});
