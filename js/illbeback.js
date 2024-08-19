"use strict";

/**
 * I'll be back
 *
 * Copyright (c) Max Bidiuk
 */

(function($) {

    $.illBeBack = function(el, options) {

        // Use base instead of this to reference use this from internal functions
        var base = this;

        // jQuery DOM Element
        base.target = $(el);

        // Styling
        function setStyle() {

            var defaultCss = {
                'background-position': '0% 0%',
                'background-size': '50% auto',
                'background-image': 'none',
                'background-repeat': 'repeat'
            };

            // Merge CSS Rules
            var buttonCss  = {
                'display' : 'none',
                'position' : 'fixed',
                'z-index' : base.options.zIndex,
                'top' : base.options.top + 'px',
                'left' : base.options.left + 'px',
                'bottom' : base.options.bottom + 'px',
                'right' : base.options.right + 'px',
                'width' : base.options.size + 'px',
                'height' : base.options.size + 'px',
                'background-color' : base.options.bgColor,
                'background-position': base.options.bgPosition,
                'background-size' : base.options.bgSize,
                'background-image': base.options.bgImage,
                'background-repeat' : 'no-repeat',
                'background-position-x' : '50%',
                'background-position-y' : '50%',
                WebkitTransition: 'background-color '+base.options.hoverDuration+'ms linear',
                MozTransition: 'background-color '+base.options.hoverDuration+'ms linear',
                MsTransition: 'background-color '+base.options.hoverDuration+'ms linear',
                OTransition: 'background-color '+base.options.hoverDuration+'ms linear',
                transition: 'background-color '+base.options.hoverDuration+'ms linear'
            };

            // Remove button css with preset css rules
            $.each(defaultCss, function(cssProperty, defaultValue) {
                var currentValue = base.target.css(cssProperty);
                if (currentValue !== defaultValue) {
                    delete buttonCss[cssProperty];
                }
            });

            // Set style
            base.target.css(buttonCss);

            // Make round button
            if (base.options.round) {
                base.target.css({
                    WebkitBorderRadius: '100%',
                    MozBorderRadius: '100%',
                    MsBorderRadius: '100%',
                    OBorderRadius: '100%',
                    borderRadius: '100%'
                });
            }
        }

        // Listen callbacks
        function listenCallbacks () {

            // Window scroll listener
            $(window).bind('scroll', function() {

                var scrollTop = $(this).scrollTop();

                if (scrollTop > base.options.offset) {
                    base.target.fadeIn(base.options.duration);
                }
                else {
                    base.target.fadeOut(base.options.duration);
                }
            });

            // Target mouseover listener
            base.target.bind('mouseenter', function(e) {
                base.target.css({'background-color': base.options.hoverBgColor});
            });

            // Target mouseout listener
            base.target.bind('mouseleave', function(e) {
                base.target.css({'background-color': base.options.bgColor});
            });

            // Target click listener
            base.target.bind('click', function(e) {
                e.preventDefault();
                $('html, body').animate({scrollTop: 0}, base.options.speed);
            });
        }

        // Initialization
        base.init = function() {

            // Overwrite options
            base.options = $.extend({}, $.illBeBack.defaultOptions, options);

            // Set styling
            if (!base.options.ownStyle) {
                setStyle();
            }

            // Listen callbacks
            listenCallbacks();
        };

        // Initialize plugin
        base.init();
    };

    // Set default options
    $.illBeBack.defaultOptions = {

        // Parameters
        offset        : 250,
        speed         : 200,
        duration      : 500,
        hoverDuration : 300,

        // Styling
        ownStyle : false,
        round    : false,
        zIndex   : 1000,
        size     : 52,

        // Position
        top    : 'auto',
        left   : 'auto',
        bottom : 10,
        right  : 10,

        // Background
        bgColor : 'rgba(30, 30, 30, 0.4)',
        hoverBgColor : 'rgba(30, 30, 30, 0.8)',
        bgPosition : '50% 50%',
        bgSize : '50%',
        bgRepeat : 'no-repeat',
        bgImage : "url('/images/illbeback.png')"
    };

    // Returns buttons that will scroll to the top of the page
    $.fn.illBeBack = function(options) {

        return this.each(function() {
            (new $.illBeBack(this, options));
        });
    };

})(jQuery);