require 'json'

module Jekyll
  class PageReader
    def read(files)
      for file in files do
        page = LanguagePage.new(@site, @site.source, @dir, file)
        if page.languages
          for language in page.languages do
            if page.language == language
              @unfiltered_content << page
            elsif page.language.nil?
              page.data['language'] = language
              @unfiltered_content << page
            else
              page2 = LanguagePage.new(@site, @site.source, @dir, file)
              page2.data['language'] = language
              @unfiltered_content << page2
            end
          end
        else
          @unfiltered_content << page
        end
      end
      @unfiltered_content.select{ |page| site.publisher.publish?(page) }
    end
  end

  class PostReader
    def read_content(dir, magic_dir, matcher)
      entries = @site.reader.get_entries(dir, magic_dir)
      documents = []
      for entry in entries
        next unless entry =~ matcher
        path = @site.in_source_dir(File.join(dir, magic_dir, entry))
        documents.concat(multilinguify(path))
      end
      documents
    end

    def multilinguify(path)
      document = create_document_from_path(path)
      document.read
      if not document.language and not document.languages
        # create a new document that can be freshly read
        return [create_document_from_path(path)]
      end

      languages = document.languages || []
      if document.language and not languages.include?(document.language)
        languages.push(document.language)
      end

      languages.map do |language|
        document2 = create_document_from_path(path)
        document2.data['language'] = language
        document2
      end
    end

    def create_document_from_path(path)
      LanguageDocument.new(path, {
        site: @site,
        collection: @site.posts
      })
    end
  end

  class LanguagePage < Page
    alias_method :template_orig, :template
    alias_method :url_placeholders_orig, :url_placeholders

    def language
      return nil if data.nil? || data['language'].nil?
      data['language']
    end

    def languages
      return nil if data.nil? || data['languages'].nil?
      data['languages']
    end

    def template
      if language
        return "/:language" + template_orig
      end
      template_orig
    end

    def url_placeholders
      p = url_placeholders_orig
      p['language'] = language
      p
    end
  end

  class LanguageDocument < Document
    alias_method :url_template_orig, :url_template
    alias_method :url_placeholders_orig, :url_placeholders

    def language
      return nil if data.nil? || data['language'].nil?
      data['language']
    end

    def languages
      return nil if data.nil? || data['languages'].nil?
      data['languages']
    end

    def url_template
      if language
        return "/:language" + url_template_orig
      end
      url_template_orig
    end

    def url_placeholders
      p = url_placeholders_orig
      p['language'] = language
      p
    end
  end

  module Tags
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
        page_language = context['page']['language']
        page_alias = context['page']['alias']

        data = get_language_data(context, page_language)
        if page_alias and data.include?(page_alias) and data[page_alias].include?(key)
          "#{data[page_alias][key]}"
        elsif data.include?(key)
          "#{data[key]}"
        else
          ""
        end
      end

      def render(context)
        str = get_language_string(context, @lkey)
        @params.each { |p| str.sub!("%%", p) }
        str
      end
    end

    class LanguageIncludeTag < IncludeTag
      def tag_includes_dir(context)
        context.registers[:site].config['language_includes_dir'].freeze
      end

      def page_language(context)
          context.registers[:page].nil? ? "en" : context.registers[:page]["language"]
      end

      def resolved_includes_dir(context)
        File.join(context.registers[:site].in_source_dir(@includes_dir), page_language(context))
      end
    end
  end
end

Liquid::Template.register_tag('t', Jekyll::Tags::LanguageTag)
Liquid::Template.register_tag('tinclude', Jekyll::Tags::LanguageIncludeTag)
