var irc = require('irc');

var channel = '#testing2';
var connected = false;

var allowedCommands = ["me", "whois", "motd", "topic", "msg"];

exports = module.exports = function(io){
	io.on('connection', function(socket){
		console.log('websocket established');

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

		client.addListener('motd', function(motd) {
		    console.log("motd: ", motd);
		    io.emit("motd", motd);
		});

		client.addListener('names'+channel, function(nicks) {
		    console.log("names: ", nicks);
		    io.emit("names", nicks);
		});

		client.addListener('topic', function(channel, topic, nick, message) {
		    console.log(topic);
		    io.emit("topic", topic);
		});

		client.addListener('notify', function(nick, to, text, message) {
		    console.log(text);
		    io.emit("notify", text);
		});

		client.addListener('join'+channel, function(nick, message) {
		    console.log("joined: ", message);
		    io.emit("join", message);
		});

		client.addListener('part'+channel, function(nick, reason, message) {
		    console.log("part: ", message);
		    io.emit("part", message);
		});

		client.addListener('kick'+channel, function(nick, by, reason, message) {
		    console.log(message);
		    io.emit("kick", message);
		});

		client.addListener('pm', function(nick, text, message) {
		    console.log(message);
		    io.emit("pm", message);
		});

		client.addListener('nick', function(oldnick, newnick, channels, message) {
		    console.log(message);
		    io.emit("nick", message);
		});

		client.addListener('+mode', function(channel, by, mode, argument, message) {
		    console.log(message);
		    io.emit("+mode", message);
		});

		client.addListener('-mode', function(channel, by, mode, argument, message) {
		    console.log(message);
		    io.emit("-mode", message);
		});

		client.addListener('action', function(from, to, text, message) {
		    console.log(message);
		    io.emit("action", message);
		});

		client.addListener('whois', function(info) {
		    console.log("whois: ", info);
		    io.emit("whois", info);
		});

		client.addListener('message', function(nickName, to, text, message) {
			console.log(nickName + ": " + text);
			io.emit("message", {nick: nickName, text: text});
		});

		client.connect(function() {
			console.log("connected to irc")
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
					command = data.substring(1).split(" ");
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