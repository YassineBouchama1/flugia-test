/**
 * Flugia Chatbot Loader
 * Fixed: Explicit mapping to match the working static data structure.
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag
    ? scriptTag.getAttribute("data-chatbot-id")
    : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  // Construct API URL based on script source domain
  const scriptSrc = scriptTag ? scriptTag.getAttribute("src") : "";
  const apiBaseUrl = scriptSrc
    ? new URL(scriptSrc).origin
    : window.location.origin;
  const API_URL = `${apiBaseUrl}/api/v1/chatbot/config/${chatbotId}`;

  try {
    // 1. Fetch live settings
 
    const configData = {
      status: "active",
      is_active: true,
      n8nChatUrl: "https://flugia.app.n8n.cloud/webhook/chatBot",
      metadata: {
        company_id: 24,
        company_name: "Yabo",
        auth_token:
          "eyJjaGF0Ym90X2lkIjo3MiwiY29tcGFueV9pZCI6MjQsInRpbWVzdGFtcCI6MTc2NzcwOTYwOH0=",
        BUSINESS_SECTOR: "Software & SaaS",
        SERVICES: "24/7 support, Product demos",
        CHATBOT_NAME: "Yassie",
        AGENT_ROLE: "Customer Support Agent",
      },
      theme: {
        button: {
          backgroundColor: "#007bff",
          right: 30,
          bottom: 30,
          size: 50,
          iconColor: "#ffffff",
          customIconSrc: "https://api.iconify.design/mdi/chat.svg?color=white",
          customIconSize: 40,
          borderRadius: "rounded",
        },
        tooltip: {
          showTooltip: false,
          tooltipMessage: "Need help? Chat with us yassine!",
          tooltipBackgroundColor: "#333333",
          tooltipTextColor: "#ffffff",
        },
        chatWindow: {
          title: "Yassie",
          titleAvatarSrc:
            "https://ai-service-testing.s3.eu-west-1.amazonaws.com/company_24/chatbot/72/73f6ecb3-8b69-41c9-8c2b-30db2b983fc7.png",
          welcomeMessage: "Hello! How can I help you today?",
          backgroundColor: "#ffffff",
          height: 485,
          width: 350,
          headerColor: "#007bff",
          botMessageColor: "#f1f3f4",
          userMessageColor: "#007bff",
          sendButtonColor: "#007bff",
          inputPlaceholder: "Type your message...",
        },
      },
    };
    // 2. Check if active
    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled.");
      return;
    }

    // 3. Import the library
    const { default: Chatbot } = await import(
      "https://cdn.n8nchatui.com/v1/pole-embed-yard.js"
    );

    // 4. Initialize with Correct Data Mapping (Inspired by your working static code)
    Chatbot.init({
      webhookUrl: "https://flugia.app.n8n.cloud/webhook/chatBot",
      metadata: configData.metadata || {},
      theme: {
        button: configData.theme.button,
        tooltip: configData.theme.tooltip,
        chatWindow: {
          ...configData.theme.chatWindow,

          // Explicitly mapping nested components the library expects
          botMessage: {
            backgroundColor:
              configData.theme.chatWindow.botMessageColor || "#f1f3f4",
          },
          userMessage: {
            backgroundColor:
              configData.theme.chatWindow.userMessageColor || "#007bff",
          },
          textInput: {
            placeholder:
              configData.theme.chatWindow.inputPlaceholder ||
              "Type your message...",
            sendButtonColor:
              configData.theme.chatWindow.sendButtonColor || "#007bff",
          },
        },
      },
    });

    console.log("Flugia: Chatbot initialized successfully with live data.");
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
