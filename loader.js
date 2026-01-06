/**
 * Flugia Chatbot Loader
 * Dynamically loads and initializes the Flugia chatbot widget based on live API config.
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  // Construct API URL based on script source domain
  const scriptSrc = scriptTag ? scriptTag.getAttribute("src") : "";
  // const apiBaseUrl = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;
    const apiBaseUrl = "http://54.195.141.232:8080"
  const API_URL = `${apiBaseUrl}/api/v1/chatbot/config/${chatbotId}`;

  try {
    // 1. Fetch live chatbot configuration from API
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error("Flugia: Failed to fetch chatbot configuration", response.status);
      return;
    }

    const configData = await response.json();

    // 2. Check if chatbot is active
    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled by the owner.");
      return; 
    }

    // 3. Dynamically import the working library
    const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

    // 4. Initialize the chatbot with the mapping you provided
    if (Chatbot && typeof Chatbot.init === 'function') {
      Chatbot.init({
        webhookUrl: configData.n8nChatUrl,
        metadata: configData.metadata || {},
        chatInputKey: "chatInput",
        chatSessionKey: "sessionId",
        ...configData.theme,
      });
      console.log("Flugia: Chatbot initialized successfully");
    } else {
      console.error("Flugia: Chatbot initialization failed - init function not found");
    }
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
