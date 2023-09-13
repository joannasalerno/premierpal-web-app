# Use the Node.js LTS image as a base
FROM node:lts

# Copy app source
COPY . /server

# Set working directory to /server
WORKDIR /server

# Install app dependencies
RUN npm install

# Expose port to outside world
EXPOSE 3001

# Start command as per the package.json file
CMD ["npm", "start"]
