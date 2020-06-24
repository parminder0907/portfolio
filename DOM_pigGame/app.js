/*
GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

//PIG Game

var scores, roundScores, activePlayer, dice;
init();

//get a randon dice number using math functions
//dice = Math.floor(Math.random() * 6) + 1;
//console.log(dice)

//Math.random()  // provide a random no between 0 to 1
//Math.floor(x)  // remove the decimal part

//setters - set a value to a html element
//document.querySelector('#current-0').textContent = dice
//document.querySelector('#current-1').innerHTML = '<b>'+dice+'</b>'

//getters - get a value from a html element
//var player2Score = document.querySelector('#score-1').textContent
//console.log(player2Score)

//To manipulate CSS property, use 'style.<property_to_change>' in the query selector


/** 
 * 
//Anonymous function - if not used anywhere else
document.querySelector('.btn-roll').addEventListener('click', function() {
    //do something
});


//Defined function - if we need to use an event anywhere else
function btn() {
    //do something
}
document.querySelector('.btn-roll').addEventListener('click', btn);
*/



//Add event listener to ROLL DICE button
document.querySelector('.btn-roll').addEventListener('click', function() {
    //1.Generate random number
    var dice = Math.floor(Math.random() * 6) + 1;

    //2.Display the result
    var diceDOM = document.querySelector('.dice')
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-'+dice+'.png'

    //3.Update the current score if number is not 1
    if (dice > 1) {
        //Add number to current
        roundScore += dice
        //console.log(roundScore)
        //console.log(activePlayer)
        document.getElementById('current-'+activePlayer).textContent = roundScore

    }
    else {
        //Next player 
        roundScore = 0
        document.getElementById('current-'+activePlayer).textContent = roundScore
        activePlayer == 0 ? activePlayer = 1 : activePlayer = 0;
        //document.querySelector('.player-0-panel').classList.remove('active');
        //document.querySelector('.player-1-panel').classList.add('active');
        document.querySelector('.player-0-panel').classList.toggle('active');   //toggle will add class if it is not there and vice versa
        document.querySelector('.player-1-panel').classList.toggle('active');  
        document.querySelector('.dice').style.display = 'none'
        console.log(activePlayer)
    } 
});

document.querySelector('.btn-hold').addEventListener('click', function() {
        
        scores[activePlayer] += Number(document.getElementById('current-'+activePlayer).textContent)
        //console.log(scores)
        document.getElementById('current-'+activePlayer).textContent = 0
        roundScore = 0
        document.getElementById('score-'+activePlayer).textContent = scores[activePlayer]
        if (scores[activePlayer] >= 20) {
            //document.querySelector('.dice').style.display = 'none'
            document.getElementById('name-'+activePlayer).textContent = 'Winner!';
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.dice').style.display = 'none'
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            
        }
        activePlayer == 0 ? activePlayer = 1 : activePlayer = 0;
        document.querySelector('.player-0-panel').classList.toggle('active');   //toggle will add class if it is not there and vice versa
        document.querySelector('.player-1-panel').classList.toggle('active');  
        
})

document.querySelector('.btn-new').addEventListener('click', init)

function init() {
    scores =[0,0];
    roundScore = 0;
    activePlayer = 0;
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'PLAYER 1';
    document.getElementById('name-1').textContent = 'PLAYER 2';
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}