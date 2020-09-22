class Background {
    constructor(el, bg = '../img/bg.png'){
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
        this.moveRatio = 50;
        Object.assign(this.el.style, this.style);
    }

    scrollSideWay(distance){
        this.el.style.backgroundPosition = `-${distance / this.moveRatio}px 0px`;
    }
}

class Pipe {
    constructor(parentEl){
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

    moveLeft(distance){
        document.getElementById(this.id).style.left = `${parseInt(this.style.left) - distance / this.moveRatio}px`;  
    }
}

class Bird {
    constructor(parentEl){
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
    }

    addGravity(){
        var scope = this;
        var clientHeight = parseInt(window.clientHeight);
        var gravityInterval = setInterval(function(){
            if(scope.style.top == clientHeight){
                console.log(clientHeight);
                let event = new Event('gameOver');
                this.dispatchEvent(event);
            }
            if(scope.jumping){
                return;
            }
          var _current = parseInt(scope.style.top);

          var _new = _current < document.documentElement.clientHeight-55 ? _current + 5 : _current;
          scope.style.top = _new;

          document.getElementById(scope.id).style.top = `${_current}px`;
        }, 1000/40);
    }

    jump(){
        var scope = this;
        var counter = 0;

        this.jumping = true;

        setInterval(function(){
            if(counter === 10){
                scope.jumping = false;
                return;
            }
            var _current = parseInt(scope.style.top);
            counter++;
            var _new = _current > 1 ? _current - 20 : _current;
            scope.style.top = _new;

            document.getElementById(scope.id).style.top = `${_current}px`;
        }, 1000/75)
    }
}

(function(){
    var background = new Background(document.getElementById('background'));
    var bird = new Bird(document.getElementById('background'));
    var pipes = new Array(100);
    for (var i = 0; i < pipes.length; i++){
        pipes[i] = new Pipe(document.body);
    }
    var _distance = 0;

    var backgroundScrollInterval = setInterval(function(){
        
        background.scrollSideWay(_distance);
        pipes.forEach(function(pipe){
            pipe.moveLeft(_distance);
        })
        _distance += 100;
    }, 10);

    window.addEventListener('mousedown', function(){
        bird.jump();
    })
    window.addEventListener('gameOver', function(){
        clearInterval(backgroundScrollInterval);
    })
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

