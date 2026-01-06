(async function () {
  console.log("Flugia: Simulation Started...");

  // --- START DUMMY DATA (Simulating the response from your API) ---
  const configData = {
    "status": "active",
    "is_active": true,
    "n8nChatUrl": "https://flugia.app.n8n.cloud/webhook/chatBot",
    "metadata": {
        "company_id": 24,
        "company_name": "Yabo",
        "auth_token": "eyJjaGF0Ym90X2lkIjo3MiwiY29tcGFueV9pZCI6MjQsInRpbWVzdGFtcCI6MTc2NzcwOTYwOH0=",
        "BUSINESS_SECTOR": "Software & SaaS",
        "SERVICES": "24/7 support, Product demos",
        "CHATBOT_NAME": "Yassie",
        "AGENT_ROLE": "Customer Support Agent"
    },
    "theme": {
        "button": {
            "backgroundColor": "#007bff",
            "right": 30,
            "bottom": 30,
            "size": 50,
            "iconColor": "#ffffff",
            "customIconSrc": "https://api.iconify.design/mdi/chat.svg?color=white",
            "customIconSize": 40,
            "borderRadius": "rounded"
        },
        "tooltip": {
            "showTooltip": true,
            "tooltipMessage": "Need help? Chat with us!",
            "tooltipBackgroundColor": "#333333",
            "tooltipTextColor": "#ffffff"
        },
        "chatWindow": {
            "title": "Yassie",
            "titleAvatarSrc": "https://ai-service-testing.s3.eu-west-1.amazonaws.com/company_24/chatbot/72/73f6ecb3-8b69-41c9-8c2b-30db2b983fc7.png",
            "welcomeMessage": "Hello! How can I help you today?",
            "backgroundColor": "#ffffff",
            "height": 485,
            "width": 350,
            "headerColor": "#007bff",
            "botMessageColor": "#f1f3f4",
            "userMessageColor": "#007bff",
            "sendButtonColor": "#007bff",
            "inputPlaceholder": "Type your message..."
        }
    }
  };
  // --- END DUMMY DATA ---

  try {
    // 1. Logic Check: Skip loading if not active
    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Simulation stopped - Bot is inactive.");
      return;
    }

    // 2. Import the library module
    const moduleUrl = "https://cdn.n8nchatui.com/v1/pole-embed-yard.js";
    const { default: Chatbot } = await import(moduleUrl);

    // 3. Map Simulated Data to Chatbot.init
    // Note: We map 'botMessageColor' to 'botMessage.backgroundColor' etc.
    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      metadata: configData.metadata,
      theme: {
        button: configData.theme.button,
        tooltip: configData.theme.tooltip,
        chatWindow: {
          title: configData.theme.chatWindow.title,
          titleAvatarSrc: configData.theme.chatWindow.titleAvatarSrc,
          welcomeMessage: configData.theme.chatWindow.welcomeMessage,
          backgroundColor: configData.theme.chatWindow.backgroundColor,
          height: configData.theme.chatWindow.height,
          width: configData.theme.chatWindow.width,
          // Correctly nesting the specific colors into the library's sub-objects
          botMessage: {
            backgroundColor: configData.theme.chatWindow.botMessageColor
          },
          userMessage: {
            backgroundColor: configData.theme.chatWindow.userMessageColor
          },
          textInput: {
            placeholder: configData.theme.chatWindow.inputPlaceholder,
            sendButtonColor: configData.theme.chatWindow.sendButtonColor
          }
        }
      }
    });

    console.log("Flugia: Simulation Successful. Chatbot Initialized.");

  } catch (error) {
    console.error("Flugia Simulation Error:", error);
  }
})();
