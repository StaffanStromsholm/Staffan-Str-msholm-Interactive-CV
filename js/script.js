//jumping sound
var sound = new Howl({
    src: ['./sounds/sfx_movement_ladder1a.wav'],
    volume: 0.15
});
//sound when bird has fallen
var sound2 = new Howl({
    src: ['./sounds/sfx_sounds_falling6.wav'],
    volume: 0.15
});
//sound when popup opens
var sound3 = new Howl({
    src: ['./sounds/sfx_movement_portal1.wav'],
    volume: 0.15
});

class Background {
    constructor(el, bg = './img/bg.png') {
        this.el = el;
        this.style = {
            left: 0,
            top: 0,
            position: 'fixed',
            height: '100%',
            width: '100%',
            backgroundImage: null,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: '0 0',
            backgroundSize: 'auto 100%',
            backgroundImage: `url("${bg}")`
        };
        this.moveRatio = 100;
        Object.assign(this.el.style, this.style);
    }

    scrollSideWay(distance) {
        this.el.style.backgroundPosition = `-${distance / this.moveRatio}px 0px`;
    }
}

class Pipe {
    constructor(parentEl) {
        this.id = 'pipe_' + Math.floor(Math.random() * 2000);
        this.imgSrc = './img/pipe.png';
        this.size = null;
        this.style = {
            position: 'fixed',
            top: null,
            left: Math.floor(Math.random() * 50000) + 'px',
            width: Math.floor(Math.random() * 200) + 'px',
            bottom: 0
        };
        this.flip = false;
        this.moveRatio = 20;

        var pipeEl = document.createElement('img');
        pipeEl.src = this.imgSrc;
        pipeEl.id = this.id;
        Object.assign(pipeEl.style, this.style);

        parentEl.appendChild(pipeEl);
    }

    moveLeft(distance) {
        document.getElementById(this.id).style.left = `${parseInt(this.style.left) - distance / this.moveRatio}px`;
    }
}

class Bird {
    constructor(parentEl) {
        this.id = 'bird_' + Math.floor(Math.random() * 2000);
        this.imgSrc = './img/bird.png';
        this.jumping = false;
        this.style = {
            position: 'fixed',
            top: 50 + 'px',
            left: 50 + 'px',
            width: 100 + 'px'
        };
        this.movementRatio = 35;
        this.rotationRatio = 27;

        var birdEl = document.createElement('img');
        birdEl.src = this.imgSrc;
        birdEl.id = this.id;
        Object.assign(birdEl.style, this.style);

        parentEl.appendChild(birdEl);
        this.addGravity();
    }

    //Gravity mechanism
    addGravity() {
        var scope = this;

        var gravityInterval = setInterval(function () {
            if (scope.jumping) {
                return;
            }

            var _current = parseInt(scope.style.top);
            if (_current == 100) {
                let fallenBird = new CustomEvent('FALLEN_BIRD', { 'detail': scope.id });
                document.dispatchEvent(fallenBird);
                
            }

            var _current = parseInt(scope.style.top);
            var _new = _current < 100 ? _current + 1 : _current;
            scope.style.top = _new;

            document.getElementById(scope.id).style.top = `${_current}%`;
        }, 1000 / this.movementRatio);
        window.gravityInterval = gravityInterval;
    }

    jump() {

        if (model.gameOver) {
            return;
        }
        sound.play()
        var scope = this; //make it possible to access this scope inside setInterval
        var counter = 0;
        this.jumping = true;

        setInterval(function () {
            if (counter === 10) {
                scope.jumping = false;
                return;
            }
            var _current = parseInt(scope.style.top);
            counter++;
            var _new = _current > 1 ? _current - 2 : _current;
            scope.style.top = _new;
            document.getElementById(scope.id).style.top = `${_current}%`;
        }, 1000 / 75)
    }

    moveRight() {
        //cancel moveRight if gameOver or bird is near the right edge
        if (model.gameOver || this.style.left >= (screen.width - 70)) {
            return;
        }
        var scope = this;
        var _current = parseInt(scope.style.left);
        var _new = _current + 50;
        scope.style.left = _new;
        document.getElementById(scope.id).style.left = `${_current}px`;
    }
    moveLeft() {
        //cancel moveRight if gameOver or bird is near the left edge
        if (model.gameOver || this.style.left <= -50) {
            return;
        }
        var scope = this;
        var _current = parseInt(scope.style.left);
        var _new = _current - 50;
        scope.style.left = _new;
        document.getElementById(scope.id).style.left = `${_current}px`;
    }
    //rotation magic
    rotateBird(bird) {
        var degrees = 0;
        setInterval(function () {
            document.getElementById(bird.id).style.transform = `rotate(${degrees}deg)`
            degrees += 20;
        }, 1000 / this.rotationRatio);
    }

}

class Info {
    constructor(parentEl, leftOffset, topOffset, innerHTML, textAlign = 'none') {
        this.id = 'info_' + Math.floor(Math.random() * 2000);
        this.innerHTML = innerHTML;
        this.style = {
            position: 'fixed',
            top: topOffset,
            left: leftOffset,
            bottom: null,
            textAlign: textAlign
        };

        this.moveRatio = 50;

        var infoEl = document.createElement('h2');
        infoEl.id = this.id;
        infoEl.innerHTML = this.innerHTML;
        infoEl.classList.add('info-text');
        Object.assign(infoEl.style, this.style);

        parentEl.appendChild(infoEl);
    }
    moveLeft(distance) {
        document.getElementById(this.id).style.left = `${parseInt(this.style.left) - distance / this.moveRatio}px`;
    }
}

