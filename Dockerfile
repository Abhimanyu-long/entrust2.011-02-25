# Use the official Nginx image
FROM nginx:alpine

# Copy the React build files to the Nginx HTML directory
COPY dist/ /usr/share/nginx/html

# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
