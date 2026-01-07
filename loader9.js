/**
 * Flugia Chatbot Loader - Force Override Version
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  // FORCE GLOBAL CONFIG: This tells the library where to send data before it loads
  window.CHATBOT_CONFIG = {
    webhookUrl: "https://flugia.app.n8n.cloud/webhook/chatBot"
  };

  try {
    // 1. Static Config Data
    const configData = {
      status: "active",
      is_active: true,
      n8nChatUrl: "https://flugia.app.n8n.cloud/webhook/chatBot",
      metadata: {
        company_id: 24,
        company_name: "Yabo",
        auth_token: "eyJjaGF0Ym90X2lkIjo3MiwiY29tcGFueV9pZCI6MjQsInRpbWVzdGFtcCI6MTc2NzcwOTYwOH0=",
        BUSINESS_SECTOR: "Software & SaaS",
        SERVICES: "24/7 support, Product demos",
        CHATBOT_NAME: "Yassie",
        AGENT_ROLE: "Customer Support Agent",
      },
      theme: {
        button: {
          backgroundColor: "#007bff",
          iconColor: "#ffffff",
          borderRadius: "rounded",
        },
        chatWindow: {
          title: "Yassie",
          welcomeMessage: "Hello! How can I help you today?",
          backgroundColor: "#ffffff",
          botMessageColor: "#f1f3f4",
          userMessageColor: "#007bff",
          sendButtonColor: "#007bff",
          inputPlaceholder: "Type your message...",
        },
      },
    };

    // 2. Import the library
    const { default: Chatbot } = await import(
      "https://cdn.n8nchatui.com/v1/pole-embed-yard.js"
    );

    // 3. Explicit Initialization
    Chatbot.init({
      webhookUrl: "https://flugia.app.n8n.cloud/webhook/chatBot",
      metadata: configData.metadata,
      theme: {
        button: configData.theme.button,
        chatWindow: {
          ...configData.theme.chatWindow,
          botMessage: { backgroundColor: configData.theme.chatWindow.botMessageColor },
          userMessage: { backgroundColor: configData.theme.chatWindow.userMessageColor },
          textInput: {
            placeholder: configData.theme.chatWindow.inputPlaceholder,
            sendButtonColor: configData.theme.chatWindow.sendButtonColor,
          },
        },
      },
    });

    console.log("Flugia: Initialized. Target: https://flugia.app.n8n.cloud/webhook/chatBot");
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
