let chats = [];
let currentChatIndex = 0;

export function initChat() {
  loadInitialChats();

  // close any open dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.chat-dropdown') 
                       || e.target.classList.contains('chat-menu-icon');
    if (!isDropdownClick) {
      document.querySelectorAll('.chat-dropdown').forEach(d => 
        d.classList.remove('show')
      );
    }
  });
}

// Load initial chats
function loadInitialChats() {
  fetch("https://api.fein-ai.com/v1/conversations/", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok" && Array.isArray(data.conversation_ids)) {
        if (data.conversation_ids.length === 0) {
          window.startNewChat(true);
          return;
        }

        chats = data.conversation_ids.map((id, index) => ({
          id,
          title: `Chat #${index + 1}`,
          messages: []
        }));

        currentChatIndex = 0;
        updateHistory();
        fetchChatHistory(chats[currentChatIndex].id);
      }
    })
    .catch(err => console.error("Failed to fetch conversations:", err));
}

// Start new chat
window.startNewChat = function (auto = false) {
  fetch("https://api.fein-ai.com/v1/conversations/", {
    method: "POST",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok" && data.conversation_id) {
        const title = `Chat #${chats.length + 1}`;
        chats.push({ id: data.conversation_id, title, messages: [] });
        currentChatIndex = chats.length - 1;
        updateHistory();
        renderChat();

        if (!auto) {
          const welcome = document.getElementById('welcomeSection');
          if (welcome) {
            welcome.style.display = 'flex';
            welcome.classList.remove('fade-out');
          }
        }
      }
    })
    .catch(err => console.error("Failed to start new chat:", err));
};

// Fetch chat history
function fetchChatHistory(conversationId) {
  fetch(`https://api.fein-ai.com/v1/conversations/${conversationId}`, {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok" && Array.isArray(data.messages)) {
        chats[currentChatIndex].messages = data.messages;
        renderChat();
      }
    })
    .catch(err => console.error("Failed to fetch chat history:", err));
}

// Send message
window.sendMessage = function () {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  const chatId = chats[currentChatIndex]?.id;
  if (!chatId) return;

  chats[currentChatIndex].messages.push({ from: 'user', text: message });
  renderChat();
  input.value = '';

  fetch(`https://api.fein-ai.com/v1/conversations/${chatId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        chats[currentChatIndex].messages.push({ from: 'ai', text: data.response });
      } else {
        chats[currentChatIndex].messages.push({ from: 'ai', text: "AI failed to respond." });
      }
      renderChat();
    })
    .catch(err => {
      console.error("Failed to get AI response:", err);
      chats[currentChatIndex].messages.push({ from: 'ai', text: "Server error." });
      renderChat();
    });
};

// Render chat messages
function renderChat() {
  const chatWindow = document.getElementById('chatWindow');
  if (!chatWindow) return;

  chatWindow.innerHTML = '';

  const currentChat = chats[currentChatIndex] || { messages: [] };
  const messages = currentChat.messages || [];

  const welcome = document.getElementById('welcomeSection');
  if (welcome) {
    welcome.style.display = messages.length === 0 ? 'flex' : 'none';
    if (messages.length === 0) welcome.classList.remove('fade-out');
  }

  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.from;
    div.textContent = msg.text;
    chatWindow.appendChild(div);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Update sidebar chat history
function updateHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;

  list.innerHTML = '';

  chats.forEach((chat, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-item' + (i === currentChatIndex ? ' active' : '');

    const titleButton = document.createElement('button');
    titleButton.className = 'chat-title';
    titleButton.textContent = chat.title || `Chat #${i + 1}`;
    titleButton.onclick = () => {
      currentChatIndex = i;
      updateHistory();
      fetchChatHistory(chats[currentChatIndex].id);
    };

    const menuIcon = document.createElement('i');
    menuIcon.className = 'ph ph-dots-three-vertical chat-menu-icon';
    menuIcon.onclick = (e) => {
      e.stopPropagation();
      window.toggleDropdown(i);
    };

    const dropdown = document.createElement('div');
    dropdown.className = 'chat-dropdown';
    dropdown.dataset.index = i;
    dropdown.innerHTML = `
      <button onclick="window.renameChat(${i})">Rename</button>
      <button onclick="window.deleteChat(${i})">Delete</button>
    `;

    wrapper.appendChild(titleButton);
    wrapper.appendChild(menuIcon);
    wrapper.appendChild(dropdown);
    list.appendChild(wrapper);
  });
}

// Toggle dropdown menu
window.toggleDropdown = function (index) {
  document.querySelectorAll('.chat-dropdown').forEach((dropdown, i) => {
    if (i === index) {
      dropdown.classList.toggle('show');
    } else {
      dropdown.classList.remove('show');
    }
  });
};

// Rename chat
window.renameChat = function (index) {
  const newName = prompt("Rename chat:");
  if (newName) {
    chats[index].title = newName;
    updateHistory();
  }
};

// Delete chat
window.deleteChat = function (index) {
  if (!confirm("Are you sure you want to delete this chat?")) return;

  chats.splice(index, 1);

  if (chats.length === 0) {
    currentChatIndex = 0;
    window.startNewChat(true);
  } else {
    currentChatIndex = Math.max(0, currentChatIndex - 1);
    updateHistory();
    renderChat();
  }
};
