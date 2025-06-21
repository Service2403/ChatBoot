// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const quickQueryBtns = document.querySelectorAll('.quick-btn');
    
    // Historial del chat
    let chatHistory = [];
    
    // Función para añadir mensaje al chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `p-4 mb-4 max-w-3/4 ${isUser ? 'user-message ml-auto' : 'bot-message mr-auto'} message-animation`;
        
        // Formatear contenido con saltos de línea
        const formattedContent = content.replace(/\n/g, '<br>');
        
        // Detectar bloques de comandos (simulado)
        const commandBlocks = formattedContent.match(/```[\s\S]*?```/g) || [];
        let displayContent = formattedContent;
        
        commandBlocks.forEach(block => {
            const cleanBlock = block.replace(/```[\w]*/g, '').trim();
            displayContent = displayContent.replace(block, 
                `<div class="command-block mono text-sm overflow-x-auto">
                    <button class="code-copy-btn" onclick="copyToClipboard(this)">Copiar</button>
                    ${cleanBlock}
                </div>`);
        });
        
        messageDiv.innerHTML = displayContent;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Guardar en historial
        chatHistory.push({
            role: isUser ? 'user' : 'assistant',
            content: content
        });
    }
    
    // Función para consultas rápidas
    function quickQuery(query) {
        chatInput.value = query;
        sendMessage();
    }
    
    // Función para enviar mensaje
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        addMessage(message, true);
        chatInput.value = '';
        sendBtn.disabled = true;
        
        // Mostrar indicador de escritura
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'bot-message mr-auto p-4 mb-4 max-w-3/4';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = '<div class="typing-indicator flex space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full"></div><div class="w-2 h-2 bg-gray-400 rounded-full"></div><div class="w-2 h-2 bg-gray-400 rounded-full"></div></div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simular respuesta del asistente (en un caso real, aquí harías una llamada API)
        setTimeout(() => {
            document.getElementById('typing-indicator').remove();
            const response = generateMockResponse(message);
            addMessage(response);
        }, 1500);
    }
    
    // Función para generar respuestas simuladas
    function generateMockResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('vlan')) {
            return `Para configurar una VLAN en un switch Cisco, sigue estos pasos:\n\n` +
                   `1. Entrar en modo configuración:\n` +
                   ````\nconfigure terminal\n```\n\n` +
                   `2. Crear la VLAN:\n` +
                   ````\nvlan 10\nname Ventas\n```\n\n` +
                   `3. Asignar puertos a la VLAN:\n` +
                   ````\ninterface range fastEthernet 0/1 - 10\nswitchport mode access\nswitchport access vlan 10\n````;
        } else if (lowerQuery.includes('ospf')) {
            return `Configuración básica de OSPF en Cisco:\n\n` +
                   ````\nrouter ospf 1\nnetwork 192.168.1.0 0.0.0.255 area 0\nnetwork 10.0.0.0 0.255.255.255 area 0\n```\n\n` +
                   `Para verificar la configuración:\n` +
                   ````\nshow ip ospf neighbor\nshow ip ospf interface\n````;
        } else if (lowerQuery.includes('diagnóstico') || lowerQuery.includes('diagnostico')) {
            return `Comandos útiles para diagnóstico de red:\n\n` +
                   `En Windows:\n` +
                   ````\nping 8.8.8.8\ntracert google.com\nipconfig /all\nnetstat -ano\n```\n\n` +
                   `En Linux:\n` +
                   ````\nping 8.8.8.8\ntraceroute google.com\nifconfig\nnetstat -tulnp\n````;
        } else {
            return `Gracias por tu consulta sobre redes. Como asistente especializado, puedo ayudarte con:\n\n` +
                   `- Configuración de switches y routers\n- Protocolos de enrutamiento (OSPF, BGP, EIGRP)\n` +
                   `- Solución de problemas de conectividad\n- Diseño de topologías de red\n\n` +
                   `¿Puedes proporcionar más detalles sobre lo que necesitas?`;
        }
    }
    
    // Función para limpiar el chat
    function clearChat() {
        chatMessages.innerHTML = '';
        chatHistory = [];
        addMessage('¡Hola! Soy NetAssist AI, tu especialista en redes. ¿En qué puedo ayudarte hoy?');
    }
    
    // Función para copiar al portapapeles
    window.copyToClipboard = function(button) {
        const codeBlock = button.parentElement;
        const textToCopy = codeBlock.innerText.replace('Copiar', '').trim();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            button.textContent = '¡Copiado!';
            setTimeout(() => {
                button.textContent = 'Copiar';
            }, 2000);
        });
    };
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    chatInput.addEventListener('input', function() {
        sendBtn.disabled = chatInput.value.trim() === '';
    });
    
    // Exponer funciones al ámbito global para los botones HTML
    window.quickQuery = quickQuery;
    window.clearChat = clearChat;
    
    // Mensaje inicial
    addMessage('¡Hola! Soy NetAssist AI, tu especialista en redes. ¿En qué puedo ayudarte hoy?');
});