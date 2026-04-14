let humanScore = 0
let computerScore=0

function getComputerChoice(){
let choice = Math.floor(Math.random()*3);
if(choice === 0 ) {
    choice = "rock";
}else if (choice === "paper") {
    choice = "rock"
}else {
    choice ="scissors"
}
return choice;
}

function getHumanChoice() {
    let choice= prompt("Rock, Paper, Scissors!").toLocaleLowerCase();
    if (choice === "rock") {
        return choice;
    }else if (choice === "paper") {
        return choice;
    }else if (choice === "scissors"){
        return getHumanChoice;
    }else {
        return getHumanChoice;
    }
    
}

function playRound (humanScore, computerScore){
    if(humanChoice === computerChoice ) {
        console.log ("Draw!!");
    } else if(humanChoice === "rock" && computerChoice === "scissors") {
        console.log("Paper Wins!!");
        humanScore++
    } else if (humanChoice === "paper" && computerChoice === "rock") {
        console.log(" Paper beats Rock!");
        humanScore++
    } else if (humanChoice === "scissors" && computerChoice === "paper") {
        console.log("Scissors beat paper");
        humanScore++
    }else {
        console.log("you lose!");
        computerScore++;
    }
 console.log("Score = ${humanScore}-${computerChoice}");
}

function playGame() {
    
    for(let i = 0; i < 5; i++) {
        const humanSelection = getHumanChoice();
        const computerSelection = getComputerChoice();
        playRound(humanSelection, computerSelection);
    }
}


playGame();