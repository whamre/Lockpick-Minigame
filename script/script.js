const lockpickButton = document.querySelector(".lockpick-button");
const gameInterface = document.querySelector(".game-interface");
const movingSquare = document.querySelector(".moving-square");
const targetSquares = document.querySelectorAll(".target-square");
const restartButton = document.querySelector(".restart-button");
const resultMessage = document.querySelector(".result-message");
const forklaring = document.querySelector(".forklaring");
const loadingScreen = document.querySelector(".loading-screen");
const countdownElement = document.querySelector(".countdown");

let moveInterval;
let movingPosition = 0;
let targetPositions = [];
let currentTargetIndex = 0;
let successfulHits = 0;
let targetKeys = [];

lockpickButton.addEventListener("click", function() {
    showLoadingScreen();
});

restartButton.addEventListener("click", function() {
    resetGame();
});

function showLoadingScreen() {
    lockpickButton.style.display = "none";
    loadingScreen.style.display = "block"; 
    
    let countdown = 3;
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            loadingScreen.style.display = "none"; 
            startGame(); 
        }
    }, 1000);
}

function startGame() {
    gameInterface.style.display = "block";
    restartButton.style.display = "none"; 
    resultMessage.style.display = "none"; 
    forklaring.style.display = "block"; 
    
    targetKeys = Array.from({length: 5}, () => Math.floor(Math.random() * 10));
    
    targetSquares.forEach((square, index) => {
        square.textContent = targetKeys[index];
    });

    targetPositions = Array.from(targetSquares).map(square => square.offsetLeft);

    movingPosition = 0;
    currentTargetIndex = 0;
    successfulHits = 0;
    movingSquare.style.left = movingPosition + "px";

    moveInterval = setInterval(moveSquare, 10);
}

function moveSquare() {
    movingPosition += 2;
    movingSquare.style.left = movingPosition + "px";
    
    if (movingPosition >= 390) { 
        clearInterval(moveInterval);
        checkForLoss();
    }
}

document.addEventListener("keydown", function(event) {
    handleKeyPress(event.key);
});

function handleKeyPress(key) {
    if (key === targetKeys[currentTargetIndex].toString()) {
        clearInterval(moveInterval);
        checkWinCondition();
    } else {
        clearInterval(moveInterval);
        displayMessage("Du Tapte!", "red");
        forklaring.style.display = "none";  
        restartButton.style.display = "block";
    }
}

function checkWinCondition() {
    const squareCenter = movingPosition + (movingSquare.offsetWidth / 2);
    const targetCenter = targetPositions[currentTargetIndex] + (targetSquares[currentTargetIndex].offsetWidth / 2);
    
    const difference = Math.abs(squareCenter - targetCenter);
    
    if (difference < 30) {
        successfulHits++;
        targetSquares[currentTargetIndex].classList.add('hit');
        currentTargetIndex++;

        if (successfulHits === 5) {
            displayMessage("Du Vant!", "green");
            forklaring.style.display = "none";  
            restartButton.style.display = "block";
        } else {
            moveInterval = setInterval(moveSquare, 10);
        }
    } else {
        displayMessage("Du Tapte!", "red");
        forklaring.style.display = "none";  
        restartButton.style.display = "block";
    }
}

function checkForLoss() {
    if (successfulHits < 5) {
        displayMessage("Du Tapte!", "red");
        forklaring.style.display = "none";  
        restartButton.style.display = "block";
    }
}

function displayMessage(message, color) {
    resultMessage.textContent = message;
    resultMessage.style.color = color;
    resultMessage.style.display = "block";
}

function resetGame() {
    gameInterface.style.display = "none";
    lockpickButton.style.display = "block";
    
    movingPosition = 0;
    currentTargetIndex = 0;
    successfulHits = 0;
    movingSquare.style.left = movingPosition + "px";
    
    resultMessage.style.display = "none";
    forklaring.style.display = "block"; 
    
    targetSquares.forEach(square => {
        square.classList.remove('hit');
        square.textContent = "";
    });
}
