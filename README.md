[![Build Status](https://travis-ci.org/ianmartorell/finances.svg?branch=master)](https://travis-ci.org/ianmartorell/finances)

For example:

```
docker run -d \
--name=mongo \
--restart=always \
-p=27017:27017 \
mongo:3.2

docker run -d \
--name=finances \
--restart=always \
-p 3000:80 \
--link mongo:mongo \
-e ROOT_URL=http://mydomain.com \
-e MONGO_URL=mongodb://mongo:27017/finances \
ianmartorell/finances:latest
```
