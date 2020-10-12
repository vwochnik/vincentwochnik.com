(function() {
  (function(wnd, doc, $) {
    var $list, morePosts, posts, toggleScrollHandler;
    $list = void 0;
    posts = [];
    morePosts = function(e) {
      if ($(wnd).scrollTop() >= $list.offset().top + $list.outerHeight() - $(wnd).innerHeight()) {
        toggleScrollHandler('off');
        return $('<div/>').load(posts.pop().uri + ' #post-excerpt', function() {
          $(this).find('article').appendTo($list);
          if (posts.length) {
            return toggleScrollHandler('on');
          }
        });
      }
    };
    toggleScrollHandler = function(fn) {
      return $(wnd)[fn]('scroll', morePosts);
    };
    return $(function() {
      return $('#posts').first().each(function() {
        $list = $(this);
        return $.get('posts.json', function(data, status) {
          if (status === 'success') {
            data.forEach(function(post) {
              if ($list.children('article[data-post-uri=\'' + post.uri + '\']').length === 0) {
                return posts.push(post);
              }
            });
            if (posts.length) {
              toggleScrollHandler('on');
              return morePosts();
            }
          }
        });
      });
    });
  })(window, document, jQuery);

}).call(this);
