# Very Simple Slider (VSP)

A lightweight, responsive and secure slider with smooth transitions and multiple modes.

It is responsive, slide, and does it well.



## Features
- Responsive design - Works on all device sizes
- Customizable - Configurable width, height, transition speed, interval and more
- Two display modes - Fullscreen and responsive modes
- Slide mode and effects
    - Two slide modes - Classic rewind or infinite scrolling
    - Two slide effects - Slide transition using transform translate or fade-in opacity
- Simple Navigation
    - Previous/next buttons and indicators
    - Keyboard: Arrow keys support
    - Touchscreen: Swipe navigation
    - Indicator dots - Visual navigation controls
    - Smart indicators - Dots automatically change to numeric display when there are more than 12 slides
- Auto-play 
- Pause on hover
- Overlay
    - Text overlay
    - Event blocking overlay
- Security - Sanitizes slides to prevent XSS attacks
- Lightweight - Minimal code, maximum performance



## Installation

1. Include the CSS file in your `<head>`:
```html
<link rel="stylesheet" href="/verySimpleSlider.css">
```


2. Add the HTML structure:
```html
<!-- slider-container -->
<!-- data-mode to set mode 'responsive' or 'fullscreen' -->
<!-- data-width and data-height to set size -->
<div id="slider1" class="slider-container" data-mode="responsive" data-width="70%" data-height="500px">
    <!-- slider -->
    <!-- add or remove auto-play class to activate or desactivate automatic play. -->
    <!-- add or remove infinite-loop class to activate or desactivate. -->
    <div class="slider infinite-loop auto-play">
        <div class="slide">
            <!-- Event blocking overlay (optionnal) -->
            <div class="slide-overlay"></div>

            <!-- Text overlay (optionnal) -->
            <div class="slide-text"><h1>Welcome to Slide 1</h1></div>

            <!-- Slide Image -->
            <img src="image1.jpg" alt="image1">
        </div>
        <div class="slide">
            <img src="image2.jpg" alt="image2">
        </div>
        <div class="slide">
            <img src="image3.jpg" alt="image3">
        </div>
        <!-- Add more slide elements as needed -->
    </div>
    <!-- Optional: Navigation buttons -->
    <div class="slider-nav prev">&#10094;</div>
    <div class="slider-nav next">&#10095;</div>
    <!-- Optional: Indicator dots -->
    <div class="slide-indicators"></div>
</div>
```


3. Include the JavaScript file:
```html
<script src="/verySimpleSlider.js"></script>
```


4. Initialize Slider
All sliders must be initialized on page load using: 
```html
<script>new Slider('slider1');</script>
```



## Usage Modes
The slider(s) needs to be initialized on page load.

```javascript
const slider = new Slider('slider1');
```

It can be configured using HTML attributes, javascript or both.

A working demo with multiple example is available in demo.html in the repository.



## Configuration

### Advanced Javascript Configuration
You can configure the slider using JavaScript for more advanced settings:

| Option | Type | Default | Description |
|----------------------|------|---------|-------------|
| `mode` | string | 'responsive' | 'responsive' or 'fullscreen' |
| `width` | string | '100%' | Custom width for responsive mode |
| `height` | string | '450px' | Custom height for responsive mode |
| `transitionEffect` | string | null | 'fade-in' Enable Fade-in transition effect |
| `diaporama` | boolean | false | Enable diaporama mode |
| `infinite` | boolean | false | Enable infinite loop effect |
| `autoPlay` | boolean | false | Enable automatic slide progression |
| `hoverPause` | boolean | false | Pause auto-play on hover |
| `interval` | number | 5 | Time between slides in milliseconds |
| `transitionSpeed` | number | 0.5 | Animation transition time in seconds |

Note: If both HTML data attributes and JavaScript options are provided, the JavaScript configuration takes precedence.


```javascript
const slider1 = new Slider('slider1', {
    mode: 'fullscreen',           // 'responsive' or 'fullscreen' - Default 'responsive'
    infinite: true,               // Enable infinite loop/scolling - Default false
    autoPlay: true,               // Enable auto-play - Default false
    hoverPause: false,            // Enable hover pause - Default false
    interval: 3,                  // Slide change interval in seconds - Default 5s
    transitionSpeed: 1            // Transition animation speed in seconds - Default 0.5
});

const slider2 = new Slider('slider2', {
    mode: 'responsive',
    width: '70%',                 // Custom width
    height: '600px',              // Custom height
    autoPlay: true,
    hoverPause: true,
    interval: 3,
	transitionEffect: 'fade-in',        // Change transition mode to fade-in - Default slide mode
    transitionSpeed: 0.8
});
// Note: using `transitionEffect` the infinite scolling option is automatically set to false

const slider2 = new Slider('diaporama-slider', {
    mode: 'responsive',
    width: '70%',
    height: '600px',
	diaporama: true, // Set diaporama mode, this remove navigation and indicator into the HTML structure
    infinite: true,
    hoverPause: true,
    interval: 2,
    transitionSpeed: 0.5
});

```


