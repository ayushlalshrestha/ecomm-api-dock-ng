#!/bin/bash

sleep 10s
python manage.py runserver 0.0.0.0:5050 >> /src/var/log/webserver.log
echo "Started the web API engine"

# while true
# do
#     sleep 1000s
# done
