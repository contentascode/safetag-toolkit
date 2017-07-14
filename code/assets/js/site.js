$(document).ready(function() {
  /*
   * Faceted search component configuration
   */

  // nunjucks.configure('assets/templates', { autoescape: true });
  initFacets();

  var tags,
    index,
    store = $.getJSON('searchMeta.json'),
    data = $.getJSON('searchIndex.json'),
    meta = {};
  res = {};

  data
    .then(function(data) {
      store.then(function(store) {
        tags = _.chain(store)
          .reduce(function(memo, val) {
            if (val.tags) memo.push(val.tags);
            return memo;
          }, [])
          .uniq()
          .value();

        meta = _.reduce(
          store,
          function(memo, val) {
            var cur = val;
            _.chain(val)
              .keys(val)
              .filter(function(v) {
                return cur[v] != '' && v != 'name' && v != 'description' && v != 'keywords' && v != 'tags';
              })
              .each(function(v, k, l) {
                if (!memo[v]) memo[v] = [];
                memo[v].push(cur[v]);
              })
              .value();
            return memo;
          },
          []
        );

        _.chain(meta)
          .keys()
          .each(function(k) {
            meta[k] = _.uniq(meta[k]);
            if (k != 'content_type')
              _.each(meta[k], function(v) {
                $('#' + k + '_criteria').append(
                  '<div class="checkbox">' +
                    ' <label>' +
                    '    <input type="checkbox" value="' +
                    v +
                    '">' +
                    '    <span>' +
                    v +
                    '</span>' +
                    '  </label>' +
                    '</div>'
                );
              });
          })
          .value();

        var ks = _.keys(store);
        var results = _.chain(ks)
          .filter(function(k) {
            return store[k].content_type == 'activity';
          })
          .map(function(k) {
            // add store key of object as path key of array object
            var ret = _.extend({ path: k.replace('.md', '.html') }, store[k]);
            return ret;
          })
          .value();

        var FJS = FilterJS(results, '#results', {
          template: '#result-template',
          search: { ele: '#searchbox' },
          //search: {ele: '#searchbox', fields: ['runtime']}, // With specific fields
          callbacks: {
            afterAddRecords: function(records) {
              $('#total_results').text('Found : ' + records.length);

              _.chain(meta)
                .keys()
                .omit(
                  'library',
                  'data_modeling',
                  'bulk_upload',
                  'displays_lists',
                  'network_viz',
                  'network_editing',
                  'network_analysis',
                  'embeddable',
                  'document_viz',
                  'timelines',
                  'maps'
                )
                .each(function(k) {
                  var checkboxes = $('#' + k + '_criteria :input');
                  var qResult = JsonQuery(records);

                  checkboxes.each(function() {
                    var c = $(this);
                    var q = {};
                    q[k] = c.val();
                    var count = qResult.where(q).count;
                    c.next().text(c.val() + ' (' + count + ')');
                  });
                });
            },
            afterFilter: function(result) {
              if (!result.length) {
                $('#total_results').text('No results found');
              } else {
                $('#total_results').text('Found : ' + result.length);
              }

              _.chain(meta)
                .keys()
                .omit(
                  'library',
                  'data_modeling',
                  'bulk_upload',
                  'displays_lists',
                  'network_viz',
                  'network_editing',
                  'network_analysis',
                  'embeddable',
                  'document_viz',
                  'timelines',
                  'maps'
                )
                .each(function(k) {
                  var checkboxes = $('#' + k + '_criteria :input');
                  var qResult = JsonQuery(result);

                  checkboxes.each(function() {
                    var c = $(this);
                    var q = {};
                    q[k] = c.val();
                    var count = qResult.where(q).count;
                    c.next().text(c.val() + ' (' + count + ')');
                  });
                });
            }
          }
          //appendToContainer: appendToContainer
        });

        FJS.addCriteria({ field: 'content_type', ele: '#content_type_criteria input:checkbox' });

        _.chain(meta).keys().each(function(k) {
          FJS.addCriteria({ field: k, ele: '#' + k + '_criteria input:checkbox' });
        });
      });
    })
    .then(function() {
      var productCustomization = $('.cd-customization'),
        cart = $('.cd-cart'),
        animating = false;

      console.log('productCustomization', productCustomization);

      initCustomization(productCustomization);

      function initCustomization(items) {
        items.each(function(key, item) {
          var actual = $(this),
            addToCartBtn = actual.find('.add-to-cart');
          console.log('item', item.data('activity'));
          //detect click on the add-to-cart button
          addToCartBtn.on('click', function() {
            console.log('animating', animating);
            if (!animating) {
              //animate if not already animating
              animating = true;

              addToCartBtn.addClass('is-added').find('path').eq(0).animate({
                //draw the check icon
                'stroke-dashoffset': 0
              }, 100, function() {
                setTimeout(function() {
                  updateCart();
                  addToCartBtn
                    .removeClass('is-added')
                    .find('span')
                    .on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                      //wait for the end of the transition to reset the check icon
                      addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                      animating = false;
                    });

                  if ($('.no-csstransitions').length > 0) {
                    // check if browser doesn't support css transitions
                    addToCartBtn.find('path').eq(0).css('stroke-dashoffset', '19.79');
                    animating = false;
                  }
                }, 600);
              });
            }
          });
        });
      }

      function updateCart() {
        //show counter if this is the first item added to the cart
        !cart.hasClass('items-added') && cart.addClass('items-added');

        var cartItems = cart.find('span'),
          text = parseInt(cartItems.text()) + 1;
        cartItems.text(text);
      }
    });
  /*
      data.then(function(data){
          // create index
          index = lunr.Index.load(data)
          store.then(function(store) {
            var array = $.map(store, function(value, index) {
                return [$.extend({},value, {ref: index})];
            });
            results_store = prepareResults(array,store)
            res = renderResults(results_store)
          });

          $('.search-results').empty().append( res.nb ?
            res.html : $('<p><strong>No results found</strong></p>')
          );

          $('.total-results').text(res.nb);

      });
  */

  /*
   * Side bar selection component configuration
   */

  //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
  var $L = 1200,
    $menu_navigation = $('#main-nav'),
    $cart_trigger = $('#cd-cart-trigger'),
    $hamburger_icon = $('#cd-hamburger-menu'),
    $lateral_cart = $('#cd-cart'),
    $shadow_layer = $('#cd-shadow-layer');

  //open lateral menu on mobile
  $hamburger_icon.on('click', function(event) {
    event.preventDefault();
    //close cart panel (if it's open)
    $lateral_cart.removeClass('speed-in');
    toggle_panel_visibility($menu_navigation, $shadow_layer, $('body'));
  });

  //open cart
  $cart_trigger.on('click', function(event) {
    event.preventDefault();
    //close lateral menu (if it's open)
    $menu_navigation.removeClass('speed-in');
    toggle_panel_visibility($lateral_cart, $shadow_layer, $('body'));
  });

  //close lateral cart or lateral menu
  $shadow_layer.on('click', function() {
    $shadow_layer.removeClass('is-visible');
    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if ($lateral_cart.hasClass('speed-in')) {
      $lateral_cart
        .removeClass('speed-in')
        .on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
          $('body').removeClass('overflow-hidden');
        });
      $menu_navigation.removeClass('speed-in');
    } else {
      $menu_navigation
        .removeClass('speed-in')
        .on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
          $('body').removeClass('overflow-hidden');
        });
      $lateral_cart.removeClass('speed-in');
    }
  });

  //move #main-navigation inside header on laptop
  //insert #main-navigation after header on mobile
  move_navigation($menu_navigation, $L);
  $(window).on('resize', function() {
    move_navigation($menu_navigation, $L);

    if ($(window).width() >= $L && $menu_navigation.hasClass('speed-in')) {
      $menu_navigation.removeClass('speed-in');
      $shadow_layer.removeClass('is-visible');
      $('body').removeClass('overflow-hidden');
    }
  });

  // Variables
  var $codeSnippets = $('.code-example-body'),
    $nav = $('.navbar'),
    $body = $('body'),
    $html = $('html'),
    $window = $(window),
    $popoverLink = $('[data-popover]'),
    navOffsetTop = $nav.offset().top,
    $document = $(document),
    entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };

  function init() {
    $window.on('scroll', onScroll);
    $window.on('resize', resize);
    $popoverLink.on('click', openPopover);
    $document.on('click', closePopover);
    // $('a[href^="#"]').on('click', smoothScroll);
    //    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off('scroll');
    var target = this.hash,
      menu = target;
    $target = $(target);
    $('html, body').stop().animate({
      scrollTop: $target.offset().top - 40
    }, 0, 'swing', function() {
      window.location.hash = target;
      $(document).on('scroll', onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault();
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open');
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if ($('.popover.open').length > 0) {
      $('.popover').removeClass('open');
    }
  }

  $('#button').click(function() {
    $('html, body').animate(
      {
        scrollTop: $('#elementtoScrollToID').offset().top
      },
      2000
    );
  });

  function resize() {
    $body.removeClass('has-docked-nav');
    navOffsetTop = $nav.offset().top;
    onScroll();
  }

  function onScroll() {
    // if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav') && $html.hasClass('hero')) {
    //   $body.addClass('has-docked-nav')
    // }
    // if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav') && $html.hasClass('hero')) {
    //   $body.removeClass('has-docked-nav')
    // }
    if (navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav');
    }
    if (navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav');
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function(s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html());
      $(this).html(newContent);
    });
  }

  init();
});

