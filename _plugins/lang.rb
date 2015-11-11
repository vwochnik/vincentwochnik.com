module Jekyll
  class LanguageTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @params = markup.gsub(/\s+/m, ' ').strip.split(" ")
      @lkey = @params.shift
    end

    def get_language_data(context, language)
      language_data = context['site']['language_data'].strip
      traverse = language_data.gsub("%%", language).split('.')

      data = context['site']
      traverse.each { |t| data = data[t] }
      data
    end

    def get_language_string(context, key)
      page_language = (context['page']['language'] || "").strip
      page_alias = (context['page']['alias'] || "").strip

      data = get_language_data(context, page_language)
      if page_alias and data.include?(page_alias) and data[page_alias].include?(key)
        str = "#{data[page_alias][key]}"
      elsif data.include?(key)
        str = "#{data[key]}"
      else
        str = ""
      end
    end

    def render(context)
      str = get_language_string(context, @lkey)
      @params.each { |p| str.sub!("%%", p) }
      str
    end
  end
end

Liquid::Template.register_tag('t', Jekyll::LanguageTag)
