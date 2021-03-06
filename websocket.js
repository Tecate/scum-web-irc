var irc = require('irc');

var channel = '#testing3';
var connected = false;

var allowedCommands = ["me", "whois", "motd", "topic", "msg", "nick", "names"];

exports = module.exports = function(io){
	io.on('connection', function(socket){
		console.log('websocket established');

		var remoteAddress = socket.request.connection.remoteAddress;

		var client = new irc.Client('scum.systems', 'nodebot', {
			userName: "test", // should be remoteAddress
			realName: 'nodebot',
			port: '6697',
			secure: true,
			channels: [channel],
			autoConnect: false
		});

		// client.addListener('raw', function(message) {
		//     console.log(message);
		// });

		// good clientside
		client.addListener('error', function(data) {
		    console.log('error: ', data);
		    io.emit("error", data.args[2]);
		});

		// good clientside
		client.addListener('motd', function(data) {
		    console.log("motd: ", data);
		    io.emit("motd", data);
		});

		client.addListener('names'+channel, function(data) {
		    console.log("names: ", data);
		    io.emit("names", data);
		});

		client.addListener('topic', function(channel, topic, nick, message) {
		    console.log("topic: ", message);
		    message.topic = topic;
		    io.emit("topic", message);
		});

		client.addListener('notify', function(nick, to, text, message) {
		    console.log("notify: ", message);
		    io.emit("notify", text);
		});

		// good clientside
		client.addListener('join'+channel, function(nick, message) {
		    console.log("joined: ", message);
		    io.emit("join", message);
		});

		// good clientside
		client.addListener('part'+channel, function(nick, reason, message) {
		    console.log("part: ", message);
		    io.emit("part", message);
		});

		client.addListener('kick'+channel, function(nick, by, reason, message) {
		    console.log("kick: ", message);
		    io.emit("kick", message);
		});

		// good clientside
		// client.addListener('pm', function(nick, text, message) {
		//     console.log("pm: ", message);
		//     io.emit("pm", { nick: nick, text: text });
		// });

		client.addListener('nick', function(oldnick, newnick, channels, message) {
		    console.log("nick: ", message);
		    io.emit("nick", message);
		});

		client.addListener('+mode', function(channel, by, mode, argument, message) {
		    console.log("+mode: ", message);
		    io.emit("+mode", message);
		});

		client.addListener('-mode', function(channel, by, mode, argument, message) {
		    console.log("-mode: ", message);
		    io.emit("-mode", message);
		});

		// good clientside
		client.addListener('action', function(nick, to, text, message) {
		    console.log("action: ", message);
		    io.emit("action", { nick: nick, text: text });
		});

		// good clientside
		// whois sends on connect but we don't want to send first whois event
		var whoisCount = 0;
		client.addListener('whois', function(data) {
		    console.log("whois: ", data);
		    if (whoisCount > 0) { io.emit("whois", data); }
		    whoisCount++;
		});

		// good clientside
		client.addListener('selfMessage', function(to, text) {
			console.log("selfMessage " + to + ": " + text);
			if (to != channel) {
				io.emit("selfMessage", {from: client.nick, to: to, text: text, pm: true});
			} else {
				io.emit("selfMessage", {nick: client.nick, to: to, text: text, pm: false});
			}
		});

		// good clientside
		client.addListener('message', function(nickName, to, text, message) {
			// console.log(nickName + ": " + text);
			console.log("message " + message.command);
			if (message.args[0] === client.nick) {
				io.emit("message", {from: nickName, to: client.nick, text: text, pm: true });
			} else {
				io.emit("message", {nick: nickName, text: text, pm: false });
			}
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
						if (command[0] === "me") {
							client.action(channel, command.slice(1, command.length).join(" "));
						} else if (command[0] === "topic") {
							console.log(client.chans[channel].topic);
							io.emit('topic', client.chans[channel].topic);
						} else if (command[0] === "nick") {
							client.send('nick', command[1]);
						} else if (command[0] === "msg") {
							client.say(command[1], command.slice(2, command.length).join(" "));
						} else if (command[0] === "names") {
							console.log("command names");
							client.send('names #testing3');
						} else {
							client.send(...command);
						}
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