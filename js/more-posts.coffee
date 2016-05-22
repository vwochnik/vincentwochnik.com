---
---
((wnd, doc, $) ->
  $list = undefined
  posts = []

  morePosts = (e) ->
    if $(wnd).scrollTop() >= $list.offset().top + $list.outerHeight() - $(wnd).innerHeight()
      toggleScrollHandler 'off'
      $('<div/>').load posts.pop().uri + ' #post-excerpt', ->
        $(this).find('article').appendTo $list
        if posts.length
          toggleScrollHandler 'on'

  toggleScrollHandler = (fn) ->
    $(wnd)[fn] 'scroll', morePosts

  $ ->
    $('#posts').first().each ->
      $list = $(this)
      $.get 'posts.json', (data, status) ->
        if status == 'success'
          data.forEach (post) ->
            if $list.children('article[data-post-uri=\'' + post.uri + '\']').length == 0
              posts.push post
          if posts.length
            toggleScrollHandler 'on'
            morePosts()
) window, document, jQuery
