(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag?.getAttribute("data-chatbot-id");

  if (!chatbotId) return;

  try {
 
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

    // 2. Import the library
    const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

    // 3. THE FIX: Define the configuration BEFORE calling init
    const chatConfig = {
      webhookUrl: "https://flugia.app.n8n.cloud/webhook/chatBot", // Hardcoded for safety
      webhookConfig: {
        method: 'POST',
        headers: {}
      },
      metadata: configData.metadata || {},
      theme: {
        button: configData.theme?.button || {},
        chatWindow: {
          title: configData.theme?.chatWindow?.title || "Chat",
          welcomeMessage: configData.theme?.chatWindow?.welcomeMessage || "Hello!",
          backgroundColor: configData.theme?.chatWindow?.backgroundColor || "#ffffff",
          botMessage: { backgroundColor: configData.theme?.chatWindow?.botMessageColor || "#f1f3f4" },
          userMessage: { backgroundColor: configData.theme?.chatWindow?.userMessageColor || "#007bff" },
          textInput: {
            placeholder: configData.theme?.chatWindow?.inputPlaceholder || "Type...",
            sendButtonColor: configData.theme?.chatWindow?.sendButtonColor || "#007bff"
          }
        }
      }
    };

    // 4. Force initialize
    Chatbot.init(chatConfig);
    
    console.log("Flugia: Initialized with forced URL:", chatConfig.webhookUrl);

  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
