const sizeRegex = /^\d+(\.\d+)?(%|px|em|rem|vw|vh|pt|cm|mm|in|pc|ex|ch|vmin|vmax|fr)$/;

class Slider {
	constructor(containerId, options = {}) {
		this.container = document.getElementById(containerId);
		this.slider = this.container.querySelector('.slider');
		this.slides = this.container.querySelectorAll('.slide');
		this.prevBtn = this.container.querySelector('.prev');
		this.nextBtn = this.container.querySelector('.next');

		this.indicatorsContainer = this.container.querySelector('.slide-indicators');
		this.isIndicator = !!this.indicatorsContainer;
		this.isDirectionBtn = !!this.prevBtn && !!this.nextBtn;

		this.mode = options.mode || this.container.dataset.mode || 'responsive';
		if (!['responsive', 'fullscreen'].includes(this.mode)) {
			console.log("Invalid mode, using default mode");
			this.mode = 'responsive';
		}

		this.customWidth = this.validateWidth(options.width || this.container.dataset.width || '100%');
		this.customHeight = this.validateHeight(options.height || this.container.dataset.height || '450px');

		this.isInfinite = options.infinite || this.container.querySelector('.infinite-loop') !== null;
		this.isAutoPlay = options.autoPlay || this.container.querySelector('.auto-play') !== null;

		this.sliderSpeed = Number(options.interval) * 1000 || 5000;
		if (isNaN(this.sliderSpeed) || this.sliderSpeed < 0 || this.sliderSpeed > 100000) {
			console.log("Invalid interval, using default interval");
			this.sliderSpeed = 5000;
		}

		this.transitionSpeed = Number(options.transitionSpeed) || 0.5;
		if (isNaN(this.transitionSpeed) || this.transitionSpeed < 0 || this.transitionSpeed > 100) {
			console.log("Invalid transition interval, using default transition interval");
			this.transitionSpeed = 0.5;
		}

		this.currentIndex = 0;
		this.totalSlides = this.slides.length;
		this.realSlidesCount = this.totalSlides;
		this.slideInterval = null;

		this.isSliding = false;
		this.ishoverPause = options.hoverPause || this.container.querySelector('.hover-pause') !== null;

		this.slider.addEventListener('transitionend', () => {
			this.isSliding = false;
		});

		this.init();
	}

	init() {
		// Validate and sanitize all slides
		this.sanitizeSlides();

		// Set slider
		this.applyStyles();
		this.duplicateSlides();
		this.createIndicators();
		this.bindEvents();

		this.currentIndex = 1; // Because of inserted clone at the start
		this.slider.style.transition = 'none'; // Display without transition at load
		this.updateSlider();

		if (this.isAutoPlay) {
			this.startAutoPlay();
		}

		setTimeout(() => {
			this.slider.style.transition = `transform ${this.transitionSpeed}s ease-in-out`; // Activate transition
		}, 200);

	}

	validateWidth(size) {
		if (!size || typeof size !== 'string') return '100%';
		if (!sizeRegex.test(size)) return '100%';
		return size;
	}
	validateHeight(size) {
		if (!size || typeof size !== 'string') return '450px';
		if (!sizeRegex.test(size)) return '450px';
		return size;
	}


	sanitizeSlides() {
		// Get the slider element
		if (!this.slider) throw new Error('Missing Slider');

		// Get all slides
		if (!this.slides.length) throw new Error('Missing Slides');

		this.slides.forEach(slide => {
			// Remove all script tags
			const scripts = slide.querySelectorAll('script');
			scripts.forEach(script => script.remove());

			// Remove all inline event handlers
			this.removeInlineEvents(slide);

			// Remove dangerous attributes
			this.removeDangerousAttributes(slide);

			// Remove any potentially dangerous elements
			this.removeDangerousElements(slide);
		});
	}

	removeInlineEvents(element) {
		// Remove inline event handlers from current element
		const inlineEventAttrs = [];
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			if (attr.name.startsWith('on')) {
				inlineEventAttrs.push(attr.name);
			}
		}
		inlineEventAttrs.forEach(attrName => element.removeAttribute(attrName));

