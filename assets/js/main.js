'use strict';

// ----------------------------------------------------------------------------------------------------------------- variables

// ----------------------------------------------------------------------------------------------------------------- functions
// Utility function to apply inline styles
function setStyles(element, styles) {
  Object.assign(element.style, styles);
}

// Utility function for delaying actions
function delay(n = 2000) {
  return new Promise(resolve => {
    setTimeout(resolve, n);
  });
}

// Utility function for fixing height
const fix100VhOnPhone = function () {
  var t = 0.01 * window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${t}px`);
};

// Animation function for the intro
const runIntro = function () {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingWords = document.querySelector('.loading-words');
  const onceIn = document.querySelectorAll('main .once-in');
  const homeActive = document.querySelectorAll('.loading-words .home-active');
  const roundedDivTop = document.querySelector(
    '.loading-container .rounded-div-wrap.top .rounded-div'
  );
  const roundedDivBottom = document.querySelector(
    '.loading-container .rounded-div-wrap.bottom .rounded-div'
  );
  const homeActiveFirst = document.querySelector('.home-active-first');
  const homeActiveLast = document.querySelector('.home-active-last');

  let currentWordIndex = 0;
  let t = 0;
  const delayBetweenWords = 100; // Delay between words

  // Animation function for words
  function showWord(index) {
    if (index < homeActive.length) {
      setStyles(loadingWords, {
        opacity: 1,
        transform: 'translate(-50%, -100%)',
      });
      const word = homeActive[index];
      if (word === homeActiveFirst || word === homeActiveLast)
        t = delayBetweenWords + 1000;
      else t = delayBetweenWords;
      setStyles(word, { opacity: 1, transform: 'translate(-50%, 50%)' });

      setTimeout(() => {
        setStyles(word, { opacity: 0, transform: 'translate(-50%, 50%)' });
        setTimeout(() => showWord(index + 1), t);
      }, t);
    }
  }

  // Animation for page load (Home)
  function initLoaderHome() {
    // Show loading screen
    setStyles(loadingScreen, {
      top: '100%',
      transition: 'var(--animation-smooth)',
    });
    setStyles(loadingWords, {
      top: '100%',
      transition: 'var(--animation-smooth)',
    });

    // Animate intro
    setStyles(loadingScreen, {
      top: '0',
      transition: 'var(--animation-smooth)',
    });

    homeActive.forEach(el => {
      el.style.display = 'block';
    });
    homeActiveLast.style.display = 'block';
    homeActiveFirst.style.opacity = '1';

    document.documentElement.style.cursor = 'wait';

    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Animate loading words
    showWord(currentWordIndex);

    // Hide the loading screen
    setTimeout(() => {
      setStyles(loadingScreen, {
        top: '-100%',
        transition: 'var(--animation-smooth)',
      });
      setStyles(loadingWords, {
        top: '-100%',
        transition: 'var(--animation-smooth)',
      });
      setStyles(roundedDivBottom, {
        height: '0',
        transition: 'var(--animation-smooth)',
      });
      setStyles(roundedDivTop, {
        height: '0',
        transition: 'var(--animation-smooth)',
      });
      document.documentElement.style.cursor = 'auto';

      // Animate in the page content
      onceIn.forEach((el, i) => {
        if (window.innerWidth > 540) {
          setStyles(el, { transform: 'translateY(50vh)' });
        } else {
          setStyles(el, { transform: 'translateY(10vh)' });
        }
        setTimeout(() => {
          setStyles(el, {
            transform: 'translateY(0vh)',
            transition: 'var(--animation-smooth)',
          });
        }, 70 * i);
      });

      // Enable scrolling
      document.body.style.overflow = '';
    }, homeActive.length * delayBetweenWords + 2 * 800 + 2000);
  }
  initLoaderHome();
};

// Animation function for moving circle with mouse
const targetPointer = function () {
  const movingCircle = document.querySelector('.js-masker');
  const cursorExtend = document.querySelectorAll('.js-cursor-extend');
  const cursorVanish = document.querySelectorAll('.js-cursor-vanish');

  const sizeMask = {
    default: 30,
    fake: 350,
    zero: 0,
  };

  let isOverExtend = false; // Track if the cursor is over a js-cursor-extend element
  let isOverVanish = false; // Track if the cursor is over a js-cursor-vanish element
  let lastClientX = 0;
  let lastClientY = 0;

  // Function to update the mask's size and position
  const updateMaskPosition = (clientX, clientY, size) => {
    const scrollX = window.scrollX || window.pageXOffset; // Scroll position on X-axis
    const scrollY = window.scrollY || window.pageYOffset; // Scroll position on Y-axis

    // Calculate the new position with scroll offset
    const x = clientX + scrollX;
    const y = clientY + scrollY;

    // Adjust --x and --y based on scroll position
    movingCircle.style = `--size: ${size}px; --x: ${x}px; --y: ${y}px`;
  };

  // Function to handle mouse movement
  const handleMouseMove = ev => {
    const { clientX, clientY } = ev;
    lastClientX = clientX; // Store the last known mouse position
    lastClientY = clientY;

    // Update the mask position and size
    let size = 0;
    if (isOverVanish) size = sizeMask.zero;
    if (isOverExtend) size = sizeMask.fake;
    if (!isOverVanish && !isOverExtend) size = sizeMask.default;
    // const size = isOverExtend ? sizeMask.fake : sizeMask.default;
    updateMaskPosition(clientX, clientY, size);
  };

  // Listen for mouse movement on the whole document
  document.body.addEventListener('mousemove', handleMouseMove);

  // Add event listeners to each cursorExtend element
  cursorExtend.forEach(element => {
    // When the mouse enters a cursorExtend element
    element.addEventListener('mouseover', ev => {
      const { clientX, clientY } = ev;
      isOverExtend = true; // Set flag to true when hovering over extend element
      updateMaskPosition(clientX, clientY, sizeMask.fake); // Set to fake size
    });

    // When the mouse leaves the cursorExtend element
    element.addEventListener('mouseout', ev => {
      isOverExtend = false; // Reset flag when mouse leaves
      updateMaskPosition(lastClientX, lastClientY, sizeMask.default); // Reset to default size
    });
  });

  // Add event listeners to each cursorVanish element
  cursorVanish.forEach(element => {
    // When the mouse enters a cursorExtend element
    element.addEventListener('mouseover', ev => {
      const { clientX, clientY } = ev;
      isOverVanish = true; // Set flag to true when hovering over vanish element
      updateMaskPosition(clientX, clientY, sizeMask.zero); // Set to zero size
    });

    // When the mouse leaves the cursorExtend element
    element.addEventListener('mouseout', ev => {
      isOverVanish = false; // Reset flag when mouse leaves
      updateMaskPosition(lastClientX, lastClientY, sizeMask.default); // Reset to default size
    });
  });

  // Handle the scroll event
  window.addEventListener('scroll', () => {
    // Recalculate mask position based on the last known mouse position and scroll
    let size = 0;
    if (isOverVanish) size = sizeMask.zero;
    if (isOverExtend) size = sizeMask.fake;
    if (!isOverVanish && !isOverExtend) size = sizeMask.default;
    updateMaskPosition(lastClientX, lastClientY, size);
  });
};

// Animation function to show text
const showText = function () {
  const textsToAnimate = document.querySelectorAll('.animate__text');

  // Function to wrap each word and <br /> in span elements
  const wrapWordsInSpan = element => {
    const wordsWithBreaks = element.innerHTML.split(/(<br\s*\/?>)/g); // Split by <br />
    const wrappedWords = wordsWithBreaks
      .map(word => (word.includes('<br') ? word : `<span>${word}</span>`)) // Wrap words in spans
      .join(''); // Join the array back into a string
    element.innerHTML = wrappedWords;
  };

  // Call the function for each text block
  textsToAnimate.forEach(text => {
    wrapWordsInSpan(text);
  });

  // Function to handle the visibility and add class for animation
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate__visible'); // Add class to trigger animation
        }, 500);

        observer.unobserve(entry.target); // Stop observing once the animation has been triggered
      }
    });
  };

  // Create an IntersectionObserver to watch when elements come into view
  const observer = new IntersectionObserver(animateOnScroll, {
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  // Observe each animate__text element
  textsToAnimate.forEach(text => {
    observer.observe(text);
  });
};

// Animation function to move text
const moveText = function () {
  let lastScrollTop = 0;
  let scrollDirection = 1; // 1 for moving right, -1 for moving left
  let speed = 1.8; // Speed of movement
  const nameElement = document.querySelector('#name1');
  const nameElement2 = document.querySelector('#name2');
  const nameElement3 = document.querySelector('#name3');
  const sectionElement = document.querySelector('.animated-section');

  // Initialize the name position
  nameElement.style.left = `0px`;

  // Continuous motion for the name
  function animateText() {
    // Get the current position of the text
    let currentLeft = parseFloat(nameElement.style.left) || 0;
    let nameWidth = nameElement.offsetWidth; // Get the width of the name element

    let sectionWidth = sectionElement.offsetWidth; // Get the width of the section

    let name2CurLeft;
    let name3CurLeft;

    // Update position based on current scroll direction
    currentLeft += speed * scrollDirection;

    // Check if the first letter leaves the right side of the section
    if (currentLeft > sectionWidth) {
      currentLeft = sectionWidth - nameWidth;
    }

    // Check if the first letter leaves the left side of the section
    if (currentLeft < -nameWidth) {
      currentLeft = 0;
    }

    // Apply the new positions
    nameElement.style.left = `${currentLeft}px`;

    if (scrollDirection === 1) {
      name2CurLeft = currentLeft - sectionWidth - (nameWidth - sectionWidth);
      name3CurLeft = name2CurLeft + 2 * nameWidth;
    }
    if (scrollDirection === -1) {
      name2CurLeft = currentLeft + sectionWidth + (nameWidth - sectionWidth);
      name3CurLeft = name2CurLeft + -2 * nameWidth;
    }

    nameElement2.style.left = `${name2CurLeft}px`;
    nameElement3.style.left = `${name3CurLeft}px`;

    // Loop the motion
    requestAnimationFrame(animateText);
  }

  // Detect scroll direction
  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Reverse scroll direction based on user scrolling
    if (scrollTop > lastScrollTop) {
      scrollDirection = -1; // Scroll down, move left
    } else {
      scrollDirection = 1; // Scroll up, move right
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
  });

  // Start the continuous animation
  requestAnimationFrame(animateText);
};

// Animation function for the career timeline
const imgHighlight = function () {
  const imgLinks = document.querySelectorAll('.panel.panel--brands');
  const panelTexts = document.querySelectorAll('.panel__text');
  const viewportWidth = window.innerWidth;

  panelTexts.forEach(el => {
    if (viewportWidth > 1024)
      if (!(el === panelTexts[0]))
        setStyles(el, {
          opacity: 0,
          transition: 'var(--animation-smooth)',
        });
  });

  const deselect = function (el) {
    el.classList.remove('panel--brands--highlight');
    setStyles(el.querySelector('.panel__image img'), {
      height: '400px',
      filter: 'grayscale(80%)',
      transition: 'var(--animation-smooth)',
    });

    setStyles(el.querySelector('.panel__text'), {
      opacity: 0,
      transition: 'var(--animation-smooth)',
    });
  };
  const select = function (el) {
    el.classList.add('panel--brands--highlight');
    setStyles(el.querySelector('.panel__image img'), {
      height: '570px',
      filter: 'grayscale(0%)',
      transition: 'var(--animation-smooth)',
    });
    setStyles(el.querySelector('.panel__text'), {
      opacity: 1,
      transition: 'var(--animation-smooth)',
    });
  };

  imgLinks.forEach(img => {
    img.addEventListener('mouseover', ev => {
      const hoveredImg = ev.target.closest('.panel--brands');
      if (!hoveredImg) return;
      imgLinks.forEach(el => {
        deselect(el);
      });
      select(hoveredImg);
    });
    // img.addEventListener('mouseout', () => {
    //   imgLinks.forEach(el => {
    //     deselect(el);
    //   });
    //   // select(imgLinks[0]);
    // });
    img.addEventListener('click', ev => {
      const clickedImg = ev.target.closest('.panel--brands');
      if (!clickedImg) return;
      imgLinks.forEach(el => {
        deselect(el);
      });
      select(clickedImg);

      if (viewportWidth < 1024)
        panelTexts.forEach(el => {
          setStyles(el, {
            opacity: 1,
            transition: 'var(--animation-smooth)',
          });
        });
    });

    const imgLinkHighlight = document.querySelector(
      '.panel--brands--highlight'
    );

    setStyles(imgLinkHighlight.querySelector('.panel__image img'), {
      height: '570px',
      filter: 'grayscale(0%)',
      transition: 'var(--animation-smooth)',
    });
  });
};

// Function to handle paragraph mask scroll effect
// Apply the effect to all elements with the class `js-scroll-div-move`
function scrollDivMove() {
  const paragraphs = document.querySelectorAll('.js-scroll-div-move');

  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Apply effect when element is in viewport
  function applyScrollEffect() {
    paragraphs.forEach(paragraph => {
      if (isElementInViewport(paragraph)) {
        paragraph.classList.add('in-view'); // Add class when in view
      } else {
        paragraph.classList.remove('in-view'); // Remove class when out of view
      }
    });
  }

  // Event listener for scrolling
  window.addEventListener('scroll', applyScrollEffect);

  // Initial check in case some elements are already in view
  applyScrollEffect();
}

// Animation function for rotating image aroun y-axis
const rotateImg = function () {
  // Select the earth image element
  const rotatedImage = document.querySelector('.rotated-image');

  // Variable to track the rotation on the Y-axis
  let rotationYY = 0;

  // Variable to track the previous scroll position
  let previousScrollPosition1 = window.scrollY;

  // Function to update the rotation based on scroll direction
  function updateEarthRotation1() {
    const currentScrollPosition = window.scrollY;

    // Calculate the difference in scroll position to determine the direction
    const scrollDirection =
      currentScrollPosition > previousScrollPosition1 ? 1 : -1;

    // Update the rotationY by adding or subtracting based on the scroll direction
    rotationYY += scrollDirection * 2; // Change "2" to adjust the sensitivity

    // Apply the rotation transformation to the earth image
    rotatedImage.style.transform = `rotateY(${rotationYY}deg)`;

    // Update the previous scroll position
    previousScrollPosition1 = currentScrollPosition;
  }

  // Add an event listener for the scroll event
  window.addEventListener('scroll', updateEarthRotation1);
};

// Animation Function for creating 3D sphere element from a texture image using Three.js lib.
const createSphere = function () {
  // Get the earth container where the 3D scene will be rendered
  const container = document.getElementById('earth-container');

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadows
  container.appendChild(renderer.domElement);

  // Create a sphere geometry to represent the Earth
  const geometry = new THREE.SphereGeometry(1.7, 64, 64);

  // Load the Earth texture (replace with your dark earth texture if needed)
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('/assets/img/earthlights4k.jpg'); // Earth texture

  // Create a material using the texture and PhongMaterial to react to light
  const material = new THREE.MeshPhongMaterial({ map: earthTexture });

  // Create the 3D Earth mesh (sphere + texture)
  const earth = new THREE.Mesh(geometry, material);
  earth.castShadow = true; // Earth will cast a shadow
  scene.add(earth);

  // Position the camera to view the Earth
  camera.position.z = 3;

  // Add lighting
  // Directional light to simulate sunlight coming from the right
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 0, 5); // Position it to the right of the Earth
  light.castShadow = true; // Enable shadows for the light
  scene.add(light);

  // Ambient light for soft global illumination
  const ambientLight = new THREE.AmbientLight(0x404040); // Soft light everywhere
  scene.add(ambientLight);

  // Add a shadow on the left side by adding a light to the right and enabling shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

  // Variables for rotation
  let rotationY = 3;
  let previousScrollPosition = window.scrollY;

  // Function to update the rotation based on scroll direction
  function updateEarthRotation() {
    const currentScrollPosition = window.scrollY;

    // Calculate the scroll direction
    const scrollDirection =
      currentScrollPosition > previousScrollPosition ? 1 : -1;

    // Update rotation based on scroll direction
    rotationY += scrollDirection * 0.005; // Adjust 0.02 for sensitivity

    // Rotate the Earth on its Y-axis
    earth.rotation.y = rotationY;

    // Update the previous scroll position
    previousScrollPosition = currentScrollPosition;
  }

  // Add the scroll event listener to update rotation
  window.addEventListener('scroll', updateEarthRotation);

  // Animate the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
};

// Animation function for scrolling to top
const scrollTop = function () {
  const mgaBtn = document.querySelector('.mga');
  mgaBtn.addEventListener('click', () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });
};

// Function for creating slider and connect it with images
const sliderization = function () {
  //////////////////////
  // Slider component //
  //////////////////////

  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const slidesNum = slides.length;
  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="dots__dot" data-slide-num="${i}"></div>`
      );
    });
  };

  const goToSlide = function (slideNum) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - slideNum)}%)`)
    );
  };

  const activateDot = function (slideNum) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide-num="${slideNum}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide === slidesNum - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = slidesNum - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Initial conditions
  const init = function () {
    createDots(); // Creating slides dots
    goToSlide(0); // Initial slide condition
    activateDot(0); // Initial dot condition
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // Short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slideNum } = e.target.dataset;
      goToSlide(slideNum);
      activateDot(slideNum);
    }
  });

  // Link images to slider slides
  const parentLinksEl = document.querySelector('.slider--brands');
  const allLinksEls = document.querySelectorAll('.panel--brands');

  allLinksEls.forEach((el, i) => {
    el.setAttribute('data-slide-num', i);
  });

  parentLinksEl.addEventListener('click', function (e) {
    e.preventDefault();
    const targetLink = e.target.closest('.panel--brands');
    if (!targetLink) return;

    const id = targetLink.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

    const { slideNum } = targetLink.dataset;
    goToSlide(slideNum);
    activateDot(slideNum);
  });

  //////////////////////////////////////////////////////////
  // Swipe and scroll touchable devices and mouse-devices //
  //////////////////////////////////////////////////////////

  // Initial mouse X and Y positions are 0
  let mouseX,
    initialX = 0;
  let mouseY,
    initialY = 0;
  let isSwiped;

  // Initial swipe conditions
  let swipeDirection = 'Middle'; //idle
  let lastSwipe = 9999;
  let swipeIdleTime = 200; // time interval that we consider a new scroll event

  // Events for touch and mouse
  let events = {
    mouse: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      scroll: 'wheel',
    },
    touch: {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      scroll: 'wheel',
    },
  };

  let deviceType = '';

  // Detect touch device
  const isTouchDevice = () => {
    try {
      // We try to create TouchEvent (it would fail for desktops and throw error)
      document.createEvent('TouchEvent');
      deviceType = 'touch';
      return true;
    } catch (e) {
      deviceType = 'mouse';
      return false;
    }
  };

  // Get left and top of touched element
  slides.forEach(slide => {
    let rectLeft = slide.getBoundingClientRect().left;
    let rectTop = slide.getBoundingClientRect().top;

    // Get exact X and Y positions of mouse/touch
    const getXY = e => {
      mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
      mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
    };

    isTouchDevice();

    // Start swipe
    slide.addEventListener(events[deviceType].down, ev => {
      isSwiped = true;

      // Get X and Y position
      getXY(ev);
      initialX = mouseX;
      initialY = mouseY;
    });

    // Mousemove / touchmove
    slide.addEventListener(events[deviceType].move, ev => {
      if (!isTouchDevice()) {
        ev.preventDefault();
      }

      let timeNow = performance.now();

      if (isSwiped) {
        getXY(ev);
        let diffX = mouseX - initialX;
        let diffY = mouseY - initialY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
          const vSwipe = diffY > 0 ? 'Down' : 'Up';
          console.log(vSwipe);
        }
        if (Math.abs(diffY) < Math.abs(diffX)) {
          const hSwipe = diffX > 0 ? 'Right' : 'Left';
          console.log(hSwipe);

          if (
            diffX > 0 &&
            (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            prevSlide();
            swipeDirection = 'Right';
          }

          if (
            diffX < 0 &&
            (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            nextSlide();
            swipeDirection = 'Left';
          }
        }
      }
      lastSwipe = timeNow;
    });

    // End swipe
    slide.addEventListener(events[deviceType].up, () => {
      isSwiped = false;
    });
    slide.addEventListener('mouseleave', () => {
      isSwiped = false;
    });

    // Scrolling
    slide.addEventListener(events[deviceType].scroll, ev => {
      let timeNow = performance.now();
      let { deltaX } = ev;

      if (
        deltaX < 0 &&
        (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        prevSlide();
        swipeDirection = 'Right';
      }

      if (
        deltaX > 0 &&
        (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        nextSlide();
        swipeDirection = 'Left';
      }

      lastSwipe = timeNow;
    });
  });

  window.onload = () => {
    isSwiped = false;
  };
};

// Function for creating vertical slider of projects
const verticalSliderization = function (slideNum) {
  const slides = document.querySelectorAll('.section--brands');
  const slider = document.querySelector('.fullpage-wrapper');

  const projs = document.querySelectorAll('.section-nav__item');
  const dotContainer = document.querySelector('.nav__indicator');
  const dots = document.querySelectorAll('.section-nav__indicator');

  let curSlide = 0;
  const slidesNum = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<div class="section-nav__indicator" data-slide-num="${i}"></div>`
      );
    });
  };

  const goToSlide = function (slideNum) {
    slider.style.transform = `translateY(${-100 * slideNum}%)`;
  };

  const activateNavItem = function (slideNum) {
    projs.forEach(dot => dot.classList.remove('active'));

    document
      .querySelector(`.section-nav__item[data-slide-num="${slideNum}"]`)
      .classList.add('active');
  };

  const activateDot = function (slideNum) {
    document
      .querySelectorAll('.section-nav__indicator')
      .forEach(dot => dot.classList.remove('section-nav__indicator--active'));

    document
      .querySelector(`.section-nav__indicator[data-slide-num="${slideNum}"]`)
      .classList.add('section-nav__indicator--active');
  };

  const nextSlide = function () {
    if (curSlide === slidesNum - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateNavItem(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = slidesNum - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateNavItem(curSlide);
    activateDot(curSlide);
  };

  const addAttrToNavItems = function () {
    projs.forEach((proj, i) => {
      proj.setAttribute('data-slide-num', `${i}`);
    });
  };

  // Initial conditions
  const init = function (slideNum) {
    addAttrToNavItems(); // Add attribute for nav items
    if (dots.length === 0) createDots(); // Creating slides dots
    goToSlide(slideNum); // Initial slide condition
    activateNavItem(slideNum); // Initial nav item condition
    activateDot(slideNum); // Initial dot condition
  };
  init(slideNum);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') prevSlide();
    e.key === 'ArrowDown' && nextSlide(); // Short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('section-nav__indicator')) {
      const { slideNum } = e.target.dataset;
      goToSlide(slideNum);
      activateNavItem(slideNum);
      activateDot(slideNum);
    }
  });

  projs.forEach(proj => {
    proj.addEventListener('click', function (e) {
      if (e.target.classList.contains('section-nav__item')) {
        const { slideNum } = e.target.dataset;
        goToSlide(slideNum);
        activateNavItem(slideNum);
        activateDot(slideNum);
      }
    });
  });

  //////////////////////////////////////////////////////////
  // Swipe and scroll touchable devices and mouse-devices //
  //////////////////////////////////////////////////////////

  // Initial mouse X and Y positions are 0
  let mouseX,
    initialX = 0;
  let mouseY,
    initialY = 0;
  let isSwiped;

  // Initial swipe conditions
  let swipeDirection = 'Middle'; //idle
  let lastSwipe = 9999;
  let swipeIdleTime = 200; // time interval that we consider a new scroll event

  // Events for touch and mouse
  let events = {
    mouse: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      scroll: 'wheel',
    },
    touch: {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      scroll: 'wheel',
    },
  };

  let deviceType = '';

  // Detect touch device
  const isTouchDevice = () => {
    try {
      // We try to create TouchEvent (it would fail for desktops and throw error)
      document.createEvent('TouchEvent');
      deviceType = 'touch';
      return true;
    } catch (e) {
      deviceType = 'mouse';
      return false;
    }
  };

  // Get left and top of touched element
  slides.forEach(slide => {
    let rectLeft = slide.getBoundingClientRect().left;
    let rectTop = slide.getBoundingClientRect().top;

    // Get exact X and Y positions of mouse/touch
    const getXY = e => {
      mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
      mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
    };

    isTouchDevice();

    // Start swipe
    slide.addEventListener(events[deviceType].down, ev => {
      isSwiped = true;

      // Get X and Y position
      getXY(ev);
      initialX = mouseX;
      initialY = mouseY;
    });

    // Mousemove / touchmove
    slide.addEventListener(events[deviceType].move, ev => {
      if (!isTouchDevice()) {
        ev.preventDefault();
      }

      let timeNow = performance.now();

      if (isSwiped) {
        getXY(ev);
        let diffX = mouseX - initialX;
        let diffY = mouseY - initialY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
          const vSwipe = diffY > 0 ? 'Down' : 'Up';
          console.log(vSwipe);

          if (
            diffX > 0 &&
            (swipeDirection !== 'Down' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            prevSlide();
            swipeDirection = 'Down';
          }

          if (
            diffX < 0 &&
            (swipeDirection !== 'Up' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            nextSlide();
            swipeDirection = 'Up';
          }
        }
        if (Math.abs(diffY) < Math.abs(diffX)) {
          const hSwipe = diffX > 0 ? 'Right' : 'Left';
          console.log(hSwipe);

          if (
            diffX > 0 &&
            (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            prevSlide();
            swipeDirection = 'Right';
          }

          if (
            diffX < 0 &&
            (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            nextSlide();
            swipeDirection = 'Left';
          }
        }
      }
      lastSwipe = timeNow;
    });

    // End swipe
    slide.addEventListener(events[deviceType].up, () => {
      isSwiped = false;
    });
    slide.addEventListener('mouseleave', () => {
      isSwiped = false;
    });

    // Scrolling
    let scrollThrottle = false; // Throttle flag to prevent multiple triggers during a single scroll
    let threshold = 10; // Minimum scroll distance to trigger a slide change

    slide.addEventListener(events[deviceType].scroll, ev => {
      let timeNow = performance.now();
      let { deltaX, deltaY } = ev;

      if (scrollThrottle) return;
      // Only proceed if the scroll distance is significant enough (to avoid minor trackpad movements)
      if (Math.abs(deltaY) > threshold) {
        console.log(deltaY);

        if (
          deltaY < 0 &&
          (swipeDirection !== 'Down' || timeNow > lastSwipe + swipeIdleTime)
        ) {
          prevSlide();
          swipeDirection = 'Down';
        }

        if (
          deltaY > 0 &&
          (swipeDirection !== 'Up' || timeNow > lastSwipe + swipeIdleTime)
        ) {
          nextSlide();
          swipeDirection = 'Up';
        }

        // Set throttle to true to prevent multiple triggers
        scrollThrottle = true;

        // Reset throttle after a short delay (e.g., 1 second)
        setTimeout(() => (scrollThrottle = false), 500); // Adjust delay as needed
      }

      if (
        deltaX < 0 &&
        (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        prevSlide();
        swipeDirection = 'Right';
      }
      if (
        deltaX > 0 &&
        (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        nextSlide();
        swipeDirection = 'Left';
      }
      lastSwipe = timeNow;
    });
  });

  window.onload = () => {
    isSwiped = false;
  };
};

// Function for opening and closing projects modal
const modalProjs = function () {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const projNames = document.querySelectorAll('.js-simple-masking_el');
  const projects = document.querySelectorAll('.js-project');
  const myProjs = document.getElementById('earth-container');

  const openModal = function (e, pNum) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    verticalSliderization(pNum);
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    myProjs.scrollIntoView();
  };

  projects.forEach((proj, i) => {
    projNames[i].setAttribute('data-slide-num', `${i}`);
    projNames[i].addEventListener('mouseover', () => {
      proj.classList.add('is-hover');
    });
    projNames[i].addEventListener('mouseout', () => {
      proj.classList.remove('is-hover');
    });
    projNames[i].addEventListener('click', e => {
      let { slideNum } = e.target.closest('.js-simple-masking_el').dataset;
      // Modal window open
      openModal(e, slideNum);
    });
  });

  // Close modal
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};

// Animation function for changing element width on scrolling
const changeElWidth = function () {
  const videoPlayerInner = document.querySelector('.js-videoPlayer_inner');
  const videoContainer = document.querySelector('.video');

  // Function to update --size based on scroll position
  function updateClipPath() {
    const rect = videoContainer.getBoundingClientRect(); // Get position of the video container relative to the viewport
    const viewportHeight = window.innerHeight; // Get the viewport height

    // Check when the image top is at the top of the viewport and bottom is in view
    if (rect.bottom >= 0 && rect.top <= viewportHeight) {
      // If image is within the viewport, calculate the range of visible area
      const visiblePercentage = Math.min(
        Math.max((rect.bottom - viewportHeight) / rect.height, 0),
        1
      );

      // Update --size: 20% when at the bottom, 0% when at the top
      const newSize = 20 * visiblePercentage;
      videoPlayerInner.style.setProperty('--size', `${newSize}%`);
    }
  }

  // Attach scroll event listener
  window.addEventListener('scroll', updateClipPath);

  // Initial call to set the clip-path when the page loads
  updateClipPath();
};

// Animation function for contacts
const connectMask = function () {
  const connects = document.querySelectorAll('.js-connect-mask');

  connects.forEach(connect => {
    connect.addEventListener('mouseover', () => {
      connect.classList.add('is-hover');
    });
    connect.addEventListener('mouseout', () => {
      connect.classList.remove('is-hover');
    });
  });
};

// Animation function for revealing section on scrolling
const reveal = function () {
  const allSections = document.querySelectorAll('.main-section');
  const revealSection = function (entryArr, observer) {
    const [entry] = entryArr;
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target); // To prevent observer callback function after it runs once
  };
  const revealOptions = {
    root: null,
    threshold: 0.15,
  };
  const sectionObserver = new IntersectionObserver(
    revealSection,
    revealOptions
  );

  allSections.forEach(function (section) {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
};

// Function for replacing images src
const imageSrcChange = function () {
  const imgTargets = document.querySelectorAll('img[data-src]');
  const loadImg = function (entryArr, observer) {
    const [entry] = entryArr;

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };
  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0.1,
  });

  imgTargets.forEach(img => imgObserver.observe(img));
};

// Animation function for adding magnetic effect
const initMagneticButtons = function () {
  var magnets = document.querySelectorAll('.magnetic');
  var strength = 100;

  // START: If the screen width is larger than 540px, apply magnetic effect
  if (window.innerWidth > 540) {
    magnets.forEach(magnet => {
      magnet.addEventListener('mousemove', moveMagnet);

      magnet.addEventListener('mouseover', function () {
        // Remove 'not-active' class
        magnet.classList.remove('not-active');
        magnet.querySelector('.btn-text').classList.remove('not-active');
      });
      magnet.addEventListener('mouseleave', function (event) {
        // Reset position on mouse leave
        var magnetButton = event.currentTarget;

        // Reset magnetic button to original position
        // magnetButton.style.transition = `transform 0.9s cubic-bezier(0.2, 4.5, 0.4, 1)`;
        magnetButton.classList.add('not-active');
        magnetButton.style.transform = `translate(0px, 0px)`;

        // Reset text inside the button to original position
        var btnText = magnetButton.querySelector('.btn-text');
        if (btnText) {
          btnText.classList.add('not-active');
          btnText.style.transform = `translate(0px, 0px)`;
        }
      });
    });

    function moveMagnet(event) {
      var magnetButton = event.currentTarget;
      var bounding = magnetButton.getBoundingClientRect();
      var magnetsStrength =
        magnetButton.getAttribute('data-strength') || strength;

      var magnetsStrengthText =
        magnetButton.getAttribute('data-strength-text') || strength;

      // Calculate magnetic movement for the button
      var translateX =
        ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
        magnetsStrength;
      var translateY =
        ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
        magnetsStrength;

      // Move button according to mouse position
      magnetButton.style.transform = `translate(${translateX}px, ${translateY}px)`;

      // Move the text inside the button if it exists
      var btnText = magnetButton.querySelector('.btn-text');
      if (btnText) {
        var translateTextX =
          ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
          magnetsStrengthText;
        var translateTextY =
          ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
          magnetsStrengthText;

        btnText.style.transform = `translate(${translateTextX}px, ${translateTextY}px)`;
      }
    }
  }

  // Mouse Enter: Add animation when the mouse enters
  document.querySelectorAll('.btn-click.magnetic').forEach(button => {
    button.addEventListener('mouseenter', function () {
      var btnFill = this.querySelector('.btn-fill');
      if (btnFill) {
        btnFill.style.transition = 'transform 0.6s ease-in-out';
        btnFill.style.transform = 'translateY(76%)'; // Move .btn-fill to 0% on hover
      }

      var btnTextInner = this.querySelector('.btn-text-inner.change');
      if (btnTextInner) {
        btnTextInner.style.transition = 'color 0.3s ease-in';
        btnTextInner.style.color = '#FFFFFF'; // Change color to white on hover
      }

      this.parentNode.classList.remove('not-active');
    });
  });

  // Mouse Leave: Add animation when the mouse leaves
  document.querySelectorAll('.btn-click.magnetic').forEach(button => {
    button.addEventListener('mouseleave', function () {
      var btnFill = this.querySelector('.btn-fill');
      if (btnFill) {
        btnFill.style.transition = 'transform 0.6s ease-in-out';
        btnFill.style.transform = 'translateY(-76%)'; // Move .btn-fill back to -76% on mouse leave
      }

      var btnTextInner = this.querySelector('.btn-text-inner.change');
      if (btnTextInner) {
        btnTextInner.style.transition = 'color 0.3s ease-out 0.3s'; // Delay color change by 0.3s
        btnTextInner.style.color = '#1C1D20'; // Change text color back to black
      }

      this.parentNode.classList.remove('not-active');
    });
  });
};

// Animation function for nav and menu items
const headerMenu = function () {
  const headerMenuItemParents = document.querySelectorAll('.header_menu_item');
  const headerLinksParent = document.querySelectorAll('.links-wrap');
  const headerLinks = document.querySelectorAll('.btn-link');
  const btnMenu = document.querySelector('.btn-menu');
  const btnHmbrgr = document.querySelector('.btn-hamburger');
  const mainDiv = document.getElementById('main');

  btnMenu.addEventListener('click', () => {
    mainDiv.classList.add('nav-active');
    btnHmbrgr.classList.add('active');
  });
  btnHmbrgr.addEventListener('click', () => {
    mainDiv.classList.remove('nav-active');
    btnHmbrgr.classList.remove('active');
  });

  headerMenuItemParents.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      headerMenuItemParents.forEach(el => {
        el.classList.remove('is-active');
      });
      item.classList.add('is-active');

      // Scroll to section
      const menuLink = e.target.closest('.js-menu-link');
      const id = menuLink.getAttribute('href');
      if (!id) return;
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    });
  });

  headerLinksParent.forEach(parent => {
    parent.addEventListener('click', e => {
      e.preventDefault();

      headerLinks.forEach(el => {
        el.classList.remove('active');
      });

      // Scroll to section
      const link = e.target.closest('.js-menu-link');
      if (!link) return;
      const activeLink = e.target.closest('.btn-link');
      activeLink.classList.add('active');
      const id = link.getAttribute('href');
      if (!id) return;
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

      mainDiv.classList.remove('nav-active');
      btnHmbrgr.classList.remove('active');
    });
  });

  // nav fade animation
  const handlerHover = function (e) {
    e.preventDefault();

    if (e.target.classList.contains('js-menu-link')) {
      const clickedLink = e.target.closest('.btn-link');
      const navLinks = clickedLink
        .closest('.links-wrap')
        .querySelectorAll('.btn-link');

      navLinks.forEach(link => {
        if (link !== clickedLink) link.style.opacity = this;
      });
    }
  };
  const nav = document.querySelector('.links-wrap');
  // Passing "argument" into handler only using this keyword
  nav.addEventListener('mouseover', handlerHover.bind(0.5));
  nav.addEventListener('mouseout', handlerHover.bind(1));

  // Sticky navigation
  const heroDiv = document.querySelector('.hero');
  const headerMenuDiv = document.querySelector('.header_menu');
  const navHeight = nav.getBoundingClientRect().height;
  const obsCallback = function (entriesArr) {
    // entries : threshold's values each one alone
    const [entries] = entriesArr;
    if (!entries.isIntersecting) headerMenuDiv.classList.remove('hidden');
    else headerMenuDiv.classList.add('hidden');
  };
  const obsOptions = {
    root: null, // the element that target (header) intersecting ==> null : the entire viewport
    threshold: [0, 0.2], // percentage of intersection at which the (obsCallback) will be called
    rootMargin: `-${navHeight}px`, // Margin applied outside of target element
  };
  const observer = new IntersectionObserver(obsCallback, obsOptions);
  observer.observe(heroDiv);

  // activate menu-link on section intersection
  const secIds = ['#about', '#work', '#contact'];
  const secIntersection = function (id) {
    const observedSec = document.querySelector(id);
    const secMenuItem = document
      .querySelector(`.js-menu-link[href="${id}"]`)
      .closest('.header_menu_item');
    const secNavItem = document
      .querySelector(`.btn-click.js-menu-link[href="${id}"]`)
      .closest('.btn-link');

    // const secHeight = observedSec.getBoundingClientRect().height;

    const allMenuItems = document.querySelectorAll('.header_menu_item');
    const allNavItems = document.querySelectorAll('.btn-link');

    const secObsCallback = function (entriesArr) {
      // entries : threshold's values each one alone
      const [entries] = entriesArr;

      if (entries.isIntersecting) {
        allMenuItems.forEach(item => {
          item.classList.remove('is-active');
        });
        secMenuItem.classList.add('is-active');
        allNavItems.forEach(item => {
          item.classList.remove('active');
        });
        secNavItem.classList.add('active');
      }
    };
    const SecObsOptions = {
      root: null, // the element that target (header) intersecting ==> null : the entire viewport
      threshold: [0], // percentage of intersection at which the (obsCallback) will be called
    };
    const secObserver = new IntersectionObserver(secObsCallback, SecObsOptions);
    secObserver.observe(observedSec);
  };
  secIds.forEach(id => {
    secIntersection(id);
  });
};