var model = {
    gameOver : false
}

var view = {
    showPopup: function () {
        sound3.play();
        document.querySelector('.tea-popup').classList.toggle('hidden');
        document.querySelector('.tea-popup').style.opacity = '1';
        document.querySelector('.tea-popup').style.marginLeft = '-385px';
    },
    countDown: function () {
        document.querySelector('#countdown-text p').innerText = '5';
        setTimeout(function () {
            document.querySelector('#countdown-text p').innerText = '4';
            setTimeout(function () {
                document.querySelector('#countdown-text p').innerText = '3';
                setTimeout(function () {
                    document.querySelector('#countdown-text p').innerText = '2';
                    setTimeout(function () {
                        document.querySelector('#countdown-text p').innerText = '1';
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    },
    initializeTexts: function () {
        document.getElementById('main-text').innerHTML = '';
        document.querySelector('#countdown-text p').innerText = '';
    },
    removeFallenBirds: function () {
        if (document.querySelector('.fallen') != null) {
            var fallenBirds = document.querySelectorAll('.fallen');
            fallenBirds.forEach(function (fallenBird) {
                fallenBird.style.display = 'none';
            })
        }
    },
    makeGameOverTextAndRetryButton: function() {
        document.getElementById('countdown-text').innerHTML = '';
        document.getElementById('main-text').innerHTML = `<h1>Game Over</h1>`
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'Try Again';
        button.id = 'try-again';
        document.getElementById('countdown-text').appendChild(button);
        button.onclick = () => {
            window.location.reload();
        }
    }
}

var controller = {
    checkIfUserHasReachedEnd: function (_distance, bird) {
        if (_distance == 400000) {
            clearInterval(gravityInterval);
            bird.rotateBird(bird);
            view.showPopup();
            model.gameOver = true;
        }
    },
    listenForKeypresses: function (bird) {
        window.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                bird.moveRight();
            } else if (e.key === ' ') {
                bird.jump();
            } else if (e.key === 'ArrowLeft') {
                bird.moveLeft();
            };
        })
    },
    listenForClicks: function(bird){
        window.addEventListener('mousedown' || 'touchstart', function (e) {
            if(e.target.id === 'leftBtn' || e.target.id === 'rightBtn'){
                return;
            }
            bird.jump();
        })
    },
    listenForButtonPresses: function(bird){
        document.getElementById('leftBtn').addEventListener('click', function(){
            bird.moveLeft();
        })
        document.getElementById('rightBtn').addEventListener('click', function(){
            bird.moveRight();
        })
    }
}



//contains most of the logic to get things going
function init() {
    //if there are fallen birds, set them to display: none
    view.removeFallenBirds();

    //delete countdown text and instruction text
    view.initializeTexts();

    //create the background
    const background = new Background(document.getElementById('background'));

    //create bird
    var bird = new Bird(document.getElementById('background'));

    // create pipes
    const pipes = new Array(20);

    //create the info boxes
    const info = new Info(document.getElementById('main-text'), '1500px', '30%', `Hi! My name is Staffan Strömsholm, <br> welcome to my interactive CV.`);
    const info2 = new Info(document.getElementById('main-text'), '2500px', '30%', `I am a student at Business College Helsinki studying fullstack development.`);
    const info3 = new Info(document.getElementById('main-text'), '3500px', '30%', `I love programming, music and solving problems.`);
    const info4 = new Info(document.getElementById('main-text'), '4500px', '30%', `Frontend technologies I use: <br>HTML, CSS, Javascript, Bootstrap`);
    const info5 = new Info(document.getElementById('main-text'), '5500px', '30%', `Backend technologies I use: <br>NodeJS, Express`);
    const info6 = new Info(document.getElementById('main-text'), '6500px', '30%', `Databases:<br>MongoDB`, 'center');
    const info7 = new Info(document.getElementById('main-text'), '7500px', '30%', `Other technologies I use: <br>Git, GitHub`, 'center');
    // const info8 = new Info(document.getElementById('main-text'), '8500px', '30%', `I speak <br>1. Swedish: mother tongue <br>2. English: very good <br>3. Finnish: Fair`);

    //make an array of info to iterate over
    const infoArr = [info, info2, info3, info4, info5, info6, info7];

    for (var i = 0; i < pipes.length; i++) {
        pipes[i] = new Pipe(document.body);
    }
    
    //make background and pipes scroll automatically
    var _distance = 0;
    var backgroundScrollInterval = setInterval(function () {
        controller.checkIfUserHasReachedEnd(_distance, bird);
        background.scrollSideWay(_distance);
        pipes.forEach(function (pipe) {
            pipe.moveLeft(_distance);
        })
        infoArr.forEach(function (info) {
            info.moveLeft(_distance);
        })
        _distance += 100;
    }, 10);


    controller.listenForClicks(bird);

    controller.listenForKeypresses(bird);

    controller.listenForButtonPresses(bird);

    document.addEventListener('FALLEN_BIRD', function (e) {
        sound2.play()
        var fallenBird = document.getElementById(e.detail);
        fallenBird.classList.add('fallen');
        view.makeGameOverTextAndRetryButton();
        clearInterval(backgroundScrollInterval);
        clearInterval(gravityInterval);
        model.gameOver = true;
    })
};

// ======IIFE======
(function () {
    var background = new Background(document.getElementById('background'));
    view.countDown();
    setTimeout(init, 5000);
})();