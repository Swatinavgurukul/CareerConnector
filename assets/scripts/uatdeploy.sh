#!/bin/bash
# cd /var/www/project/static
# rm  !(*.xml)
cd /var/www/project
git checkout feature/UAT
git pull origin feature/UAT
# . /var/www/env/bin/activate
. /var/www/project/env/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py search_index --rebuild -f
npm install
npm run production
chown -R ubuntu:ubuntu /var/www/project/
ls -al /var/www/project/static
sudo service nginx reload
sudo systemctl restart gunicorn
sudo systemctl status gunicorn
sudo systemctl restart celery
sudo systemctl status celery