function toggle_panel_visibility($lateral_panel, $background_layer, $body) {
  if ($lateral_panel.hasClass('speed-in')) {
    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    $lateral_panel
      .removeClass('speed-in')
      .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        $body.removeClass('overflow-hidden');
      });
    $background_layer.removeClass('is-visible');
  } else {
    $lateral_panel
      .addClass('speed-in')
      .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
        $body.addClass('overflow-hidden');
      });
    $background_layer.addClass('is-visible');
  }
}

function move_navigation($navigation, $MQ) {
  if ($(window).width() >= $MQ) {
    $navigation.detach();
    $navigation.appendTo('header');
  } else {
    $navigation.detach();
    $navigation.insertAfter('header');
  }
}

function prepareResults(results, store) {
  var results_store = results
    .map(function(result) {
      return $.extend({}, store[result.ref], { path: result.ref.replace('.md', '.html'), score: result.score });
    })
    .sort(function(a, b) {
      return b.score - a.score;
    });

  return results_store;
}

function renderResults(results) {
  return {
    results: results,
    html: nunjucks.render('results.html', { results: results }),
    nb: results.length
  };
}

function initFacets() {
  $('#content_type_criteria :checkbox').prop('checked', true);
  $('#content_type_audience').on('click', function() {
    $('#content_type_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });
}
