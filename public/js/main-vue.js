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
      // this.messages.push({ type: 'message', nick: this.nick, text: this.myMessage });
      this.myMessage = '';
    },
    deleteMessages(e) {
      e.preventDefault()
      this.messages = []
    }
  }
})


socket.on('message', function (data) {
  console.log("message", data);
  if (data.pm) {
    data.type = 'pm';
  } else {
    data.type = 'message';
  }
  app.messages.push(data);
  // $("#chat-log").append(data.nick + ": " + data.text + "\n");
});

socket.on('selfMessage', function (data) {
  console.log(data);
  if (data.text.startsWith("\u0001ACTION")) {
    data.type = 'action';
    data.text = data.text.substring(8);
  } else if (data.pm) {
    data.type = 'pm';
  } else {
    data.type = 'message';
  }
  app.messages.push(data);
});

socket.on('whois', function (data) {
  console.log(data);
  data.channels = data.channels.join(', ');
  data.type = 'whois';
  app.messages.push(data);
});

socket.on('motd', function (motd) {
  console.log(motd);
  var data = { type: 'motd', text: motd }
  app.messages.push(data);
});

socket.on('topic', function (data) {
  console.log(data);
  if (data.commandType === "reply") {
    data.type = 'initialTopic';
  } else {
    data.type = 'topic';
  }
  app.messages.push(data);
});

// socket.on('pm', function (data) {
//   console.log("pm ", data);
//   data.type = 'pm';
//   app.messages.push(data);
//   // $("#chat-log").append("PM from " + data.nick + ": " + data.text);
// });

socket.on('join', function (data) {
  console.log(data);
  data.type = 'join';
  app.messages.push(data);
});

socket.on('part', function (data) {
  console.log(data);
  data.type = 'part';
  app.messages.push(data);
});

socket.on('action', function (data) {
  console.log(data);
  data.type = 'action';
  app.messages.push(data);
  // $("#chat-log").append(data.from + " " + data.text);
});

socket.on('error', function (error) {
  console.log(data);
  var data = { type: 'error', text: error }
  app.messages.push(data);
});

socket.on('connection', function(socket){
  // socket.on('chat message', function(msg){
  //   socket.emit('chat message', msg);
  // });
});