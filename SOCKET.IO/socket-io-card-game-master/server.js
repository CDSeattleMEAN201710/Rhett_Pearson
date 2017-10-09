var ejs = require('ejs');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);

var engine = require('engine.io');
var io = require('socket.io')(http);

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    // ejs render automatically looks in the views folder
    res.render('index');
});

app.get('/player', function(req, res){
    // ejs render automatically looks in the views folder
    res.render('partials/player',{

    });
});

/////-----------------------
var sockets = {

};
var clients = {

};
var rooms = {

};
/////------------------------
app.get('/room', function(req, res){
    console.log(req.query);

    var room = rooms[req.query.name];

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(room));
});

io.on('connection', function(socket){
    console.log(socket.id+' is connected');
    sockets[socket.id] = socket;
    clients[socket.id] = {
        name : "",
        id : socket.id
    };

    socket.emit('connected', ':)');

    socket.on('disconnect', function(){
        console.log(this.id+' is disconnected');

        var found = false;
        for (var i in rooms) {
            var room = rooms[i];
            for (var j in room.players) {
                var player = room.players[j];
                if (player.id === this.id) {
                    room.players.splice(j, 1);
                    room.announce({
                        what : 'left',
                        startedGame : room.started,
                        player : player,
                        players_count : room.players.length
                    });
                    found = true;
                    break;
                }
            }
            if (room.players.length === 0) delete rooms[i];
            if (found) break;
        }

        delete clients[this.id];
        delete sockets[this.id];
    });

    socket.on('set-player', function(req){
        console.log('set-player', req);
        clients[this.id].name = req.name;
    });

    socket.on('create-room', function(req) {
        var self = this;
        console.log('create-room', req);

        var roomName = req.name;

        rooms[roomName] = {
            name : roomName,
            turn : "",
            started : false, //started playing
            players : [],
            player : function(id) {
                for (var i in this.players){
                    if (this.players[i].id === id) return this.players[i];
                }
                return null;
            },
            announce : function(data, socket) {
                if (socket) {
                    socket.broadcast.to(this.name).emit('announce', data);
                } else {
                    io.sockets.in(this.name).emit('announce',data);
                }
            },
            start : function() {
                this.started = true;
                var p = this.players[0];
                this.turn = {
                    id : p.id,
                    name : p.name
                };
                this.handCardsAndCoins();
                this.announce({what : 'started', turn: this.turn})
            },
            handCardsAndCoins : function() {
                for (var i in this.players) {
                    var player = this.players[i];
                    var card_1 = this.deck.shift();
                    var card_2 = this.deck.shift();
                    player.lost = false;
                    player.coins = 2;
                    player.cards = [
                        {
                            id : "first",
                            flipped : false,
                            type : card_1
                        },
                        {
                            id : "second",
                            flipped : false,
                            type : card_2
                        }
                    ];
                    player.has = function(card) {
                        if (!this.cards[0].flipped && this.cards[0].type === card) {
                            return true;
                        } else if (!this.cards[1].flipped && this.cards[1].type === card) {
                            return true;
                        }
                        return false;
                    };
                    player.flip = function(card) {
                        var flipped;
                        if (!this.cards[0].flipped && (this.cards[0].type === card || this.cards[0].id === card)) {
                            this.cards[0].flipped = true;
                            flipped = [ this.cards[0] ];
                        } else if (!this.cards[1].flipped && (this.cards[1].type === card || this.cards[1].id === card)) {
                            this.cards[1].flipped = true;
                            flipped = [ this.cards[1] ];
                        } else if (card === 'both'){
                            this.cards[0].flipped = true;
                            this.cards[1].flipped = true;
                            flipped = this.cards;
                        }

                        this.lost = this.cards[0].flipped && this.cards[1].flipped;
                        return flipped;
                    };
                    var s = sockets[player.id];
                    s.emit('hand-cards', player.cards);
                }
            }
        };

        rooms[roomName].players.push(clients[self.id]);

        var room = rooms[roomName];

        self.join(req.name, function(err) {
            console.log('error', err);

            if (err) delete rooms[roomName];

            self.emit('created-room', {
                success : err === null,
                name : req.name,
                players_count : room.players.length
            });
        });
    });

    socket.on('join-room', function(req) {
        var self = this;
        console.log('join-room', req);

        var roomName = req.name;

        var room = rooms[roomName];
        if (room && !room.started && room.players.length < 6) {
            var player = req.player;

            room.players.push(clients[self.id]);

            self.join(roomName, function(err) {
                console.log('error', err);

                var view = fs.readFileSync('views/partials/player.ejs', "utf8");
                var views = [];

                if (err === null) {
                    for (var index in room.players) {
                        var player = room.players[index];
                        if (player.id !== self.id) {
                            views.push(ejs.render(view, {
                                id : player.id,
                                name : player.name
                            }));
                        }
                    }
                }

                self.emit('joined-room', {
                    success : err === null,
                    name : roomName,
                    views : views,
                    message : err === null ? '' : 'Something went wrong :(',
                    players_count : room.players.length
                });

                if (err === null) {
                    room.announce({
                        what : 'joined',
                        who : player,
                        view : ejs.render(view, {
                            id : player.id,
                            name : player.name
                        }),
                        players_count : room.players.length
                    }, self);
                }
            });
        } else if (room && room.started) {
            self.emit('joined-room', {
                success : false,
                message : 'The Game Is Ongoing'
            });
        }
    });

    socket.on('message', function(data) {
        console.log('message', data);
        var room = rooms[data.room];
        room.announce({
            what : 'message',
            who : this.id,
            message : data.message
        }, this);
    });

    socket.on('start', function(name) {
        console.log('start game in room', name);
        var room = rooms[name];
        room.start();
    });

    socket.on('player-move', function(data) {
        console.log('player move :', data);

        var room = rooms[data.room];
        if (room.player(this.id).coins >= 10) {
            return;
        }

        var msg = {
            what : 'player-move',
            move : data.move,
            from : clients[this.id].name
        };
        if (data.target) {
            msg.target = clients[data.target].name;
            msg.target_id = clients[data.target].id;
        }
        switch (data.move) {
            case 'assassinate':
            case 'steal':
            case 'duke':
            case 'foreign-aid':
                if (data.move === 'assassinate') {
                    if (room.player(this.id).coins < 3) {
                        return;
                    } else {
                        room.player(this.id).coins -= 3;
                    }
                }
                room.contest = {
                    move : data.move,
                    by : {
                        id : this.id,
                        name : msg.from
                    }
                };
                break;
            default :
                break;
        }
        room.announce(msg, this);
    });

    socket.on('react', function(data) {
        console.log('react', data);
        var room = rooms[data.room];
        var liar = false;
        var lose = false;
        var player;
        switch (data.statement) {
            case 'Call Bluff' :
                switch (room.contest.move) {
                    case "I Have A Contessa":
                        liar = !room.player(room.contest.by.id).has('contessa');
                        lose = 2;
                        break;
                    case 'assassinate':
                        liar = !room.player(room.contest.by.id).has('assassin');
                        lose = 2;
                        break;
                    case "I Have A Captain":
                    case 'steal':
                        liar = !room.player(room.contest.by.id).has('captain');
                        lose = 1;
                        break;
                    case 'foreign-aid':
                    case "I Have A Duke":
                    case 'duke':
                        liar = !room.player(room.contest.by.id).has('duke');
                        lose = 1;
                        break;
                    case "I Have An Ambassador":
                    case 'ambassador':
                        liar = !room.player(room.contest.by.id).has('ambassador');
                        lose = 1;
                        break;
                    default :
                        break;
                }

                player = liar ? room.player(room.contest.by.id) : room.player(this.id);

                if (lose == 2 || (player.cards[0].flipped || player.cards[1].flipped)) {
                    room.announce({
                        type : 'reveal',
                        who : {
                            name : player.name,
                            id : player.id
                        },
                        cards : player.flip('both')
                    })
                } else {
                    sockets[player.id].emit('reveal-card', player.cards);
                }
                delete room.contest;
                break;
            case 'Allow It' :
                player = room.player(this.id);
                switch (room.contest.move) {
                    case 'assassinate':
                        if (player.cards[0].flipped || player.cards[1].flipped) {
                            player.flip('both');
                            room.announce({
                                type : 'reveal',
                                who : {
                                    name : player.name,
                                    id : player.id
                                },
                                choice : false,
                                cards : player.cards
                            })
                        } else {
                            sockets[player.id].emit('reveal-card', player.cards);
                        }
                        break;
                    case 'steal':
                        room.player(room.contest.by.id).coins += 2;
                        room.player(this.id).coins -= 2;
                        break;
                    case 'duke':
                        room.player(room.contest.by.id).coins += 3;
                        break;
                    case 'foreign-aid':
                        room.player(room.contest.by.id).coins += 2;
                        break;
                    default :
                        break;
                }
                room.announce({
                    what : 'allow-move',
                    move : room.contest.move
                }, this);
                delete room.contest;
                break;
            case 'I Back Off':
                player = room.player(this.id);
                room.announce({
                    what : 'back-off',
                    who : {
                        name : player.name,
                        id : player.id
                    }
                }, this);
                delete room.contest;
                break;
            default :
                player = room.player(this.id);
                room.announce({
                    what : 'challenge',
                    who : room.contest.by,
                    by :  {
                        name : player.name,
                        id : player.id
                    },
                    statement : data.statement
                }, this);
                room.contest = {
                    move : data.statement,
                    by :  {
                        name : player.name,
                        id : player.id
                    }
                };
                break;
        }
    });

    //Choose card to reveal
    socket.on('give-up', function(data) {
        console.log('give up card : ', data);
        var room = rooms[data.name];
        room.announce({
            type : 'reveal',
            who : {
                name : room.player(this.id).name,
                id : room.player(this.id).id
            },
            cards : room.player(this.id).flip(data.secondCard ? 'second' : 'first')
        })

    });

    socket.on('error', function(exception) {
        console.log(exception);
    });
});

http.listen(port, function(){
    console.log('listening port :', port);
});
