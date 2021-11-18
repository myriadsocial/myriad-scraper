FROM nikolaik/python-nodejs:python3.8-nodejs16
WORKDIR /app
COPY . .
RUN yarn install

RUN git clone --depth=1 https://github.com/twintproject/twint.git && \
	cd twint && \
	pip3 install . -r requirements.txt

RUN pip install facebook-scraper

RUN yarn run build
ENV HOST=0.0.0.0 PORT=3000
EXPOSE ${PORT}
CMD [ "node", "build/src/app.js" ]
