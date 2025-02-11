import os
import sys

os.chdir('/var/www/html/flaskapp')

sys.path.insert(0, '/var/www/html/flaskapp')

from flaskapp import app as application