const sizeRegex = /^\d+(\.\d+)?(%|px|em|rem|vw|vh|pt|cm|mm|in|pc|ex|ch|vmin|vmax|fr)$/;

class Slider {
	constructor(containerId, options = {}) {
		this.container = document.getElementById(containerId);

		this.slider = this.container.querySelector('.slider');
		this.slides = this.container.querySelectorAll('.slide');

		// Diaporama setting
		this.IsDiaporama = options.diaporama === true;
		if (this.IsDiaporama) {
			this.container = document.getElementById(containerId);

			// Remove all slider-nav elements
			this.container.querySelectorAll('.slider-nav').forEach(element => {
				element.remove();
			});
		}

		// Navigation buttons
		this.prevBtn = this.container.querySelector('.prev');
		this.nextBtn = this.container.querySelector('.next');
		this.isDirectionBtn = !!this.prevBtn && !!this.nextBtn;

		// Position indicator
		this.indicatorsContainer = this.container.querySelector('.slide-indicators');
		this.isIndicator = !!this.indicatorsContainer;
		this.maxIndicators = 12; // Maximum dot indicator, if more will display slide number
		
		// Mode setting
		this.mode = options.mode || this.container.dataset.mode || 'responsive';

		if (!['responsive', 'fullscreen'].includes(this.mode)) {
			console.log("Invalid mode, using default mode");
			this.mode = 'responsive';
		}

		// Customization options
		this.customWidth = this.validateWidth(options.width || this.container.dataset.width || '100%');
		this.customHeight = this.validateHeight(options.height || this.container.dataset.height || '450px');

		this.isInfinite = options.infinite === true || this.container.querySelector('.infinite-loop') !== null;
		this.isAutoPlay = options.autoPlay === true || this.container.querySelector('.auto-play') !== null;
		this.ishoverPause = options.hoverPause === true || this.container.querySelector('.hover-pause') !== null;

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


		this.transitionStyle = `transform ${this.transitionSpeed}s ease-in-out`; // Default slider transform transition

		this.fadeInTransition = options.transitionEffect || null;
		if (!['fade-in'].includes(this.fadeInTransition)) {
			// console.log("Using default transition mode: Slide");
			this.fadeInTransition = null;
		} else {
			this.transitionStyle = `transform 0s ease-in-out, opacity ${this.transitionSpeed}s ease-in-out`; // Fade-in opacity transition
			this.isInfinite = false; // Infinite scroll is useless with fade-in mode
		}



		// Slider variables
		this.currentIndex = 0;
		this.totalSlides = this.slides.length;
		this.realSlidesCount = this.totalSlides;
		this.slideInterval = null;

		this.isSliding = false;

		this.slider.addEventListener('transitionend', (event) => {
			// Check if the transition was for transform (This avoid false positive from textElement 'translate')
			if (event.propertyName === 'transform') {
				this.isSliding = false;
			}
		});

		// Touchscreen swipe
		this.touchStartX = 0;
		this.touchEndX = 0;
		// this.touchStartTime = 0;

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

		if (this.isInfinite) {
			this.currentIndex = 1; // Because of inserted clone at the start
		} else {
			this.currentIndex = 0; // For classic rewind mode.
		}
		this.slider.style.transition = 'none'; // Display without transition at load
		this.updateSlider();

		if (this.isAutoPlay || this.IsDiaporama) {
			this.startAutoPlay();
		}

		setTimeout(() => {
			this.slider.style.transition = this.transitionStyle; // Activate transition for Slide or Fade-in
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
		]; // Removed for image or link: 'href', 'src'

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

			const overlay = slide.querySelector('.slide-overlay');
			if (overlay) slide.style.position = 'relative'; // Ensure overlay positioning works

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

	// Create duplicate slides for infinite scrolling effect
	// This is only executed when infinite loop is enabled
	duplicateSlides() {
		if (!this.isInfinite) return;

		const firstSlide = this.slides[0].cloneNode(true); // Clone the first slide and append it to the end

		const lastSlide = this.slides[this.slides.length - 1].cloneNode(true); // Clone the last slide and insert it at the beginning

		// Add cloned slides to the slider
		this.slider.appendChild(firstSlide);
		this.slider.insertBefore(lastSlide, this.slider.firstChild);

		this.realSlidesCount = this.slider.querySelectorAll('.slide').length; // Update the total slide count to include duplicates
	}


	// Create navigation indicators (dots) for slide navigation
	createIndicators() {
		if (this.isIndicator && !this.IsDiaporama) {
			this.indicatorsContainer.innerHTML = ''; // Clear existing indicators
			if (this.totalSlides < this.maxIndicators) {
				for (let i = 0; i < this.totalSlides; i++) {
					const indicator = document.createElement('div');
					indicator.classList.add('indicator');

					if (i === 0) indicator.classList.add('active'); // Mark the first indicator as active

					indicator.addEventListener('click', () => this.goToSlide(i)); // Add click event listener to navigate to specific slide
					this.indicatorsContainer.appendChild(indicator);
				}

			} else {
				if(this.isInfinite){
					this.indicatorsContainer.textContent = this.currentIndex-1;
				}else{
					this.indicatorsContainer.textContent = this.currentIndex+1;
				}
			}
		}
	}

	bindEvents() {
		if (this.isDirectionBtn) {
			this.nextBtn.addEventListener('click', () => this.nextSlide()); // Next button clicks advance to next slide
			this.prevBtn.addEventListener('click', () => this.prevSlide()); // Previous button clicks go to previous slide
		}

		if (this.isAutoPlay || this.IsDiaporama) {
			if (this.ishoverPause) {
				this.container.addEventListener('mouseenter', () => this.pauseAutoPlay()); // Pause auto-play when mouse enters container
				this.container.addEventListener('mouseleave', () => this.startAutoPlay()); // Resume auto-play when mouse leaves container
			}
		}

		if (!this.IsDiaporama) {
			// Keyboard Arrow control
			this.container.addEventListener('click', () => {
				this.container.style.outline = 'none'; // Remove red border on first focus
				this.container.tabIndex = 0; // Make container focusable (0 means it can receive focus via tab key)
				this.container.focus(); // Give focus to the container so keyboard events are captured
			});

			document.addEventListener('keydown', (e) => {
				if (e.target === this.container || this.container.contains(e.target)) {
					if (e.key === 'ArrowLeft') this.prevSlide(); // Arrow left advance to prev slide
					if (e.key === 'ArrowRight') this.nextSlide(); // Arrow right advance to next slide
				}
			});

			// Touchscreen swipe control
			document.addEventListener('touchstart', (e) => {
				// Only handle swipes on the slider container
				if (e.target === this.container || this.container.contains(e.target)) {
					this.touchStartX = e.changedTouches[0].screenX;
					// this.touchStartTime = Date.now();
				}
			});

			document.addEventListener('touchend', (e) => {
				// Only handle swipes on the slider container
				if (e.target === this.container || this.container.contains(e.target)) {
					this.touchEndX = e.changedTouches[0].screenX;
					this.handleSwipe();
				}
			});
		}
	}

	handleSwipe() {
		const swipeThreshold = 50;
		const diff = this.touchStartX - this.touchEndX;
		// const touchDuration = Date.now() - this.touchStartTime;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				this.nextSlide(); // Swipe left - go to next slide
			} else {
				this.prevSlide(); // Swipe right - go to previous slide
			}
		}
	}

