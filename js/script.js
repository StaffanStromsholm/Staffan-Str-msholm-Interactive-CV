class Background {
    constructor(el, bg = '../img/bg.png') {
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
        this.imgSrc = '../img/pipe.png';
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
        this.id = 'bird_';
        this.imgSrc = '../img/bird.png';
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
        birdEl.addEventListener('gameOver', function () {
            console.log('game over')
            clearInterval(backgroundScrollInterval);
        })
    }

    addGravity() {
        var scope = this;
        var clientHeight = parseInt(window.clientHeight);
        var gravityInterval = setInterval(function () {
            if (scope.style.top == '100%') {
                console.log(clientHeight);
                let event = new Event('gameOver');
                this.dispatchEvent(event);
            }
            if (scope.jumping) {
                return;
            }
            var _current = parseInt(scope.style.top);

            var _new = _current < 93 ? _current + 1 : _current;
            scope.style.top = _new;

            document.getElementById(scope.id).style.top = `${_current}%`;

            if (scope.style.top === 93) {
                scope.gameOver = true;
                clearInterval(backgroundScrollInterval);
                clearInterval(gravityInterval);


            }
        }, 1000 / 40);
        window.gravityInterval = gravityInterval;
    }

    jump() {
        if (this.gameOver) {
            return;
        }
        var scope = this;
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
}

class Info {
    constructor(parentEl, leftOffset, topOffset, text) {
        this.id = 'info_' + Math.floor(Math.random() * 2000);
        this.text = text;
        this.style = {
            position: 'fixed',
            top: topOffset,
            left: leftOffset,
            width: '50%',
            bottom: null
        };

        this.moveRatio = 50;

        var infoEl = document.createElement('h2');
        infoEl.id = this.id;
        infoEl.innerText = this.text;
        Object.assign(infoEl.style, this.style);

        parentEl.appendChild(infoEl);
    }
    moveLeft(distance) {
        document.getElementById(this.id).style.left = `${parseInt(this.style.left) - distance / this.moveRatio}px`;
    }
}

(function () {
    var background = new Background(document.getElementById('background'));
    var bird = new Bird(document.getElementById('background'));
    var pipes = new Array(20);

    var info = new Info(document.getElementById('main-text'), '1000px', '30%', `Hi! My name is Staffan Strömsholm, I'm a web developer`);
    var info2 = new Info(document.getElementById('main-text'), '1700px', '20%', `I built this with HTML, CSS and Javascript`);
    var info3 = new Info(document.getElementById('main-text'), '2400px', '20%', `I will tell you a bit more about myself, just don't fall down`);
    var info4 = new Info(document.getElementById('main-text'), '3100px', '40%', `Languages and technologies I like to use:`);
    var info5 = new Info(document.getElementById('main-text'), '3500px', '36%', `HTML`);
    var info6 = new Info(document.getElementById('main-text'), '3900px', '33%', `CSS`);
    var info7 = new Info(document.getElementById('main-text'), '4300px', '38%', `Javascript`);
    var info8 = new Info(document.getElementById('main-text'), '4700px', '35%', `NodeJS`);



    var infoArr = [info, info2, info3, info4, info5, info6, info7, info8];

    for (var i = 0; i < pipes.length; i++) {
        pipes[i] = new Pipe(document.body);
    }
    var _distance = 0;

    var backgroundScrollInterval = setInterval(function () {

        background.scrollSideWay(_distance);
        pipes.forEach(function (pipe) {
            pipe.moveLeft(_distance);
        })
        infoArr.forEach(function (info) {
            info.moveLeft(_distance);
        })
        _distance += 100;
    }, 10);

    window.addEventListener('mousedown', function () {
        bird.jump();
    })
    window.addEventListener('gameOver', function () {
        console.log('game over')
        clearInterval(backgroundScrollInterval);
        clearInterval(gravityInterval);
    })
    window.backgroundScrollInterval = backgroundScrollInterval;
})();

// $(document).ready(function(){
//     var background = new Background(
//         document.getElementById('background')
//     );

//     document.addEventListener('scroll', function(){
//         var offset = window.scrollY;

//         background.scrollSideWay(offset);
//         pipe1.moveLeft(offset)
//         pipe2.moveLeft(offset)
//         pipe3.moveLeft(offset)
//         pipe4.moveLeft(offset)
//         pipe5.moveLeft(offset)
//     })

//     var pipe1 = new Pipe(document.body);
//     var pipe2 = new Pipe(document.body);
//     var pipe3 = new Pipe(document.body);
//     var pipe4 = new Pipe(document.body);
//     var pipe5 = new Pipe(document.body);
// });

