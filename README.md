# Very Simple Slider (VSP)

A lightweight, responsive and secure slider with smooth transitions and multiple modes.

It is responsive, slide and does it well.



## Features
- Responsive design - Works on all device sizes
- Two display modes - Fullscreen and responsive modes
- Two operation modes - Classic rewind or infinite loop
- Simple navigation - Previous/next buttons and indicators
- Indicator Dots: Visual navigation controls
- Lightweight - Minimal code, maximum performance
- Customizable: Configurable width, height, transition speed, and interval
- Auto-play with pause on hover
- Text overlay
- Keyboard Navigation: Arrow keys support
- Security: Sanitizes slides to prevent XSS attacks



## Installation

1. Include the CSS file in your `<head>`:
```html
<link rel="stylesheet" href="/verySimpleSlider.css">
```


2. Add the HTML structure:
```html
<div id="slider1" class="slider-container" data-mode="responsive" data-width="70%" data-height="500px">
    <!-- slider-container -->
    <!-- data-mode to set mode 'responsive' or 'fullscreen' -->
    <!-- data-width and data-height to set size -->
    <div class="slider infinite-loop auto-play">
        <!-- slider -->
        <!-- add or remove auto-play class to activate or desactivate automatic play. -->
        <!-- add or remove infinite-loop class to activate or desactivate. -->
        <div class="slide">
            <img src="image1.jpg" alt="image1">
            <!-- Text overlay (optionnal) -->
            <div class="slide-text"><h1>Welcome to Slide 1</h1></div>
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



## Configuration

### JavaScript Configuration

| Configuration Options | Option | Type | Default | Description |
|----------------------|--------|------|---------|-------------|
| `mode` | string | 'responsive' | 'responsive' or 'fullscreen' |
| `width` | string | '100%' | Custom width for responsive mode |
| `height` | string | '450px' | Custom height for responsive mode |
| `infinite` | boolean | false | Enable infinite loop effect |
| `autoPlay` | boolean | false | Enable automatic slide progression |
| `interval` | number | 5 | Time between slides in milliseconds |
| `transitionSpeed` | number | 0.5 | Animation transition time in seconds |
| `hoverPause` | boolean | false | Pause auto-play on hover |

Note: If both HTML data attributes and JavaScript options are provided, the JavaScript configuration takes precedence.


#### Advanced Settings
You can configure the slider using JavaScript for more advanced settings:

```javascript
new Slider('slider1', {
    mode: 'fullscreen',           // 'responsive' or 'fullscreen' - Default 'responsive'
    infinite: true,               // Enable infinite loop - Default false
    autoPlay: true,               // Enable auto-play - Default false
    hoverPause: false,            // Enable hover pause - Default false
    interval: 3,                  // Slide change interval in seconds - Default 5s
    transitionSpeed: 1            // Transition animation speed in seconds - Default 0.5
});

new Slider('slider2', {
    mode: 'responsive',
    width: '70%',                 // Custom width
    height: '600px',              // Custom height
    infinite: true,
    autoPlay: true,
    hoverPause: true,
    interval: 3,
    transitionSpeed: 0.8
});
```


### HTML Configuration via data-* attribute

| HTML Data | Description |
|------------|-------------|
| `data-mode` | Set the slider mode |


### HTML Class Names

| HTML Class Name | Description |
|------------|-------------|
| `.infinite-loop` | Enable infinite looping |
| `.auto-play` | Enable auto-play |
| `.hover-pause` | Enable hover pause |


### CSS Class Names

| CSS Class Name | Description |
|------------|-------------|
| `.slider-container` | Main container |
| `.slider` | Slider wrapper |
| `.slide` | Individual slide |
| `.slide-text` | Slide text content |
| `.prev` | Previous button |
| `.next` | Next button |
| `.slide-indicators` | Indicator container |
| `.indicator` | Individual indicator dot |
| `.active` | Active indicator |



## Usage Modes
The slider(s) needs to be initialized on page load.
```javascript
new Slider('slider1');
```

A working demo is available in demo.html in the repository.


### Mode Selection 
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


### Auto-play/Auto-slide
Add/Remove the `auto-play` class to enable/disable automatic play

```html
<div class="slider auto-play">
```


### Hover Pause
Add/Remove the `hover-pause` class to enable/disable slide pause on hover

```html
<div class="slider hover-pause">
```


### Infinite Loop Mode
Add the `infinite-loop` class to enable continuous looping:

```html
<div class="slider infinite-loop">
```


### Classic Rewind Mode
Remove the `infinite-loop` class for traditional back-and-forth navigation


### Combined Usage Example
```html
<div id="slider1" class="slider-container" data-mode="responsive" data-width="600px" data-height="300px">
    <div class="slider infinite-loop auto-play hover-pause">
        <!-- Slides here -->
    </div>
</div>
```


### Text Overlay
Add a `slide-text` div inside the `slide` div with the image:
```html
<div class="slide">
    <img src="image.jpg" alt="Description">
    <div class="slide-text">Your overlay text here</div>
</div>
```

To modify image size inside text overlay adapt `.slide-text img` in the .css file



## Keyboard Support
Left Arrow: Previous slide
Right Arrow: Next slide



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



## License
MIT



## About VSP
Why reinvent the wheel?

There are already countless sliders available. But sometimes you can't find what you need, or find it but struggle with poor documentation.

That's why I created **Very Simple Slider**, to provide a clean, straightforward solution that just works.

I hope you find it helpful and enjoy using it!
