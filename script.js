const gridSize = 20; // Størrelsen på hver rute i rutenettet
let snake = [{ x: 200, y: 200 }]; // Slangens startposisjon
let numPacmen = 1;
let direction = { x: 1, y: 0 }; // Slangens bevegelsesretning (start: høyre)
let pacmanDirection = { x: 1, y: 0 }; // Pac-Man sin startretning (mot høyre)
let growing = false; // Slangen vokser ikke by default
let timeRemaining = 180; // 3 minutter (180 sekunder)
let gameInterval; // Referanse til spillets hovedintervall
let timerInterval; // Referanse til nedtellingsintervall

const startGameButton = document.getElementById("start-game-button");
const shareButton = document.getElementById("share-button");
const homeScreen = document.getElementById("home-screen");
const rulesButton = document.getElementById("rules-button");
const rulesOverlay = document.getElementById("rules-overlay");
const closeRulesButton = document.getElementById("close-rules-button");
const exitButton = document.getElementById("exit-button");

// Funksjon for å avslutte spillet
function exitGame() {
  // Skjul exit-knappen
  exitButton.classList.add("hidden");

  // Vis hjemskjermen
  homeScreen.classList.remove("hidden");

  // Stopp alle aktive intervaller
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Nullstill variabler
  timeRemaining = 180; // Tilbakestill timeren
  score = 0; // Nullstill poeng
  updateScore(); // Oppdater poengvisningen

  // Fjern slange og Pac-Men fra skjermen
  document.querySelectorAll(".snake, .pacman").forEach((el) => el.remove());
}

// Koble "Exit"-knappen til funksjonen
exitButton.addEventListener("click", exitGame);

// Vis Exit-knappen når spillet starter
startGameButton.addEventListener("click", () => {
  exitButton.classList.remove("hidden"); // Vis Exit-knappen
});

// Når "Rules"-knappen klikkes, vis reglene
rulesButton.addEventListener("click", () => {
  if (rulesOverlay) {
    rulesOverlay.classList.remove("hidden"); // Fjern 'hidden'-klassen for å vise reglene
  } else {
    console.error("Element with id 'rules-overlay' not found!");
  }
});

// Når "Close"-knappen klikkes, skjul reglene
closeRulesButton.addEventListener("click", () => {
  if (rulesOverlay) {
    rulesOverlay.classList.add("hidden"); // Legg til 'hidden'-klassen for å skjule reglene
  } else {
    console.error("Element with id 'rules-overlay' not found!");
  }
});

let gameRunning = false; // For å holde oversikt over spillstatus

startGameButton.addEventListener("click", () => {
  console.log("Start Game clicked");
  if (homeScreen) {
    homeScreen.classList.add("hidden"); // Skjul hjemskjermen
  } else {
    console.error("Element with id 'home-screen' not found!");
  }
  startGame(); // Start spillet
});

// Share Game
shareButton.addEventListener("click", () => {
  const gameUrl = window.location.href;
  navigator.clipboard
    .writeText(gameUrl)
    .then(() => alert("Game URL copied to clipboard!"))
    .catch((err) => console.error("Failed to copy URL:", err));
});

// Spilllogikk
function pauseGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
}

function resumeGame() {
  gameInterval = setInterval(moveSnake, 120);
  timerInterval = setInterval(updateTimer, 1000);
}

// Game timer
function updateTimer() {
  const timerElement = document.querySelector("#timer");
  const homeScreen = document.getElementById("home-screen");
  const gameOverMessage = document.getElementById("game-over-message");
  const finalScoreSpan = document.getElementById("final-score");

  if (timeRemaining > 0) {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    // Stop the game
    clearInterval(timerInterval);
    clearInterval(gameInterval);

    // Update and show game over message
    finalScoreSpan.textContent = score;
    gameOverMessage.classList.remove("hidden");

    // Show home screen
    homeScreen.classList.remove("hidden");

    // Stop background music if you want
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  }
}

// Opprett og legg til slangen i DOM
function createSnake() {
  const existingSegments = document.querySelectorAll(".snake");
  existingSegments.forEach((segment) => segment.remove()); // Fjern gamle segmenter

  // Legg slangekropp til hovedelementet
  snake.forEach((segment) => {
    const segmentDiv = document.createElement("div");
    segmentDiv.classList.add("snake");
    segmentDiv.style.left = `${segment.x}px`;
    segmentDiv.style.top = `${segment.y}px`;
    document.body.appendChild(segmentDiv);
  });
}

