To start the server:
--------------------
node server.js

VSCode Extensions for development:
----------------------------------
- vscode-refresh-html: Servers a HTML page from a available port and refreshes the page automatically on changes
Usage:
Open Folder
Press Shift+Ctrl+P
Pick Reload HTML: Start

 Important Socket functions:
---------------------------
- socket.emit = Generate/Throw socket event
- socket.on = Catch the socket event
- socket.broadcast.emit = All clients except the sender client will get the message(socket event)