const API_KEY = "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";

let messages = JSON.parse(localStorage.getItem("chat")) || [];

function renderChat() {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML = "";

  messages.forEach(msg => {
    chatbox.innerHTML += `<div class="${msg.role}">
      <b>${msg.role}:</b> ${msg.content}
    </div>`;
  });

  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value;

  if (!text) return;

  messages.push({ role: "user", content: text });
  input.value = "";
  renderChat();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  messages.push({ role: "ai", content: reply });

  localStorage.setItem("chat", JSON.stringify(messages));
  renderChat();
}

function newChat() {
  messages = [];
  localStorage.removeItem("chat");
  renderChat();
}

// 🎤 Voice Input
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };

  recognition.start();
}

// Load old chat
renderChat();