// const gridSize = 20; // Størrelsen på hver rute i rutenettet
let snake = [{ x: 200, y: 200 }]; // Slangens startposisjon
let numPacmen = 1;
let direction = { x: 1, y: 0 }; // Slangens bevegelsesretning (start: høyre)
let pacmanDirection = { x: 1, y: 0 }; // Pac-Man sin startretning (mot høyre)
let growing = false; // Slangen vokser ikke by default
let timeRemaining = 180; // 3 minutter (180 sekunder)
let gameInterval = null;
let pacmenInterval = null;
let pacmenDirectionInterval = null;
let timerInterval = null;

const startGameButton = document.getElementById("start-game-button");
const shareButton = document.getElementById("share-button");
const homeScreen = document.getElementById("home-screen");
const rulesButton = document.getElementById("rules-button");
const rulesOverlay = document.getElementById("rules-overlay");
const closeRulesButton = document.getElementById("close-rules-button");
const exitButton = document.getElementById("exit-button");
const mainscreenMusic = document.getElementById("mainscreen-music");

mainscreenMusic.volume = 0.7; // Juster volum
mainscreenMusic.loop = true; // Loop musikken automatisk

function getHighscore() {
  const storedHighscore = localStorage.getItem("highscore");
  console.log("Stored highscore from localStorage:", storedHighscore); // Debugging

  try {
    // Returner parsed verdi eller standard
    return storedHighscore
      ? JSON.parse(storedHighscore)
      : { initials: "AAA", score: 0 };
  } catch (error) {
    console.error("Failed to parse highscore:", error);
    localStorage.removeItem("highscore"); // Fjern ødelagt data
    return { initials: "AAA", score: 0 }; // Returner standard verdi
  }
}

// HIGHSCORE
function saveHighscore(score) {
  const currentHighscore = getHighscore(); // Hent eksisterende highscore
  console.log("Current highscore object:", currentHighscore); // Debugging

  if (score > currentHighscore.score) {
    const initials = prompt("Congratulations! Enter your initials (3 letters):")
      ?.toUpperCase()
      .slice(0, 3); // Begrens til 3 tegn

    if (!initials) {
      console.warn("Highscore update canceled: No initials entered.");
      return currentHighscore;
    }

    const newHighscore = { initials, score };
    localStorage.setItem("highscore", JSON.stringify(newHighscore));
    console.log("New highscore saved:", newHighscore);
    return newHighscore;
  }

  console.log("Highscore not updated");
  return currentHighscore;
}

document.addEventListener("DOMContentLoaded", () => {
  const highscoreDisplay = document.querySelector("#highscore-display");
  if (highscoreDisplay) {
    const highscore = getHighscore();
    highscoreDisplay.textContent = `Highscore: ${highscore.initials} - ${highscore.score}`;
  }
});

// SCORE
let score = 0;

function updateScore() {
  const scoreElement = document.querySelector("#score");
  const highscoreElement = document.querySelector("#highscore");
  if (scoreElement) {
    scoreElement.textContent = `Score: ${score}`;
  }
  if (highscoreElement) {
    const highscore = getHighscore();
    highscoreElement.textContent = `Highscore: ${highscore.initials} - ${highscore.score}`;
  }
}

// Funksjon for å kalkulere en dynamisk gridsize, for jevner opplevelse på ulike format
function calculateGridSize() {
  const baseSize = Math.min(window.innerWidth, window.innerHeight) / 50; // Juster faktor etter ønsket tetthet
  return Math.floor(baseSize);
}

let gridSize = calculateGridSize();

// Oppdater gridsize når vindauge endrast
window.addEventListener("resize", () => {
  gridSize = calculateGridSize();
  updateGameElements(); // Sørg for at elementer oppdateres
});

function updateGameElements() {
  // Oppdater slangens segmenter
  document.querySelectorAll(".snake").forEach((segment) => {
    segment.style.width = `${gridSize}px`;
    segment.style.height = `${gridSize}px`;
  });

  // Oppdater Pac-Men
  document.querySelectorAll(".pacman").forEach((pacman) => {
    pacman.style.width = `${gridSize}px`;
    pacman.style.height = `${gridSize}px`;
  });
}

