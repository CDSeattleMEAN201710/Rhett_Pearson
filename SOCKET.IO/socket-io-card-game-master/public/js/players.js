/**
 * Created by kayr1m on 15-08-21.
 */

$("#message-input").keyup(function(event){
    if(event.keyCode == 13) {
        var msg = $(this).val();
        var mid = Math.floor(Math.random() * 999999999999);
        $("#my-messenger").append('<div id="my-msg-'+mid+'" class="message my-message message-animate">'+msg+'</div>');
        socket.emit('message', {message : msg, room: player.room});
        $(this).val('');

        var intervalID = setInterval(function() {
            $('#my-msg-'+mid).remove();
            clearInterval(intervalID);
        }, 6000);
    }
});

function handleMessage(from, message) {
    console.log('handleMessage : ', from, message);

    var mid = Math.floor(Math.random() * 999999999999);
    $('#player-'+from).append('<div id="msg-'+mid+from+'" class="message opponent-message message-animate">'+message+'</div>');
    var intervalID = setInterval(function() {
        $('#msg-'+mid+from).remove();
        clearInterval(intervalID);
    }, 6000);
}