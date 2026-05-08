FROM node:20-alpine

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Dependencies will be installed via volume mount or copy
# COPY package.json package-lock.json ./
# RUN npm install

# COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
