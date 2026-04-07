/**
 * Flugia Chatbot Loader
 * Merged with lead form flow from index-yassine.
 */
(async function () {
  const scriptTag = document.getElementById("flugia-chatbot-loader");
  const chatbotId = scriptTag ? scriptTag.getAttribute("data-chatbot-id") : null;

  if (!chatbotId) {
    console.warn("Flugia: Missing data-chatbot-id attribute");
    return;
  }

  const alreadyFilled = sessionStorage.getItem("flugia_user");

  const scriptSrc = scriptTag ? scriptTag.getAttribute("src") : "";
  const apiBaseUrl = scriptSrc
    ? new URL(scriptSrc, window.location.href).origin
    : window.location.origin;
  const API_URL = `https://api-dev.flugia.com/api/v1/chatbot/config/${chatbotId}`;


  // For testing only: assign an object to bypass API and use local config.
  // Keep null in production.
  const DUMMY_CONFIG_DATA = null;

  try {
    let configData;

    if (DUMMY_CONFIG_DATA) {
      configData = DUMMY_CONFIG_DATA;
      console.log("Flugia: using DUMMY_CONFIG_DATA instead of API response", configData);
    } else {
      const response = await fetch(API_URL);
      if (!response.ok) {
        console.error("Flugia: config fetch failed", response.status);
        return;
      }
      configData = await response.json();
    }

    if (configData.status !== "active" || configData.is_active !== true) {
      console.log("Flugia: Chatbot is currently disabled.");
      return;
    }

    window.N8N_CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };
    window.CHATBOT_CONFIG = { webhookUrl: configData.n8nChatUrl };

    const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

    Chatbot.init({
      webhookUrl: configData.n8nChatUrl,
      n8nChatUrl: configData.n8nChatUrl,
      metadata: { ...(configData.metadata || {}), chatbot_id: chatbotId },
      theme: {
        button: {
          ...(configData.theme?.button || {}),
          backgroundColor: configData.theme?.chatWindow?.headerColor || configData.theme?.button?.backgroundColor,
          customIconBorderRadius: 16,
          autoWindowOpen: { autoOpen: false },
          borderRadius: configData.theme?.button?.borderRadius,
        },
        tooltip: { ...(configData.theme?.tooltip || {}) },
        customCSS: `
          .chat-widget { font-family: 'Segoe UI', Arial, sans-serif !important; }
          .tooltip, .tooltip-message { font-family: 'Segoe UI', Arial, sans-serif !important; }
          * { -webkit-font-smoothing: antialiased !important; }
        `,
        direction: "ltr",
        chatWindow: {
          borderRadiusStyle: "rounded",
          avatarBorderRadius: 21,
          messageBorderRadius: 6,
          backgroundColor: configData.theme?.chatWindow?.backgroundColor,
          height: configData.theme?.chatWindow?.height,
          width: configData.theme?.chatWindow?.width,
          fontSize: 12,
          renderHTML: true,
          clearChatOnReload: false,
          showTitle: true,
          title: configData.theme?.chatWindow?.title,
          titleAvatarSrc: configData.theme?.chatWindow?.titleAvatarSrc,
          avatarSize: 40,
          welcomeMessage: configData.theme?.chatWindow?.welcomeMessage,
          errorMessage: "Oops, technical issue! Please try again in a few seconds.",
          starterPrompts: configData.theme?.chatWindow?.starterPrompts,
          botMessage: {
            backgroundColor: configData.theme?.chatWindow?.botMessageColor,
            textColor: "#504e4e",
            showAvatar: true,
            avatarSrc: configData.theme?.chatWindow?.titleAvatarSrc,
          },
          userMessage: {
            backgroundColor: configData.theme?.chatWindow?.userMessageColor,
            textColor: "#ffffff",
            showAvatar: false,
          },
          textInput: {
            placeholder: configData.theme?.chatWindow?.inputPlaceholder,
            backgroundColor: "#ffffff",
            textColor: "#1e1e1f",
            sendButtonColor: configData.theme?.chatWindow?.sendButtonColor,
            maxChars: 5000,
            borderRadius: 13,
          },
          uploadsConfig: {
            enabled: configData.theme?.uploadsConfig?.enabled === true,
            acceptFileTypes: ["pdf", "txt", "png", "jpg"],
            maxSizeInMB: 10,
          },
          voiceInputConfig: {
            enabled: configData.theme?.voiceInputConfig?.enabled === true,
            maxRecordingTime: 10,
          },
        },
      },
    });

    if (alreadyFilled) {
      console.log("Flugia: form already filled this session.");
      return;
    }

    console.log("Flugia: initialized, waiting for chat window to open...");

    let observerActive = true;
    const openChecker = setInterval(async () => {
      if (!observerActive) return;

      const chatContainer = querySelectorDeep(".n8n-chat-ui-bot-chat-container");
      if (!chatContainer || chatContainer.getBoundingClientRect().height <= 50) return;

      const styles = window.getComputedStyle(chatContainer);
      const isVisible = styles.display !== "none" && styles.opacity !== "0" && styles.visibility !== "hidden";
      if (!isVisible) return;

      console.log("Flugia: Chat container found! Checking lead form config...");
      observerActive = false;
      clearInterval(openChecker);

      const isLeadFormActive = configData?.leadForm?.is_active !== false;
      if (!isLeadFormActive) {
        console.log("Flugia: lead form is disabled by configData.leadForm.is_active");
        return;
      }

      const userDetails = await showLeadForm(configData, chatContainer);
      if (userDetails && userDetails.name) {
        triggerBotWelcome(userDetails, configData.n8nChatUrl, configData, chatbotId);
      }
    }, 100);

    setTimeout(() => clearInterval(openChecker), 60000);
  } catch (error) {
    console.error("Flugia Loader Error:", error);
  }
})();

