FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Copy nginx configuration template
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Cloud Run uses the PORT environment variable
ENV PORT 8080

EXPOSE 8080

# The official nginx image has a built-in helper to handle templates and envsubst
# It will look for files in /etc/nginx/templates/*.template and output to /etc/nginx/conf.d/*.conf