		// Recursively remove from children
		element.querySelectorAll('*').forEach(child => {
			const childInlineEvents = [];
			for (let i = 0; i < child.attributes.length; i++) {
				const attr = child.attributes[i];
				if (attr.name.startsWith('on')) {
					childInlineEvents.push(attr.name);
				}
			}
			childInlineEvents.forEach(attrName => child.removeAttribute(attrName));
		});
	}

	removeDangerousAttributes(element) {
		const dangerousAttrs = [
			'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
			'onfocus', 'onblur', 'onsubmit', 'onkeydown', 'onkeyup',
			'onkeypress', 'ondblclick', 'onmousedown', 'onmouseup',
			'action', 'data', 'formaction', 'onbeforeunload'
		];

		// Remove from current element
		dangerousAttrs.forEach(attr => {
			if (element.hasAttribute(attr)) {
				element.removeAttribute(attr);
			}
		});

		// Remove from children
		element.querySelectorAll('*').forEach(child => {
			dangerousAttrs.forEach(attr => {
				if (child.hasAttribute(attr)) {
					child.removeAttribute(attr);
				}
			});
		});
	}

	removeDangerousElements(element) {
		// Remove dangerous elements
		const dangerousElements = ['script', 'iframe', 'object', 'embed', 'applet', 'link', 'meta', 'base'];
		dangerousElements.forEach(tagName => {
			const elements = element.querySelectorAll(tagName);
			elements.forEach(el => el.remove());
		});
	}


	applyStyles() {
		if (this.mode === 'fullscreen') {
			this.container.style.width = '100vw';
			this.container.style.height = '100vh';
			this.container.style.margin = '0';
			document.body.style.padding = '0';
			document.body.style.margin = '0';
		} else {
			this.container.style.width = this.customWidth;
			this.container.style.height = this.customHeight;
			this.container.style.margin = '0 auto';
		}

		this.slides.forEach(slide => {
			const img = slide.querySelector('img');
			if (img) {
				if (this.mode === 'fullscreen') {
					img.style.width = '100vw';
					img.style.height = '100vh';
				} else {
					img.style.width = '100%';
					img.style.height = this.customHeight;
				}
			}
		});
	}

	duplicateSlides() {
		if (!this.isInfinite) return;

		const firstSlide = this.slides[0].cloneNode(true);

		const lastSlide = this.slides[this.slides.length - 1].cloneNode(true);

		this.slider.appendChild(firstSlide);
		this.slider.insertBefore(lastSlide, this.slider.firstChild);

		this.realSlidesCount = this.slider.querySelectorAll('.slide').length;
	}

	createIndicators() {
		if (this.isIndicator) {
			this.indicatorsContainer.innerHTML = '';
			for (let i = 0; i < this.totalSlides; i++) {
				const indicator = document.createElement('div');
				indicator.classList.add('indicator');

				if (i === 0) indicator.classList.add('active');

				indicator.addEventListener('click', () => this.goToSlide(i));
				this.indicatorsContainer.appendChild(indicator);
			}
		}
	}

	bindEvents() {
		if (this.isDirectionBtn) {
			this.nextBtn.addEventListener('click', () => this.nextSlide());
			this.prevBtn.addEventListener('click', () => this.prevSlide());
		}

		if (this.isAutoPlay) {
			if (this.ishoverPause) {
				this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
				this.container.addEventListener('mouseleave', () => this.startAutoPlay());
			}
		}

		// Keyboard Arrow control
		document.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') this.prevSlide();
			if (e.key === 'ArrowRight') this.nextSlide();
		});
	}

	updateSlider() {
		// Ensure slide-text elements are styled properly
		this.slides.forEach((slide, index) => {
			const textElement = slide.querySelector('.slide-text');
			if (textElement) {
				if (textElement.classList.contains('show')) textElement.classList.remove('show');

				if (this.currentIndex - 1 === this.totalSlides && index === 0 || // First slide duplicate
					this.currentIndex === 0 && index === this.totalSlides - 1 || // Last slide duplicate
					this.currentIndex - 1 === index
				) {
					textElement.classList.add('show');
					textElement.style.transform = `translate(${(this.currentIndex * 100) - 50}%, -50%)`;
				}
			}
		});

		this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;

		if (this.isIndicator) {
			const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
			indicators.forEach((indicator, index) => {
				let activeIndex = index;

				activeIndex = (this.currentIndex - 1) % this.slides.length;

				if (activeIndex === -1) activeIndex = this.slides.length - 1; // Specific position for first slide duplicate

				if (index === activeIndex) {
					indicator.classList.add('active');
				} else {
					indicator.classList.remove('active');
				}
			});
		}
	}

	goToSlide(index) {
		if (index < 0 || index >= this.totalSlides) return; // Deny out-of-Bounds Access
		this.currentIndex = index + 1;
		this.updateSlider();
	}

	nextSlide() {
		if (this.isSliding) return;
		this.isSliding = true;

		if (this.isInfinite) {
			this.currentIndex++;
			if (this.currentIndex > this.realSlidesCount - 1) {
				this.currentIndex = 1;
				this.slider.style.transition = 'none';
				this.updateSlider();
				setTimeout(() => {
					this.slider.style.transition = 'transform ' + this.transitionSpeed + 's ease-in-out';
					this.currentIndex = 2;
					this.updateSlider();
				}, 50);
			} else {
				this.updateSlider();
			}
		} else {
			this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
			this.updateSlider();
		}

		// Unlock Slide after sliderSpeed timeout
		setTimeout(() => {
			this.isSliding = false;
		}, this.sliderSpeed);
		// Reset interval 
		setTimeout(() => {
			this.startAutoPlay();
		}, this.transitionSpeed);
	}

	prevSlide() {
		if (this.isSliding) return;
		this.isSliding = true;

		if (this.isInfinite) {
			this.currentIndex--;
			if (this.currentIndex < 0) {
				this.currentIndex = this.totalSlides;
				this.slider.style.transition = 'none';
				this.updateSlider();
				setTimeout(() => {
					this.slider.style.transition = 'transform ' + this.transitionSpeed + 's ease-in-out';
					this.currentIndex = this.totalSlides - 1;
					this.updateSlider();
				}, 50);
			} else {
				this.updateSlider();
			}
		} else {
			this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
			this.updateSlider();
		}
		setTimeout(() => {
			this.isSliding = false;
		}, this.sliderSpeed);
		setTimeout(() => {
			this.startAutoPlay();
		}, this.transitionSpeed);
	}

	startAutoPlay() {
		clearInterval(this.slideInterval);
		this.slideInterval = setInterval(() => this.nextSlide(), this.sliderSpeed);
	}

	pauseAutoPlay() {
		clearInterval(this.slideInterval);
	}
}