function querySelectorDeep(selector, root) {
  const safeRoot = root || document;

  if (safeRoot.querySelector && safeRoot.querySelector(selector)) {
    return safeRoot.querySelector(selector);
  }

  let elementsWithShadow = [];
  if (safeRoot.querySelectorAll) {
    elementsWithShadow = Array.from(safeRoot.querySelectorAll("*")).filter((el) => el.shadowRoot);
  }

  for (const el of elementsWithShadow) {
    const found = querySelectorDeep(selector, el.shadowRoot);
    if (found) return found;
  }

  return null;
}

function showLeadForm(configData, chatContainer) {
  return new Promise((resolve) => {
    const headerColor = configData.theme?.chatWindow?.headerColor || "#6366f1";

    const style = document.createElement("style");
    style.textContent = `
      #flugia-lead-overlay {
        position: relative;
        z-index: 2147483647;
        font-family: 'Segoe UI', Arial, sans-serif;
        background: #fff;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: f-fade-in 0.25s ease;
      }
      @keyframes f-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      #flugia-lead-body { padding: 20px; flex: 1; overflow-y: auto; text-align: left; }
      #flugia-lead-body > p { margin: 0 0 14px; color: #555; font-size: 13px; line-height: 1.5; }
      .f-field { margin-bottom: 12px; }
      .f-field label { display: block; font-size: 11px; font-weight: 600; color: #333; margin-bottom: 4px; text-align: left; }
      .f-field input {
        width: 100%; box-sizing: border-box; padding: 9px 12px;
        border: 1.5px solid #e0e0e0; border-radius: 10px;
        font-size: 13px; color: #1e1e1f; outline: none;
        transition: border-color 0.2s; font-family: 'Segoe UI', Arial, sans-serif;
      }
      .f-field input:focus { border-color: ${headerColor}; }
      .f-err { color: #e53e3e; font-size: 11px; margin-top: 3px; display: none; }
      #f-submit {
        width: 100%; padding: 11px; background: ${headerColor}; color: #fff;
        border: none; border-radius: 10px; font-size: 13px; font-weight: 600;
        cursor: pointer; margin-top: 4px; transition: opacity 0.2s;
        font-family: 'Segoe UI', Arial, sans-serif;
      }
      #f-submit:hover { opacity: 0.87; }
      #f-skip {
        display: block; text-align: center; margin-top: 10px;
        font-size: 12px; color: #aaa; cursor: pointer; text-decoration: underline;
      }
      #f-skip:hover { color: #666; }
    `;

    if (chatContainer.getRootNode() && chatContainer.getRootNode().host) {
      chatContainer.getRootNode().appendChild(style);
    } else {
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.id = "flugia-lead-overlay";
    overlay.innerHTML = `
      <div id="flugia-lead-body">
        <p>Share a few details so we can assist you better.</p>
        <div class="f-field">
          <label for="f-name">Your Name</label>
          <input id="f-name" type="text" placeholder="e.g. John Doe" autocomplete="name" />
          <div class="f-err" id="f-name-err">Please enter your name.</div>
        </div>
        <div class="f-field">
          <label for="f-email">Email Address</label>
          <input id="f-email" type="email" placeholder="john@company.com" autocomplete="email" />
          <div class="f-err" id="f-email-err">Please enter a valid email.</div>
        </div>
        <button id="f-submit">Start Chatting</button>
        <span id="f-skip">Skip for now</span>
      </div>
    `;

    const originalDisplay = chatContainer.style.display || "";
    chatContainer.style.display = "none";
    chatContainer.parentNode.insertBefore(overlay, chatContainer);

    setTimeout(() => {
      const nameInput = overlay.querySelector("#f-name");
      if (nameInput) nameInput.focus();
    }, 80);

    function dismiss(name, email) {
      overlay.remove();
      style.remove();
      chatContainer.style.display = originalDisplay;
      sessionStorage.setItem("flugia_user", JSON.stringify({ name, email }));
      resolve({ name, email });
    }

    overlay.querySelector("#f-submit").addEventListener("click", () => {
      const name = overlay.querySelector("#f-name").value.trim();
      const email = overlay.querySelector("#f-email").value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      overlay.querySelector("#f-name-err").style.display = name ? "none" : "block";
      overlay.querySelector("#f-email-err").style.display = ok ? "none" : "block";

      if (name && ok) dismiss(name, email);
    });

    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        overlay.querySelector("#f-submit").click();
      }
    });

    overlay.querySelector("#f-skip").addEventListener("click", () => dismiss("", ""));
  });
}

