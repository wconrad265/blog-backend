# Use the latest Node.js LTS (Long Term Support) image as the base
FROM node:lts

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the application code
COPY . .

# Expose the port that the Express app will run on
EXPOSE 3040

# Start the Express app
CMD ["npm", "start"]