(function ($) {

  "use strict";

  /* Page Loader active
  ========================================================
  Se oculta al estar listo el DOM, no al terminar de bajar todos los recursos:
  colgado del evento `load` el visitante veía una pantalla en blanco hasta el
  último asset, lo que empeoraba el LCP. */
  $(function () {
    $('#preloader').fadeOut();
  });

  $(window).on('load', function () {

    // Sticky Nav
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > 50) {
        $('.scrolling-navbar').addClass('top-nav-collapse');
      } else {
        $('.scrolling-navbar').removeClass('top-nav-collapse');
      }
    });

    // one page navigation 
    $('.navbar-nav').onePageNav({
      currentClass: 'active'
    });

    /* Auto Close Responsive Navbar on Click
    ========================================================*/
    function close_toggle() {
      if ($(window).width() <= 768) {
        $('.navbar-collapse a').on('click', function () {
          $('.navbar-collapse').collapse('hide');
        });
      }
      else {
        $('.navbar .navbar-inverse a').off('click');
      }
    }
    close_toggle();
    $(window).resize(close_toggle);

    /* WOW Scroll Spy
    ========================================================*/
    var wow = new WOW({
      //disabled for mobile
      mobile: false
    });

    wow.init();

    /* Back Top Link active
    ========================================================*/
    var offset = 200;
    var duration = 500;
    $(window).scroll(function () {
      if ($(this).scrollTop() > offset) {
        $('.back-to-top').fadeIn(400);
      } else {
        $('.back-to-top').fadeOut(400);
      }
    });

    $('.back-to-top').on('click', function (event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });

  });

  // ========================================================================= //
  //  Typed Js
  // ========================================================================= //

  var typed = $(".typed");

  $(function () {
    var strings = $('.typed-items').text();
    strings = $('.typed-items').data('typed-person') + ',' + strings;
    strings = strings.split(',');

    typed.typed({
      strings: strings,
      typeSpeed: 40,
      loop: true,
    });
  });

  /**
   * Frequently Asked Questions Toggle
   *
   * Antes solo escuchaba el click, así que el acordeón no se podía operar con
   * teclado. Ahora responde también a Enter/Espacio y mantiene aria-expanded
   * sincronizado para los lectores de pantalla.
   */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var titulo = item.querySelector('h3');
    var flecha = item.querySelector('.faq-toggle');

    function toggle() {
      var abierto = item.classList.toggle('faq-active');
      if (titulo) {
        titulo.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      }
    }

    // El primer item viene abierto desde el HTML: reflejarlo en el atributo.
    if (titulo) {
      titulo.setAttribute('aria-expanded', item.classList.contains('faq-active') ? 'true' : 'false');
      titulo.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          toggle();
        }
      });
    }

    [titulo, flecha].forEach(function (el) {
      if (el) {
        el.addEventListener('click', toggle);
      }
    });
  });


  /**
   * Modal de video (cliente Athicon)
   *
   * El <video> se carga con preload="none" para no bajar varios MB en la home.
   * Al cerrar el modal se pausa y se rebobina: sin esto el audio sigue sonando
   * detras de la pagina.
   */
  $('#athiconVideoModal')
    .on('shown.bs.modal', function () {
      var video = document.getElementById('athiconVideoPlayer');
      if (video) {
        var reproduccion = video.play();
        // Safari/Chrome pueden rechazar el play() con audio; el usuario usa los controles.
        if (reproduccion && typeof reproduccion.catch === 'function') {
          reproduccion.catch(function () { });
        }
      }
    })
    .on('hidden.bs.modal', function () {
      var video = document.getElementById('athiconVideoPlayer');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });


}(jQuery));