# Frozen-string-literal: true
# Encoding: utf-8

require 'digest'

module Jekyll
  class Site
    attr_accessor :media_files
  end

  class MediaFile < StaticFile
    def initialize(site, base, dir, name)
      super
    end

    def destination(dest)
      @site.in_dest_dir(*[dest, url].compact)
    end

    def destination_rel_dir
      File.dirname(url)
    end

    def placeholders
      {
        :path => File.join(*[@dir, @name].compact),
      }
    end

    def url
      @url ||= ::Jekyll::URL.new({
        :template => "/media/:path",
        :placeholders => placeholders
      }).to_s
    end
  end

  class MediaTag < Liquid::Tag
    def initialize(tag_name, path, tokens)
      super
      @dir = File.dirname(path.strip)
      @filename = File.basename(path.strip)
    end

    def render(context)
      site = context.registers[:site]
      media_file = site.media_files[@filename]

      if media_file.nil?
        base = File.join(*[site.source, "_posts/_media"].compact)
        media_file = MediaFile.new(site, base, @dir, @filename)
        site.media_files[@filename] = media_file
        site.static_files.push(media_file)
      end

      media_file.url
    end
  end
end

Jekyll::Hooks.register :site, :after_reset do |site|
  site.media_files = Hash.new
end

Liquid::Template.register_tag('media', Jekyll::MediaTag)
