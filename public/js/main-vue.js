var socket = io('//'+document.location.hostname+':'+document.location.port);

const app = new Vue({
  el: '#chat',
  data: {
    // messages: ["test", "testing"],
    myMessage: '',
    nick: 'nodebot',
    messages: [
      // { nick: "test", text: 'Foo' }
    ],
    sentMessages: []
  },
  methods: {
    newMessage(e) {
      e.preventDefault();
      socket.emit('message', this.myMessage);
      this.sentMessages.push(this.myMessage);
      this.messages.push({ nick: this.nick, text: this.myMessage });
      this.myMessage = '';
    },
    deleteMessages(e) {
      e.preventDefault()
      this.messages = []
    }
  }
})


socket.on('message', function (data) {
  console.log(data);
  app.messages.push(data);
  // $("#chat-log").append(data.nick + ": " + data.text + "\n");
});

socket.on('whois', function (data) {
  console.log(data);
  // $("#chat-log").append("WHOIS " + data.nick + ": " + "\n"
  // 						+ "host: " + data.host + "\n"
  // 						+ "realname: " + data.realname + "\n"
  // 						+ "channels: " + data.channels + "\n"
  // 						+ "idle: " + data.idle + "\n"
  // 						);
});

socket.on('motd', function (data) {
  console.log(data);
  // $("#chat-log").append(data);
});

socket.on('topic', function (data) {
  console.log(data);
  // $("#chat-log").append(data);
});

socket.on('pm', function (data) {
  console.log(data);
  // $("#chat-log").append("PM from " + data.nick + ": " + data.text);
});

socket.on('action', function (data) {
  console.log(data);
  // $("#chat-log").append(data.from + " " + data.text);
});


socket.on('connection', function(socket){
  // socket.on('chat message', function(msg){
  //   socket.emit('chat message', msg);
  // });
});