let snakeSpeed = gridSize * 6; // Avhenger av gridSize
let pacmanSpeed = gridSize * 2;

// definer grid for spawning av nye karakterer (implementeres i spawn-funksjoner)
function getMaxBounds() {
  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;
  return { maxX, maxY };
}

function moveSnake() {
  // Respekter rammene satt av #game-container
  const gameContainer = document.getElementById("game-container");
  const maxX = gameContainer.offsetWidth - gridSize;
  const maxY = gameContainer.offsetHeight - gridSize;

  const head = {
    x: snake[0].x + direction.x * gridSize,
    y: snake[0].y + direction.y * gridSize,
  };

  snake.unshift(head);
  if (!growing) snake.pop();
  createSnake();
}

function movePacmen() {
  // Respekter rammene satt av #game-container
  const gameContainer = document.getElementById("game-container");
  const maxX = gameContainer.offsetWidth - gridSize;
  const maxY = gameContainer.offsetHeight - gridSize;

  pacmen.forEach((pacman) => {
    pacman.x += pacman.direction.x * gridSize;
    pacman.y += pacman.direction.y * gridSize;
    updatePacmanPosition(pacman);
  });
}

// Funksjon for å avslutte spillet
function exitGame() {
  console.log("Exiting game...");
  // Oppdater highscore før noe annet
  const highscore = saveHighscore(score);

  stopBackgroundMusic();
  playMainScreenMusic();

  // Skjul exit-knappen
  exitButton.classList.add("hidden");

  // Vis hjemskjermen
  homeScreen.classList.remove("hidden");

  // Vis oppdatert highscore
  const highscoreDisplay = document.querySelector("#highscore-display");
  if (highscoreDisplay) {
    highscoreDisplay.textContent = `Highscore: ${highscore.initials} - ${highscore.score}`;
  }

  // Stopp alle aktive intervaller
  clearInterval(gameInterval);
  clearInterval(pacmenInterval);
  clearInterval(pacmenDirectionInterval);
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

  // Referanse til blip-lyden
  const blipSound = document.getElementById("blip-sound");

  if (timeRemaining > 0) {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Spill blip-lyd i de siste 10 sekundene
    if (timeRemaining <= 10 && timeRemaining > 0 && blipSound) {
      blipSound.volume = 0.2; // Redusert volum for bedre opplevelse
      blipSound.currentTime = 0; // Start lyden fra begynnelsen
      blipSound
        .play()
        .catch((err) => console.error("Error playing blip sound:", err));
    }
  } else {
    // Spill er over, stopp alle aktive intervaller
    clearInterval(timerInterval);
    clearInterval(gameInterval);

    // Oppdater highscore
    const highscore = saveHighscore(score);

    // Oppdater og vis "game over"-meldingen
    finalScoreSpan.textContent = score;
    gameOverMessage.classList.remove("hidden");

    // Vis hjemskjermen
    homeScreen.classList.remove("hidden");

    // Vis oppdatert highscore
    const highscoreDisplay = document.querySelector("#highscore-display");
    if (highscoreDisplay) {
      highscoreDisplay.textContent = `Highscore: ${highscore.initials} - ${highscore.score}`;
    }

    // Stopp bakgrunnsmusikken
    const backgroundMusic = document.getElementById("background-music");
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0; // Nullstill musikken
    }

    // Start musikken til hovedskjermen
    const mainScreenMusic = document.getElementById("mainscreen-music");
    if (mainScreenMusic) {
      mainScreenMusic.volume = 0.7; // Juster volum
      mainScreenMusic.currentTime = 0; // Start fra begynnelsen
      mainScreenMusic
        .play()
        .catch((err) => console.error("Error playing main screen music:", err));
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
  const { maxX, maxY } = getMaxBounds();

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

  const { maxX, maxY } = getMaxBounds();

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
    if (pacmanElement) {
      pacmanElement.style.left = `${pacman.x}px`;
      pacmanElement.style.top = `${pacman.y}px`;
    } else {
      console.warn(
        `Pac-Man element not found for index ${index}. Skipping update.`
      );
    }

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
    randomSound.volume = 0.2; // Juster volumet
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
  const { maxX, maxY } = getMaxBounds();

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

function resetGame() {
  // Nullstill variabler
  score = 0;
  timeRemaining = 180; // Sett tilbake til 3 minutter
  snake = [{ x: 200, y: 200 }]; // Startposisjon for slangen
  direction = { x: 1, y: 0 }; // Startretning
  pacmen = []; // Tøm listen over Pac-Men
  growing = false;

  // Nullstill intervaller
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(pacmenInterval);
  clearInterval(pacmenDirectionInterval);

  // Fjern eksisterende DOM-elementer for slange og Pac-Men
  document.querySelectorAll(".snake, .pacman").forEach((el) => el.remove());

  // Nullstill poeng og tid i UI
  updateScore();
  const timerElement = document.querySelector("#timer");
  if (timerElement) {
    timerElement.textContent = "Time: 3:00";
  }

  // Diverse musikk-kommandoer
  // Nullstill bakgrunnsmusikk
  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Start fra begynnelsen
  }
}

function stopBackgroundMusic() {
  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Nullstill
  }
}

