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
        this.gameOver = false;
        this.id = 'bird_' + Math.floor(Math.random() * 2000);
        this.imgSrc = './img/bird.png';
        this.jumping = false;
        this.style = {
            position: 'fixed',
            top: 50 + 'px',
            left: 50 + 'px',
            width: 100 + 'px'
        };
        this.movementRatio = 20;

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
            if (_current == 93) {
                console.log(_current);
                let fallenBird = new CustomEvent('FALLEN_BIRD', { 'detail': scope.id });
                document.dispatchEvent(fallenBird);
            }

            var _current = parseInt(scope.style.top);
            var _new = _current < 93 ? _current + 1 : _current;
            scope.style.top = _new;

            document.getElementById(scope.id).style.top = `${_current}%`;
        }, 1000 / 40);
        window.gravityInterval = gravityInterval;
    }

    jump() {

        if (this.gameOver) {
            return;
        }
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
        var scope = this;
        var _current = parseInt(scope.style.left);
        var _new = _current + 50;
        scope.style.left = _new;
        document.getElementById(scope.id).style.left = `${_current}px`;
    }

}

class Info {
    constructor(parentEl, leftOffset, topOffset, text, textAlign = 'none') {
        this.id = 'info_' + Math.floor(Math.random() * 2000);
        this.text = text;
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
        infoEl.innerText = this.text;
        infoEl.classList.add('info-text');
        Object.assign(infoEl.style, this.style);

        parentEl.appendChild(infoEl);
    }
    moveLeft(distance) {
        document.getElementById(this.id).style.left = `${parseInt(this.style.left) - distance / this.moveRatio}px`;
    }
}


function countDown() {
    document.querySelector('#countdown-text p').innerText = '3';
    setTimeout(function () {
        document.querySelector('#countdown-text p').innerText = '2';
        setTimeout(function () {
            document.querySelector('#countdown-text p').innerText = '1';
        }, 1000);
    }, 1000);
}

function showPopup() {
    document.querySelector('.tea-popup').classList.toggle('hidden');
    document.querySelector('.tea-popup').style.opacity = '1';
    document.querySelector('.tea-popup').style.marginLeft = '-385px';
}

function rotateBird(bird) {
    var degrees = 0;
    setInterval(function () {
        document.getElementById(bird.id).style.transform = `rotate(${degrees}deg)`
        degrees += 20;
    }, 1000 / 27)
}

function restart() {
    console.log(document.querySelector('.fallen'));
    document.getElementById('main-text').innerHTML = '';
    document.getElementById('countdown-text').innerHTML = '<p></p>';
    countDown();
    setTimeout(init, 3000);
}

function moveFallenBirdsToLeft() {
    if (document.querySelector('.fallen') != null) {
        var fallenBirds = document.querySelectorAll('.fallen');
        fallenBirds.forEach(function (fallenBird) {
            fallenBird.style.marginLeft = '-1000px';
        })
    }
}

function checkIfUserHasReachedEnd(_distance, bird) {
    if (_distance == 29000) {
        clearInterval(gravityInterval);
        rotateBird(bird);
        showPopup();
        bird.gameOver = true;
    }
}

//contains most of the logic to get things going
function init() {
    //if there are fallen birds, move them 1000px to the left so they don't show
    moveFallenBirdsToLeft();

    //delete countdown text and instruction text
    document.getElementById('main-text').innerHTML = '';
    document.querySelector('#countdown-text p').innerText = '';
    //create the background
    const background = new Background(document.getElementById('background'));
    //create bird
    var bird = new Bird(document.getElementById('background'));
    // create pipes
    const pipes = new Array(20);

    //create the info boxes
    const info = new Info(document.getElementById('main-text'), '1500px', '30%', `Hi! My name is Staffan Strömsholm, I'm a web developer`);
    const info2 = new Info(document.getElementById('main-text'), '2000px', '30%', `I built this with HTML, CSS and Javascript`);
    const info3 = new Info(document.getElementById('main-text'), '2500px', '30%', `I will tell you a bit more about myself, just don't fall down`);
    const info4 = new Info(document.getElementById('main-text'), '3000px', '30%', `Languages and technologies I like to use:`);
    const info5 = new Info(document.getElementById('main-text'), '3500px', '30%', `HTML`, 'center');
    const info6 = new Info(document.getElementById('main-text'), '4000px', '30%', `CSS`, 'center');
    const info7 = new Info(document.getElementById('main-text'), '4500px', '30%', `Javascript`, 'center');
    const info8 = new Info(document.getElementById('main-text'), '5000px', '30%', `NodeJS`, 'center');
    //make an array of them to iterate over
    const infoArr = [info, info2, info3, info4, info5, info6, info7, info8];

    for (var i = 0; i < pipes.length; i++) {
        pipes[i] = new Pipe(document.body);
    }
    var _distance = 0;

    var scope = this;

    //make background scroll automatically
    var backgroundScrollInterval = setInterval(function () {
        checkIfUserHasReachedEnd(_distance, bird);

        background.scrollSideWay(_distance);

        pipes.forEach(function (pipe) {
            pipe.moveLeft(_distance);
        })

        infoArr.forEach(function (info) {
            info.moveLeft(_distance);
        })

        _distance += 100;
    }, 10);

    window.addEventListener('mousedown' || 'touchstart', function () {
        bird.jump();
    })

    window.addEventListener('keydown', function (e) {
        console.log(e.key)
        if (e.key === "ArrowRight") {
            bird.moveRight();
        }
    })

    document.addEventListener('FALLEN_BIRD', function (e) {
        var fallenBird = document.getElementById(e.detail);
        fallenBird.classList.add('fallen');
        document.getElementById('countdown-text').innerHTML = '';
        document.getElementById('main-text').innerHTML = `<h1>Game Over</h1>`
        var button = document.createElement('input');
        button.type = 'button';
        button.value = 'Try Again';
        button.id = 'try-again';
        document.getElementById('countdown-text').appendChild(button);
        button.onclick = restart;
        clearInterval(backgroundScrollInterval);
        clearInterval(gravityInterval);
        bird.gameOver = true;
    })
};

// ======IIFE======
(function () {
    var background = new Background(document.getElementById('background'));
    countDown();
    setTimeout(init, 3000);
})();