var socket = io('//'+document.location.hostname+':'+document.location.port);

$(document).ready(function(){
	$("#input").hide();
   $('#input').bind("enterKey",function(e){
	   socket.emit('message', $("#input").val());
	   $("#chat-log").append($("#input").val() + "\n");
	   $("#input").val("");
   });
   $('#input').keyup(function(e){
     if(e.keyCode == 13)
     {
        $(this).trigger("enterKey");
     }
   });

   $('#nick').bind("enterKey",function(e){
	   socket.emit('nick', $("#nick").val());
	   $("#nick").hide();
	   $("#input").show();
   });
   $('#nick').keyup(function(e){
     if(e.keyCode == 13) { $(this).trigger("enterKey"); }
   });

});

socket.on('message', function (data) {
  console.log(data);
  $("#chat-log").append(data.nick + ": " + data.text + "\n");
});

socket.on('connection', function(socket){
  // socket.on('chat message', function(msg){
  //   socket.emit('chat message', msg);
  // });
});