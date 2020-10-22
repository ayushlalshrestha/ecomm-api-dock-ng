# This application serves the purpose of:
 1. Buying products (duh, another ecommerce app 😂)
 2. Upload your products, sell it (as if someone's gonna buy it 😂)
 
 Anyways enjoy!!

## Ecommerce app, to be dockerized with 3 main containers (for now :P ):
    1. API engine, hosting the backend webserver to handle http requests, in Django DRF
    2. postgre sql server, for database purpose
    3. UI engine, for User Interface served by angular 5

# Build images for all 3 engines:
    1. cd into respective apps, eg. APIEngine
    2. run: `docker build . -t apiengine`
    3. repeat the same for uiengine and postgres


# Running all images using docker-compose
cd into the location of the docker-compose file: `docker-compose up`

# Difficult way of running each image seperately
# After building the respective images using `docker build . -t <container-name>` :
```
1. docker run --platform=linux -it --rm --name postgres -v postgres_data:/var/lib/postgresql/data  -d --net bsb-net -p 5433:5432 postgre

2. docker run --platform=linux -it --rm --name apiengine -d -v "$(pwd):/src" -w /src --net bsb-net -p 5050:8000 apiengine

3. docker run --platform=linux -it --rm --name uiengine -d -v "$(pwd):/ngapp" -w /ngapp --net bsb-net -p 5051:4200 uiengine

4. docker exec -it apiengine /bin/bash
python manage.py runserver 0.0.0.0:8000 >> /src/var/log/webserver.log

5. docker exec -it uiengine sh ng serve --host 0.0.0.0 >> /ngapp/var/log/uiserver.log

6. docker exec -it postgres /bin/bash
```
