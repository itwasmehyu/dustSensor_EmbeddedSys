// xử lý chat bot
async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const chatContainer = document.querySelector(".chat-container");

    if (userInput.value.trim() === "") return;

    // Hiển thị tin nhắn người dùng
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = userInput.value;
    chatBox.appendChild(userMessage);

    const message = userInput.value;
    userInput.value = "";

    try {
        const response = await fetch("http://localhost:5006/webhooks/rest/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (data && data.length > 0) {
            data.forEach((resp) => {
                const botMessage = document.createElement("div");
                botMessage.classList.add("message", "bot-message");
                botMessage.innerText = resp.text || "[Không có phản hồi]";
                chatBox.appendChild(botMessage);
            });
        } else {
            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot-message");
            botMessage.innerText = "[Bot không có phản hồi]";
            chatBox.appendChild(botMessage);
        }
    } catch (error) {
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.innerText = "[Lỗi kết nối tới Rasa server]";
        chatBox.appendChild(botMessage);
        console.error("Lỗi gửi tin nhắn đến Rasa:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

const chatIcon = document.getElementById("icon-chat"); 
const chatContainer = document.querySelector(".chat-container"); 

chatIcon.addEventListener("click", function () {
    chatIcon.style.display = "none";
    chatContainer.style.display = "flex";
});

// Khi click ra ngoài khung chat, ẩn chatbox và hiển thị icon lại
document.addEventListener("click", function (event) {
    if (!chatContainer.contains(event.target) && event.target !== chatIcon) {
        chatContainer.style.display = "none";
        chatIcon.style.display = "block";
    }
});
const sendButton = document.querySelector("button");

sendButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();  // Gọi hàm sendMessage() khi nhấn Enter
    }
});