document.addEventListener("DOMContentLoaded", function() {
    const progressBar = document.querySelector(".progress-fill");
    const targetSquares = document.querySelectorAll(".target-square");
    const countdownElement = document.querySelector(".countdown");
    const loadingScreen = document.querySelector(".loading-screen");
    const gameInterface = document.querySelector(".game-interface");
    const resultMessage = document.querySelector(".result-message");
    const restartButton = document.querySelector(".restart-button");
    const lockpickButton = document.querySelector(".lockpick-button");
    const bar = document.querySelector(".progress-bar");

    let progress = 0;
    let interval;
    let currentTargetIndex = 0;

    lockpickButton.addEventListener("click", startGame);


    function startGame() {
        lockpickButton.style.display = "none";
        loadingScreen.style.display = "block";
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
            }
        }, 1000);
    }

    function startProgressBar() {
        interval = setInterval(() => {
            progress += 1;
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
        targetSquares.forEach(square => square.style.backgroundColor = "#0000006c");
        resultMessage.style.display = "none";
        restartButton.style.display = "none";
        bar.style.display = "none";
        lockpickButton.style.display = "block";
    }

    restartButton.addEventListener("click", function() {
        resetGameVisuals();
        document.addEventListener("keydown", handleKeyPress); 
    });

    function handleKeyPress(event) {
        if (event.key === "e" || event.key === "E") {
            const currentTarget = targetSquares[currentTargetIndex];
            const currentTargetPosition = (currentTarget.offsetLeft + (currentTarget.offsetWidth / 2)) / progressBar.parentElement.offsetWidth * 100;

            if (Math.abs(progress - currentTargetPosition) < 5) {
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
