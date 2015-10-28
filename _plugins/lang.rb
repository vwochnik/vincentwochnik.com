module Jekyll
  class LanguageTag < Liquid::Tag
    def initialize(tag_name, lkey, tokens)
      super
      @lkey = lkey.strip
    end

    def render(context)
      lang = context['page']['lang']
      data = context['site']['data']['lang'][lang]

      a = context['page']['alias']
      if a and data[a].include?(@lkey)
        "#{data[a][@lkey]}"
      elsif data.include?(@lkey)
        "#{data[@lkey]}"
      else
        ""
      end
    end
  end
end

Liquid::Template.register_tag('t', Jekyll::LanguageTag)
