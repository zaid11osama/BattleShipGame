var view={

     /* this method takes a string message and displays it  
    in the message display area*/
    displayMessage:function(message){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML=message;
    },
    //display hit on the board
    displayHit:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","hit");
        
    },
    //display miss on the board
    displayMiss:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","miss");

    }
} 

var model ={

    //The size of the grid for the board.
    boardSize: 7,

    //The number of ships in the game.
    numShips: 3,

    // The number of locations in each ship.
    shipLength: 3,

    //how manu ships have been sunk
    shipsSunk: 0,
    generateShipLocations: function() {

        var locations;
        for(let i=0 ;i<this.numShips ;i++){

            do{
                locations = this.generateShip();
            }while (this.collision(locations));
            this.ships[i].locations=locations
        }
    },
    generateShip: function(){

        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if(direction === 1){//horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

        }
        else{//vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);

        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++){

            if (direction === 1) {
                newShipLocations.push(row+""+(col+i));

            }
            else{
                newShipLocations.push((row+i)+""+col);

            }
        }
        return newShipLocations;

    },
    collision:function(locations){
        for(let i=0 ;i<this.numShips ;i++){
            var ship = model.ships[i];
                for(let j =0 ;j<locations.length ;j++){

                    if(ship.locations.indexOf(locations[j]) >= 0)
                        return true;
                }
        }
        return false;

    },
    //I have 3 ships each ship has 3 locations 
    ships:[{locations:[0,0,0] , hits:["","",""]},
           {locations:[0,0,0] , hits:["","",""]},
           {locations:[0,0,0] , hits:["","",""]}
          ],
    
    fire : function(guess){
        for(let i = 0 ;i < this.numShips ;i++){
            //a single ship
            var ship = this.ships[i];
            //location array for a single ship
            var locations = ship.locations;
            //index of the guessed location
            var index = locations.indexOf(guess);//return here

            if(index >= 0 && ship.hits[index] !=="hit"){//return back here
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT !!");
                if(this.isSunk(ship)){
                    view.displayMessage("you sank my battleship !!!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
            view.displayMiss(guess);
            view.displayMessage("You Missed : - (");
            return false;

    },

    isSunk : function(ship){

        if(ship.hits.includes(""))//return here
            return false;
        return true;
    }
}


function parseGuess(guess){
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess.length!==2 || guess === null){
        alert("Oops, please enter a letter and a number on the board.");
    }
    else{
        firstChar = guess[0].toUpperCase();
        var row = alphabet.indexOf(firstChar); 
        var column = guess[1];
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        }
        else if (row < 0 || row >= model.boardSize ||column < 0 || column >= model.boardSize){
            alert("Oops, that's off the board!");
        }
        else{
            return row + column;
        }

    }
    return null;
  }




var controller = {
    guesses: 0,

   

    processGuess: function(guess) {
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);

            if(hit && model.numShips === model.shipsSunk){
                view.displayMessage("You sank all my battleships, in " + 
                this.guesses + " guesses");
            }
        }
    }

  };

function init(){

    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    var guessInput = document.getElementById("guessInput");
   guessInput.onkeypress = handleKeyPress;

   model.generateShipLocations();

}

function handleFireButton() {
   var guessInput = document.getElementById("guessInput");
   var guess = guessInput.value;
   controller.processGuess(guess);
   guessInput.value="";
  }

  function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
       fireButton.click();
       return false;
    }
  }
  window.onload=init;

  console.log(model.generateShip());
//model













