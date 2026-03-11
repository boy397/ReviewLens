(function () {
  "use strict";

  // Detect if we're on a product page
  const url = window.location.href;
  let isProductPage = false;

  // Amazon product page detection
  if (url.includes("amazon.") && url.includes("/dp/")) {
    isProductPage = true;
  }

  // Flipkart product page detection  
  if (url.includes("flipkart.com") && url.includes("/p/")) {
    isProductPage = true;
  }

  if (isProductPage) {
    // Notify the background script that we're on a product page
    chrome.runtime.sendMessage({
      type: "PRODUCT_PAGE_DETECTED",
      url: url,
    });

    // Inject a small floating button
    const btn = document.createElement("div");
    btn.id = "reviewlens-fab";
    btn.innerHTML = "🔍";
    btn.title = "Analyze with ReviewLens";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "52px",
      height: "52px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      cursor: "pointer",
      zIndex: "999999",
      boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      border: "none",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 6px 28px rgba(99, 102, 241, 0.5)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.4)";
    });

    btn.addEventListener("click", () => {
      // Open popup or trigger analysis
      chrome.runtime.sendMessage({
        type: "ANALYZE_CURRENT_PAGE",
        url: url,
      });
    });

    document.body.appendChild(btn);
  }
})();