	updateSlider() {
		// Ensure slide-text elements are styled properly
		this.slides.forEach((slide, index) => {
			const textElement = slide.querySelector('.slide-text');
			const overlay = slide.querySelector('.slide-overlay');

			if (textElement) {
				if (textElement.classList.contains('show')) textElement.classList.remove('show');

				let shouldShow = false;

				if (!this.isInfinite) { // Rewind setting
					if (this.currentIndex === index) {
						shouldShow = true;
					}
				} else {  // Infinite loop setting
					if (this.currentIndex - 1 === this.totalSlides && index === 0 || // First slide clone
						this.currentIndex === 0 && index === this.totalSlides - 1 || // Last slide clone
						this.currentIndex - 1 === index
					) {
						shouldShow = true;
					}
				}

				if (shouldShow) {
					if (overlay) {
						// Overlay setting
						textElement.classList.add('show');

						if (this.currentIndex - 1 === this.totalSlides && index === 0) { // First slide clone
							textElement.style.transform = `translate(${((index + 2) * 100) + 50}%, -50%)`;

						} else if (this.currentIndex === 0 && index === this.totalSlides - 1) {  // Last slide clone
							textElement.style.transform = `translate(-${((index + 1) * 100) + 50}%, -50%)`;

						} else {
							textElement.style.transform = `translate(-50%, -50%)`;
						}

					} else { // Without overlay setting
						textElement.classList.add('show');


						textElement.style.transform = `translate(${(this.currentIndex * 100) - 50}%, -50%)`;
					}
				}
			}
		});

		this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;

		if (this.isIndicator) {
			const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
			if (this.totalSlides < this.maxIndicators) {
				indicators.forEach((indicator, index) => {
					let activeIndex = index;

					if (this.isInfinite) {
						activeIndex = (this.currentIndex - 1) % this.slides.length;
						if (activeIndex === -1) activeIndex = this.slides.length - 1; // Specific position for first slide duplicate
					} else {
						activeIndex = (this.currentIndex) % this.slides.length;
					}

					if (index === activeIndex) {
						indicator.classList.add('active');
					} else {
						indicator.classList.remove('active');
					}
				});
			}else{
				if(this.isInfinite){
					let activeIndex = (this.currentIndex - 1) % this.slides.length
					if (activeIndex === -1) activeIndex = this.slides.length - 1; // Specific position for first slide duplicate
					this.indicatorsContainer.textContent = activeIndex+1;
				}else{
					this.indicatorsContainer.textContent = this.currentIndex+1;
				}
			}



		}
	}

