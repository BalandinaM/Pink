let navMain = document.querySelector('.header__nav');
let navToggle = document.querySelector('.header__button');
let wrapLogo = document.querySelector('.header__wrap-logo');
let wrapHeaderLogo = document.querySelector('.wrap-header-and-intro');

navMain.classList.remove ('header__nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('header__nav--closed')) {
    wrapLogo.classList.remove('header__wrap-logo--bg-opacity');
    wrapHeaderLogo.classList.add('wrap-header-and-intro--open-menu');
    navMain.classList.remove('header__nav--closed');
    navMain.classList.add('header__nav--open');
  } else {
    navMain.classList.remove('header__nav--open');
    navMain.classList.add('header__nav--closed');
    wrapLogo.classList.add('header__wrap-logo--bg-opacity');
    wrapHeaderLogo.classList.remove('wrap-header-and-intro--open-menu');
  }
});
