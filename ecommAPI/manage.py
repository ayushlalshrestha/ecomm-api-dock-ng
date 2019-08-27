#!/usr/bin/env python
import os
import sys
import logging

# logging.basicConfig(level=logging.DEBUG,
#                     format='%(asctime)-6s: %(levelname)s - %(message)s',
#                     datefmt='%Y-%m-%d %H:%M:%S',
#                     filename='/src/var/log/webserver.log')

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecommAPI.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        try:
            import django
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    execute_from_command_line(sys.argv)
