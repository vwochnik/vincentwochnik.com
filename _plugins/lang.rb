module Jekyll
  class LanguageTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @params = markup.gsub(/\s+/m, ' ').strip.split(" ")
      @lkey = @params.shift
    end

    def render(context)
      lang = context['page']['lang']
      data = context['site']['data']['lang'][lang]

      a = context['page']['alias']
      if a and data.include?(a) and data[a].include?(@lkey)
        str = "#{data[a][@lkey]}"
      elsif data.include?(@lkey)
        str = "#{data[@lkey]}"
      else
        str = ""
      end

      @params.each { |p| str.sub!("%%", p) }
      str
    end
  end
end

Liquid::Template.register_tag('t', Jekyll::LanguageTag)
