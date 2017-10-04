class Deck{
  constructor(){
    this.deck = [];
    this.count = 51;
    this.createDeck = function() {
      for(let i = 14; i < 18; i++){
        for (let j = 1; j < 14; j++) {
          this.deck.push([i, j])
        }
      }
      return this.deck;
    }

  }
}

Deck.prototype.shuffle = function () {
  var currentIndex = this.deck.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = this.deck[currentIndex];
    this.deck[currentIndex] = this.deck[randomIndex];
    this.deck[randomIndex] = temporaryValue;
  }
  // console.log(this.deck.length);
  return this.deck;
}

Deck.prototype.deal = function () {
  // let num = Math.floor(Math.random() * (this.count));
  // this.count = this.count - 1;
  // const card = this.deck[num];
  // this.deck.splice(num, 1);
  // // console.log(this.count);
  // return card;
  return this.deck.pop();
}

Deck.prototype.reset = function () {
  this.deck = [];
  this.count = 51;
  this.createDeck();
}

class Player extends Deck {
  constructor(name){
    super();
    this.name = name;
    this.hand = [];
    let deal = super.deal();

    this.createHand = function() {
      console.log(deal);
      this.hand.push(deal);
      console.log(this.hand);
    }
  }
}

const deck1 = new Deck();

deck1.createDeck();
deck1.shuffle();
// deck1.deal();
deck1.reset();
console.log(deck1.deck);
player1 = new Player('Jerry');
player1.createHand();
