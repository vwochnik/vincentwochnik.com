module Jekyll
  class LanguageTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @params = markup.gsub(/\s+/m, ' ').strip.split(" ")
      @lkey = @params.shift
    end

    def get_language_data(context)
      lang = context['page']['lang']

      language_data = context['site']['language_data'].strip
      traverse = language_data.gsub("%%", lang).split('.')
      data = context['site']
      traverse.each { |t| data = data[t] }
      data
    end

    def render(context)
      data = get_language_data(context)
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
