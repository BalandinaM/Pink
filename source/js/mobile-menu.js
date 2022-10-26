let navMain = document.querySelector('.header__nav');
let navToggle = document.querySelector('.header__button');
let wrapLogo = document.querySelector('.header__wrap-logo');

navMain.classList.remove ('header__nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('header__nav--closed')) {
    wrapLogo.classList.remove('header__wrap-logo--bg-opacity');
    navMain.classList.remove('header__nav--closed');
    navMain.classList.add('header__nav--open');
  } else {
    navMain.classList.remove('header__nav--open');
    navMain.classList.add('header__nav--closed');
    wrapLogo.classList.add('header__wrap-logo--bg-opacity');
  }
});
