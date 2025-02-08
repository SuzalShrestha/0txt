FROM node:22-alpine
WORKDIR /app
COPY package.json  package-lock.json ./
RUN npm install
COPY  . .
RUN npx prisma generate 
ENV NODE_ENV=production
ENV DATABASE_URL=
ENV REDIS_URL=
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]