function triggerBotWelcome(userDetails, webhookUrl, configData, chatbotId) {
  if (!webhookUrl) return;

  let sessionId = sessionStorage.getItem("flugia_session_id");
  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
    sessionStorage.setItem("flugia_session_id", sessionId);
  }

  const metadata = configData && configData.metadata ? configData.metadata : {};

  const leadPayload = {
    action: "message",
    sessionId: sessionId,
    auth_token: metadata.auth_token,
    company_id: metadata.company_id,
    company_name: metadata.company_name,
    chatbot_id: Number(chatbotId),
    chatbot_name: metadata.CHATBOT_NAME,
    name: userDetails.name || null,
    email: userDetails.email || null,
    message: `Hello, I am ${userDetails.name}`,
    timestamp: new Date().toISOString(),
    info: "Initialize chat session"
  };

  sendJson(webhookUrl, leadPayload, "silent lead payload");
}

function sendJson(webhookUrl, payload, label) {
  console.log(`Flugia: sending ${label}`, { webhookUrl: webhookUrl, payload: payload });

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      webhookUrl,
      new Blob([body], { type: "application/json" })
    );

    if (queued) {
      console.log(`Flugia: ${label} queued via sendBeacon`);
      return;
    }

    console.warn(`Flugia: ${label} sendBeacon was not accepted, falling back to fetch`);
  }

  fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    },
    body
  })
    .then(() => {
      console.log(`Flugia: ${label} sent via no-cors fetch`);
    })
    .catch((err) => {
      console.error(`Flugia: ${label} failed`, err);
    });
}