// -------------------------------------------------------------------------------------------------------------------- classes
// Class to fill a div with mask on scroll
class ScrollParagraphMask {
  constructor(el, elClass) {
    this.DOM = { el: el };
    this.DOM.parent = this.DOM.el.parentElement;

    // Create a background duplicate of the el
    this.DOM.background = this.DOM.el.cloneNode(true);
    this.DOM.background.classList.add(elClass);
    this.DOM.parent.classList.add('scroll-el-parent');
    this.DOM.parent.appendChild(this.DOM.background);

    // Initially, apply the 'is-masking' class
    this.DOM.el.classList.add('is-masking');

    // Initial mask setup
    this.DOM.el.style.setProperty('--size', '100%');

    // Track scroll direction and the last scroll position
    this.lastScrollTop = window.scrollY;
    this.isMasked = true;

    // Initialize the scroll effect
    this.initScrollEffect();
  }

  // Method to calculate and apply the masking effect based on scroll position
  onScroll() {
    const currentScrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    // Get the bounding rectangle of the parent
    const rect = this.DOM.parent.getBoundingClientRect();
    const progress = Math.max(
      0,
      Math.min(1, (1.5 * (windowHeight - rect.top)) / windowHeight)
    );

    // If the parent is in the viewport, update the mask size
    if (rect.top < windowHeight) {
      // Decrease the mask size when scrolling down
      if (currentScrollTop > this.lastScrollTop) {
        this.DOM.el.style.setProperty('--size', `${100 - progress * 100}%`);
      } else {
        // Increase the mask size when scrolling up
        this.DOM.el.style.setProperty(
          '--size',
          `${Math.min(
            100,
            parseFloat(
              getComputedStyle(this.DOM.el).getPropertyValue('--size')
            ) + 1
          )}%`
        );
      }
    }

    this.lastScrollTop = currentScrollTop; // Update last scroll position
  }

