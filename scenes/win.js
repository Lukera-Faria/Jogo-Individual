class win extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'win', // Nome da cena
        });
    }

    // Pré-carregamento de recursos
    preload() {
        this.load.image('win', 'assets/win.jpg'); // Carrega a imagem de fundo
    }

    // Função chamada quando a cena é criada
    create() {
        this.add.image(0, 0, 'win').setOrigin(0, 0).setScale(1.2); // adiciona a imagem 
        this.cameras.main.setBackgroundColor(0x211401); // adiciono um fundo cor marrom escuro
    }

}