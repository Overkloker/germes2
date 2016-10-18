$(document).ready(function () {

  widthScreen = $(window).width();
  heightScreen = $(window).height();

  var blockInCenter = function (container, element) {
    var elementWidth = $(element).outerWidth(),
      elementHeight = $(element).outerHeight(),
      containerWidth = $(container).outerWidth(),
      containerHeight = $(container).outerHeight(),
      positionLeft = (containerWidth - elementWidth) / 2,
      positionTop = (containerHeight - elementHeight) / 2;

    if (positionTop < 20) {
      positionTop = 20;
    }
    $(element).css("left", positionLeft);

    $(element).css("top", positionTop);

  };

  // Number fix
  $("[name='num']").keypress(function (event) {
    var controlKeys = [8, 9, 13, 35, 36, 37, 39];
    // IE doesn't support indexOf
    var isControlKey = controlKeys.join(",").match(new RegExp(event.which));
    // Some browsers just don't raise events for control keys. Easy.
    // e.g. Safari backspace.
    if (!event.which || // Control keys in most browsers. e.g. Firefox tab is 0
      (49 <= event.which && event.which <= 57) || // Always 1 through 9
      (48 == event.which && $(this).attr("value")) || // No 0 first digit
      isControlKey) { // Opera assigns values for control keys.
      return;
    } else {
      event.preventDefault();
    }
  });

  // Link anchor
  $(function () {
    $('a[href^="#"]').bind('click', function (event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
      }, 1500, 'swing');
      event.preventDefault();
    });
  });


  var androidAnimate = function () {
    var button = document.querySelectorAll('.anim');
    for (var i = 0; i < button.length; i++) {
      button[i].onmousedown = function (e) {

        var x = (e.offsetX == undefined) ? e.layerX : e.offsetX;
        var y = (e.offsetY == undefined) ? e.layerY : e.offsetY;
        var effect = document.createElement('div');
        effect.className = 'effect';
        effect.style.top = y + 'px';
        effect.style.left = x + 'px';
        if (typeof e.srcElement != 'undefined') {
   e.srcElement.appendChild(effect);
   setTimeout(function () {
     e.srcElement.removeChild(effect);
   }, 1100);
  }
      }
    }
  };

  // Popup
  var activePopupCenter = function () {
    var popupActive = $(".b-popup-overlay.active"),
      actHead = $(".b-header-nav .e-header-nav-item.active").index(),
      pop = popupActive.find(".e-popup-info-item");
    blockInCenter(".wrap", popupActive);

    pop.eq(actHead).show();

    blockInCenter(".wrap", popupActive);

  };

  var popup = function () {
    var popup = $(".b-popup-overlay");

    $("[data-button]").click(function () {
      var popupNum = $(this).data("button");
      $("[data-modal='" + popupNum + "']").addClass("active").animate({
        "opacity": 1
      }, 300);
      overlayOpen();
    });


    $("[data-button]").click(function (e) {
      e.preventDefault();

      activePopupCenter();


    });


    $(".b-close").click(function () {
      $(".b-popup-overlay").animate({
        "opacity": 0
      }, 300);
      setTimeout(function () {
        $(".b-popup-overlay.active").removeClass("active");
      }, 310);

      // Destroy gallery
      var actGallery = $(".js-gallery-popup").hasClass("js-active-gallery");

      if (actGallery) {
        $(".js-gallery-popup").removeClass("js-active-gallery");
        galleryPopup.destroy();
      }

      overlayClose();
    });

    $(".b-overlay, .js-close").click(function () {
      $(".b-popup-overlay").animate({
        "opacity": 0
      }, 300);
      setTimeout(function () {
        $(".b-popup-overlay.active").removeClass("active");
      }, 310);
      overlayClose();
    })
  };
  // Popup end

  // Overlay
  var overlayOpen = function () {
    $(".b-overlay").addClass("active");
    $(".b-overlay").animate({
      "opacity": "1"
    }, 300);
  };

  var overlayClose = function () {

    $(".b-overlay").animate({
      "opacity": "0"
    }, 300);
    setTimeout(function () {
      $(".b-overlay").removeClass("active");
    }, 310);
  };
  // Overlay end

