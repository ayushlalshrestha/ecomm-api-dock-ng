#!/bin/bash

python manage.py runserver 0.0.0.0:5050 >> /src/var/log/webserver.log
