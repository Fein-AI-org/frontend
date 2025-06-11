let chats = [[]];
let currentChatIndex = 0;

export function initChat() {
  updateHistory();
  renderChat();

  window.startNewChat = function () {
    chats.push([]);
    currentChatIndex = chats.length - 1;
    updateHistory();
    renderChat();
  };

  window.sendMessage = function () {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    chats[currentChatIndex].push({ from: 'user', text: message });
    chats[currentChatIndex].push({ from: 'ai', text: `AI says: "${message}"` });

    input.value = '';
    renderChat();
  };
}

function renderChat() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.innerHTML = '';

  chats[currentChatIndex].forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.from;
    div.textContent = msg.text;
    chatWindow.appendChild(div);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  chats.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="ph ph-chat-circle-dots"></i> Chat #${i + 1}`;
    btn.onclick = () => {
      currentChatIndex = i;
      renderChat();
    };
    list.appendChild(btn);
  });
}
