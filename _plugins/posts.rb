require 'json'

module Reading
  class Generator < Jekyll::Generator
    #safe true
    priority :low

    def generate(site)
      destination_path = site.in_dest_dir(File.join("blog", "posts.json"))

      posts = []
      site.posts.docs.each do |post|
        posts.push({
          :uri => site.config['baseurl'] + post.url,
          :date => post.data['date']
        })
      end

      contents = JSON.generate(posts)
      FileUtils.mkdir_p File.dirname(destination_path)
      File.open(destination_path, 'w+') { |f| f.write(contents) }
      site.keep_files ||= []
      site.keep_files << "posts.json"
    end
  end
end
