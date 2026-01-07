/**
 * Flugia Chatbot Loader
 * Static configuration with full theme and metadata mapping.
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
  const apiBaseUrl = "http://54.195.141.232:8080";
  const API_URL = `${apiBaseUrl}/api/v1/chatbot/config/${chatbotId}`;

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
    window.N8N_CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };
    window.CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };

    // 3. Import the library
    const { default: Chatbot } = await import(
      "https://cdn.n8nchatui.com/v1/pole-embed-yard.js"
    );

    // 4. Initialize with full static configuration
    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      n8nChatUrl: configData.n8nChatUrl,
      metadata: { ...configData.metadata, chatbot_id: chatbotId },
      theme: {
        button: configData.theme.button,
        tooltip: {
          ...configData.theme.tooltip,
          tooltipFontSize: 12,
        },
        customCSS: `
          .chat-widget { font-family: 'Segoe UI', Arial, sans-serif !important; }
          .tooltip, .tooltip-message { font-family: 'Segoe UI', Arial, sans-serif !important; }
          * { -webkit-font-smoothing: antialiased !important; }
        `,
        direction: "ltr",
        consentScreen: {
          enabled: true,
          title: "Welcome! 👋",
          message:
            "We're here to assist you with your questions. <br><p style='font-size: 12px;'>Optional: provide name and email for personalized help.</p>",
          textColor: "#1e1e1f",
          acceptButtonColor: configData.theme.button.backgroundColor,
          acceptButtonTextColor: "#ffffff",
          acceptButtonText: "Start Chatting",
          backgroundColor:configData.theme.chatWindow.headerColor,
        },
        chatWindow: {
          borderRadiusStyle: "rounded",
          avatarBorderRadius: 21,
          messageBorderRadius: 6,
          backgroundColor: configData.theme.chatWindow.backgroundColor,
          height: configData.theme.chatWindow.height,
          width: configData.theme.chatWindow.width,
          fontSize: 12,
          renderHTML: true,
          clearChatOnReload: false,
          showTitle: true,
          title: configData.theme.chatWindow.title,
          titleAvatarSrc: configData.theme.chatWindow.titleAvatarSrc,
          avatarSize: 40,
          welcomeMessage: configData.theme.chatWindow.welcomeMessage,
          errorMessage:
            "Oops, technical issue! Please try again in a few seconds.",
          starterPrompts: [
            "How does this work?",
            "Tell me about services",
            "Pricing info",
          ],
          botMessage: {
            backgroundColor: configData.theme.chatWindow.botMessageColor,
            textColor: "#504e4e",
            showAvatar: true,
            avatarSrc: configData.theme.chatWindow.titleAvatarSrc,
          },
          userMessage: {
            backgroundColor: configData.theme.chatWindow.userMessageColor,
            textColor: "#ffffff",
            showAvatar: false,
          },
          textInput: {
            placeholder: configData.theme.chatWindow.inputPlaceholder,
            backgroundColor: "#ffffff",
            textColor: "#1e1e1f",
            sendButtonColor: configData.theme.chatWindow.sendButtonColor,
            maxChars: 5000,
            borderRadius: 13,
          },
          uploadsConfig: {
            enabled: true,
            acceptFileTypes: ["pdf", "txt", "png", "jpg"],
            maxSizeInMB: 10,
          },
          voiceInputConfig: {
            enabled: true,
            maxRecordingTime: 10,
          },
        },
      },
    });

    console.log("Flugia: Chatbot successfully initialized.");
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
