/**
 * Flugia Chatbot Loader
 * Static configuration with full theme and metadata mapping.
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  try {
    // 1. Static Configuration Data
    const configData = {
      "status": "active",
      "is_active": true,
      "n8nChatUrl": "https://flugia.app.n8n.cloud/webhook/chatBot",
      "metadata": {
        "company_id": 23,
        "company_name": "Flugia Corp",
        "auth_token": "eyJjaGF0Ym90X2lkIjo3MSwiY29tcGFueV9pZCI6MjMsInRpbWVzdGFtcCI6MTc2Nzc4MTg1NH0=",
        "BUSINESS_SECTOR": "Software & SaaS",
        "SERVICES": "24/7 support, Product demos",
        "CHATBOT_NAME": "FlugiaBot",
        "AGENT_ROLE": "Customer Support Agent",
        "COMPANY_DESCRIPTION": "this is a description",
        "COMPANY_WEBSITE": "https://flugia.com",
        "COMPANY_EMAIL": "contact@flugia.com",
        "COMPANY_PHONE": "+1234567890",
        "DEFAULT_LANGUAGE": "en",
        "SUPPORTED_LANGUAGES": ["en", "fr"],
        "chatbot_id":chatbotId,
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
          "title": "FlugiaBot",
          "titleAvatarSrc": "https://ai-service-testing.s3.eu-west-1.amazonaws.com/company_23/chatbot/71/4565bb46-4e98-4044-8840-c0c759163537.png",
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
"webhookUrl": configData.n8nChatUrl, // Standard key
      "n8nChatUrl": configData.n8nChatUrl, // Your original script's key
      "metadata": configData.metadata,
      "theme": {
        "button": configData.theme.button,
        "tooltip": {
          ...configData.theme.tooltip,
          "tooltipFontSize": 12
        },
        "customCSS": `
          .chat-widget { font-family: 'Segoe UI', Arial, sans-serif !important; }
          .tooltip, .tooltip-message { font-family: 'Segoe UI', Arial, sans-serif !important; }
          * { -webkit-font-smoothing: antialiased !important; }
        `,
        "direction": "ltr",
        "consentScreen": {
          "enabled": true,
          "title": "Welcome! 👋",
          "message": "We're here to assist you with your questions. <br><p style='font-size: 12px;'>Optional: provide name and email for personalized help.</p>",
          "textColor": "#1e1e1f",
          "acceptButtonColor": configData.theme.button.backgroundColor,
          "acceptButtonTextColor": "#ffffff",
          "acceptButtonText": "Start Chatting",
          "backgroundColor": "#FFFDFD"
        },
        "chatWindow": {
          "borderRadiusStyle": "rounded",
          "avatarBorderRadius": 21,
          "messageBorderRadius": 6,
          "backgroundColor": configData.theme.chatWindow.backgroundColor,
          "height": configData.theme.chatWindow.height,
          "width": configData.theme.chatWindow.width,
          "fontSize": 12,
          "renderHTML": true,
          "clearChatOnReload": false,
          "showTitle": true,
          "title": configData.theme.chatWindow.title,
          "titleAvatarSrc": configData.theme.chatWindow.titleAvatarSrc,
          "avatarSize": 40,
          "welcomeMessage": configData.theme.chatWindow.welcomeMessage,
          "errorMessage": "Oops, technical issue! Please try again in a few seconds.",
          "starterPrompts": ["How does this work?", "Tell me about services", "Pricing info"],
          "botMessage": {
            "backgroundColor": configData.theme.chatWindow.botMessageColor,
            "textColor": "#504e4e",
            "showAvatar": true,
            "avatarSrc": configData.theme.chatWindow.titleAvatarSrc
          },
          "userMessage": {
            "backgroundColor": configData.theme.chatWindow.userMessageColor,
            "textColor": "#ffffff",
            "showAvatar": false
          },
          "textInput": {
            "placeholder": configData.theme.chatWindow.inputPlaceholder,
            "backgroundColor": "#ffffff",
            "textColor": "#1e1e1f",
            "sendButtonColor": configData.theme.chatWindow.sendButtonColor,
            "maxChars": 5000,
            "borderRadius": 13
          },
          "uploadsConfig": {
            "enabled": true,
            "acceptFileTypes": ["pdf", "txt", "png", "jpg"],
            "maxSizeInMB": 10
          },
          "voiceInputConfig": {
            "enabled": true,
            "maxRecordingTime": 10
          }
        }
      }
    });

    console.log("Flugia: Chatbot successfully initialized.");
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
