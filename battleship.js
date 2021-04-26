var blue = "aliceblue";
var rows = 10;
var cols = 10;
var squareSize = 50;
var userMessage;
var hardModeOn = false;
var hardModeButton;
var gameBoardContainer = document.getElementById("gameboard");
var gameBoardContainerHuman = document.getElementById("gameboardEnnemy");
var drawBox = document.getElementById("gameboard");
var newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", placeShip);
var readyButton = document.getElementById("ready");
var yourPoints = document.getElementById("yourPoints");
var opponentPoints = document.getElementById("opponentPoints");

var mySound = new sound("tap.mp3"); ;
var bgm = new sound("bgm.mp3");
var operaSound = new sound("opera.mp3");
var hitCount = 0;
var computerHitCount = 0;
var orientation = [0,0,0,0,0]; 
var shipImg = [0,0,0,0,0];
var fullShipFound = [0, 0, 0, 0, 0];
var points = [2,3,3,4,5]; //each battleship's length
var pointsArray = [ //each battleship's points according to their length
                    [0,0],
                    [0,0,0],
                    [0,0,0],
                    [0,0,0,0],
                    [0,0,0,0,0]
                ];
//initialize my grid
var square = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				];
//the square is for the div display and storing IDs. the id is stored such as if beginning with 'y' is a yes ship and 'n' for no ship
//for human ID 's' for Safe and 'd' for danger
//human values
var squareHuman = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				]; //coying square
var pointsArrayHuman =[
                    [0,0],
                    [0,0,0],
                    [0,0,0],
                    [0,0,0,0],
                    [0,0,0,0,0]
                ];


window.onload = function() {
    initializeGame();
    placeShip();
    //showNewGameState();
}

function initializeGame(){ 
//i = y (cols)  j = x (rows)
    
    //document.getElementById('bgm').volume = 0.5;
    //bgm.sound.play();
    //bgm.volume = 0.6;
    hardModeButton = document.getElementById('switch');
    hardModeButton.addEventListener('change', function(){
        if(hardModeOn == false){
            hardModeOn = true;
            //console.log('checked');
        }else{
            hardModeOn = false;
            //console.log('notchecked');
        }
    });
    
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            square[i][j] = document.createElement("div");
            //gameBoardContainer.appendChild(square[i][j]);
            var topPosition = j * squareSize;
            var leftPosition = i * squareSize;			
            square[i][j].style.top = topPosition + 'px';
            square[i][j].style.left = leftPosition + 'px';
        }
    }
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) { 
            squareHuman[i][j] = document.createElement("div");
            //gameBoardContainerHuman.appendChild(squareHuman[i][j]);
            var topPosition = j * squareSize;
            var leftPosition = i * squareSize;			
            squareHuman[i][j].style.top = topPosition + 'px';
            squareHuman[i][j].style.left = leftPosition + 'px';
        }
    }
    for(var i=0; i<points.length; i++){
        fullShipFound[i] = document.createElement("div");
        drawBox.appendChild(fullShipFound[i]);
    }
    

}
function placeShip(){
    
    showUser("hide your precious belongings!");
    gameBoardContainer.style.display = 'none';
    gameBoardContainerHuman.style.display = 'block';
    
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {    
            squareHuman[i][j].style.backgroundColor = blue;
            squareHuman[i][j].id = 's' + j + i;
            
        }
    } 
    pointsArrayHuman = [ 
                    [0,0],
                    [0,0,0],
                    [0,0,0],
                    [0,0,0,0],
                    [0,0,0,0,0]
                ];
    var orientationH = [0,0,0,0,0]; 
    //let 0 be horizontal and 1 be vertical 
    
    for(var i=0; i<orientationH.length; i++){
        orientationH[i] = getRandomIntegerLessThan(2);
    }
    
    //randomizing each ship's coordinates
    for(var i=0; i<points.length; i++){
        
        if(orientationH[i] == 0){
            var available = rows - points[i]; //for horizontal
            do{
                var x = getRandomIntegerLessThan(available);
                var y = getRandomIntegerLessThan(cols);
                for(var j=0; j<points[i]; j++){
                    pointsArrayHuman[i][j] = 'd' + (x+j) + y; 
                }
            }while(checkOverlap(pointsArrayHuman[i]) == true); //making sure the generated ship does not overlap existing ones
            for(var j=0; j<points[i]; j++){
                squareHuman[y][x+j].id = 'd' + (x+j) + y;; 
            }
        }else if(orientationH[i] == 1){
            var available = cols - points[i]; //for vertical
            do{
                var x = getRandomIntegerLessThan(rows);
                var y = getRandomIntegerLessThan(available);
                for(var j=0; j<points[i]; j++){
                    pointsArrayHuman[i][j] = 'd' + x + (y+j); 
                }
            }while(checkOverlap(pointsArrayHuman[i]) == true)
            for(var j=0; j<points[i]; j++){
                squareHuman[y+j][x].id = 'd' + x + (y+j);
            }
        }else{
            console.log("error");
        }
    }
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if(squareHuman[i][j].id.charAt(0) == 'd'){
                squareHuman[i][j].style.backgroundColor = 'pink';

            }else{
                squareHuman[i][j].style.backgroundColor = blue;
                squareHuman[i][j].id = 's' + j + i;
            }
            gameBoardContainerHuman.appendChild(squareHuman[i][j]);
        }
    } 
    
    //hide stuff and clear displays from previous rounds
    //newGameButton.style.display='none';
    newGameButton.style.display = 'block';
    newGameButton.innerHTML = 'randomize position';
    readyButton.style.display = 'block';
    readyButton.addEventListener("click", showNewGameState);
    
     for(var i=0; i<points.length; i++){
        fullShipFound[i].style.display = 'none';
         if(shipImg[i]!= 0){
             shipImg[i].style.display = 'none';
         } 
     }

}

