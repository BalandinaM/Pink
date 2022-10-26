let navMain = document.querySelector('.header__nav');
let navToggle = document.querySelector('.header__button');
let headerLogo = document.querySelector('.header__logo');

navMain.classList.remove ('header__nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('header__nav--closed')) {
    headerLogo.classList.remove('header__logo--bg-opacity');
    navMain.classList.remove('header__nav--closed');
    navMain.classList.add('header__nav--open');
  } else {
    navMain.classList.add('header__nav--closed');
    navMain.classList.remove('header__nav--open');
    headerLogo.classList.add('header__logo--bg-opacity');
  }
});
