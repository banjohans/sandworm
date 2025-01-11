const gridSize = 20; // Størrelsen på hver rute i rutenettet
let snake = [{ x: 200, y: 200 }]; // Slangens startposisjon
let pacman = { x: 0, y: 0 }; // Pac-Man sin startposisjon
let direction = { x: 1, y: 0 }; // Slangens bevegelsesretning (start: høyre)
let pacmanDirection = { x: 1, y: 0 }; // Pac-Man sin startretning (mot høyre)
let growing = false; // Slangen vokser ikke by default
let timeRemaining = 180; // 3 minutter (180 sekunder)
let gameInterval; // Referanse til spillets hovedintervall
let timerInterval; // Referanse til nedtellingsintervall

// Game timer
function updateTimer() {
  const timerElement = document.querySelector("#timer");
  if (timeRemaining > 0) {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `Time: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    clearInterval(timerInterval); // Stopp nedtellingen
    clearInterval(gameInterval); // Stopp spillet
    alert("Game Over! Your final score is: " + score); // Vis sluttmelding
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

// Flytt Pac-Man til en ny, tilfeldig posisjon
function spawnPacman() {
  const maxX = Math.floor(window.innerWidth / gridSize) * gridSize - gridSize;
  const maxY = Math.floor(window.innerHeight / gridSize) * gridSize - gridSize;

  do {
    pacman.x = Math.floor(Math.random() * (maxX / gridSize)) * gridSize;
    pacman.y = Math.floor(Math.random() * (maxY / gridSize)) * gridSize;
  } while (
    snake.some((segment) => segment.x === pacman.x && segment.y === pacman.y)
  );

  const pacmanElement = document.querySelector(".pacman");
  pacmanElement.style.left = `${pacman.x}px`;
  pacmanElement.style.top = `${pacman.y}px`;
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

function movePacman() {
  pacman.x += pacmanDirection.x * gridSize;
  pacman.y += pacmanDirection.y * gridSize;

  // Endre retning hvis Pac-Man treffer kanten av skjermen
  if (pacman.x < 0 || pacman.x >= window.innerWidth) {
    pacmanDirection.x *= -1; // Snu horisontal retning
  }
  if (pacman.y < 0 || pacman.y >= window.innerHeight) {
    pacmanDirection.y *= -1; // Snu vertikal retning
  }

  const pacmanElement = document.querySelector(".pacman");
  pacmanElement.style.left = `${pacman.x}px`;
  pacmanElement.style.top = `${pacman.y}px`;
}

const hitboxSize = gridSize; // Treffer Pac-Man hvis slangehodet er innenfor 1 rute
let lastCloseTimestamp = null; // Tidspunktet da slangen sist var innenfor treffområdet
const hitTimeout = 200; // Tidsvindu for å regne det som en treff (200ms)

function checkPacmanCollision() {
  const head = snake[0]; // Hodet til slangen

  // Beregn avstanden mellom slangens hode og Pac-Man
  const distanceX = Math.abs(head.x - pacman.x);
  const distanceY = Math.abs(head.y - pacman.y);

  // Sjekk om hodet er nær nok Pac-Man
  if (distanceX < hitboxSize && distanceY < hitboxSize) {
    lastCloseTimestamp = Date.now(); // Oppdater siste tidspunkt slangen var nær
  }

  // Sjekk om slangen har vært nær Pac-Man innenfor tidsvinduet
  if (lastCloseTimestamp && Date.now() - lastCloseTimestamp <= hitTimeout) {
    growing = true; // Slangen vokser
    score += 10; // Øk poengsummen
    updateScore();
    spawnPacman(); // Flytt Pac-Man til ny posisjon
    lastCloseTimestamp = null; // Tilbakestill treff
  }
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
}

// Start spillet
function startGame() {
  spawnPacman();
  createSnake();
  updateScore(); // Vis initial poengsum
  //   setInterval(moveSnake, 120); // Oppdater hvert 200ms
  setInterval(movePacman, 200); // Flytt Pac-Man hvert 300ms
  setInterval(randomizePacmanDirection, 2000 + Math.random() * 2000);
  // Start spillet og oppdateringer
  gameInterval = setInterval(moveSnake, 120); // Oppdater hvert 120ms
  // Start nedtellingen
  timerInterval = setInterval(updateTimer, 1000); // Oppdater hvert sekund
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

// Start spillet
startGame();
