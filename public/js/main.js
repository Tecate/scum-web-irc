var socket = io('//'+document.location.hostname+':'+document.location.port);

const app = new Vue({
  el: '#chat',
  data: {
    messages: [],
    myMessage: '',
    number: undefined
  },
  methods: {
    newMessage(e) {
      e.preventDefault();
      
      this.messages.push(this.myMessage);
      socket.emit('message', this.myMessage);
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
  app.messages.push(data.text);
});

socket.on('connection', function(socket){
  socket.on('chat message', function(msg){
    socket.emit('chat message', msg);
  });
});