function showNewGameState(){
    bgm.sound.play();
    newGameButton.style.display='block';
    newGameButton.innerHTML = 'start new game';
    gameBoardContainerHuman.style.display = 'none';
    gameBoardContainer.style.display = 'block';
    
    
    readyButton.style.display = 'none';
    showUser("expose the other Otaku!");
    yourPoints.textContent = "your points: " +hitCount;
    opponentPoints.textContent = "opponent points: " +computerHitCount;
    
    //set all the squares and points to neutral
    hitCount = 0;
    computerHitCount = 0;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {    
            square[i][j].style.backgroundColor = blue;
            square[i][j].id = 'n' + j + i;
            
        }
    } 
    pointsArray = [ 
                    [0,0],
                    [0,0,0],
                    [0,0,0],
                    [0,0,0,0],
                    [0,0,0,0,0]
                ];
    
    orientation = [0,0,0,0,0]; 
    //let 0 be horizontal and 1 be vertical 
    
    for(var i=0; i<orientation.length; i++){
        orientation[i] = getRandomIntegerLessThan(2);
    }
    
    //randomizing each ship's coordinates
    for(var i=0; i<points.length; i++){
        
        if(orientation[i] == 0){
            var available = rows - points[i]; //for horizontal
            do{
                var x = getRandomIntegerLessThan(available);
                var y = getRandomIntegerLessThan(cols);
                for(var j=0; j<points[i]; j++){
                    pointsArray[i][j] = 'y' + (x+j) + y; 
                }
            }while(checkOverlap(pointsArray[i]) == true); //making sure the generated ship does not overlap existing ones
            for(var j=0; j<points[i]; j++){
                square[y][x+j].id = 'y' + (x+j) + y;; 
            }
        }else if(orientation[i] == 1){
            var available = cols - points[i]; //for vertical
            do{
                var x = getRandomIntegerLessThan(rows);
                var y = getRandomIntegerLessThan(available);
                for(var j=0; j<points[i]; j++){
                    pointsArray[i][j] = 'y' + x + (y+j); 
                }
            }while(checkOverlap(pointsArray[i]) == true)
            for(var j=0; j<points[i]; j++){
                square[y+j][x].id = 'y' + x + (y+j);
            }
        }else{
            console.log("error");
        }
    }
    
    
    //append the squares to the boards to show
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if(square[i][j].id.charAt(0) == 'y'){
                //square[i][j].style.backgroundColor = "red";  
            }
            gameBoardContainer.appendChild(square[i][j]);
            gameBoardContainerHuman.appendChild(squareHuman[i][j]);
        }
    } 
    gameplay();
}

function checkOverlap(array){

    for(var k =0; k<array.length; k++){
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                if(array[k] == square[i][j].id || array[k] == squareHuman[i][j].id){
                    return true; //if the id of square[i][j] is the same than the array which means it's set to y+j+i, return true for overlap
                }
            }
        }
    }
    return false;
}

function gameplay(){
    console.log(gameBoardContainer);
    humanRound();
    //computerRound();
//    setTimeout(function(){
//        //console.log("I am the third log after 5 seconds");
//        //humanRound();
//        computerRound();
//    },5000);
    //}
    
}

var next= false;
//gameBoardContainer.onclick = function(){
//    next = true;
//}

