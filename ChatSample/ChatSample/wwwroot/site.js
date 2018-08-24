// Helper functions
function addMessage(name, message) {
    // Html encode display name and message.
    var encodedName = name;
    var encodedMsg = message;
    // Add the message to the page.
    var liElement = document.createElement('li');
    liElement.innerHTML = '<strong>' + encodedName + '</strong>:&nbsp;&nbsp;' + encodedMsg;
    document.getElementById('discussion').appendChild(liElement);
}

document.addEventListener('DOMContentLoaded', function () {
    var messageInput = document.getElementById('message');

    // Get the user name and store it to prepend to messages.
    var name = prompt('Enter your name:', '');
    // Set initial focus to message input box.
    messageInput.focus();

    // Do SignalR things!
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/chat", signalR.HttpTransportType.LongPolling)
        .build();

    connection.on("ReceiveMessage", (sender, message) => {
        addMessage(sender, message);
    });

    // On click handler for the "send" button
    document.getElementById('sendmessage').addEventListener('click', function (event) {
        // Send the message somehow?
        connection.invoke("SendMessageAsync", name, messageInput.value);

        // Clear text box and reset focus for next comment.
        messageInput.value = '';
        messageInput.focus();
        event.preventDefault();
    });

    connection.start()
        .then(() => {
            document.getElementById("message").disabled = false;
            document.getElementById("sendmessage").disabled = false;
        });
});
