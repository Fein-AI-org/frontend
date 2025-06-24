let chats = [];
let currentChatIndex = 0;

export function initChat() {
  loadInitialChats();
}

// Load poorane ajeeb ajeeb initial conversations and populate UIIIII
function loadInitialChats() {
  fetch("https://api.fein-ai.com/v1/conversations/", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok" && Array.isArray(data.conversation_ids)) {
        if (data.conversation_ids.length === 0) {
          // If no chats yet, auto-create one
          startNewChat(true);
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
    .catch(err => {
      console.error("Failed to fetch conversations:", err);
    });
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
    .catch(err => {
      console.error("Failed to start new chat:", err);
    });
};

// Fetching chaaaaaaaaat history
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
    .catch(err => {
      console.error("Failed to fetch chat history:", err);
    });
}

//  Sending  message to FEIN BABA
window.sendMessage = function () {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  const chatId = chats[currentChatIndex].id;
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
        renderChat();
      } else {
        chats[currentChatIndex].messages.push({ from: 'ai', text: "AI failed to respond." });
        renderChat();
      }
    })
    .catch(err => {
      console.error("Failed to get AI response:", err);
      chats[currentChatIndex].messages.push({ from: 'ai', text: "Server error." });
      renderChat();
    });
};

//  chat window
function renderChat() {
  const chatWindow = document.getElementById('chatWindow');
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

//  Update chat history sidebar
function updateHistory() {
  const list = document.getElementById('historyList');
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
      toggleDropdown(i);
    };

    const dropdown = document.createElement('div');
    dropdown.className = 'chat-dropdown';
    dropdown.dataset.index = i;
    dropdown.innerHTML = `
      <button onclick="renameChat(${i})">Rename</button>
      <button onclick="deleteChat(${i})">Delete</button>
    `;

    wrapper.appendChild(titleButton);
    wrapper.appendChild(menuIcon);
    wrapper.appendChild(dropdown);
    list.appendChild(wrapper);
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.chat-dropdown').forEach(d => d.style.display = 'none');
  });
}

//  Dropdown of Rename/Delete
window.toggleDropdown = function (index) {
  document.querySelectorAll('.chat-dropdown').forEach((dropdown, i) => {
    dropdown.style.display = i === index && dropdown.style.display !== 'block' ? 'block' : 'none';
  });
};

window.renameChat = function (index) {
  const newName = prompt("Rename chat:");
  if (newName) {
    chats[index].title = newName;
    updateHistory();
  }
};

window.deleteChat = function (index) {
  if (confirm("Are you sure you want to delete this chat?")) {
    chats.splice(index, 1);
    currentChatIndex = Math.max(0, currentChatIndex - 1);
    updateHistory();
    renderChat();
  }
};