### Detailed HTML Configuration

**HTML Configuration via data-* attribute**
| HTML Data | Description |
|------------|-------------|
| `data-mode` | Set the slider mode |


**HTML Configuration Class Names**
| HTML Class Name | Description |
|------------|-------------|
| `.infinite-loop` | Enable infinite looping |
| `.auto-play` | Enable auto-play |
| `.hover-pause` | Enables pausing of auto-play on hover |


#### Mode Selection 
Set the slider mode using the `data-mode` attribute on the container:

- data-mode="fullscreen": Fullscreen mode (100vw x 100vh)
    ```html
    <div id="slider1" class="slider-container" data-mode="fullscreen">
    ```

- data-mode="responsive": Responsive mode (100% width, 450px height). You can customize value using `data-width` and `data-height`
    ```html
    <div id="slider1" class="slider-container" data-mode="responsive" data-width="600px" data-height="300px">
    ```

- No data-mode attribute: Defaults to responsive mode


#### Auto-play/Auto-slide
Add/Remove the `auto-play` class to enable/disable automatic play

```html
<div class="slider auto-play">
```


#### Hover Pause
Add/Remove the `hover-pause` class to enable/disable slide pause on hover

```html
<div class="slider hover-pause">
```


#### Infinite Loop Mode
Add the `infinite-loop` class to enable continuous looping:

```html
<div class="slider infinite-loop">
```


#### Classic Rewind Mode
Remove the `infinite-loop` class for traditional back-and-forth navigation


#### Combined Usage Example
```html
<div id="slider1" class="slider-container" data-mode="responsive" data-width="600px" data-height="300px">
    <div class="slider infinite-loop auto-play hover-pause">
        <!-- Slides here -->
    </div>
</div>
```



## Overlay

### Text Overlay
Add a `slide-text` div inside the `slide` div with the image:
```html
<div class="slide">
    <div class="slide-text">Your overlay text here</div>
    <img src="image.jpg" alt="Description">
</div>
```

To modify image size inside text overlay adapt `.slide-text img` in the .css file


### Event Blocking Overlay
Add a `slide-overlay` div inside the `slide` div with the image:
```
<div id="slider" class="slider-container">
	<div class="slider">
		<div class="slide">
			<div class="slide-overlay"></div>
            <img src="image1.jpg" alt="image1">
```


### Combined Overlay Example
```
<div id="slider" class="slider-container">
	<div class="slider">
		<div class="slide">
			<div class="slide-overlay"></div>
            <div class="slide-text">Your overlay text here</div>
            <img src="image1.jpg" alt="image1">
```



## Keyboard & Touchscreen Swipe Support

### Keyboard
- Left Arrow: Previous slide
- Right Arrow: Next slide


### Touchscreen
- Left Swipe: Previous slide
- Right Swipe: Next slide



## JavaScript Methods

| Methods | Description |
|---------|-------------|
| nextSlide() | Navigate to next slide |
| prevSlide() | Navigate to previous slide |
| goToSlide(index) | Go to specific slide |
| startAutoPlay() | Start auto-play |
| pauseAutoPlay() | Pause auto-play |



## Security Features
The slider includes built-in security measures:

- Removes all <script> tags from slides
- Sanitizes inline event handlers (onclick, onload, etc.)
- Removes dangerous attributes and elements
- Prevents XSS attacks



## CSS Design Class Names

| CSS Class Name | Description |
|------------|-------------|
| `.slider-container` | Main container |
| `.slider` | Slider wrapper |
| `.slide` | Individual slide |
| `.slide-text` | Slide text content |
| `.slide-overlay` | Event blocking overlay |
| `.prev` | Previous button |
| `.next` | Next button |
| `.slide-indicators` | Indicator container |
| `.indicator` | Individual indicator dot |
| `.active` | Active indicator |
| `.inactive-slide` | Fade-in opacity 0 |


## About VSP
Why reinvent the wheel?

There are already countless sliders available. But sometimes you can't find what you need, or find it but struggle with poor documentation.

That's why I created **Very Simple Slider**, to provide a clean, straightforward solution that just works.

I hope you find it helpful and enjoy using it!



## License
MIT