	goToSlide(index) {
		if (index < 0 || index >= this.totalSlides) return; // Deny out-of-Bounds Access

		if (this.isInfinite) {
			this.currentIndex = index + 1;
		} else {
			this.currentIndex = index;
		}

		this.handleTransition();
	}

	handleTransition() {
		if (this.fadeInTransition) {
			this.slider.classList.add('inactive-slide');
			setTimeout(() => {
				this.slider.classList.remove('inactive-slide');
				this.updateSlider();
			}, this.transitionSpeed * 1000);
		} else {
			this.updateSlider();
		}
	}

	// Navigate to the next slide
	nextSlide() {
		if (this.isSliding) return; // Lock to avoid multiple simultaneous calls
		this.isSliding = true;

		if (this.isInfinite) { // Infinite loop setting
			this.currentIndex++;

			if (this.currentIndex > this.realSlidesCount - 1) { // If reached the end of duplicated slides
				this.currentIndex = 1; // Jump back to the first duplicated slide (which is the original last slide)
				this.slider.style.transition = 'none'; // Temporarily remove transition
				this.handleTransition();
				setTimeout(() => {
					// Restore transition
					this.slider.style.transition = this.transitionStyle;
					this.currentIndex = 2; // Set to second slide (which is the original first slide after duplication)
					this.handleTransition();
				}, 10);
			} else {
				this.handleTransition();
			}
		} else { // Rewind setting - loop back to first slide after last
			this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
			this.handleTransition();
		}

		// Unlock slide navigation after transition completes
		setTimeout(() => {
			this.isSliding = false;

			// Prevent slide just after pression navigation button
			if (this.isAutoPlay) {
				this.startAutoPlay();
			}
		}, this.transitionSpeed * 1000);
	}

	// Navigate to the previous slide
	prevSlide() {
		if (this.isSliding) return;
		this.isSliding = true;

		if (this.isInfinite) {
			this.currentIndex--;
			if (this.currentIndex < 0) {
				this.currentIndex = this.totalSlides;
				this.slider.style.transition = 'none';
				this.handleTransition();
				setTimeout(() => {
					this.slider.style.transition = this.transitionStyle;
					this.currentIndex = this.totalSlides - 1;
					this.handleTransition();
				}, 50);
			} else {
				this.handleTransition();
			}
		} else {
			this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
			this.handleTransition();
		}
		setTimeout(() => {
			this.isSliding = false;

			if (this.isAutoPlay) {
				this.startAutoPlay();
			}
		}, this.transitionSpeed * 1000);
	}

	startAutoPlay() {
		clearInterval(this.slideInterval);
		this.slideInterval = setInterval(() => this.nextSlide(), this.sliderSpeed);
	}

	pauseAutoPlay() {
		clearInterval(this.slideInterval);
	}
}
