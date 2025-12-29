(async function() {
    // 1. Get the Company ID from the script tag
    const scriptTag = document.getElementById('flugia-chatbot-loader');
    const companyId = scriptTag ? scriptTag.getAttribute('data-company-id') : '8';

    // 2. ALL DATA FROM YOUR INDEX1.HTML (Static for now)
    const dynamicConfig = {
        "n8nChatUrl": "https://flugia.app.n8n.cloud/webhook/chatBot",
        "metadata": {
            "company_id": companyId, 
            "company_name": "Flugia", 
            "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "BUSINESS_SECTOR": "AI Solutions",
            "SERVICES": "Automatisation AI...",
            "CHATBOT_NAME": "Emily"
        },
        "theme": {
            "button": {
                "backgroundColor": "#4CC4F0",
                "right": 30,  
                "bottom": 30,  
                "size": 50,  
                "iconColor": "#FFFFFF",
                "customIconSrc": "https://api.iconify.design/mdi/chat.svg?color=white",  
                "customIconSize": 40,  
                "customIconBorderRadius": 16,  
                "autoWindowOpen": { "autoOpen": true, "openDelay": 2 },
                "borderRadius": "rounded"  
            },
            "tooltip": {
                "showTooltip": true,
                "tooltipMessage": "Need help ? Contact us via chat 👋", 
                "tooltipBackgroundColor": "#F7F8FF", 
                "tooltipTextColor": "#1E1B4B", 
                "tooltipFontSize": 12
            },
            "customCSS": `
                .chat-widget { font-family: 'Segoe UI', Arial, sans-serif !important; }
                .tooltip, .tooltip-message { font-family: 'Segoe UI', Arial, sans-serif !important; }
                * { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
            `,
            "direction": "ltr",  
            "consentScreen": {
                "enabled": true,
                "title": "Welcome! 👋",
                "message": "We're here to assist you... (truncated)",
                "textColor": "#1e1e1f",
                "acceptButtonColor": "#4CC4F0",
                "acceptButtonTextColor": "#ffffff",
                "acceptButtonText": "Start Chating",
                "backgroundColor": "#FFFDFD"
            },
            "chatWindow": {
                "borderRadiusStyle": "rounded",  
                "avatarBorderRadius": 21,  
                "messageBorderRadius": 6,  
                "backgroundColor": "#ffffff",  
                "height": 485,  
                "width": 350,  
                "fontSize": 12,  
                "renderHTML": true,  
                "showTitle": true,  
                "title": "Emily",
                "titleAvatarSrc": "https://i.postimg.cc/L4rh1Kb9/avatar.png",
                "welcomeMessage":" Hello! 👋 How can I help you today?",
                "errorMessage": "Oops, technical issue!",
                "starterPrompts": ["message 1 ?", "message 2 ?", "message 3 ?"],
                "botMessage": {
                    "backgroundColor": "#F7F8FF",
                    "textColor": "#504e4e",
                    "showAvatar": false,
                    "avatarSrc": "https://i.postimg.cc/L4rh1Kb9/avatar.png"
                },
                "userMessage": {
                    "backgroundColor": "#4CC4F0",
                    "textColor": "#ffffff",
                    "showAvatar": false,
                    "avatarSrc": "https://www.svgrepo.com/show/532363/user-alt-1.svg"
                },
                "textInput": {
                    "placeholder": "Type here...", 
                    "sendButtonColor": "#4CC4F0"
                },
                "uploadsConfig": { "enabled": true, "maxSizeInMB": 50 },
                "voiceInputConfig": { "enabled": true, "maxRecordingTime": 10 }
            }
        }
    };

    try {
        // 3. Load the library
        const { default: Chatbot } = await import("https://cdn.n8nchatui.com/v1/pole-embed-yard.js");

        // 4. Initialize with the data above
        Chatbot.init({
            n8nChatUrl: dynamicConfig.n8nChatUrl,
            metadata: dynamicConfig.metadata,
            theme: dynamicConfig.theme
        });

    } catch (error) {
        console.error("Flugia Chatbot failed to load:", error);
    }
})();