function humanRound(){
    gameBoardContainerHuman.style.display = 'none';
    gameBoardContainer.style.display = 'block';
    var rounds = function(){
            var clicked = event.target.id;
                if(isHit(clicked)){
                    //mySound.sound.play();
                    event.target.style.backgroundColor = "red";
                    hitCount ++;
                    var shipNum = checkWholeShip();
                    if(shipNum != -1){
                        playEffect(shipImg[shipNum]);
                        
                        setTimeout(function(){
                            shipImg[shipNum].style.scale = '100';
                            shining.style.display = 'none';
                            showUser("expose the other otaku!");
                            yourPoints.textContent = "your points: " +hitCount;
                            
    
                            
                            largeImgCopy.style.display = 'none';
                            showHumanGameboard();
                        }, 2000);
                    }else{
                        yourPoints.textContent = "your points: " +hitCount;
                        opponentPoints.textContent = "opponent points: " +computerHitCount;
    
                        setTimeout(showHumanGameboard, 200);
                    }

                }else if(event.target.style.backgroundColor == blue){
                    //mySound.sound.play();
                    
                    event.target.style.backgroundColor = "grey";
                     setTimeout(showHumanGameboard, 200);
                    //only change colour if the square is neutral
                }

            }

        gameBoardContainer.addEventListener("click", rounds);
    
    if(hitCount == 17){
        showUser("you have exposed the otaku!");
         shining.style.pointerEvents = 'all';
         shining.style.display = 'block';
        gameBoardContainer.removeEventListener("click", rounds);
    }
    if(computerHitCount == 17){
        showUser("you have been exposed! ");
        shining.style.pointerEvents = 'all';
        shining.style.display = 'block';
    }
    
}



function checkWholeShip(){
    
    for(var i=0; i<points.length; i++){
        var counter = 0;
        for(var j=0; j<points[i]; j++){
            if(document.getElementById(pointsArray[i][j]).style.backgroundColor == "red"){
                counter ++;
                if(counter == points[i] && fullShipFound[i].style.display=='none'){
                    //drawing a rectangle out for the found ship then put a picture on top
                    var firstPoint = document.getElementById(pointsArray[i][0]).id;
                    var lastPoint = document.getElementById(pointsArray[i][j]).id;
                    
                    
                    var topPosition = firstPoint[1]*squareSize;
                    var leftPosition = firstPoint[2]* squareSize;	
                    var height = (lastPoint[1]-firstPoint[1]+1 )*squareSize;
                    var width = (lastPoint[2]-firstPoint[2]+1)*squareSize;
                    fullShipFound[i].style.position = 'absolute';
                    fullShipFound[i].style.top = topPosition + 'px';
                    fullShipFound[i].style.left = leftPosition + 'px';
                    fullShipFound[i].style.height = height-2 + 'px'
                    fullShipFound[i].style.width = width-2 + 'px';
                    //-2 because the boarder
                    fullShipFound[i].style.border = '2px solid black';
                    fullShipFound[i].style.display = 'block';
                    fullShipFound[i].style.zIndex = +1;
                    fullShipFound[i].style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    fullShipFound[i].style.pointerEvents = 'none';
                    fullShipFound[i].style.borderRadius = '0';
                    var shipNum;
                    if(i == 0){
                        shipNum = 'ship1';
                    }else if(i == 1){
                        shipNum = 'ship2';
                    }else if(i == 2){
                        shipNum = 'ship3';
                    }else if(i == 3){
                        shipNum = 'ship4';
                    }else if(i == 4){
                        shipNum = 'ship5';
                    }

                    shipImg[i] = document.getElementById(shipNum);

                    shipImg[i].style.display = 'block';
                    shipImg[i].style.top = topPosition + 'px';
                    shipImg[i].style.left = leftPosition + 'px';
                    //shipImg[i].style.zIndex = +1;
                    if(orientation[i] == 0){
                        shipImg[i].style.transform = 'none';
                    }
                    operaSound.sound.play();
                    
                    return i;
                }              
            }
        }        
    }
    return -1;
}

var degrees = 0;
var shining = document.getElementById('shining');
var largeImgCopy;
function playEffect(image){
    shining.style.display = 'block';
    
    largeImgCopy = document.createElement('img');
    largeImgCopy.src = image.src;
    gameBoardContainer.appendChild(largeImgCopy);
    if(image.id == 'ship1'){
        showUser("An embarrasing doujinshi found!");
    }if(image.id == 'ship2'){
        showUser("An embarrasing paimon figurine found!");
    }if(image.id == 'ship3'){
        showUser("Some embarrasing clothing merch found!");
    }if(image.id == 'ship4'){
        showUser("An embarrasing Hisoka figurine found!");
    }if(image.id == 'ship5'){
        showUser("A bookshelf of embarrasing merch found!");
    }
//    largeImgCopy.style.transform = 'scale(2)';
//    largeImgCopy.style.zIndex = '4';
//    largeImgCopy.style.margin = 'auto';
//    largeImgCopy.style.opacity = '100%';
//    largeImgCopy.style.position = 'absolute';
//    largeImgCopy.style.top = '0';
//    largeImgCopy.style.left = '0';
//    largeImgCopy.style.height = "500px";
    largeImgCopy.classList = 'enlarge';
    spinAnimation();

}

