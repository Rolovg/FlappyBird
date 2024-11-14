const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game-container'
};

let game = new Phaser.Game(config);
let bird;
let pipes;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {

    this.load.image('bird', 'assets/bird.png');      
    this.load.image('pipe', 'assets/pipe.png');       
    this.load.image('pipeDown', 'assets/pipe_down.png'); 
    this.load.audio('flap', 'assets/flap.wav');        
    this.load.audio('hit', 'assets/hit.wav');          
}

function create() {

    bird = this.physics.add.sprite(100, 300, 'bird').setScale(0.5);
    bird.setCollideWorldBounds(true);
    bird.body.setGravityY(800);


    pipes = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: addPipes,
        callbackScope: this,
        loop: true
    });


    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });


    this.input.on('pointerdown', flap, this);
    this.input.keyboard.on('keydown-SPACE', flap, this);


    this.physics.add.collider(bird, pipes, hitPipe, null, this);
}

function update() {

    if (gameOver) {
        this.scene.restart();
        gameOver = false;
        score = 0;
    }


    if (bird.angle < 20) bird.angle += 2;
}

function flap() {
    if (gameOver) return;
    bird.setVelocityY(-300);
    bird.angle = -20;
    this.sound.play('flap');
}

function addPipes() {

    const gap = Phaser.Math.Between(150, 350);
    const topPipeY = gap - 640;
    const bottomPipeY = gap + 120;


    const topPipe = pipes.create(500, topPipeY, 'pipeDown').setOrigin(0, 0).setScale(0.8).refreshBody();
    const bottomPipe = pipes.create(500, bottomPipeY, 'pipe').setOrigin(0, 0).setScale(0.8).refreshBody();

    pipes.setVelocityX(-200);


    pipes.children.iterate(pipe => {
        if (pipe.x < -pipe.width) pipe.destroy();
    });


    this.time.addEvent({
        delay: 2000,
        callback: updateScore,
        callbackScope: this
    });


    topPipe.body.allowGravity = false;
    bottomPipe.body.allowGravity = false;
}

function updateScore() {
    if (!gameOver) {
        score += 1;
        scoreText.setText('Score: ' + score);
    }
}

function hitPipe() {
    if (gameOver) return;
    this.sound.play('hit');
    gameOver = true;
}
