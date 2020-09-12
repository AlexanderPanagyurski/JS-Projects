; (function game(){
    const gameStartEl = document.getElementById('game-start');
    const gameTitleEl = document.getElementById('game-title');
    const gameAreaEl = document.getElementById('game-area');
    const blueBikeEl = document.getElementById('blue-bike-right');
    const yellowBikeEl = document.getElementById('yellow-bike-left');
    const tron = document.getElementById('tron-avatar');
    const clu = document.getElementById('clu-avatar');


    const config = {
      speed: 7
    }
    const blueBikeCoordinates= {
        blueBike: blueBikeEl,
        set x(newX) {
            if (newX < 0) {
              newX = 0;
            } else if (newX + blueBikeEl.offsetWidth >= gameAreaEl.offsetWidth) {
              newX = gameAreaEl.offsetWidth - blueBikeEl.offsetWidth;
            }
            this.blueBike.style.left = utils.numberToPx(newX);
        },
        get x() {
            return utils.pxToNumber(this.blueBike.style.left);
        },
        set y(newY) {
            if (newY < 0) {
              newY = 0;
            } else if (newY + blueBikeEl.offsetHeight >= gameAreaEl.offsetHeight) {
              newY = gameAreaEl.offsetHeight - blueBikeEl.offsetHeight;
            }
            this.blueBike.style.top = utils.numberToPx(newY);
          },
          get y() {
            return utils.pxToNumber(this.blueBike.style.top);
          },
          set direction(newDirection){

          },
          get direction(){
            return this.direction;
          }
    }

    const yellowBikeCoordinates = {
        yellowBike: yellowBikeEl,
        set x(newX) {
            if (newX < 0) {
              newX = 0;
            } else if (newX + yellowBikeEl.offsetWidth >= gameAreaEl.offsetWidth) {
              newX = gameAreaEl.offsetWidth - yellowBikeEl.offsetWidth;
            }
            this.yellowBike.style.left = utils.numberToPx(newX);
        },
        get x() {
            return utils.pxToNumber(this.yellowBike.style.left);
        },
        set y(newY) {
            if (newY < 0) {
              newY = 0;
            } else if (newY + yellowBikeEl.offsetHeight >= gameAreaEl.offsetHeight) {
              newY = gameAreaEl.offsetHeight - yellowBikeEl.offsetHeight;
            }
            this.yellowBike.style.top = utils.numberToPx(newY);
          },
          get y() {
            return utils.pxToNumber(this.yellowBike.style.top);
          },
          set direction(newDirection){

          },
          get direction(){
            return this.direction;
          }
    }
    
    let gameplay;
    
    function createGameplay() {
        return {
          loopId: null,
        };
    }

    const utils = {
        pxToNumber(val) {
          return +val.replace('px', '');
        },
        numberToPx(val) {
          return `${val}px`;
        }
    }

    function init() {
        gameplay = createGameplay();
        blueBikeCoordinates.x = 200;
        blueBikeCoordinates.y = 200;
        yellowBikeCoordinates.x = 1000;
        yellowBikeCoordinates.y = 200;
        
        blueBikeEl.classList.remove('hidden');
        yellowBikeEl.classList.remove('hidden');
        gameStartEl.classList.add('hidden');
        gameTitleEl.classList.add('hidden');
        tron.classList.add('hidden');
        clu.classList.add('hidden');

        gameLoop(0);
      }
      function bikeMovement(timestamp){

        if(yellowBikeEl.direction==='left'){
          addGameElementFactory('yellow-trail',yellowBikeCoordinates.x,yellowBikeCoordinates.y);
          yellowBikeCoordinates.x -= config.speed;
        } else if(yellowBikeEl.direction === 'right'){
          addGameElementFactory('yellow-trail',yellowBikeCoordinates.x,yellowBikeCoordinates.y);
          yellowBikeCoordinates.x += config.speed;
        } else if(yellowBikeEl.direction === 'up'){
          addGameElementFactory('yellow-trail',yellowBikeCoordinates.x,yellowBikeCoordinates.y);
          yellowBikeCoordinates.y -= config.speed;
        } else if (yellowBikeEl.direction === 'down'){
          addGameElementFactory('yellow-trail',yellowBikeCoordinates.x,yellowBikeCoordinates.y);
          yellowBikeCoordinates.y += config.speed;
        }

        if(blueBikeEl.direction === 'left'){
          addGameElementFactory('blue-trail',blueBikeCoordinates.x,blueBikeCoordinates.y);
          blueBikeCoordinates.x-=config.speed;
        } else if (blueBikeEl.direction === 'right'){
           addGameElementFactory('blue-trail',blueBikeCoordinates.x,blueBikeCoordinates.y);
          blueBikeCoordinates.x += config.speed;
        } else if (blueBikeEl.direction === 'up'){
          addGameElementFactory('blue-trail',blueBikeCoordinates.x,blueBikeCoordinates.y);
          blueBikeCoordinates.y -= config.speed;
        } else if(blueBikeEl.direction === 'down'){
          addGameElementFactory('blue-trail',blueBikeCoordinates.x,blueBikeCoordinates.y);
          blueBikeCoordinates.y += config.speed;
        }
      }
      function addGameElementFactory(className,x,y) {
          const e = document.createElement('div');
          e.classList.add(className);
          e.style.left = utils.numberToPx(x);
          e.style.top = utils.numberToPx(y);
          gameAreaEl.appendChild(e);
      };
      
      function gameLoop(timestamp) {
        gameplay.loopId = window.requestAnimationFrame(gameLoop);
        bikeMovement(timestamp);
     
        //processNextRenderQueue(timestamp);
        // processFireBalls(timestamp);
        // processAsteroids(timestamp*config.asteroidMultiplier);
        // processSpacestations(timestamp);

        // gameScoreValueEl.innerText++;
      }

      gameStartEl.addEventListener('click', function gameStartHandler(){
        init();
      });
      document.addEventListener('keydown', function keydownHandler(e) {

        switch (e.keyCode) {
          case 37:{
            yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-right','yellow-bike-down')
            yellowBikeEl.classList.add('yellow-bike-left');

             if (yellowBikeEl.direction !== 'right') {
                yellowBikeEl.direction = 'left'
              } else {
                yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-left','yellow-bike-down')
                yellowBikeEl.classList.add('yellow-bike-right');
              }
           break;
          }
          case 38:{            
            yellowBikeEl.classList.remove('yellow-bike-left','yellow-bike-right','yellow-bike-down')
            yellowBikeEl.classList.add('yellow-bike-up');

            if (yellowBikeEl.direction !== 'down') {
              yellowBikeEl.direction='up'
            } else {
              yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-left','yellow-bike-right')
              yellowBikeEl.classList.add('yellow-bike-down');
            }
            break;
          }
          case 39:{
            yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-left','yellow-bike-down')
            yellowBikeEl.classList.add('yellow-bike-right');

            if(yellowBikeEl.direction !== 'left'){
              yellowBikeEl.direction='right';
            } else {
              yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-right','yellow-bike-down')
              yellowBikeEl.classList.add('yellow-bike-left');
            }
           break;
          }
          case 40:
            {
              yellowBikeEl.classList.remove('yellow-bike-up','yellow-bike-left','yellow-bike-right')
              yellowBikeEl.classList.add('yellow-bike-down');

              if(yellowBikeEl.direction !== 'up'){
                yellowBikeEl.direction='down';
              } else {
                yellowBikeEl.classList.remove('yellow-bike-left','yellow-bike-right','yellow-bike-down')
                yellowBikeEl.classList.add('yellow-bike-up');
              }
              break;
            }
          case 87:{
            blueBikeEl.classList.remove('blue-bike-left','blue-bike-down','blue-bike-right');
            blueBikeEl.classList.add('blue-bike-up');
            
            if(blueBikeEl.direction !== 'down'){
              blueBikeEl.direction='up';
            } else {
              blueBikeEl.classList.remove('blue-bike-up','blue-bike-left','blue-bike-right');
              blueBikeEl.classList.add('blue-bike-down');
            }
            break;
          }
          case 83:{
            blueBikeEl.classList.remove('blue-bike-up','blue-bike-left','blue-bike-right');
            blueBikeEl.classList.add('blue-bike-down');

            if(blueBikeEl.direction !== 'up'){
              blueBikeEl.direction='down';
            } else {
              blueBikeEl.classList.remove('blue-bike-left','blue-bike-down','blue-bike-right');
              blueBikeEl.classList.add('blue-bike-up');
            }
           break;
          }
          case 65:{
            blueBikeEl.classList.remove('blue-bike-up','blue-bike-down','blue-bike-right');
            blueBikeEl.classList.add('blue-bike-left');

            if(blueBikeEl.direction !== 'right'){
              blueBikeEl.direction='left';
            } else {
              blueBikeEl.classList.remove('blue-bike-up','blue-bike-down','blue-bike-left');
              blueBikeEl.classList.add('blue-bike-right');
            }
           break;
          }
          case 68:{
            blueBikeEl.classList.remove('blue-bike-up','blue-bike-down','blue-bike-left');
            blueBikeEl.classList.add('blue-bike-right');

            if(blueBikeEl.direction !== 'left'){
              blueBikeEl.direction='right';
            } else {
              blueBikeEl.classList.remove('blue-bike-up','blue-bike-down','blue-bike-right');
              blueBikeEl.classList.add('blue-bike-left');
            }
           break; 
          }
        }
      });
     // document.addEventListener('keyup', function keyupHandler(e) { pressedKeys.delete(e.code); });
}());