  // Initialize the scroll effect
  initScrollEffect() {
    window.addEventListener('scroll', () => this.onScroll());
  }
}
// Apply the effect to all elements with the class `js-scroll-paragraph-mask`
const ScrollFillMask = function () {
  document.querySelectorAll('.js-scroll-paragraph-mask').forEach(paragraph => {
    new ScrollParagraphMask(paragraph, 'is-bg');
  });
  document.querySelectorAll('.js-heading-mask_heading').forEach(head => {
    new ScrollParagraphMask(head, 'is-deep');
  });
};
// -------------------------------------------------------------------------------------------------------------------- onload event

// Fire scripts on page load
function initScript() {
  fix100VhOnPhone(); // Fix height
  runIntro(); // Load intro animation
  targetPointer(); // Create moving circle
  showText(); // Show text over image
  moveText(); // Move text depend on scroll
  imgHighlight(); // Image highlight from section about
  scrollDivMove(); // Div move on scroll
  ScrollFillMask(); // Div move on scroll
  scrollTop(); // Scroll page to top
  sliderization(); // Slider connect to images
  // rotateImg(); // Rotate earth image
  createSphere(); // Creating earth
  changeElWidth(); // Change img width on scrolling
  modalProjs(); // Show my projects
  // verticalSliderization(0); // Projects slider in modal (is being called in modalProjs())
  connectMask(); // Create mask for connect elements
  reveal(); // Reveal sections
  imageSrcChange(); // Change images src
  initMagneticButtons(); // Magnetise elements
  headerMenu(); // Header menu links & side nav & side links
}
document.addEventListener('DOMContentLoaded', initScript);
// ----------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------