function spinAnimation(){
    setTimeout(spinAnimation, 20);
    shining.style.transform = "rotate(" +degrees +"deg)";
    degrees++;
    if(degrees >= 360){
        degrees = 1;
    }
}

//function checking if hit
function isHit(string){
    if(string[0] == 'y' && document.getElementById(string).style.backgroundColor == blue){
        return true;
    } 
    //let it also be used for the computer 
    if(string[0] == 'd' && document.getElementById(string).style.backgroundColor == 'pink'){
        return true;
    } 
    return false;
}


function showHumanGameboard(){
    gameBoardContainerHuman.style.display = 'block';
    gameBoardContainer.style.display = 'none';
    setTimeout(computerRound, 500);
}
var firstHitSpot = null;
var strike = null;
var lastMoveHit = null;

function computerRound(){

    gameBoardContainerHuman.style.display = 'block';
    gameBoardContainer.style.display = 'none';
    var randomX; 
    var randomY;
    
    
    do{
        if(!hardModeOn){
            randomX = getRandomIntegerLessThan(10);
            randomY = getRandomIntegerLessThan(10);
        }else{
            var end1 = true;
            var end2 = true;
            //I want to chose the numbers such as each even row to have even numbers and each odd row to have odd numbers so that it looks like chess grid and minimizes searching range
            var randomIndex = getRandomIntegerLessThan(50)*2;
            //odd rows
            if((randomIndex%20)>=10){
                randomIndex += 1;
            }
            //if i get a 54 as random index, I want a 5 for x value and 4 for y value.
            randomX = Math.floor(randomIndex/10); 
            randomY = randomIndex%10;
            
            if(firstHitSpot!=null){
                
                if(strike == 'vertical'){
                    console.log('verti');
                    randomX = firstHitSpot[1];
                    randomY = firstHitSpot[0];
                    var randomIndex = getRandomIntegerLessThan(2);
                    if(randomIndex == 0){
                        while(!computerWholeShipFound(firstHitSpot) && squareHuman[randomY][randomX].style.backgroundColor == 'red'){
                            randomX +=1;
                            //keep going until unreached square
                            if(squareHuman[randomY][randomX] === undefined || squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
                                randomIndex = 1;
                                end1 = false;
                                break;
                            }
                        }
                    }
                    
                    if(randomIndex == 1){
                        while(!computerWholeShipFound(firstHitSpot) && squareHuman[randomY][randomX].style.backgroundColor == 'red'){
                            randomX -=1;
                            //keep going until unreached square
                            if(squareHuman[randomY][randomX] === undefined || squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
                                end2 = false;
                                break;
                            }
                        }
                    }
                    if(!end1 && !end2){
                        strike = null;
                        console.log('no strike');
                        
                    }
                    
 //previous method i was trying but not working well                
//                    if(typeof squareHuman[randomY][randomX+1] != 'undefined' && lastMoveHit != null && squareHuman[randomY][randomX+1].style.backgroundColor != 'red'){
//                        randomX = lastMoveHit[1];
//                        randomY = lastMoveHit[0];
//                        randomX += 1;
//                        console.log('verti1');
//                    }else{
//                        randomX = firstHitSpot[1]-1;
//                        randomY = firstHitSpot[0];
//                        
//                        if(squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
//                            strike = null;
//                            firstHitSpot = [randomY][randomX-1];
//                        }else{
//                            firstHitSpot = [randomY][randomX];
//                        }
//                        console.log('verti2');
//                    }
//                    
                }else if(strike == 'horizontal'){
                    console.log('hori');
                    randomX = firstHitSpot[1];
                    randomY = firstHitSpot[0];
                    var randomIndex = getRandomIntegerLessThan(2);
                    if(randomIndex == 0){
                        while(!computerWholeShipFound(firstHitSpot) && squareHuman[randomY][randomX].style.backgroundColor == 'red'){
                            randomY += 1;
                            //keep going until unreached square
                            if(squareHuman[randomY][randomX] === undefined || squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
                                randomIndex = 1;
                                end1 = false;
                                break;
                            }
                        }
                    }
                    if(randomIndex == 1){
                        while(!computerWholeShipFound(firstHitSpot) && squareHuman[randomY][randomX].style.backgroundColor == 'red'){
                            randomY -= 1;
                            //keep going until unreached square
                            if(squareHuman[randomY][randomX] === undefined || squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
                                end2 = false;
                                break;
                            }
                        }
                    }
                    if(!end1 && !end2){
                        strike = null;
                        console.log('no strike');
                        
                    }
                }
                if(strike == null){
                    randomY = firstHitSpot[0];
                    randomX = firstHitSpot[1];
                    var randomIndex = getRandomIntegerLessThan(4);
                    if(randomIndex == 0){
                        randomY += 1; //go down
                    }if(randomIndex == 1){
                        randomY -= 1; //go up
                    }if(randomIndex == 2){
                        randomX += 1; //go right 
                    }if(randomIndex == 3){
                        randomX -= 1; //go left
                    }
//                    if(square[randomY][randomX] !== undefined && square[randomY][randomX].style.backgroundColor == 'red'){
//                        firstHitSpot;
//                    }
                    //console.log(firstHitSpot, lastMoveHit, randomY, randomX);
                }
                    
                    
//                    if(squareHuman[randomY+1][randomX] === undefined && lastMoveHit != null && squareHuman[randomY+1][randomX].style.backgroundColor != 'red'){ 
//                        randomX = lastMoveHit[1];
//                        randomY = lastMoveHit[0];
//                        randomY += 1;
//                        console.log('hori1');
//                        
//                    }else{
//                        randomX = firstHitSpot[1];
//                        randomY = firstHitSpot[0]-1;
//                        if(squareHuman[randomY][randomX].style.backgroundColor == 'grey'){
//                            strike = null;
//                            firstHitSpot = [randomY-1][randomX];
//                        }else{
//                            firstHitSpot = [randomY][randomX];
//                        }
//                        console.log('hori2');
//                    }
                    
            }
            
        }
//This undefined does not work sometimes it all depends on luck if my computer is smart or not 
    }while(squareHuman[randomY][randomX] === undefined || squareHuman[randomY][randomX].style.backgroundColor == 'red' || squareHuman[randomY][randomX].style.backgroundColor == 'grey');

    var hitPlace = squareHuman[randomY][randomX];
    mySound.sound.play();
    if(isHit(hitPlace.id)){
        computerHitCount ++;
        opponentPoints.textContent = "opponent points: " +computerHitCount;
        
        hitPlace.style.backgroundColor = 'red';
        
        if(lastMoveHit == null && firstHitSpot == null && strike == null){ //only count firstHitSpot if no previous hits
            firstHitSpot = [randomY, randomX];
        }
       
        lastMoveHit = [randomY, randomX];
        
        if(lastMoveHit != null && firstHitSpot != null && strike == null){
            console.log(lastMoveHit, firstHitSpot);
            if(firstHitSpot[0] - lastMoveHit[0] == 1 || firstHitSpot[0] - lastMoveHit[0] == -1){
                strike = 'horizontal';
                console.log('hori strike');
            }
            if(firstHitSpot[1] - lastMoveHit[1] == 1 || firstHitSpot[1] - lastMoveHit[1] == -1){
                strike = 'vertical';
                console.log('verti strike');
            }
        }
//        if(lastMoveHit == null && strike != null){
//            
//            
//        }
    }else{
        //not hit
        hitPlace.style.backgroundColor = 'grey';
        lastMoveHit = null;
    }
    
    if (computerWholeShipFound(firstHitSpot)){
        firstHitSpot = null;
        strike = null;
        console.log('cleared');
    }

    setTimeout(humanRound, 1000);
}

function computerWholeShipFound(index){
    if(index!=null){
        var currentSquare = 'd'+index[1]+index[0];
        
    }else{
        return false;
    }
    
    var counter = 0;
    var currentShip;
    for(var i=0; i<5; i++){
        for(var j=0; j<points[i]; j++){
            if(pointsArrayHuman[i][j] == currentSquare){
                console.log(pointsArrayHuman[i][j]);
                currentShip = i; //find which ship we're on
                break;
            }
        }
    }
    for(var i=0; i<points[currentShip]; i++){
        if(document.getElementById(pointsArrayHuman[currentShip][i]).style.backgroundColor == "red"){
            counter++;
            console.log(counter);
        }
    }
    if(counter == points[currentShip]){
       return true;
    }else {
        return false;
    }

}

function showUser(message){
    var userMessage = document.getElementById("userMessage");
    userMessage.textContent = message;
}

function getRandomIntegerLessThan(value) {
    return Math.floor(Math.random() * value);
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}