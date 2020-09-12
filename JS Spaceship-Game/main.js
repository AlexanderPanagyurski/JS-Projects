; (function game(){

    const gameStartEl = document.getElementById('game-start');
    const gameTitleEl = document.getElementById('game-title');
    const gameScoreValueEl = document.getElementById('score-value');
    const gameAreaEl = document.getElementById('game-area');
    const gameOverEl = document.getElementById('game-over');
    const spaceshipEl = document.getElementById('spaceship');

    const pressedKeys = new Set();

    const config = {
        speed: 2,
        spaceshipMovingMultiplier: 2.1,
        fireballMovingMultiplier: 10,
        asteroidMultiplier: 4,
        fireInterval: 200,
        asteroidSpanInterval: 3000,
        spacestationSpanInterval: 6000,
        enemySpanInterval: 600,
        asteroidKillScore: 1000,
        enemyKillScore: 2000
      };

      const utils = {
        pxToNumber(val) {
          return +val.replace('px', '');
        },
        numberToPx(val) {
          return `${val}px`;
        },
        randomNumberBetween(min, max) {
          return Math.floor(Math.random() * max) + min;
        },
        hasCollision(el1, el2) {
          const el1Rect = el1.getBoundingClientRect();
          const el2Rect = el2.getBoundingClientRect();  
          return !(
            el1Rect.top > el2Rect.bottom ||
            el1Rect.bottom < el2Rect.top ||
            el1Rect.right < el2Rect.left ||
            el1Rect.left > el2Rect.right
          );
        }
      }

      const scene = {
        get fireBalls() {
          return Array.from(document.querySelectorAll('.fire-ball'));
        },
        get spacestations() {
            return Array.from(document.querySelectorAll('.spacestation'));
        },
        get asteroids() {
          return Array.from(document.querySelectorAll('.asteroid'));
        },
        get enemy() {
          return Array.from(document.querySelectorAll('.enemy'));
        }
      }

      const spaceshipCoordinates = {
        spaceship: spaceshipEl,
        set x(newX) {
          if (newX < 0) {
            newX = 0;
          } else if (newX + spaceshipEl.offsetWidth >= gameAreaEl.offsetWidth) {
            newX = gameAreaEl.offsetWidth - spaceshipEl.offsetWidth;
          }
          this.spaceship.style.left = utils.numberToPx(newX);
        },
        get x() {
          return utils.pxToNumber(this.spaceship.style.left);
        },
        set y(newY) {
          if (newY < 0) {
            newY = 0;
          } else if (newY + spaceshipEl.offsetHeight >= gameAreaEl.offsetHeight) {
            newY = gameAreaEl.offsetHeight - spaceshipEl.offsetHeight;
          }
          this.spaceship.style.top = utils.numberToPx(newY);
        },
        get y() {
          return utils.pxToNumber(this.spaceship.style.top);
        }
      };

      function createGameplay() {
        return {
          loopId: null,
          nextRenderQueue: [],
          lastFireBallTimestamp: 0,
          lastSpacestationTimestamp: 0,
          lastAsteroidTimestamp: 0,
          lastEnemyTimestamp: 0
        };
      }
      let gameplay;

      
      function init() {
        gameplay = createGameplay();
        gameScoreValueEl.innerText = 0;
        spaceshipCoordinates.x = 200;
        spaceshipCoordinates.y = 200;
        spaceshipEl.classList.remove('hidden');
        gameStartEl.classList.add('hidden');
        gameTitleEl.classList.add('hidden');
        gameOverEl.classList.add('hidden');
    
        gameLoop(0);
      }

      function gameOver() {
        gameOverEl.classList.remove('hidden');
        gameStartEl.classList.remove('hidden');
        gameTitleEl.classList.remove('hidden');
        spaceshipEl.classList.add('hidden');
        window.cancelAnimationFrame(gameplay.loopId);
      }

      function addGameElementFactory(className) {
        return function addElement(x, y) {
          const e = document.createElement('div');
          e.classList.add(className);
          e.style.left = utils.numberToPx(x);
          e.style.top = utils.numberToPx(y);
          gameAreaEl.appendChild(e);
        };
      }

      const addFireBall = addGameElementFactory('fire-ball');
      const addSpacestation = addGameElementFactory('spacestation');
      const addAsteroid = addGameElementFactory('asteroid');
      const addEnemy = addGameElementFactory('enemy');

      const pressedKeyActionMap = {
        ArrowUp() {
          spaceshipCoordinates.y -=config.speed * config.spaceshipMovingMultiplier;
        },
        ArrowDown() {
          spaceshipCoordinates.y += config.speed * config.spaceshipMovingMultiplier;
        },
        ArrowLeft() {
          spaceshipCoordinates.x -= config.speed * config.spaceshipMovingMultiplier;
        },
        ArrowRight() {
          spaceshipCoordinates.x += config.speed * config.spaceshipMovingMultiplier;
        },
        Space(timestamp) {
          if (
            spaceshipEl.classList.contains('spaceship-fire') ||
            timestamp - gameplay.lastFireBallTimestamp < config.fireInterval
          ) { return; }
          addFireBall(spaceshipCoordinates.x + 120, spaceshipCoordinates.y+30);
          gameplay.lastFireBallTimestamp = timestamp;
          spaceshipEl.classList.add('spaceship-fire');
          gameplay.nextRenderQueue = gameplay.nextRenderQueue.concat(function clearSpaceshipFire() {
            if (pressedKeys.has('Space')) { return false; }
            spaceshipEl.classList.remove('spaceship-fire');
            return true;
          });
        }
      }

      function processFireBalls() {
        scene.fireBalls.forEach(fbe => {
          const newX = (config.speed * config.fireballMovingMultiplier) + utils.pxToNumber(fbe.style.left);
          if (newX + fbe.offsetWidth >= gameAreaEl.offsetWidth) {
            fbe.remove();
            return;
          }
          fbe.style.left = utils.numberToPx(newX);
        });
      }

      function processNextRenderQueue() {
        gameplay.nextRenderQueue = gameplay.nextRenderQueue.reduce((acc, currFn) => {
          if (currFn()) { return acc; }
          return acc.concat(currFn);
        }, []);
      }

      function processPressedKeys(timestamp){
        pressedKeys.forEach(pressedKey => {
          pressedKeys.forEach(pressedKey => {
            const handler = pressedKeyActionMap[pressedKey];
            if (handler) { handler(timestamp); }
          });
        });
      }

      function processGameElementFactory(
        addFn,
        elementWidth,
        gameplayTimestampName,
        sceneName,
        configName,
        additionalElementProcessor
      ) {
        return function (timestamp) {
          if (timestamp - gameplay[gameplayTimestampName] > config[configName]) {
            const x = gameAreaEl.offsetWidth + elementWidth;
            const y = utils.randomNumberBetween(0, gameAreaEl.offsetHeight - elementWidth);
            addFn(x, y);
            gameplay[gameplayTimestampName] = timestamp;
          }
          scene[sceneName].forEach(ce => {
            const newX = utils.pxToNumber(ce.style.left) - config.speed*config.asteroidMultiplier;
            if (additionalElementProcessor && additionalElementProcessor(ce)) { return; }
            if (newX + 200 < 0) { ce.remove(); }
            ce.style.left = utils.numberToPx(newX);
          });
        }
      }

      function asteroidElementProcessor(asteroidEl) {
        const fireball = scene.fireBalls.find(fe => utils.hasCollision(fe, asteroidEl));
        if (fireball) {
          fireball.remove();
          asteroidEl.classList.add("explosion",setTimeout(function(){  asteroidEl.remove(); }, 100));
         
          gameScoreValueEl.innerText = config.asteroidKillScore + +gameScoreValueEl.innerText;
          return true;
        }
        if (utils.hasCollision(asteroidEl, spaceshipEl)) {
           asteroidEl.classList.add("explosion",setTimeout(function(){  asteroidEl.remove(); }, 100));
           gameOver(); 
           return true; 
          }
        return false;
      }
      
      const processSpacestations=processGameElementFactory(addSpacestation,200,'lastSpacestationTimestamp','spacestations','spacestationSpanInterval');

      const processAsteroids = processGameElementFactory(addAsteroid, 60, 'lastAsteroidTimestamp', 'asteroids', 'asteroidSpanInterval', asteroidElementProcessor);


      function gameLoop(timestamp) {
        gameplay.loopId = window.requestAnimationFrame(gameLoop);
        processPressedKeys(timestamp);
        processNextRenderQueue(timestamp);
        processFireBalls(timestamp);
        processAsteroids(timestamp*config.asteroidMultiplier);
        processSpacestations(timestamp);

        gameScoreValueEl.innerText++;
      }

      gameStartEl.addEventListener('click', function gameStartHandler(){
        init();
      });
      document.addEventListener('keydown', function keydownHandler(e) { pressedKeys.add(e.code); });
      document.addEventListener('keyup', function keyupHandler(e) { pressedKeys.delete(e.code); });
}());