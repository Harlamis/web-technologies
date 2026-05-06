class Slider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.items = options.items || [];
        this.duration = options.duration || 500;
        this.autoplay = options.autoplay || false;
        this.autoplayInterval = options.autoplayInterval || 3000;
        this.showArrows = options.showArrows !== false;
        this.showDots = options.showDots !== false;
        
        this.currentIndex = 0;
        this.timer = null;
        
        this.init();
    }

    init() {
        if (!this.container || this.items.length === 0) return;
        this.render();
        this.sliderWrapper = this.container.querySelector('.slider-container');
        this.track = this.container.querySelector('.slider-track');
        this.dots = this.container.querySelectorAll('.dot');
        
        this.setupEvents();
        if (this.autoplay) this.startAutoplay();
    }

    render() {
        let html = `<div class="slider-container" tabindex="0">
            <div class="slider-track" style="transition: transform ${this.duration}ms ease;">`;
        
        this.items.forEach(item => {
            if (item.type === 'image') {
                html += `<div class="slide"><img src="${item.src}" alt="slide image"></div>`;
            } else {
                html += `<div class="slide">${item.content}</div>`;
            }
        });

        html += `</div>`;

        if (this.showArrows) {
            html += `<div class="slider-arrows">
                <button class="arrow prev">&#10094;</button>
                <button class="arrow next">&#10095;</button>
            </div>`;
        }

        if (this.showDots) {
            html += `<div class="slider-dots">`;
            this.items.forEach((_, i) => {
                html += `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
        this.container.innerHTML = html;
    }

    goTo(index) {
        if (index < 0) index = this.items.length - 1;
        if (index >= this.items.length) index = 0;
        
        this.currentIndex = index;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateDots();
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    updateDots() {
        if (!this.showDots) return;
        this.dots.forEach(dot => dot.classList.remove('active'));
        if (this.dots[this.currentIndex]) {
            this.dots[this.currentIndex].classList.add('active');
        }
    }

    startAutoplay() {
        this.stopAutoplay();
        this.timer = setInterval(() => this.next(), this.autoplayInterval);
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    setupEvents() {
        if (this.showArrows) {
            this.container.querySelector('.prev').addEventListener('click', () => this.prev());
            this.container.querySelector('.next').addEventListener('click', () => this.next());
        }

        if (this.showDots) {
            this.container.querySelector('.slider-dots').addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    this.goTo(parseInt(e.target.dataset.index));
                }
            });
        }

        this.sliderWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        if (this.autoplay) {
            this.sliderWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
            this.sliderWrapper.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
}

const mySlider = new Slider('slider-root', {
    items: [
        { type: 'text', content: 'Slide 1' },
        { type: 'text', content: 'Slide 2' },
        { type: 'text', content: 'Slide 3' },
        { type: 'text', content: 'Slide 4' }
    ],
    duration: 600,
    autoplay: true,
    autoplayInterval: 2500,
    showArrows: true,
    showDots: true
});