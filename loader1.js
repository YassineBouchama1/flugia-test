/**
 * Flugia Chatbot Loader - Fixed Style Mapping
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) return;

  // Change this to your actual backend URL
  const API_URL = `http://54.195.141.232:8080/api/v1/chatbot/config/${chatbotId}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) return;

    const configData = await response.json();

    // 1. Check if active
    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled.");
      return;
    }

    // 2. Import the library
    const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

    // 3. TRANSLATION LAYER (Crucial for Styles)
    // We take your API data and put it exactly where the library code looks for it.
    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      metadata: configData.metadata || {},
      
      // The library looks for these keys at the ROOT of the theme object
      ...configData.theme, // Spreads button and tooltip
      
      // Manually pull values out of your "chatWindow" object
      title: configData.theme?.chatWindow?.title,
      welcomeMessage: configData.theme?.chatWindow?.welcomeMessage,
      titleAvatarSrc: configData.theme?.chatWindow?.titleAvatarSrc,
      backgroundColor: configData.theme?.chatWindow?.backgroundColor,
      height: configData.theme?.chatWindow?.height,
      width: configData.theme?.chatWindow?.width,
      
      // Map your custom color keys to the library's nested style objects
      botMessage: {
        backgroundColor: configData.theme?.chatWindow?.botMessageColor,
        showAvatar: true
      },
      userMessage: {
        backgroundColor: configData.theme?.chatWindow?.userMessageColor,
        showAvatar: false
      },
      textInput: {
        placeholder: configData.theme?.chatWindow?.inputPlaceholder,
        sendButtonColor: configData.theme?.chatWindow?.sendButtonColor
      }
    });

    console.log("Flugia: Chatbot styles mapped and initialized.");
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();
