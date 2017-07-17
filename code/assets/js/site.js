$(document).ready(function() {
  // State for current audit plan
  // TODO: Serialize to localstorage.
  var audit = [];

  //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
  var $L = 1200,
    $menu_navigation = $('#main-nav'),
    $cart_trigger = $('#cd-cart-trigger'),
    $hamburger_icon = $('#cd-hamburger-menu'),
    $lateral_cart = $('#cd-cart'),
    $shadow_layer = $('#cd-shadow-layer');

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
      var productCustomization = $('.movie'),
        cart = $('.cd-cart'),
        animating = false;

      console.log('productCustomization', productCustomization);

      initCustomization(productCustomization);

      function initCustomization(items) {
        items.each(function(key, item) {
          var actual = $(this),
            addToCartBtn = actual.find('.add-to-cart'),
            data = actual.data('activity');
          //detect click on the add-to-cart button
          addToCartBtn.on('click', function() {
            if (!animating) {
              //animate if not already animating
              animating = true;

              addToCartBtn.addClass('is-added').find('path').eq(0).animate({
                //draw the check icon
                'stroke-dashoffset': 0
              }, 100, function() {
                setTimeout(function() {
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
                  updateCart(data);
                }, 600);
              });
            }
          });
        });
      }

      function updateCartCounter(count) {
        //show counter if this is the first item added to the cart
        !cart.hasClass('items-added') && cart.addClass('items-added');

        var cartItemsCount = cart.find('span');
        if (count === 0) {
          cart.removeClass('items-added');
          $('#cd-cart .cd-cart-items').remove();
          $('#cd-cart .cd-cart-total').remove();
          $('a.export-btn').text('Add activities or select an Audit template');
          // Close plan pane when plan is empty.
          $('a.export-btn').off();
          $('a.export-btn').on('click', function(e) {
            close_panel();
          });
        } else {
          cartItemsCount.text(count);
        }
      }

      function updateCart(activity) {
        audit = audit.concat(
          Object.keys(activity.tasks).map(function(task) {
            return { activity: activity, task: activity.tasks[task], variation: task.variation || 0 };
          })
        );

        console.log('audit', audit);

        // Object.keys(tasks).reduce(function(sum, task) { var varDurations = Object.keys(tasks[task].variations).map(function(variation) { return tasks[task].variations[variation].duration }); return [(varDurations.length !== 0 ? Math.min(...varDurations) : tasks[task].duration ) < sum[0] ? (varDurations.length !== 0 ? Math.min(...varDurations) : tasks[task].duration ) : sum[0], (varDurations.length !== 0 ? Math.max(...varDurations) : tasks[task].duration ) > sum[1] ? (varDurations.length !== 0 ? Math.max(...varDurations) : tasks[task].duration ) + sum[1] : sum[1]] },[9999,0]).join(' ~ ') || duration || "?"

        $('#cd-cart').html(renderPlan(audit));
        attachEvents();

        animating = false;
      }

      // View render
      function renderPlan(state) {
        return (
          '<ul class="cd-cart-items">' +
          state
            .map(function(item) {
              var duration = item.task.variations
                ? item.task.variations[item.variation].duration
                : item.task.duration ||
                  (item.activity.duration && item.activity.duration / Object.keys(item.activity.tasks).length) ||
                  '?';
              return (
                '<li class="cd-single-item"><span class="cd-qty"><strong>' +
                item.activity.name +
                '</strong></span> ' +
                item.task.name +
                '<div class="cd-price">' +
                duration +
                'h</div>' +
                (item.task.variations
                  ? '<div class="cd-customization">' +
                    '    <select>' +
                    item.task.variations
                      .map(function(variation, idx) {
                        return (
                          '<option value="' +
                          idx +
                          '" ' +
                          (idx === parseInt(item.variation) ? 'selected="selected"' : '') +
                          '>' +
                          variation.name +
                          '</option>'
                        );
                      })
                      .join('') +
                    '    </select>' +
                    '  </div> <!-- .cd-customization -->'
                  : '') +
                '<a class="cd-item-remove cd-img-replace" href="#0">Remove</a></li>'
              );
            })
            .join('') +
          '</ul><div class="cd-cart-total"><p>Duration <span>' +
          state.reduce(function(sum, item) {
            console.log('sum', sum);
            return (
              sum +
              (item.task.variations
                ? item.task.variations[item.variation].duration
                : item.task.duration ||
                  (item.activity.duration && item.activity.duration / Object.keys(item.activity.tasks).length) ||
                  0)
            );
          }, 0) +
          'h</span></p></div><a class="export-btn" href="#0">Export</a>' +
          '<div class="form-group hidden" id="export">' +
          '<label for="comment">Comment:</label>' +
          '<textarea class="form-control" rows="5" id="text">' +
          jsyaml.safeDump(audit, { noRefs: true }) +
          '</textarea>' +
          '</div>'
        );
      }

      function attachEvents() {
        var cartItemList = $('#cd-cart .cd-cart-items');

        // console.log($('#cd-cart .cd-cart-items li'));
        updateCartCounter($('#cd-cart .cd-cart-items li.cd-single-item').length);

        //detect click on select elements
        $('.cd-customization select').on('change', function(event) {
          var index = $(this).parent().parent('li').index();
          console.log('$(this).parent(li)', $(this).parent().parent('li'));
          console.log('index', index);
          console.log('value', this.value);
          audit[index].variation = this.value;
          $('#cd-cart').html(renderPlan(audit));
          attachEvents();
        });

        var sortable = Sortable.create(cartItemList.get(0), {
          onEnd: function(/**Event*/ evt) {
            var tmp = audit[evt.newIndex];
            audit[evt.newIndex] = audit[evt.oldIndex];
            audit[evt.oldIndex] = tmp;
          }
        });

        cartItemList.on('click', 'li .cd-item-remove', function(e) {
          var index = $(this).parent('li').index();
          audit = audit.filter(function(val, key) {
            return key != index;
          });
          $(this).parent().remove();
          updateCartCounter($('#cd-cart .cd-cart-items li.cd-single-item').length);
          $('#cd-cart').html(renderPlan(audit));
          attachEvents();
        });

        $('a.export-btn').off();

        $('a.export-btn').on('click', function(e) {
          $('#export').toggleClass('hidden');
        });
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

  $('body').on('click', function(event) {
    //if user clicks outside the .cd-gallery list items - remove the .hover class and close the open ul.size/ul.color list elements
    if ($(event.target).is('#cd-cart ul li.cd-single-item') || $(event.target).is('#cd-cart')) {
      deactivateCustomization();
    }
  });

  /*
   * Side bar selection component configuration
   */

  // Close plan pane when plan is empty.
  $('a.export-btn').on('click', function(e) {
    close_panel();
  });

  // Urgh... quick and dirty closure.
  function close_panel() {
    $shadow_layer.removeClass('is-visible');
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
  }

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

function resetCustomization(selectOptions) {
  //close ul.clor/ul.size if they were left open and user is not interacting with them anymore
  //remove the .hover class from items if user is interacting with a different one
  selectOptions
    .siblings('[data-type="select"]')
    .removeClass('is-open')
    .end()
    .parents('.cd-single-item')
    .addClass('hover')
    .parent('li')
    .siblings('li')
    .find('.cd-single-item')
    .removeClass('hover')
    .end()
    .find('[data-type="select"]')
    .removeClass('is-open');
}

function deactivateCustomization() {
  $('#cd-cart').find('[data-type="select"]').removeClass('is-open');
}

function initFacets() {
  $('#content_type_criteria :checkbox').prop('checked', true);
  $('#content_type_audience').on('click', function() {
    $('#content_type_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });
}
