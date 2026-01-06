/**
 * Flugia Chatbot Loader
 * Fixed: Explicit mapping to match the working static data structure.
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  // Construct API URL
  const API_URL = `http://54.195.141.232:8080/api/v1/chatbot/config/${chatbotId}`;

  try {
    // 1. Fetch live settings
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error("Flugia: Failed to fetch configuration", response.status);
      return;
    }

    const configData = await response.json();

    // 2. Check if active
    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled.");
      return;
    }

    // 3. Import the library
    const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

    // 4. Initialize with Correct Data Mapping (Inspired by your working static code)
    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      metadata: configData.metadata || {},
      theme: {
        button: configData.theme.button,
        tooltip: configData.theme.tooltip,
        chatWindow: {
          // Flattening the configData.theme.chatWindow data
          ...configData.theme.chatWindow, 
          
          // Explicitly mapping nested components the library expects
          botMessage: {
            backgroundColor: configData.theme.chatWindow.botMessageColor || "#f1f3f4"
          },
          userMessage: {
            backgroundColor: configData.theme.chatWindow.userMessageColor || "#007bff"
          },
          textInput: {
            placeholder: configData.theme.chatWindow.inputPlaceholder || "Type your message...",
            sendButtonColor: configData.theme.chatWindow.sendButtonColor || "#007bff"
          }
        }
      }
    });

    console.log("Flugia: Chatbot initialized successfully with live data.");

  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
