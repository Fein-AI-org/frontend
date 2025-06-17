let chats = [{
  title: 'Chat #1',
  messages: []
}];

let currentChatIndex = 0;

export function initChat() {
  updateHistory();
  renderChat();

  window.startNewChat = function () {
    const title = `Chat #${chats.length + 1}`;
    chats.push({ title, messages: [] });
    currentChatIndex = chats.length - 1;
    updateHistory();
    renderChat();
  };

  window.sendMessage = function () {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    // Hide welcome message on first send
    const welcome = document.querySelector('.welcome-section');
    if (welcome) {
      welcome.classList.add('fade-out');
      setTimeout(() => {
        welcome.remove(); // removes it entirely from DOM
      }, 500);
    }

    chats[currentChatIndex].messages.push({ from: 'user', text: message });
    chats[currentChatIndex].messages.push({ from: 'ai', text: `AI says: "${message}"` });

    input.value = '';
    renderChat();
  };
}

function renderChat() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.innerHTML = '';

  const currentChat = chats[currentChatIndex] || { messages: [] };
  const messages = currentChat.messages || [];

  messages.forEach(msg => {
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

  chats.forEach((chat, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-item' + (i === currentChatIndex ? ' active' : '');

    const titleButton = document.createElement('button');
    titleButton.className = 'chat-title';
    titleButton.textContent = chat.title || `Chat #${i + 1}`;
    titleButton.onclick = () => {
      currentChatIndex = i;
      updateHistory();
      renderChat();
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

  // Close dropdowns if clicked outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.chat-dropdown').forEach(d => d.style.display = 'none');
  });
}

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
