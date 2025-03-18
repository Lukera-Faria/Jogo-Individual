class tutorial extends Phaser.Scene{
    constructor() {
        super({
            key: 'tutorial',
        });
    }

    // Pré-carregamento de recursos
    preload() {
        this.load.image('menu', 'assets/ChickenMenu.png');
        this.load.image('awsd', 'assets/awsd.png')
        this.load.image('start', 'assets/startButton.png');
    }

    // Função chamada quando a cena é criada
    create() {
        
        if (game.device.os.desktop){
            console.log("o jogador esta jogando no pc")
        } else{
            console.log("o jogador esta jogando no celular")
        }

        this.add.image(0, 0, 'menu').setOrigin(0, 0).setScale(2);
        this.add.image(40, 350, 'awsd').setOrigin(0, 0).setScale(0.5);
        this.add.image(30, 100, 'start').setOrigin(0, 0).setScale(1);
        // Add start button image and make it interactive
        const startButton = this.add.image(30, 100, 'start').setOrigin(0, 0).setScale(1);
        startButton.setInteractive();

        // Listen for pointer events on the start button
        startButton.on('pointerdown', () => {
            // Transition to the next scene
            this.scene.start('play');
        });

          this.add.text(50, 50, "Capture todas as galinhas", {
            fontFamily: '"Press Start 2P"',
            fontSize: '25px',
            color: '#000000',
            align: 'left'
        });
        this.add.text(30, 325, "Se Mexa com as teclas:", {
            fontFamily: '"Press Start 2P"',
            fontSize: '15px',
            color: '#000000',
            align: 'left'
        });
        game.scale.on('orientationchange', function(orientation) {
            if (orientation === Phaser.Scale.PORTRAIT) {
                console.log('PORTRAIT')
            }  
            if (orientation === Phaser.Scale.LANDSCAPE) {
                console.log('LANDSCAPE')
            } 
        });
    }

    
}