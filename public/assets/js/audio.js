class AudioManager {
    constructor() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.select = document.getElementById('select-audio');
        this.slider = document.getElementById('volume-slider');

        this.init();
    }

    init() {
        this.select.addEventListener('change', (e) => {
            if (e.target.value) {
                this.audio.src = e.target.value;
                this.audio.play().catch(console.error);
            } else {
                this.audio.pause();
            }
        });

        this.slider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
        });
        
        this.audio.volume = this.slider.value;
    }
}

const audioManager = new AudioManager();