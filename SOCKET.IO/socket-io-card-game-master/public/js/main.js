var player = {
    id : "",
    room : "",
    name : randomName(1)
};

$('#game-page').hide();
//$('#initial-page').hide();

function switchToGamePage(complete) {
    $( "#initial-page" ).fadeOut( "slow", function() {
        $('#initial-page').hide();
        $('#game-page').fadeIn("slow", function() {
            if (complete) {
                complete();
            }
        });
    });
}

var socket = io();

$('#player-name').val("Connecting ...");

$("#start").click(function(){
    socket.emit('start', player.room);
});

socket.on('connected', function(data) {
    console.log("connected", data);
    console.log("this", this.id);
    player.id = this.id;

    socket.emit('set-player', player);

    var pn = $('#player-name');

    pn.val(player.name);
    pn.keyup(function(event){
        if(event.keyCode == 13) {
            player.name = $(this).val();
            socket.emit('set-player', player);
        }
    });

    toastr.success(player.name+'!', 'You are Connected As');
});

socket.on('announce', function(data){
    console.log("announce ",data.what," : ", data);
    var pc = $('#players-count');
    switch (data.what) {
        case 'joined' :
            pc.html("Players : "+data.players_count);
            $("#players").append(data.view);
            break;
        case 'left' :
            pc.html("Players : "+data.players_count);
            swal({
                title: ":(",
                text: data.player.name+" left the chat!",
                timer: 2000,
                showConfirmButton: false
            });
        case 'message' :
            handleMessage(data.who, data.message);
            break;
        default :
            break;
    }
});

socket.on('joined-room', function(data){
    console.log("joined-room", data);
    if (data.success) {
        switchToGamePage(function(){

        });
        player.room = data.name;

        $('#players-count').html("Players : "+data.players_count);
        for (var idx in data.views) {
            $("#players").append(data.views[idx]);
        }
    } else {
        toastr.error(data.message, 'Failed To Join!');
    }
});
//toastr.success('Created Room '+data.name+'!', 'Success!');

socket.on('created-room', function(data){
    console.log("created-room", data);
    if (data.success) {
        switchToGamePage(function(){
            swal({
                title: "Okay Time To Chat!",
                text: "Invite People To Room "+player.room,
                showConfirmButton: true
            });
        });

        player.room = data.name;

        $('#players-count').html("Players : "+data.players_count);
    } else {
        toastr.error('Failed To Create Room :(', 'Error!');
    }
});

/////

function perform(move, target) {
    console.log('perform : ', move, target);
    socket.emit('player-move', {move: move, room: player.room, target: target});
}

function react(statement) {
    console.log('react : ', statement);
    socket.emit('react', {statement: statement, room: player.room});
}

/////

$('#start-game-button').click(function() {
    console.log("start");
    socket.emit('start', player.room);
});

$('#create-room').click(function() {
    var name = $('#room-name').val();
    console.log("create-room", name );
    socket.emit('create-room', {name: name, player: player});
});

$('#join-room').click(function(){
    var name = $('#room-name').val();
    console.log("join-room", name);
    socket.emit('join-room', {name: name, player: player});
});
