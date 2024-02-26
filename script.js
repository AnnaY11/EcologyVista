window.addEventListener('load', function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;

    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e =>{
                
                if ((e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') 
                    && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
                //console.log(e.key, this.keys);
            });
            window.addEventListener('keyup', e =>{
                
                if ((e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') ){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                //console.log(e.key, this.keys);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 75;
            this.height = 75;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.speed = 0;
            this.vy = 0;
        }
        draw(context){

            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        update(input, enemies){
            //collision detection
            enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance <enemy.width/2 + this.width/2){
                    gameOver = true;
                }
            })
            
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft')>-1) {
                this.speed = -5;
            } else {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if(this.x <0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            //vertical movement
            
            if (input.keys.indexOf('ArrowDown') > -1){
                this.vy = 5;
            } else if (input.keys.indexOf('ArrowUp')>-1) {
                this.vy = -5;
            } else {
                this.vy = 0;
            }
            this.y += this.vy;
            if(this.y <0) this.y = 0;
            else if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }
    }

    

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 1800;
            this.height = 720;
            this.speed = 10;
        }
        draw(context){
            context.drawImage(this.image, 0, 0, 3428, 3000, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, 0, 0, 3428, 3000, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 100;
            this.height = 100;
            this.image = document.getElementById('truck');
            this.x = this.gameWidth;
            this.y = this.gameHeight - randomHeight;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context){

            context.drawImage(this.image, 0, 0, 200, 200, this.x, this.y, this.width, this.height)
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
            
    
        }
    }

    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height))
            randomEnemyInterval = Math.random() * 800 + 500;
            randomHeight = Math.random() * 350;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update();
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displaysStatusText(context){
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score, 20, 50);
        if(gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, try again!', canvas.width/2, 200);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 800;
    let randomEnemyInterval = Math.random() * 800 + 500;
    let randomHeight = Math.random() * 350;

     function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, enemies);   
        handleEnemies(deltaTime); 
        displaysStatusText(ctx);
        if (!gameOver) requestAnimationFrame(animate);

    }
    animate(0);
});


// let gameSpeed = 10;

// const backgroundLayer1 = new Image();
// backgroundLayer1.src = 'assets/background/1427.jpg';

// let x = 0;
// let x2 = 800;

// function animate() {
//     ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
//     ctx.drawImage(backgroundLayer1, 0, 0, 3428, 3000, x, 0, 800, 700);
//     ctx.drawImage(backgroundLayer1, 0, 0, 3428, 3000, x2, 0, 800, 700);

//     if (x < -800) x = 800 + x2 - gameSpeed;
//     else x -= gameSpeed;
//     if (x2 < -800) x2 = 800 + x - gameSpeed;
//     else x2 -= gameSpeed;

//     requestAnimationFrame(animate);
// };
// animate();

// const playerImage = new Image();
// playerImage.src = 'assets/LeafSprite/PNG/icon1.png';

// function animate(){
//     //ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
//     //ctx.fillRect(50,50,100,100);
//     ctx.drawImage(playerImage, 0,0, 200,200);
//     requestAnimationFrame(animate);
// };
// animate();
