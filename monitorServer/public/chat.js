async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (userInput.value.trim() === "") return;
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = userInput.value;
    chatBox.appendChild(userMessage);
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    botMessage.innerText = "Thiên thượng thiên hạ, duy ngã độc tôn";
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = "";
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
