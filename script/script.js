document.addEventListener("DOMContentLoaded", function() {
    const progressBar = document.querySelector(".progress-fill");
    let targetSquares;
    const countdownElement = document.querySelector(".countdown");
    const loadingScreen = document.querySelector(".loading-screen");
    const gameInterface = document.querySelector(".game-interface");
    const resultMessage = document.querySelector(".result-message");
    const restartButton = document.querySelector(".restart-button");
    const lockpickButton = document.querySelector(".lockpick-button");
    const bar = document.querySelector(".progress-bar");

    const targetSquaresInput = document.getElementById('targetSquares');
    const progressSpeedInput = document.getElementById('progressSpeed');
    const applySettingsButton = document.getElementById('applySettings');

    let progress = 0;
    let interval;
    let currentTargetIndex = 0;
    let numberOfTargetSquares = parseInt(targetSquaresInput.value);
    let progressSpeed = parseFloat(progressSpeedInput.value);

    applySettingsButton.addEventListener('click', () => {
        numberOfTargetSquares = parseInt(targetSquaresInput.value);
        progressSpeed = parseFloat(progressSpeedInput.value);
        console.log(`Number of Target Squares: ${numberOfTargetSquares}, Progress Speed: ${progressSpeed}`);
    });
    
    document.removeEventListener("keydown", handleKeyPress);

    lockpickButton.addEventListener("click", startGame);

    function startGame() {
        lockpickButton.style.display = "none";
        loadingScreen.style.display = "block";
    
        createTargetSquares(numberOfTargetSquares);
    
        let countdown = 3;
        
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = countdown;
            countdown--;
    
            if (countdown < 0) {
                clearInterval(countdownInterval);
                bar.style.display = "block";
                loadingScreen.style.display = "none";
                gameInterface.style.display = "block";
                startProgressBar();
    
                document.addEventListener("keydown", handleKeyPress);
            }
        }, 1000);
    }
    
    

    function createTargetSquares(numberOfSquares) {
        targetSquares = [];
        
        let previousLeftPosition = 10;
        const minimumGap = 15;

        for (let i = 1; i <= numberOfSquares; i++) {
            const targetSquare = document.createElement('div');
            targetSquare.classList.add('target-square');
            targetSquare.classList.add(`target-square-${i}`);

            const maxLeftPosition = 91 - (numberOfSquares - i) * minimumGap;
            const leftPosition = Math.floor(Math.random() * (maxLeftPosition - previousLeftPosition)) + previousLeftPosition;
            
            targetSquare.style.left = `${leftPosition}%`;

            previousLeftPosition = leftPosition + minimumGap;

            bar.appendChild(targetSquare);
            targetSquares.push(targetSquare);
        }
    }

    function startProgressBar() {
        interval = setInterval(() => {
            let currentTarget = targetSquares[currentTargetIndex];
            let currentTargetPosition = (currentTarget.offsetLeft + (currentTarget.offsetWidth / 2)) / progressBar.parentElement.offsetWidth * 100;
    
            let targetStart = (currentTarget.offsetLeft / progressBar.parentElement.offsetWidth) * 100;
            let targetEnd = targetStart + (currentTarget.offsetWidth / progressBar.parentElement.offsetWidth) * 100;
    
            if (progress >= targetStart && progress <= targetEnd) {
                progress += progressSpeed * 0.20;
            } else {
                progress += progressSpeed;
            }
    
            progressBar.style.width = `${progress}%`;
    
            if (progress >= 100) {
                clearInterval(interval);
                console.log("Progress bar reached the end without hitting all targets.");
                endGame(false);
            }
        }, 50);
    }
    

    function endGame(isWin) {
        clearInterval(interval);
        gameInterface.style.display = "block";
        resultMessage.style.display = "block";
        restartButton.style.display = "block";

        if (isWin) {
            resultMessage.textContent = "Gratulerer, du klarte det!";
            console.log("Du vant!");
        } else {
            resultMessage.textContent = "Du tapte, prøv igjen!";
            console.log("Du tapte.");
        }

        document.removeEventListener("keydown", handleKeyPress);
    }

    function resetGameVisuals() {
        progress = 0;
        currentTargetIndex = 0;
        progressBar.style.width = "0%";
        
        targetSquares.forEach(square => square.remove());
        
        targetSquares = [];
        
        resultMessage.style.display = "none";
        restartButton.style.display = "none";
        bar.style.display = "none";
        lockpickButton.style.display = "block";
    
        document.removeEventListener("keydown", handleKeyPress);
    }
    

    restartButton.addEventListener("click", function() {
        resetGameVisuals();
    });

    function handleKeyPress(event) {
        if (event.key === "e" || event.key === "E") {
            const currentTarget = targetSquares[currentTargetIndex];
            const currentTargetPosition = (currentTarget.offsetLeft + (currentTarget.offsetWidth / 2)) / progressBar.parentElement.offsetWidth * 100;
    
            if (Math.abs(progress - currentTargetPosition) < 4) {
                currentTarget.style.backgroundColor = "green";
                currentTargetIndex++;
    
                if (currentTargetIndex >= targetSquares.length) {
                    endGame(true);
                }
            } else {
                console.log("Mistimed keypress. You lose.");
                endGame(false);
            }
        } else {
            console.log("Wrong key pressed. You lose.");
            endGame(false);
        }
    }
    

    document.addEventListener("keydown", handleKeyPress);
});
