;
(function game() {

    const gameStartEl = document.getElementById('game-start');
    const gameTitleEl = document.getElementById('game-title');
    const gameScoreValueEl = document.getElementById('score-value');
    const gameAreaEl = document.getElementById('game-area');
    const gameOverEl = document.getElementById('game-over');
    const spinnerEl = document.getElementById('spinner');
    const cityEl = document.getElementById('city').childNodes[0];

    const pressedKeys = new Set();

    const config = {
        speed: 2,
        spinnerMovingMultiplier: 2.1,
        fireballMovingMultiplier: 10,
        spacestationMultiplier: 2,
        galaxyMultiplier: 1.1,
        starMultiplier: 5,
        enemyMultiplier: 6,
        asteroidMultiplier: 4,
        missileMultipler: 8,
        fireInterval: 200,
        asteroidSpanInterval: 3000,
        spacestationSpanInterval: 6000,
        galaxySpanInterval: 10000,
        starSpanInterval: 1000,
        enemySpanInterval: 8000,
        missileSpanInterval: 10000,
        asteroidKillScore: 1000,
        enemyKillScore: 2000
    };

    function moveBuildings(timestamp) {
        let cityElPositon=Number(cityEl.style.left.replace('px',''))+1;
        cityEl.style.left = `${cityElPositon}px`;
        console.log((cityEl)+' '+cityEl.style.left)
    }

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
        get enemies() {
            return Array.from(document.querySelectorAll('.enemy'));
        }
    }

    const spinnerCoordinates = {
        spinner: spinnerEl,
        set x(newX) {
            if (newX < 0) {
                newX = 0;
            } else if (newX + spinnerEl.offsetWidth >= gameAreaEl.offsetWidth) {
                newX = gameAreaEl.offsetWidth - spinnerEl.offsetWidth;
            }
            this.spinner.style.left = utils.numberToPx(newX);
        },
        get x() {
            return utils.pxToNumber(this.spinner.style.left);
        },
        set y(newY) {
            if (newY < 0) {
                newY = 0;
            } else if (newY + spinnerEl.offsetHeight >= gameAreaEl.offsetHeight) {
                newY = gameAreaEl.offsetHeight - spinnerEl.offsetHeight;
            }
            this.spinner.style.top = utils.numberToPx(newY);
        },
        get y() {
            return utils.pxToNumber(this.spinner.style.top);
        }
    };

    function createGameplay() {
        return {
            loopId: null,
            nextRenderQueue: [],
            lastFireBallTimestamp: 0,
            lastSpacestationTimestamp: 0,
            lastAsteroidTimestamp: 0,
            lastEnemyTimestamp: 0,
            lastGalaxyTimestamp: 0,
            lastMissleTimestamp: 0,
            lastStarTimestamp: 0
        };
    }
    let gameplay;


    function init() {
        gameplay = createGameplay();
        gameScoreValueEl.innerText = 0;
        spinnerCoordinates.x = 200;
        spinnerCoordinates.y = 200;
        spinnerEl.classList.remove('hidden');
        gameStartEl.classList.add('hidden');
        gameTitleEl.classList.add('hidden');
        gameOverEl.classList.add('hidden');

        gameLoop(0);
    }

    function gameOver() {
        gameOverEl.classList.remove('hidden');
        gameStartEl.classList.remove('hidden');
        gameTitleEl.classList.remove('hidden');
        spinnerEl.classList.add('hidden');
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
    const addEnemy = addGameElementFactory('enemy');

    const pressedKeyActionMap = {
        ArrowUp() {
            spinnerCoordinates.y -= config.speed * config.spinnerMovingMultiplier;
        },
        ArrowDown() {
            spinnerCoordinates.y += config.speed * config.spinnerMovingMultiplier;
        },
        ArrowLeft() {
            spinnerCoordinates.x -= config.speed * config.spinnerMovingMultiplier;
        },
        ArrowRight() {
            spinnerCoordinates.x += config.speed * config.spinnerMovingMultiplier;
        },
        Space(timestamp) {
            if (
                spinnerEl.classList.contains('spinner-fire') ||
                timestamp - gameplay.lastFireBallTimestamp < config.fireInterval
            ) {
                return;
            }
            addFireBall(spinnerCoordinates.x + 120, spinnerCoordinates.y + 30);
            gameplay.lastFireBallTimestamp = timestamp;
            spinnerEl.classList.add('spinner-fire');
            gameplay.nextRenderQueue = gameplay.nextRenderQueue.concat(function clearspinnerFire() {
                if (pressedKeys.has('Space')) { return false; }
                spinnerEl.classList.remove('spinner-fire');
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

    function processPressedKeys(timestamp) {
        pressedKeys.forEach(pressedKey => {
            pressedKeys.forEach(pressedKey => {
                const handler = pressedKeyActionMap[pressedKey];
                if (handler) { handler(timestamp); }
            });
        });
    }

    function processGameElementFactory(
        speedMultiplier,
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
                const newX = utils.pxToNumber(ce.style.left) - config.speed * speedMultiplier;
                if (additionalElementProcessor && additionalElementProcessor(ce)) { return; }
                if (newX + 200 < 0) { ce.remove(); }
                ce.style.left = utils.numberToPx(newX);
            });
        }
    }

    function enemyElementProcessor(enemyEl) {
        const fireball = scene.fireBalls.find(fe => utils.hasCollision(fe, enemyEl));
        if (fireball) {
            fireball.remove();
            enemyEl.classList.add("explosion", setTimeout(function () { enemyEl.remove(); }, 100));

            gameScoreValueEl.innerText = config.enemyKillScore + +gameScoreValueEl.innerText;
            return true;
        }
        if (utils.hasCollision(enemyEl, spinnerEl)) {
            enemyEl.classList.add("explosion", setTimeout(function () { enemyEl.remove(); }, 100));
            gameOver();
            return true;
        }
        return false;
    }

    const processSpacestations = processGameElementFactory(config.spacestationMultiplier, addSpacestation, 200, 'lastSpacestationTimestamp', 'spacestations', 'spacestationSpanInterval');


    const processEnemies = processGameElementFactory(config.enemyMultiplier, addEnemy, 60, 'lastEnemyTimestamp', 'enemies', 'enemySpanInterval', enemyElementProcessor);



    function gameLoop(timestamp) {
        gameplay.loopId = window.requestAnimationFrame(gameLoop);
        processPressedKeys(timestamp);
        processNextRenderQueue(timestamp);
        processFireBalls(timestamp);
        processSpacestations(timestamp);
        processEnemies(timestamp * config.asteroidMultiplier);
        moveBuildings(timestamp);

        gameScoreValueEl.innerText++;
    }

    gameStartEl.addEventListener('click', function gameStartHandler() {
        init();
    });
    document.addEventListener('keydown', function keydownHandler(e) { pressedKeys.add(e.code); });
    document.addEventListener('keyup', function keyupHandler(e) { pressedKeys.delete(e.code); });
}());