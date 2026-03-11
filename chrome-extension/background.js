// ReviewLens Background Service Worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PRODUCT_PAGE_DETECTED") {
    console.log("[ReviewLens] Product page detected:", message.url);
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#6366f1" });
  }

  if (message.type === "ANALYZE_CURRENT_PAGE") {
    // Open the analyze page with the product URL pre-filled
    const analyzeUrl = `http://localhost:3000/analyze?url=${encodeURIComponent(message.url)}`;
    chrome.tabs.create({ url: analyzeUrl });
  }
});

// Clear badge when navigating away from product pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const isProduct =
      (tab.url.includes("amazon.") && (tab.url.includes("/dp/") || tab.url.includes("/gp/product/"))) ||
      (tab.url.includes("flipkart.com") && tab.url.includes("/p/"));

    if (!isProduct) {
      chrome.action.setBadgeText({ text: "" });
    }
  }
});
