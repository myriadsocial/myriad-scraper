FROM nikolaik/python-nodejs:python3.8-nodejs16

WORKDIR /app

# copy the content of the local src directory to the working directory
COPY . .
RUN yarn install

RUN git clone --depth=1 https://github.com/twintproject/twint.git && \
	cd twint && \
	pip3 install . -r requirements.txt

RUN pip install facebook-scraper

RUN yarn build
ENV HOST=0.0.0.0 PORT=5000 GUN_PORT=8763
EXPOSE ${PORT} ${GUN_PORT}
# RUN tsc
CMD [ "node", "build/src.app.js" ]