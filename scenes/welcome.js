// Definindo a cena de boas-vindas usando a biblioteca Phaser
class Welcome extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'Welcome',
        });
    }

    // Pré-carregamento de recursos
    preload() {
        this.load.image('menu', 'assets/ChickenMenu.png');
        this.load.image('start', 'assets/startButton.png');
    }

    // Função chamada quando a cena é criada
    create() {
        this.add.image(0, 0, 'menu').setOrigin(0, 0).setScale(2);
        this.add.image(30, 100, 'start').setOrigin(0, 0).setScale(1);
        // Add start button image and make it interactive
        const startButton = this.add.image(30, 100, 'start').setOrigin(0, 0).setScale(1);
        startButton.setInteractive();

        // Listen for pointer events on the start button
        startButton.on('pointerdown', () => {
            // Transition to the next scene
            this.scene.start('tutorial');
        });
    }
}