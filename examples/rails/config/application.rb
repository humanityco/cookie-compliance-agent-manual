require_relative "boot"

require "rails"
require "action_controller/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

module Example
  class Application < Rails::Application
    config.load_defaults 7.2
    config.eager_load = false
    config.secret_key_base = "example-only-change-me-example-only-change-me"
    config.hosts << "localhost"
  end
end
