class play extends Phaser.Scene {
    constructor() {
        super({
            key: 'play',  // Nome da cena
        });

        this.player = null;  // Jogador
        this.cursors = null;  // Controles de movimento
        this.score = 0;  // Pontuação inicial
        this.scoreText = null;  // Texto da pontuação
        this.chicken = null;  // Galinhas
    }

    // Pré-carregamento dos assets
    preload() {
        this.load.image('sky', 'assets/back.png');  // Imagem do fundo
        this.load.image('ground', 'assets/platform.png');  // Imagem do solo
        this.load.spritesheet('chicken', 'assets/Chicken SpriteSheet/ChickenSleeping-Sheet.png', { frameWidth: 20, frameHeight: 21 });  // Sprite das galinhas
        this.load.spritesheet('fox', 'assets/fox.png', { frameWidth: 35, frameHeight: 30 });  // Sprite do jogador (raposa)
        this.load.spritesheet('die', 'assets/Chicken SpriteSheet/ChickenDie-Sheet.png', { frameWidth: 20, frameHeight: 21 });  // Sprite da animação de morte das galinhas
    }

    // Função chamada quando a cena é criada
    create() {
        var platforms;

        // Adiciona a imagem de fundo
        this.add.image(400, 300, 'sky').setScale(3);

        // Criação das plataformas
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 720, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground').setScale(0.15).refreshBody();
        platforms.create(50, 250, 'ground').setScale(0.15).refreshBody();
        platforms.create(750, 220, 'ground').setScale(0.15).refreshBody();

        // Criação do jogador (raposa)
        this.player = this.physics.add.sprite(100, 450, 'fox');
        this.player.setCollideWorldBounds(true);  // Impede que o jogador saia da tela

        // Criação das animações das galinhas
        this.anims.create({
            key: 'chickenIdle',
            frames: this.anims.generateFrameNumbers('chicken', { start: 0, end: 8 }),
            frameRate: 5
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('die', { start: 0, end: 1 }), // Animação de morte das galinhas
            frameRate: 6, // Taxa de quadros
            repeat: 0 // Animação não será repetida
        });

        // Animações do jogador (raposa)
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'fox', frame: 9 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('fox', { start: 10, end: 14 }),
            frameRate: 10,
            repeat: -1  // Repetir infinitamente
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'fox', frame: 1 }],
            frameRate: 1,
            repeat: -1  // Repetir infinitamente
        });

        // Definir controles para o movimento do jogador
        this.cursors = this.input.keyboard.createCursorKeys();

        // Criação do grupo de galinhas
        this.chicken = this.physics.add.group();

        // Criar várias galinhas com posições aleatórias
        for (let i = 0; i < 20; i++) {
            let x = Phaser.Math.Between(50, 750);
            let y = Phaser.Math.Between(50, 500);
            let newChicken = this.chicken.create(x, y, 'chicken');
            newChicken.setBounce(0.2);  // Efeito de pulo pequeno
            newChicken.setCollideWorldBounds(true);  // Impede que as galinhas saiam da tela
            newChicken.setGravityY(3000);  // Faz as galinhas caírem naturalmente
        }

        // Adiciona as colisões do jogodor
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.chicken, platforms);
        this.physics.add.collider(this.chicken, this.chicken);

        // Adiciona o texto de pontuação
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // Detecta colisões entre o jogador e as galinhas
        this.physics.add.overlap(this.player, this.chicken, this.collectChicken, null, this);
    }

    update() {
        // Movimentação do jogador no eixo x
        if (this.cursors.left.isDown) {
            this.player.setFlipX(true);  // Vira a raposa para a esquerda
            this.player.setVelocityX(-160);  // Movimenta para a esquerda
        }
        else if (this.cursors.right.isDown) {
            this.player.setFlipX(false);  // Vira a raposa para a direita
            this.player.setVelocityX(160);  // Movimenta para a direita
        }
        else {
            this.player.setVelocityX(0);  // faz que o jogador pare quando ele parar de apertar a tecla
        }

        // Lógica de pulo
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);  // Pula para cima
        }

        // Animações do jogador
        if (!this.player.body.blocked.down) {
            this.player.anims.play('jump', true);  // Se estiver no ar, toca a animação de pulo
        } else if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.player.anims.play('walk', true);  // Se estiver no chão e em movimento, toca a animação de andar
        } else {
            this.player.anims.play('turn', true);  // Se estiver no chão e parado, toca a animação de estar parado
        }

        // Animação das galinhas
        this.chicken.children.iterate(function (child) {
            if (!child.anims.currentAnim || child.anims.currentAnim.key !== 'dead') {
                child.anims.play('chickenIdle', true);  // Toca a animação de galinha parada se a animação de morte não estiver sendo executada
            }
        });

        // Lógica de movimento das galinhas
        this.chicken.children.iterate((chicken) => {
            let playerX = this.player.x;
            let playerY = this.player.y;
            let chickenX = chicken.x;
            let chickenY = chicken.y;

            // Calcula a direção do movimento das galinhas em relação ao jogador
            let dx = chickenX - playerX;
            let dy = chickenY - playerY;
            let distance = Math.sqrt(dx * dx + dy * dy); // Calcula a distância entre a galinha e o jogador

            // Função que se o joagdor chegar perto de uma galinha ela foge
            if (distance < 200) {
                dx /= distance;  
                dy /= distance;
                chicken.setVelocity(dx * 100, dy * 100);  // Faz a galinha se mover
            } else {
                chicken.setVelocity(0, 0);  // Para o movimento se a galinha estiver longe
            }
        });
    }

    // Função chamada quando o jogador coleta uma galinha
    collectChicken(player, chicken) {
        chicken.anims.play('dead');  // Toca a animação de morte da galinha

        // Incrementa a pontuaçã por 20 pontos
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Quando a animação de morte terminar, faz a galinha desaparecer
        chicken.once('animationcomplete', () => {
            chicken.disableBody(true, true);  // faz a galinha desaparecer

            // Verifica se todas as galinhas foram coletadas
            if (this.chicken.countActive(true) === 0) {
                this.scene.start('win');  // Inicia a cena de vitória
            }
        });
    }
}