// Tilfeldig retning på spawnet pacmann
function randomDirection() {
  const directions = [
    { x: 0, y: -1 }, // Opp
    { x: 0, y: 1 }, // Ned
    { x: -1, y: 0 }, // Venstre
    { x: 1, y: 0 }, // Høyre
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

function randomizePacmanDirection() {
  pacmen.forEach((pacman) => {
    pacman.direction = randomDirection(); // Tilfeldig ny retning
  });
}

// SUPERPACMAN for mer poeng
const superPacmanProbability = 0.2; // 20% sjanse for å spawne en "super" Pac-Man
const superPacmanBonusPoints = 50; // Ekstra poeng for "super" Pac-Man

// Flytt Pac-Man til en ny, tilfeldig posisjon
function spawnPacmen() {
  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;

  // Fjern alle eksisterende Pac-Men fra DOM og listen
  document.querySelectorAll(".pacman").forEach((element) => element.remove());
  pacmen = []; // Nullstill listen over eksisterende Pac-Men

  // Legg til nye Pac-Men basert på numPacmen
  while (pacmen.length < numPacmen) {
    let pacman = {};
    do {
      pacman.x = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
      pacman.y = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;
    } while (
      snake.some(
        (segment) => segment.x === pacman.x && segment.y === pacman.y
      ) ||
      pacmen.some((p) => p.x === pacman.x && p.y === pacman.y)
    );

    pacman.direction = randomDirection(); // Velg en tilfeldig retning
    pacman.isSuper = Math.random() < superPacmanProbability; // Bestem om det er en "super" Pac-Man
    pacmen.push(pacman);

    // Opprett DOM-element
    const pacmanElement = document.createElement("div");
    pacmanElement.classList.add("pacman");
    if (pacman.isSuper) {
      pacmanElement.classList.add("super-pacman"); // Spesialklasse for "super" Pac-Man
    }
    pacmanElement.style.left = `${pacman.x}px`;
    pacmanElement.style.top = `${pacman.y}px`;

    // Legg til munn og øyne
    const pacmanEye = document.createElement("div");
    pacmanEye.classList.add("pacman_eye");
    pacmanElement.appendChild(pacmanEye);

    const pacmanMouth = document.createElement("div");
    pacmanMouth.classList.add("pacman_mouth");
    pacmanElement.appendChild(pacmanMouth);

    document.body.appendChild(pacmanElement);
  }
}

function spawnSuperPacman() {
  // Sjekk om det allerede finnes en Super-Pacman
  if (pacmen.some((p) => p.isSuper)) return;

  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;

  let superPacman = {};
  do {
    superPacman.x = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
    superPacman.y = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;
  } while (
    snake.some(
      (segment) => segment.x === superPacman.x && segment.y === superPacman.y
    ) ||
    pacmen.some((p) => p.x === superPacman.x && p.y === superPacman.y)
  );

  superPacman.direction = randomDirection();
  superPacman.isSuper = true; // Marker som Super-Pacman
  pacmen.push(superPacman);

  // Opprett DOM-element
  const pacmanElement = document.createElement("div");
  pacmanElement.classList.add("pacman", "super-pacman");
  pacmanElement.style.left = `${superPacman.x}px`;
  pacmanElement.style.top = `${superPacman.y}px`;

  // Legg til munn og øyne
  const pacmanEye = document.createElement("div");
  pacmanEye.classList.add("pacman_eye");
  pacmanElement.appendChild(pacmanEye);

  const pacmanMouth = document.createElement("div");
  pacmanMouth.classList.add("pacman_mouth");
  pacmanElement.appendChild(pacmanMouth);

  document.body.appendChild(pacmanElement);

  // **Spill av lyd**
  const superPacmanSound = document.getElementById("lisan-al-gaib");
  if (superPacmanSound) {
    superPacmanSound.volume = 0.2; // nedjustert volum
    superPacmanSound.currentTime = 0; // Start fra begynnelsen
    superPacmanSound.play();
  }
}

// Oppdater slangens posisjon og sjekk for kollisjoner
function moveSnake() {
  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };

  // Sjekk kollisjon med Pac-Man
  checkPacmanCollision();

  // Legg til nytt hode
  snake.unshift(head);

  // Fjern halen hvis slangen ikke vokser
  if (!growing) {
    snake.pop();
  } else {
    growing = false;
  }

  // Hold slangen innenfor skjermen
  head.x = (head.x + window.innerWidth) % window.innerWidth;
  head.y = (head.y + window.innerHeight) % window.innerHeight;

  createSnake(); // Oppdater DOM for slangen
}

function movePacmen() {
  pacmen.forEach((pacman, index) => {
    // Sjekk om det er på tide å endre retning
    if (
      !pacman.nextDirectionChange ||
      Date.now() > pacman.nextDirectionChange
    ) {
      pacman.direction = randomDirection(); // Velg en ny tilfeldig retning
      pacman.nextDirectionChange = Date.now() + Math.random() * 4000 + 2000; // Neste retning etter 2-4 sekunder
    }

    // Oppdater posisjonen basert på retningen
    pacman.x += pacman.direction.x * gridSize;
    pacman.y += pacman.direction.y * gridSize;

    // Snu retningen hvis Pac-Man treffer kanten av skjermen
    if (pacman.x < 0 || pacman.x >= window.innerWidth) {
      pacman.direction.x *= -1;
    }
    if (pacman.y < 0 || pacman.y >= window.innerHeight) {
      pacman.direction.y *= -1;
    }

    // Oppdater Pac-Man i DOM
    const pacmanElement = document.querySelectorAll(".pacman")[index];
    pacmanElement.style.left = `${pacman.x}px`;
    pacmanElement.style.top = `${pacman.y}px`;

    // Rotér Pac-Man basert på retningen
    if (pacman.direction.x === 1) {
      pacmanElement.style.transform = "rotate(0deg)"; // Går mot høyre
    } else if (pacman.direction.x === -1) {
      pacmanElement.style.transform = "rotate(180deg)"; // Går mot venstre
    } else if (pacman.direction.y === -1) {
      pacmanElement.style.transform = "rotate(270deg)"; // Går opp
    } else if (pacman.direction.y === 1) {
      pacmanElement.style.transform = "rotate(90deg)"; // Går ned
    }
  });
}

const hitboxSize = gridSize; // Treffer Pac-Man hvis slangehodet er innenfor 1 rute
let lastCloseTimestamp = null; // Tidspunktet da slangen sist var innenfor treffområdet
const hitTimeout = 200; // Tidsvindu for å regne det som en treff (200ms)

// Spiselyder til når ormen spiser frimenn
function playRandomChompSound() {
  const chompSounds = [
    document.getElementById("chomp1"),
    document.getElementById("chomp2"),
    document.getElementById("chomp3"),
  ];
  const randomSound =
    chompSounds[Math.floor(Math.random() * chompSounds.length)];
  if (randomSound) {
    randomSound.currentTime = 0; // Start lyden fra begynnelsen
    randomSound.play().catch((error) => {
      console.error("Kunne ikke spille av lyden:", error);
    });
  }
}

function checkPacmanCollision() {
  const head = snake[0]; // Hodet til slangen

  pacmen.forEach((pacman, index) => {
    const distanceX = Math.abs(head.x - pacman.x);
    const distanceY = Math.abs(head.y - pacman.y);

    // Sjekk om slangen treffer denne Pac-Man
    if (distanceX < hitboxSize && distanceY < hitboxSize) {
      growing = true; // Slangen vokser

      if (pacman.isSuper) {
        // Spill "swallow"-lyden for Super-Pac-Man
        const swallowSound = document.getElementById("swallow-sound");
        if (swallowSound) {
          swallowSound.currentTime = 0; // Start lyden fra begynnelsen
          swallowSound.play();
        }
        score += superPacmanBonusPoints; // Legg til bonuspoeng
      } else {
        // Spill en tilfeldig chomp-lyd for vanlige Pac-Men
        playRandomChompSound();
        score += 10; // Standard poeng
      }

      updateScore(); // Oppdater poengsummen

      // Fjern spist Pac-Man fra listen og DOM
      const pacmanElements = document.querySelectorAll(".pacman");
      pacmanElements[index].remove(); // Fjern fra DOM
      pacmen.splice(index, 1); // Fjern fra listen

      // Legg til nye Pac-Men
      addNewPacman();
      addNewPacman();
    }
  });
}

function addNewPacman() {
  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;

  let pacman = {};
  do {
    pacman.x = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
    pacman.y = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;
  } while (
    snake.some((segment) => segment.x === pacman.x && segment.y === pacman.y) ||
    pacmen.some((p) => p.x === pacman.x && p.y === pacman.y)
  );

  pacman.direction = randomDirection(); // Velg en tilfeldig retning
  pacman.changeDirectionTime = Date.now() + Math.random() * 4000 + 2000; // Randomisert tidsintervall
  pacmen.push(pacman);

  // Legg til ny Pac-Man i DOM
  const pacmanElement = document.createElement("div");
  pacmanElement.classList.add("pacman");
  pacmanElement.style.left = `${pacman.x}px`;
  pacmanElement.style.top = `${pacman.y}px`;

  // Legg til munn og øyne
  const pacmanEye = document.createElement("div");
  pacmanEye.classList.add("pacman_eye");
  pacmanElement.appendChild(pacmanEye);

  const pacmanMouth = document.createElement("div");
  pacmanMouth.classList.add("pacman_mouth");
  pacmanElement.appendChild(pacmanMouth);

  document.body.appendChild(pacmanElement);
}

// Parametere for å randomisere pacmans bevegelser
function randomizePacmanDirection() {
  const directions = [
    { x: 0, y: -1 }, // Opp
    { x: 0, y: 1 }, // Ned
    { x: -1, y: 0 }, // Venstre
    { x: 1, y: 0 }, // Høyre
  ];

  // Velg en tilfeldig retning
  const randomIndex = Math.floor(Math.random() * directions.length);
  pacmanDirection = directions[randomIndex];
}

// Håndter tastetrykk for å endre retning
function handleKeydown(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

// Håndter museklikk for å "warpe" slangen
function handleMouseClick(event) {
  const newHeadX = Math.floor(event.clientX / gridSize) * gridSize;
  const newHeadY = Math.floor(event.clientY / gridSize) * gridSize;

  // Flytt hodet til den nye posisjonen
  const newHead = { x: newHeadX, y: newHeadY };

  // Oppdater slangen, flytt segmentene for å følge etter
  snake = [newHead, ...snake.slice(0, snake.length - 1)];
  createSnake();
  // Reduser poengsum og oppdater visningen
  score = Math.max(0, score - 5); // Sørg for at poeng ikke blir negativ
  updateScore();
}

// La en super-pacman komme med ujevne mellomrom mellom 1 og 2 minutt, som gir høgere poeng
function scheduleSuperPacmanSpawn() {
  const minDelay = 60000; // Minimum forsinkelse: 1 minutt
  const maxDelay = 120000; // Maksimum forsinkelse: 2 minutter
  const randomDelay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  setTimeout(() => {
    spawnSuperPacman(); // Spawner en ny Super-Pacman
    scheduleSuperPacmanSpawn(); // Planlegg neste spawn
  }, randomDelay);
}

// Start spillet
function startGame() {
  // Gjem game over melding hvis den finnes
  const gameOverMessage = document.getElementById("game-over-message");
  if (gameOverMessage) {
    gameOverMessage.classList.add("hidden");
  }

  // Start bakgrunnsmusikken
  const backgroundMusic = document.getElementById("background-music");
  backgroundMusic.volume = 0.5; // Juster volumet (0.0 til 1.0)
  backgroundMusic.play();

  spawnPacmen(); // Plasser flere Pac-Men i startposisjoner
  createSnake(); // Plasser slangen
  updateScore(); // Vis initial poengsum

  // Start intervallene
  gameInterval = setInterval(moveSnake, 120); // Flytt slangen
  setInterval(movePacmen, 200); // Flytt Pac-Men
  setInterval(randomizePacmanDirection, 2000 + Math.random() * 2000); // Endre retning for Pac-Men
  timerInterval = setInterval(updateTimer, 1000); // Nedtelling
  // Planlegg Super-Pacman spawns
  scheduleSuperPacmanSpawn(); // <-- setter i gang funksjon som spawner SuperPacman
}

// Lytt etter tastetrykk
window.addEventListener("keydown", handleKeydown);
window.addEventListener("click", handleMouseClick);

// SCORE
let score = 0;

function updateScore() {
  const scoreElement = document.querySelector("#score");
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`; // Oppdater poengtallet
  }
}

// Swipefunksjoner for å kunne spill på mobil

let startX, startY, endX, endY;

// Start av swipe
function handleTouchStart(event) {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}

// Slutt av swipe
function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  endX = touch.clientX;
  endY = touch.clientY;

  // Beregn swipe-retning
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horisontal swipe
    if (diffX > 0 && direction.x === 0) {
      direction = { x: 1, y: 0 }; // Høyre
    } else if (diffX < 0 && direction.x === 0) {
      direction = { x: -1, y: 0 }; // Venstre
    }
  } else {
    // Vertikal swipe
    if (diffY > 0 && direction.y === 0) {
      direction = { x: 0, y: 1 }; // Ned
    } else if (diffY < 0 && direction.y === 0) {
      direction = { x: 0, y: -1 }; // Opp
    }
  }
}

// Legg til event listeners
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchend", handleTouchEnd);