function playMainScreenMusic() {
  if (mainscreenMusic) {
    console.log("Playing mainscreen music...");
    mainscreenMusic.currentTime = 0; // Start fra begynnelsen
    mainscreenMusic
      .play()
      .catch((err) => console.error("Error playing mainscreen music:", err));
  } else {
    console.warn("Mainscreen music instance not found.");
  }
}

function stopMainScreenMusic() {
  if (mainscreenMusic) {
    console.log("Stopping mainscreen music...");
    mainscreenMusic.pause();
    mainscreenMusic.currentTime = 0; // Reset to the start
  } else {
    console.warn("Mainscreen music instance not found.");
  }
}

// Vis hjemskjermen
function showHomeScreen() {
  const homeScreen = document.getElementById("home-screen");
  if (homeScreen) {
    homeScreen.classList.remove("hidden");
  }
}

// Start spillet
function startGame() {
  console.log("Starting game...");
  stopMainScreenMusic(); // Stopp mainscreen-music
  resetGame(); // Nullstill spillet

  // Skjul hjemskjermen og eventuelle game over-meldinger
  const gameOverMessage = document.getElementById("game-over-message");
  if (gameOverMessage) {
    gameOverMessage.classList.add("hidden");
  }
  if (homeScreen) {
    homeScreen.classList.add("hidden");
  }

  // Start bakgrunnsmusikken
  const backgroundMusic = document.getElementById("background-music");
  if (backgroundMusic) {
    backgroundMusic.volume = 0.8; // Juster volumet
    backgroundMusic.play();
  }

  // **Dynamisk justering av hastighet basert på skjermstørrelse**
  const snakeSpeed = window.innerWidth < 768 ? 180 : 120; // Langsommere på mobil
  const pacmanSpeed = window.innerWidth < 768 ? 250 : 200;

  // Start nye intervaller for spillet
  gameInterval = setInterval(moveSnake, 120); // Flytt slangen
  pacmenInterval = setInterval(movePacmen, 200); // Flytt Pac-Men
  pacmenDirectionInterval = setInterval(randomizePacmanDirection, 3000); // Endre retning for Pac-Men
  timerInterval = setInterval(updateTimer, 1000); // Oppdater timer

  // Planlegg Super-Pacman spawns
  scheduleSuperPacmanSpawn();

  // Sett opp spillobjekter
  spawnPacmen(); // Opprett Pac-Men i nye posisjoner
  createSnake(); // Opprett slangen
  updateScore(); // Oppdater poengsummen på skjermen
}

// Lytt etter tastetrykk
window.addEventListener("keydown", handleKeydown);
window.addEventListener("click", handleMouseClick);

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

// Legg til event listeners for mobil-swipe og tap
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchend", handleTouchEnd);
