const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  const pairButton = document.getElementById('pairButton');
  const chatArea = document.getElementById('chatArea');
  const messageInput = document.getElementById('messageInput');
  const sendMessageButton = document.getElementById('sendMessageButton');
  const chatMessages = document.getElementById('chatMessages');

  let paired = false;
  let partnerSocketId = null;

  pairButton.addEventListener('click', () => {
    if (!paired) {
      socket.emit('pair');
      pairButton.disabled = true;
    }
  });

  sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
      socket.emit('message', { message, partnerSocketId });
      displayMessage('You: ' + message);
      messageInput.value = '';
    }
  });

  socket.on('pairSuccess', ({ partnerId }) => {
    paired = true;
    partnerSocketId = partnerId;
    chatArea.style.display = 'block';
  });

  socket.on('message', ({ message }) => {
    displayMessage('Partner: ' + message);
  });

  function displayMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    chatMessages.appendChild(li);
  }
});
