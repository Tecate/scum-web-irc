var irc = require('irc');

var channel = '#testing';
var connected = false;

exports = module.exports = function(io){
	io.on('connection', function(socket){
		console.log('a user connected');

		var client = new irc.Client('scum.systems', 'nodebot', {
			port: '6697',
			secure: true,
			channels: [channel],
			autoConnect: false
		});

		// client.addListener('raw', function(message) {
		//     console.log(message);
		// });

		client.addListener('error', function(message) {
		    console.log('error: ', message);
		});

		client.addListener('whois', function(message) {
		    console.log(message);
		    io.emit("whois", message);
		});

		client.addListener('message', function(nickName, to, text, message) {
			console.log(nickName + ": " + text);
			io.emit("message", {nick: nickName, text: text});
		});

		client.connect(function() {
			client.join(channel, function(){
				client.say(channel, "I'm a bot!");
				connected = true;
			});

			socket.on('nick', function(data){
				client.send('nick', data);
			});

			socket.on('message', function(data){
				console.log(client.nick + ": " + data);
				if (data.substring(0,1) === '/') {
					command = data.substring(1);
					command = command.split(" ");
					console.log(command);
					if (allowedCommands.includes(command[0])) {
						client.send(...command);
					}
				} else {
					client.say(channel, data);
				}
			});

			socket.on('disconnect', function(){
				console.log('user disconnected');
				client.disconnect('peace oot');
			});
		});
	});
}