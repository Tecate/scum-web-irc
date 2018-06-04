var irc = require('irc');

var channel = '#general';
var nick = 'nodebot';
var connected = false;

exports = module.exports = function(io){
	io.on('connection', function(socket){
		console.log('a user connected');

		var client = new irc.Client('scum.systems', nick, {
			port: '6697',
			secure: true,
			channels: [channel],
			autoConnect: false
		});

		client.connect(function() {
			client.addListener('error', function(message) {
			    console.log('error: ', message);
			});

			client.addListener('join', function(channelName, nickName, message) {
				if (nickName === client.nick) { // only run when we connect, join fires on all joins
					client.say(channel, "I'm a bot!");
					connected = true;
				}
			});

			client.addListener('message', function(nickName, to, text, message) {
				console.log(nickName + ": " + text);
				io.emit("message", {nick: nickName, text: text});
			});

			socket.on('message', function(data){
				console.log(client.nick + ": " +data);
				client.say(channel, data);
			});

			socket.on('disconnect', function(){
				console.log('user disconnected');
				client.disconnect('peace oot');
			});
		});
	});
}