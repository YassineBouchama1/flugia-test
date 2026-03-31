(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  const apiBaseUrl =
    scriptTag.getAttribute("data-api-url") || "https://api-dev.flugia.com";
  const API_URL = `${apiBaseUrl}/api/v1/chatbot/config/${chatbotId}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error("Flugia: Failed to fetch configuration", response.status);
      return;
    }

    const configData = await response.json();

    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled.");
      return;
    }

    // 1. Show lead form first
    const userInfo = await collectUserInfo(configData);

    // 2. Init chatbot
    window.N8N_CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };
    window.CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };

    const { default: Chatbot } = await import(
      "https://cdn.n8nchatui.com/v1/pole-embed-yard.js"
    );

    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      n8nChatUrl: configData.n8nChatUrl,
      metadata: {
        ...configData.metadata,
        chatbot_id: chatbotId,
        user_name: userInfo.name,
        user_email: userInfo.email,
      },
      theme: {
        button: {
          ...configData.theme.button,
          backgroundColor: configData.theme.chatWindow.headerColor,
          right: configData.theme.button.right,
          bottom: configData.theme.button.bottom,
          size: configData.theme.button.size,
          iconColor: configData.theme.button.iconColor,
          customIconSrc: configData.theme.button.customIconSrc,
          customIconSize: configData.theme.button.customIconSize,
          customIconBorderRadius: 16,
          autoWindowOpen: {
            autoOpen: true,
            openDelay: 0,
          },
          borderRadius: configData.theme.button.borderRadius,
        },
        tooltip: {
          ...configData.theme.tooltip,
        },
        customCSS: `
          .chat-widget { font-family: 'Segoe UI', Arial, sans-serif !important; }
          .tooltip, .tooltip-message { font-family: 'Segoe UI', Arial, sans-serif !important; }
          * { -webkit-font-smoothing: antialiased !important; }
        `,
        direction: "ltr",
        consentScreen: {
          enabled: false,
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
          starterPrompts: configData.theme.chatWindow.starterPrompts,
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
            enabled: configData.theme.uploadsConfig.enabled,
            acceptFileTypes: ["pdf", "txt", "png", "jpg"],
            maxSizeInMB: 10,
          },
          voiceInputConfig: {
            enabled: configData.theme.voiceInputConfig.enabled,
            maxRecordingTime: 10,
          },
        },
      },
    });

    console.log(
      "Flugia: Chatbot initialized for",
      userInfo.name || "anonymous"
    );
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();

function collectUserInfo(configData) {
  return new Promise((resolve) => {
    const headerColor =
      configData.theme?.chatWindow?.headerColor || "#6366f1";
    const avatarSrc = configData.theme?.chatWindow?.titleAvatarSrc || "";
    const title = configData.theme?.chatWindow?.title || "Chat with us";

    const style = document.createElement("style");
    style.textContent = `
      #flugia-lead-overlay {
        position: fixed; inset: 0; z-index: 999999;
        background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
        display: flex; align-items: flex-end; justify-content: flex-end;
        padding: 20px; box-sizing: border-box;
        font-family: 'Segoe UI', Arial, sans-serif;
      }
      #flugia-lead-card {
        background: #fff; border-radius: 16px;
        width: 370px; overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        animation: flugia-slide-up 0.3s ease;
      }
      @keyframes flugia-slide-up {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      #flugia-lead-header {
        background: ${headerColor};
        padding: 20px; display: flex; align-items: center; gap: 12px;
      }
      #flugia-lead-header img {
        width: 42px; height: 42px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.4); object-fit: cover;
      }
      #flugia-lead-header .flugia-info h3 {
        margin: 0; color: #fff; font-size: 15px; font-weight: 600;
      }
      #flugia-lead-header .flugia-info p {
        margin: 2px 0 0; color: rgba(255,255,255,0.8); font-size: 12px;
      }
      #flugia-lead-body { padding: 24px; }
      #flugia-lead-body > p {
        margin: 0 0 18px; color: #555; font-size: 13px; line-height: 1.5;
      }
      .flugia-field { margin-bottom: 14px; }
      .flugia-field label {
        display: block; font-size: 12px; font-weight: 600;
        color: #333; margin-bottom: 5px;
      }
      .flugia-field input {
        width: 100%; box-sizing: border-box;
        padding: 10px 13px; border: 1.5px solid #e0e0e0;
        border-radius: 10px; font-size: 13px; color: #1e1e1f;
        outline: none; transition: border-color 0.2s;
        font-family: 'Segoe UI', Arial, sans-serif;
      }
      .flugia-field input:focus { border-color: ${headerColor}; }
      .flugia-field .flugia-error {
        color: #e53e3e; font-size: 11px; margin-top: 4px; display: none;
      }
      #flugia-lead-submit {
        width: 100%; padding: 12px;
        background: ${headerColor}; color: #fff;
        border: none; border-radius: 10px;
        font-size: 14px; font-weight: 600; cursor: pointer;
        margin-top: 4px; transition: opacity 0.2s;
        font-family: 'Segoe UI', Arial, sans-serif;
      }
      #flugia-lead-submit:hover { opacity: 0.88; }
      #flugia-skip-link {
        display: block; text-align: center; margin-top: 12px;
        font-size: 12px; color: #999; cursor: pointer;
        text-decoration: underline;
      }
      #flugia-skip-link:hover { color: #555; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "flugia-lead-overlay";
    overlay.innerHTML = `
      <div id="flugia-lead-card">
        <div id="flugia-lead-header">
          ${avatarSrc ? `<img src="${avatarSrc}" alt="avatar" />` : ""}
          <div class="flugia-info">
            <h3>${title}</h3>
            <p>We typically reply instantly</p>
          </div>
        </div>
        <div id="flugia-lead-body">
          <p>Before we start, please share a few details so we can assist you better.</p>
          <div class="flugia-field">
            <label for="flugia-name">Your Name</label>
            <input id="flugia-name" type="text" placeholder="e.g. Ahmed" autocomplete="name" />
            <div class="flugia-error" id="flugia-name-err">Please enter your name.</div>
          </div>
          <div class="flugia-field">
            <label for="flugia-email">Email Address</label>
            <input id="flugia-email" type="email" placeholder="you@example.com" autocomplete="email" />
            <div class="flugia-error" id="flugia-email-err">Please enter a valid email.</div>
          </div>
          <button id="flugia-lead-submit">Start Chatting →</button>
          <span id="flugia-skip-link">Skip for now</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function dismiss(name, email) {
      overlay.remove();
      style.remove();
      resolve({ name, email });
    }

    document.getElementById("flugia-lead-submit").addEventListener("click", () => {
      const name = document.getElementById("flugia-name").value.trim();
      const email = document.getElementById("flugia-email").value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      document.getElementById("flugia-name-err").style.display = name ? "none" : "block";
      document.getElementById("flugia-email-err").style.display = emailValid ? "none" : "block";

      if (name && emailValid) dismiss(name, email);
    });

    // Allow Enter key to submit
    document.getElementById("flugia-lead-overlay").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        document.getElementById("flugia-lead-submit").click();
      }
    });

    document.getElementById("flugia-skip-link").addEventListener("click", () => {
      dismiss("", "");
    });
  });
}
