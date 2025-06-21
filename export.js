// export.js
function exportChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatContent = chatMessages.innerText;
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netassist-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Añadir esta función al ámbito global
window.exportChat = exportChat;