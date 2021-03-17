document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'))
  let squaresOriginal = Array.from(document.querySelectorAll('.grid div'));
  const homeButton = document.querySelector('#home-button');
  const scoreDisplay = document.querySelector('#score');
  const startButton = document.querySelector('#start-button');
  const pauseButton = document.querySelector('#pause-button');
  const restartButton = document.querySelector('#restart-button');
  const dificultyGame = document.querySelector('#dificulty');
  const bonusGame = document.querySelector('#bonus-counter');
  const blocksCounter = document.querySelector("#blocks");
  const statusGame = document.querySelector('#status');
  const statusHit = document.querySelector('#congrats');
  const statusBonus = document.querySelector('#bonus');
  const sound = document.querySelector('#sound');

  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let dificulty = ""; 
  let bonusCounter = 0;
  let blocks = 0;
  let status = "Good Game :)";
  let statusHitGame = "";
  let statusBonusGame = "";

  homeButton.addEventListener('click', () => {
    window.location.href = '/';
  })
  
  statusGame.innerHTML = status;
  
  var URL = window.location.href;
  var dificultyURL = URL.split("=")[1]; 
  
  dificulty += dificultyURL;
  dificultyGame.innerHTML = dificulty;

  // Seconds which the figure needs to move its position
  const Dificulties = {
    "Beginner" : 1000,
    "Normal": 500,
    "Expert": 250,
    "Insane": 125 
  }

  // Quantanty of pontuation to score whenever the user completes a row
  const Pontuations = {
    "Beginner" : 25,
    "Normal": 50,
    "Expert": 75,
    "Insane": 100
  }

  const counterBonus  = {
    "Beginner" : 0,
    "Normal": 1,
    "Expert": 2,
    "Insane": 3
}

  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]

  bonusCounter += counterBonus[dificulty];
  bonusGame.innerHTML = bonusCounter;
  

  // The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ];

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ];

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ];

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random]; 
    })
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    })
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    } else if (e.keyCode === 32) {
      if (bonusCounter > 0) {
        bonus();
        statusBonusGame += "You used 1 bonus!";
        statusBonus.innerHTML = statusBonusGame;
        
        bonusCounter -= 1;
        bonusGame.innerHTML = bonusCounter;
      } else {
        statusBonusGame = "No bonus";
        statusBonus.innerHTML = statusBonusGame;
      }
      
      setTimeout(() => {
        statusBonusGame = "";
        statusBonus.innerHTML = statusBonusGame;
      }, 800);
      
      blocks -= 1;
      blocksCounter.innerHTML = blocks;  
    }
  }

  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width
    draw()
    freeze();
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!isAtLeftEdge) currentPosition -=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1;
    }
    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1;
    }
    draw();
  }
 
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0);
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0);
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition;       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1 ;   //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
        }
    } else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1;
      checkRotatedPosition(P);
      }
    }
  }
  
  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation ++;
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition();
    draw();
  }

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 5;
  const displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [displayWidth+1, displayWidth + 2, 2*displayWidth+1, 2*displayWidth+2], //oTetromino
    [2, displayWidth+2, displayWidth*2+2, displayWidth*3+2] //iTetromino
  ]

  function bonus() {
    if (counterBonus[dificulty] > 0) {
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
      counterBonus[dificulty]--;
    }  
  }

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })

    blocks += 1;
    blocksCounter.innerHTML = blocks;
  }

  var counter = 0;
  startButton.addEventListener('click', () => {
    if(!timerId) {
      draw();
      timerId = setInterval(moveDown, Dificulties[dificulty]);
      if(counter === 0) {
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayShape(); 
      }
      startButton.disabled = true;
      pauseButton.disabled = false;
      counter++
      
      status = "";
      statusGame.innerHTML = status;
    }
    sound.play();
  })
  
  pauseButton.addEventListener('click', () => {
    if (timerId) {
      sound.pause();
      clearInterval(timerId)
      timerId = null
      pauseButton.disabled = true;
      startButton.disabled = false;
      status += "Paused!";
      statusGame.innerHTML = status;
    }
  })

  restartButton.addEventListener('click', () => {
    window.location.href = 'game.html?dificuldade=' + dificulty;
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += Pontuations[dificulty];
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        })
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));

        if (statusHitGame != "Congrats!") {
          statusHitGame += "Congrats!";
          statusHit.innerHTML = statusHitGame;
        }

        setTimeout(() => {
          statusHitGame = "";
          statusHit.innerHTML = statusHitGame;
        }, 2500);
      }
        
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = score + blocks + 50 * bonusCounter;
      clearInterval(timerId);
      status += "End Game";
      statusGame.innerHTML = status;
    }
  }
})