// popup end


  var swiper = new Swiper('.b-vertical-slider .swiper-container', {
    direction: 'vertical',
    slidesPerView: 1,
    nextButton: '.js-swipe-down',
    prevButton: '.js-swipe-top'
  });

  var swiperHorizontal = new Swiper('.b-horizontal-slider .swiper-container', {
    slidesPerView: 1,
    nextButton: '.js-swipe-next',
    prevButton: '.js-swipe-prev'
  });


  // Select
  $(".b-select .e-select-top").click(function () {
    var par = $(this).closest(".b-select"),
      dropPanel = par.find(".e-select-list"),
      active = par.hasClass("active");

    $(".b-select").removeClass("active");
    $(".b-select .e-select-list").slideUp();

    if (active == true) {
      par.removeClass("active");
      dropPanel.slideUp();
    } else {
      par.addClass("active");
      dropPanel.slideDown();
    }

  });

  $(".b-select .e-select-item").click(function () {
    var par = $(this).closest(".b-select"),
      dropPanel = par.find(".e-select-list"),
      item = par.find(".e-select-item"),
      textTop = par.find(".e-select-text"),
      textItem = $(this).text();
    par.removeClass("active");
    dropPanel.slideUp();
    item.removeClass("active");
    textTop.text(textItem);
    $(this).addClass("active");
  });

  $(".b-select .e-select-item.active").each(function () {
    var changeText = $(this).closest(".b-select").find(".e-select-text"),
      newText = $(this).text();
    changeText.text(newText);
  });

  $(".js-add button").click(function () {
    var plus = $(this).hasClass("js-plus-num"),
      minus = $(this).hasClass("js-minus-num"),
      input = $(this).closest(".js-add").find(".js-input-num"),
      inputVal = parseInt(input.val());

    if (plus) {
      input.val(inputVal + 1)
    }
    if (inputVal > 0) {
      if (minus) {
        input.val(inputVal - 1)
      }
    }


  });


  var gallery = function () {
    $(".product").each(function () {
      var product = $(this).newThree({
        totalFrames: 72,
        endFrame: 72,
        imgList: '.box_images',
        progress: '.load',
        imagePath: 'img/3d/1/',
        ext: '.JPG',
        responsive: true,
        playSpeed: 40,
        onReady: function () {
          product.play();
        },
        onDragStart: function () {
          product.stop();
        },
        onDragStop: function () {
          product.play();
          $(".b-button").removeClass("m-3d-z-index");
          $(this).closest(".b-3d-container").find(".custom_stop").addClass("m-3d-z-index");
        }
      });

      $('.custom_play').bind('click', function (e) {
        product.play();
        $(".b-button").removeClass("m-3d-z-index");
        $(this).closest(".b-3d-container").find(".custom_stop").addClass("m-3d-z-index");
      });

      $('.custom_stop').bind('click', function (e) {
        product.stop();
        $(".b-button").removeClass("m-3d-z-index");
        $(this).closest(".b-3d-container").find(".custom_play").addClass("m-3d-z-index");
      });
    });
  };


  $(".b-line-buttons .b-button").click(function () {

    var ind = $(this).closest(".e-line-buttons-item").index(),
      cont = $(this).closest(".js-prop").find(".b-property-list"),
      item = cont.find(".e-property-item").eq(ind),
      active = item.hasClass("active");

    if (!active) {
      cont.find(".e-property-item").removeClass("active");
      item.addClass("active").show();
    }

  });

  // Search animate
  $(".e-num-item-before").click(function () {
    var item = $(this).closest(".m-nav-item-search"),
      but = $(this).closest(".b-nav-list").find(".m-nav-item-but-search");

    $(this).hide();
    item.removeClass("dis-search");
    item.addClass("active");
    setTimeout(function () {
      but.addClass("active");
    }, 700);
    $(this).closest(".b-header").find(".b-button.m-button-close").addClass("active").animate({
      "opacity": 1
    }, 700);
  });

  $(".b-content, .js-close-search").click(function () {
    var item = $(".b-header").find(".m-nav-item-search"),
      but = $(".b-header").find(".m-nav-item-but-search"),
      active = item.hasClass("active");
    if (active) {
      $(".e-num-item-before").show();
      item.removeClass("active");
      item.addClass("dis-search");
      setTimeout(function () {
        but.removeClass("active");
      }, 700);
      $(this).closest(".content").find(".b-header").find(".b-button.m-button-close").animate({
        "opacity": 0
      }, 700, function () {
        $(this).removeClass("active")
      })
    }
  });

  // Slider UI
  var sliderUI = $(".e-slider-count-line").slider({
    range: true,
    min: 0,
    max: 20000,
    values: [1500, 17980],
    slide: function (event, ui) {
      $(".js-s").val(ui.values[0]);
      $(".js-f").val(ui.values[1]);
    }
  });
  $(".js-s").val($(".e-slider-count-line").slider("values", 0));

  $(".js-f").val($(".e-slider-count-line").slider("values", 1));

  // Filters
  $(".js-filter").click(function () {
    var filter = $(this).closest(".b-filters-container").find(".b-filters");
    filter.addClass("active");
  });

  $(".js-close-filter").click(function () {
    var filter = $(this).closest(".b-filters");
    filter.removeClass("active");
  });

  // Timer
  function Countdown(options) {
    var timer,
      instance = this,
      seconds = options.seconds || 10,
      updateStatus = options.onUpdateStatus || function () {
        },
      counterEnd = options.onCounterEnd || function () {
        };

    function decrementCounter() {
      updateStatus(seconds);
      if (seconds === 0) {
        counterEnd();
        instance.stop();
      }
      seconds--;
    }

    this.start = function () {
      clearInterval(timer);
      timer = 0;
      seconds = options.seconds;
      timer = setInterval(decrementCounter, 1000);
    };

    this.stop = function () {
      clearInterval(timer);
    };
  }

  $(".b-timer").each(function () {
    var def = $(this).find(".e-cart-sec"),
      num = parseInt(def.text());


    var myCounter = new Countdown({
      seconds: num,  // number of seconds to count down
      onUpdateStatus: function (sec) {
        def.text(sec);
      }, // callback for each second
      onCounterEnd: function () {
        window.location.replace("index.html");
      } // final action
    });

    // todo для запуску таймера
    //myCounter.start();
  });


  popup();
  gallery();
  androidAnimate();


  $(window).resize(function () {
    popup();
    activePopupCenter();


  });


});
