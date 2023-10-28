const buttonCloseNav = document.getElementById('button-close-navbar');
const buttonOpenNav = document.getElementById('button-open-navbar');
const mobileNavbar = document.getElementById('mobile-navbar');

buttonOpenNav.onclick = function () {
    mobileNavbar.classList.remove('translate-x-full')
}
buttonCloseNav.onclick = function () {
    mobileNavbar.classList.add('translate-x-full')
}

function scrollerHelper(event) {
    event.preventDefault();
    const selector = event.target.getAttribute('href')
    const element = document.querySelector(selector)
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        })
    }
}

class ImageSlider {
    interval = null
    currentSlide = 1
    slides = []
    buttons = []
    activeTag = 'slide-active'
    timer = 10000

    constructor(slides, buttons, activeTag = 'slide-active') {
        this.slides = document.querySelectorAll(slides)
        this.buttons = document.querySelectorAll(buttons)
        this.activeTag = activeTag
    }

    navigate() {
        let actives = document.getElementsByClassName(this.activeTag)
        Array.from(actives).forEach((slide) => {
            slide.classList.remove(this.activeTag)
        })
        this.slides[this.currentSlide].classList.add(this.activeTag)
    }

    repeat() {
        this.interval = setInterval(() => {
            this.navigate()
            this.currentSlide++
            if (this.slides.length == this.currentSlide) {
                this.currentSlide = 0;
            }
            if (this.currentSlide >= this.slides.length) {
                return
            }
        }, this.timer)
    }

    activateButtons() {
        this.buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index
                this.navigate();
                clearInterval(this.interval);
                this.repeat()
            })
        })
    }

    setTimer(time) {
        this.timer = time
        return this
    }
}


class HorizontalSlider {
    currentStep = 0
    wrapper = undefined
    step = 0

    constructor(wrapper) {
        const container = document.querySelectorAll(wrapper)[0]
        this.wrapper = container

        window.addEventListener('resize', () => {
            this.next(true)
        })
    }

    render() {
        this.wrapper.style.transform = `translateX(${-this.currentStep * this.step}px)`
        return this
    }

    next(fix = false) {
        const visibleItems = this.visibleElements()
        if(!fix) this.currentStep++
        if (this.currentStep * this.step > (this.step * (this.wrapper.children.length - visibleItems))) {
            this.currentStep = 0
        }
        this.render()
    }

    prev() {
        const visibleItems = this.visibleElements()
        this.currentStep--
        if(this.currentStep < 0){
            this.currentStep = (this.wrapper.children.length - visibleItems)
        }
        this.render()
    }

    visibleElements (){
        this.step = this.wrapper.children[0].clientWidth
        return Math.floor(window.innerWidth / this.step)
    }
}
