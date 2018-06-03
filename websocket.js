var irc = require('irc');

var channel = '#general';
var nick = 'nodebot';

var client = new irc.Client('scum.systems', nick, {
	port: '6697',
	secure: true,
	channels: [channel],
	autoConnect: false
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.addListener('join', function(channelName, nickName, message) {
	if (nickName === nick) { // only run when we connect, join fires on all joins
		client.say(channel, "I'm a bot!");
	}
});

exports = module.exports = function(io){
	io.on('connection', function(socket){
		console.log('a user connected');
		client.connect(function() {

		});

		socket.on('disconnect', function(){
			console.log('user disconnected');
			client.disconnect('peace oot')
		});
	});
}