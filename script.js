class Storm {
    constructor() {
        this.init();
    }

    init() {
        this.elements = {
            frontRain: document.getElementById('frontRain'),
            backRain: document.getElementById('backRain'),
            lightning: document.getElementById('lightning'),
            hint: document.getElementById('hint'),
            body: document.body
        };

        this.createRain();
        this.setupEvents();
        
        console.log('Tempestade iniciada!');
    }

    createRain() {
        // Limpar chuva existente
        this.elements.frontRain.innerHTML = '';
        this.elements.backRain.innerHTML = '';

        // Criar pingos de chuva
        const dropCount = Math.min(100, window.innerWidth / 5);
        
        for (let i = 0; i < dropCount; i++) {
            this.createDrop(this.elements.frontRain, i, dropCount, 0);
            this.createDrop(this.elements.backRain, i, dropCount, 0.2);
        }
    }

    createDrop(container, index, totalDrops, delayModifier) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        
        const left = (index / totalDrops) * 100;
        const delay = (Math.random() * 2) + delayModifier;
        const duration = 1 + Math.random() * 0.5;
        
        drop.style.left = left + '%';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = duration + 's';
        
        container.appendChild(drop);
    }

    setupEvents() {
        // Clique para relâmpago
        this.elements.body.addEventListener('click', (e) => {
            this.createLightning(e.clientX);
        });

        // Toque para mobile
        this.elements.body.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.createLightning(touch.clientX);
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.createLightning(window.innerWidth / 2);
            }
        });

        // Redimensionamento
        window.addEventListener('resize', () => {
            setTimeout(() => this.createRain(), 100);
        });

        // Esconder hint após primeira interação
        const hideHint = () => {
            this.elements.hint.style.opacity = '0';
            setTimeout(() => {
                this.elements.hint.style.display = 'none';
            }, 1000);
        };

        this.elements.body.addEventListener('click', hideHint, { once: true });
        this.elements.body.addEventListener('touchend', hideHint, { once: true });
    }

    createLightning(x) {
        const lightning = this.elements.lightning;
        
        // Ativar relâmpago
        lightning.classList.add('active');
        
        // Criar efeito de posição baseado no clique
        lightning.style.background = `radial-gradient(
            circle at ${x}px 50%,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.3) 40%,
            transparent 70%
        )`;
        
        // Som de trovão
        this.playThunderSound();
        
        // Tremor nas nuvens
        this.shakeClouds();
        
        // Remover classe após animação
        setTimeout(() => {
            lightning.classList.remove('active');
        }, 500);
    }

    playThunderSound() {
        // Som simples usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 80;
            
            gainNode.gain.value = 0.1;
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2);
        } catch (e) {
            console.log('Áudio não suportado');
        }
    }

    shakeClouds() {
        const clouds = document.getElementById('clouds');
        clouds.style.transform = 'translateX(10px)';
        
        setTimeout(() => {
            clouds.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                clouds.style.transform = 'translateX(0)';
            }, 100);
        }, 50);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.storm = new Storm();
});
