'use strict';

///////////////////////////////////////

// ! Pre-defined classes and ids
const header = document.querySelector('.header');
const topNav = document.querySelector('.nav');
const topNavHeight = topNav.getBoundingClientRect().height;
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const sections = document.querySelectorAll('.section');
const section1 = document.getElementById('section--1');
const section1Cord = section1.getBoundingClientRect();
const allNavLinks = document.querySelectorAll('.nav__link');
const navLinksParent = document.querySelector('.nav__links');
const tabParent = document.querySelector('.operations__tab-container');
const allTabs = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');
const lazyImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderDotsSection = document.querySelector('.dots');

////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

// ! Pre-Defined functions

// TODO open pop up for creating account
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// TODO close pop up for creating account
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////
/////////////////////////////////
/////////////////////////////////

// ! Create, Insert & Delete Cookie Message

// TODO Create
const cookieMsg = document.createElement('div');
cookieMsg.classList.add('cookie-message');
cookieMsg.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// TODO INSERT
header.append(cookieMsg);

// TODO Delete
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    cookieMsg.remove();
  });

// cookieMsg.style.setProperty('height', '100px');

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

// ! Functionalities

// TODO Smooth Scrolling on clicking Learn More
btnScroll.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////

// TODO Smooth scrolling when clicked on top nav links
// * Solution 1 (but not efficient)
// allNavLinks.forEach(function (nav_link) {
// nav_link.addEventListener('click', function (e) {
// e.preventDefault();
// const linkTo = this.getAttribute('href');
// linkTo.scrollIntoView({});
// document.querySelector(linkTo).scrollIntoView({ behavior: 'smooth' });
// });
// });

// * Solution 2 (Using Event Delegation)
navLinksParent.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const linkTo = e.target.getAttribute('href');
    document.querySelector(linkTo).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////

// TODO Implement Tab
// console.log(tabParent);
// console.log(allTabs);
// console.log(tabContents);

tabParent.addEventListener('click', function (e) {
  const clickedOn = e.target.closest('.operations__tab');

  // returns null if element does not have specified class
  if (!clickedOn) return;

  // * Activate Tab

  allTabs.forEach(t => t.classList.remove('operations__tab--active'));
  // console.log(clickedOn);
  clickedOn.classList.add('operations__tab--active');

  // * Active Content of the Active Tab
  const activeTabNo = clickedOn.dataset.tab;
  // console.log(activeTabNo);
  const activeContent = document.querySelector(
    `.operations__content--${activeTabNo}`
  );
  // console.log(activeContent);

  tabContents.forEach(c => c.classList.remove('operations__content--active'));

  activeContent.classList.add('operations__content--active');
});

//////////////////////////////////

// TODO fade color in top nav links which are not in focus

const fadeNavLinks = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hoverLink = e.target;
    const logo = e.target.closest('.nav').querySelector('img');

    allNavLinks.forEach(l => {
      if (l !== hoverLink) l.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// * Fades-In other links
navLinksParent.addEventListener('mouseover', fadeNavLinks.bind(0.5));

// * Fades-Out other links
navLinksParent.addEventListener('mouseout', fadeNavLinks.bind(1));

/////////////////////////////////////

// TODO Sticky Top Nav

// * Solution 1
// window.addEventListener('scroll', function () {
//   // console.log(section1Cord);
//   // console.log(window.scrollY);

//   if (window.scrollY > section1Cord.top) topNav.classList.add('sticky');
//   else topNav.classList.remove('sticky');
// });

// * Solution 2 using IntersectionObeserver

const headerObserverFunc = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) topNav.classList.add('sticky');
  else topNav.classList.remove('sticky');
};

// Calls headerObserverFunc when the 'observed' element passes the specified threshold
const headerObserver = new IntersectionObserver(headerObserverFunc, {
  root: null,
  threshold: 0,
  rootMargin: `-${topNavHeight}px`,
});
// console.log(topNavHeight);

// Specify which element it needs to observe
headerObserver.observe(header);

///////////////////////////////////////

// TODO give fading-in affects to the sections

sections.forEach(sec => sec.classList.add('section--hidden'));

// sec.classList.add('section--hidden')

const sectionObserverFunc = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // console.log(entry.target);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // will observe only once and not again and again
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionObserverFunc, {
  root: null,
  threshold: 0.15,
});

// console.log(sections);
sections.forEach(sec => sectionObserver.observe(sec));

/////////////////////////////////////////

// TODO Lazy Loading Images

const imageObserverFunc = function (entries, observer) {
  const [entry] = entries;

  // console.log(entry);

  if (!entry.isIntersecting) return;

  const target = entry.target;

  // replace low-res image with high-res
  target.src = target.dataset.src;

  // only un-blur the low-res image after the high-res image is done loading (useful for low-bandwidth connections)
  target.addEventListener('load', function () {
    target.classList.remove('lazy-img');
  });

  observer.unobserve(target);
};

const imageObserver = new IntersectionObserver(imageObserverFunc, {
  root: null,
  threshold: 0,
  rootMargin: '-100px', // give positive value if it wants to be loaded before the image comes to the viewport
});

lazyImages.forEach(img => imageObserver.observe(img));

///////////////////////////////////
// TODO Implement Testimonial Slider

// console.log(slides);

const slidesLength = slides.length;
let currSlide = 0;

// * Create Slider dots
slides.forEach((_, i) => {
  sliderDotsSection.insertAdjacentHTML(
    'beforeend',
    `<button class="dots__dot" data-slide=${i}></button>`
  );
});

const sliderDots = document.querySelectorAll('.dots__dot');
// console.log(sliderDots);

// common function for moving slides left & right
// AND also making to view the section side by side
const moveSlides = function (current) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - current)}%)`;

    // remove active dot class for all dots
    sliderDots[i].classList.remove('dots__dot--active');
  });

  // and add active dot to only for the current slide
  sliderDots[current].classList.add('dots__dot--active');
};

// * Logic behind moving slides left and right
const sliderRightSetting = function () {
  if (currSlide === slidesLength - 1) currSlide = 0;
  else currSlide++;
  // console.log(currSlide);

  // not only moves the slides but also toggles the dots
  moveSlides(currSlide);
};
const sliderLeftSetting = function () {
  if (currSlide === 0) currSlide = slidesLength;
  currSlide--;
  // console.log(currSlide);

  moveSlides(currSlide);
};

// to view testimonials side by side
moveSlides(0);

// * Left & Right buttons
sliderBtnRight.addEventListener('click', sliderRightSetting);

sliderBtnLeft.addEventListener('click', sliderLeftSetting);

// * keyboard functionality
// move the slide via keyboards' right & left key
document.addEventListener('keydown', function (e) {
  // console.log(e.key);
  if (e.key === 'ArrowRight') sliderRightSetting();
  if (e.key === 'ArrowLeft') sliderLeftSetting();
});

// * Dots

sliderDotsSection.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot'))
    moveSlides(e.target.dataset.slide);
});

/////////////////////////////////
////////////////////////////////
