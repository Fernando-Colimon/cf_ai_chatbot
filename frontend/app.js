const WORKER_URL = "https://cf-ai-chatbot.colimonfernando10.workers.dev";

// Generate a session ID for this browser tab
const sessionId = "sess_" + Math.random().toString(36).slice(2, 10);

const messagesEl = document.getElementById("messages");
const inputEl    = document.getElementById("user-input");
const sendBtn    = document.getElementById("send-btn");
const clearBtn   = document.getElementById("clear-btn");

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key (Shift+Enter for newline)
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

clearBtn.addEventListener("click", () => {
  messagesEl.innerHTML = "";
});

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  // Clear input
  inputEl.value = "";

  // Show user message
  appendMessage("user", text);

  // Show typing indicator
  const typing = appendMessage("assistant", "...");

  try {
    const res = await fetch(`${WORKER_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: text }),
    });

    const data = await res.json();
    typing.remove();
    appendMessage("assistant", data.response);

  } catch (err) {
    typing.remove();
    appendMessage("assistant", "Error: could not reach the worker.");
  }
}

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.className = `message message--${role}`;
  div.textContent = content;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

