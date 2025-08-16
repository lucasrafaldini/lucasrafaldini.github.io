#!/bin/bash

echo "Starting simple Jekyll server..."

# Clear cache
rm -rf .jekyll-cache
rm -rf _site

# Start basic server
bundle exec jekyll serve --livereload
