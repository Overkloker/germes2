(function($) {
  'use strict';
  $.newThree = function(el, options) {

    var base = this,
      AppConfig,
      frames = [];

    base.$el = $(el);
    base.el = el;

    base.onDragStopSetinterval = function(e) {
      AppConfig.onDragStopSetinterval = setTimeout(function(){ base.play() }, 1000);
    };

    base.$el.data('newThree', base);

    base.init = function() {
      AppConfig = $.extend({}, $.newThree.defaultOptions, options);
      AppConfig.currentFrame = 1;
      AppConfig.endFrame = 1;

      AppConfig.downloadedFolder = true;
      if(AppConfig.downloadedFolder){
        base.initProgress();
        base.loadImages();
        return;
      }
    };

    base.initProgress = function() {

      base.$el.css({
        width: AppConfig.width + 'px',
        height: AppConfig.height + 'px',
        'background-image': 'none !important'
      });

      if(AppConfig.styles) {
        base.$el.css(AppConfig.styles);
      }

      base.responsive();

      base.$el.find(AppConfig.progress).css({
        marginTop: ((AppConfig.height / 2) - 15) + 'px'
      });
      base.$el.find(AppConfig.progress).fadeIn('slow');
      base.$el.find(AppConfig.imgList).hide();
    };

    base.loadImages = function() {
      var li, imageName, image, host, baseIndex;
      li = document.createElement('li');
      baseIndex = AppConfig.zeroBased ? 0 : 1;
      imageName = !AppConfig.imgArray ?
      AppConfig.domain + AppConfig.imagePath + AppConfig.filePrefix + base.zeroPad((AppConfig.loadedImages + baseIndex)) + AppConfig.ext + ((base.browser.isIE()) ? '?' + new Date().getTime() : '') :
      AppConfig.imgArray[AppConfig.loadedImages];
      image = $('<img>').attr('src', imageName).addClass('previous-image').appendTo(li);

      frames.push(image);

      base.$el.find(AppConfig.imgList).append(li);

      $(image).load(function () {
        base.imageLoaded();
      });
    };

    base.imageLoaded = function () {
      AppConfig.loadedImages += 1;
      $(AppConfig.progress + ' span').text(Math.floor(AppConfig.loadedImages / AppConfig.totalFrames * 100) + '%');
      if (AppConfig.loadedImages >= AppConfig.totalFrames) {
        if(AppConfig.disableSpin) {
          frames[0].removeClass('previous-image').addClass('current-image');
        }
        $(AppConfig.progress).fadeOut('slow', function () {
          $(this).hide();
          base.showImages();
        });
      } else {
        base.loadImages();
      }
    };

    base.showImages = function () {
      base.$el.find('.txtC').fadeIn();
      base.$el.find(AppConfig.imgList).fadeIn();
      base.ready = true;
      AppConfig.ready = true;

      if (AppConfig.drag) {
        base.initEvents();
      }
      base.refresh();
      AppConfig.onReady();

      base.responsive();
    };

    base.resize = function() {
      if(AppConfig.responsive) {

      }
    };

    base.play = function(speed, direction) {
      clearTimeout(AppConfig.onDragStopSetinterval);
      var _speed = speed || AppConfig.playSpeed;
      var _direction = direction || AppConfig.autoplayDirection;
      AppConfig.autoplayDirection = _direction

      if (!AppConfig.autoplay) {
        AppConfig.autoplay = true;
        AppConfig.play = setInterval(base.moveToNextFrame, _speed);
      }
    };

    base.stop = function() {
      clearTimeout(AppConfig.onDragStopSetinterval);
      if (AppConfig.autoplay) {
        AppConfig.autoplay = false;
        clearInterval(AppConfig.play);
        AppConfig.play = null;
      }
    };

    base.moveToNextFrame = function () {
      if (AppConfig.autoplayDirection === 1) {
        AppConfig.endFrame -= 1;
      } else {
        AppConfig.endFrame += 1;
      }
      base.refresh();
    };

    base.gotoAndPlay = function (n) {
      if( AppConfig.disableWrap ) {
        AppConfig.endFrame = n;
        base.refresh();
      } else {
        var multiplier = Math.ceil(AppConfig.endFrame / AppConfig.totalFrames);
        if(multiplier === 0) {
          multiplier = 1;
        }

        var realEndFrame = (multiplier > 1) ?
          AppConfig.endFrame - ((multiplier - 1) * AppConfig.totalFrames) :
          AppConfig.endFrame;

        var currentFromEnd = AppConfig.totalFrames - realEndFrame;

        var newEndFrame = 0;
        if(n - realEndFrame > 0) {
          if(n - realEndFrame < realEndFrame + (AppConfig.totalFrames - n)) {
            newEndFrame = AppConfig.endFrame + (n - realEndFrame);
          } else {
            newEndFrame = AppConfig.endFrame - (realEndFrame + (AppConfig.totalFrames - n));
          }
        } else {
            if(realEndFrame - n < currentFromEnd + n) {
              newEndFrame = AppConfig.endFrame - (realEndFrame - n);
            } else {
              newEndFrame = AppConfig.endFrame + (currentFromEnd + n);
            }
        }

        if(realEndFrame !== n) {
          AppConfig.endFrame = newEndFrame;
          base.refresh();
        }
      }
    };

    base.initEvents = function () {
      base.$el.bind('mousedown touchstart touchmove touchend mousemove click', function (event) {

        event.preventDefault();

        if ((event.type === 'mousedown' && event.which === 1) || event.type === 'touchstart') {
          AppConfig.pointerStartPosX = base.getPointerEvent(event).pageX;
          AppConfig.dragging = true;
          AppConfig.onDragStart(1);
        } else if (event.type === 'touchmove') {
          base.trackPointer(event);
        } else if (event.type === 'touchend') {
          AppConfig.dragging = false;
          AppConfig.onDragStop(1);
        }
      });

      $(document).bind('mouseup', function (event) {
        AppConfig.dragging = false;
        AppConfig.onDragStop(AppConfig.endFrame);
        $(this).css('cursor', 'none');
      });

      $(window).bind('resize', function (event) {
        base.responsive();
      });

      $(document).bind('mousemove', function (event) {
        if (AppConfig.dragging) {
          event.preventDefault();
          }
        base.trackPointer(event);

      });

      $(window).resize(function() {
        base.resize();
      });
    };

    base.getPointerEvent = function (event) {
      return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };

    base.trackPointer = function (event) {
      if (AppConfig.ready && AppConfig.dragging) {
        AppConfig.pointerEndPosX = base.getPointerEvent(event).pageX;
        if (AppConfig.monitorStartTime < new Date().getTime() - AppConfig.monitorInt) {
          AppConfig.pointerDistance = AppConfig.pointerEndPosX - AppConfig.pointerStartPosX;
          if(AppConfig.pointerDistance > 0){
          AppConfig.endFrame = AppConfig.currentFrame + Math.ceil((AppConfig.totalFrames - 1) * AppConfig.speedMultiplier * (AppConfig.pointerDistance / base.$el.width()));
          }else{
          AppConfig.endFrame = AppConfig.currentFrame + Math.floor((AppConfig.totalFrames - 1) * AppConfig.speedMultiplier * (AppConfig.pointerDistance / base.$el.width()));
          }

          if( AppConfig.disableWrap ) {
            AppConfig.endFrame = Math.min(AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0), AppConfig.endFrame);
            AppConfig.endFrame = Math.max((AppConfig.zeroBased ? 0 : 1), AppConfig.endFrame);
          }
          base.refresh();
          AppConfig.monitorStartTime = new Date().getTime();
          AppConfig.pointerStartPosX = base.getPointerEvent(event).pageX;
        }
      }
    };

    base.refresh = function () {
      if (AppConfig.ticker === 0) {
        AppConfig.ticker = setInterval(base.render, Math.round(1000 / AppConfig.framerate));
      }
    };

    base.render = function () {
      var frameEasing;
      if (AppConfig.currentFrame !== AppConfig.endFrame) {
        frameEasing = AppConfig.endFrame < AppConfig.currentFrame ? Math.floor((AppConfig.endFrame - AppConfig.currentFrame) * 0.1) : Math.ceil((AppConfig.endFrame - AppConfig.currentFrame) * 0.1);
        base.hidePreviousFrame();
        AppConfig.currentFrame += frameEasing;
        base.showCurrentFrame();
        base.$el.trigger('frameIndexChanged', [base.getNormalizedCurrentFrame(), AppConfig.totalFrames]);
      } else {
        window.clearInterval(AppConfig.ticker);
        AppConfig.ticker = 0;
      }
    };

    base.hidePreviousFrame = function () {
      frames[base.getNormalizedCurrentFrame()].removeClass('current-image').addClass('previous-image');
    };

    base.showCurrentFrame = function () {
      frames[base.getNormalizedCurrentFrame()].removeClass('previous-image').addClass('current-image');
    };

    base.getNormalizedCurrentFrame = function () {
      var c, e;

      if ( !AppConfig.disableWrap ) {
        c = Math.ceil(AppConfig.currentFrame % AppConfig.totalFrames);
        if (c < 0) {
          c += AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0);
        }
      } else {
        c = Math.min(AppConfig.currentFrame, AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0));
        e = Math.min(AppConfig.endFrame, AppConfig.totalFrames - (AppConfig.zeroBased ? 1 : 0));
        c = Math.max(c, (AppConfig.zeroBased ? 0 : 1));
        e = Math.max(e, (AppConfig.zeroBased ? 0 : 1));
        AppConfig.currentFrame = c;
        AppConfig.endFrame = e;
      }

      return c;
    };

    base.getCurrentFrame = function() {
      return AppConfig.currentFrame;
    };

    base.responsive = function() {
      if(AppConfig.responsive) {
        base.$el.css({
          height: $(AppConfig.imgList + ' li:first-child img').height(),
          width: '100%'
        });
      }
    };

    base.zeroPad = function (num) {
        function pad(number, length) {
          var str = number.toString();
          if(AppConfig.zeroPadding) {
            while (str.length < length) {
                str = '0' + str;
            }
          }
          return str;
        }

        var approximateLog = Math.log(AppConfig.totalFrames) / Math.LN10;
        var roundTo = 1e3;
        var roundedLog = Math.round(approximateLog * roundTo) / roundTo;
        var numChars = Math.floor(roundedLog) + 1;
        return pad(num, numChars);
    };

    base.browser = {};

    base.browser.isIE = function () {
      var rv = -1;
      if (navigator.appName === 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
        if (re.exec(ua) !== null){
          rv = parseFloat( RegExp.$1 );
        }
      }

      return rv !== -1;
    };

    base.getConfig = function() {
      return AppConfig;
    };

    $.newThree.defaultOptions = {
      dragging: false,
      ready: false,
      pointerStartPosX: 0,
      pointerEndPosX: 0,
      pointerDistance: 0,
      monitorStartTime: 0,
      monitorInt: 10,
      ticker: 0,
      speedMultiplier: 7,
      totalFrames: 180,
      loadedImages: 0,
      framerate: 60,
      domains: null,
      domain: '',
      parallel: false,
      queueAmount: 8,
      idle: 0,
      filePrefix: '',
      ext: 'png',
      height: 300,
      width: 300,
      styles: {},
      navigation: false,
      autoplay: false,
      autoplayDirection: 1,
      disableWrap: false,
      responsive: false,
      zeroPadding: false,
      zeroBased: false,
      plugins: [],
      showCursor: false,
      drag: true,
      onReady: function() {},
      onDragStart: function() {},
      onDragStop: function() {},
      imgList: '.newThree_images',
      imgArray: null,
      playSpeed: 100,
      downloadedFolder: true,
      onDragStopSetinterval: {}
    };
    base.init();
  };

  $.fn.newThree = function(options) {
    return Object.create(new $.newThree(this, options));
  };
}(jQuery));
