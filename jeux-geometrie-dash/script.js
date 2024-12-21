document.addEventListener("DOMContentLoaded", () => {
    const blocBlanc = document.querySelector(".bloc-blanc");
    const blocsDegat = document.querySelectorAll(".block-degat > div");
    const scoreDisplay = document.querySelector(".score");
    const body = document.querySelector("body");

    let gameRunning = true;
    let isJumping = false;
    let score = 0;

    // Initialiser l'affichage du score à 0
    scoreDisplay.textContent = `Score : ${score}`;

    const jumpHeight = 250; // Hauteur maximale du saut
    const gravitySpeed = 2; // Vitesse de chute
    const jumpSpeed = 10; // Vitesse de montée

    const blocBlancInitialTop = parseInt(getComputedStyle(blocBlanc).top);

    const blockSpeed = 5; // Vitesse de déplacement des blocs roses

    // Fonction pour faire sauter le bloc blanc
    const jump = () => {
        if (isJumping || !gameRunning) return;
        isJumping = true;

        let currentTop = parseInt(getComputedStyle(blocBlanc).top);
        const targetTop = Math.max(currentTop - jumpHeight, blocBlancInitialTop - jumpHeight);

        const jumpInterval = setInterval(() => {
            currentTop -= jumpSpeed;
            if (currentTop <= targetTop) {
                clearInterval(jumpInterval);
                gravity();
            }
            blocBlanc.style.top = `${currentTop}px`;
        }, 20);
    };

    // Fonction pour appliquer la gravité
    const gravity = () => {
        let currentTop = parseInt(getComputedStyle(blocBlanc).top);
        const groundLevel = blocBlancInitialTop;

        const gravityInterval = setInterval(() => {
            if (!gameRunning) {
                clearInterval(gravityInterval);
                return;
            }
            if (currentTop < groundLevel) {
                currentTop += gravitySpeed;
                blocBlanc.style.top = `${currentTop}px`;
            } else {
                clearInterval(gravityInterval);
                isJumping = false;
            }
        }, 20);
    };

    // Fonction pour déplacer les blocs roses
    const moveBlocks = () => {
        blocsDegat.forEach((bloc) => {
            let currentLeft = parseInt(getComputedStyle(bloc).left);

            // Si le bloc sort de l'écran, on le replace et on augmente le score
            if (currentLeft <= -75) {
                currentLeft = window.innerWidth;
                score++;
                scoreDisplay.textContent = `Score : ${score}`;
            }

            bloc.style.left = `${currentLeft - blockSpeed}px`; // Déplacement vers la gauche
        });

        checkCollision();
    };

    // Fonction pour vérifier les collisions
    const checkCollision = () => {
        const blocBlancRect = blocBlanc.getBoundingClientRect();

        blocsDegat.forEach((bloc) => {
            const blocRect = bloc.getBoundingClientRect();

            if (
                blocBlancRect.left < blocRect.right &&
                blocBlancRect.right > blocRect.left &&
                blocBlancRect.top < blocRect.bottom &&
                blocBlancRect.bottom > blocRect.top
            ) {
                gameOver();
            }
        });
    };

    // Fonction pour arrêter le jeu
    const gameOver = () => {
        gameRunning = false;
        const gameOverMessage = document.createElement("div");
        gameOverMessage.textContent = `Game Over! Votre score : ${score}. Appuyez sur R pour recommencer.`;
        gameOverMessage.style.color = "white";
        gameOverMessage.style.position = "absolute";
        gameOverMessage.style.top = "50%";
        gameOverMessage.style.left = "50%";
        gameOverMessage.style.transform = "translate(-50%, -50%)";
        gameOverMessage.style.fontSize = "30px";
        body.appendChild(gameOverMessage);
    };

    // Écouteur pour détecter la touche flèche haut
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            jump();
        }
        if ((e.key === "r" || e.key === "R") && !gameRunning) {
            location.reload();
        }
    });

    // Boucle principale pour déplacer les blocs roses
    setInterval(() => {
        if (gameRunning) {
            moveBlocks();
        }
    }, 50);
});