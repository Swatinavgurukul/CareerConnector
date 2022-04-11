#!/bin/bash

# eval $(ssh-agent)
# ssh-add ~/.ssh/bitbucket_key
cd /var/www/directsourcing/static
rm *
cd /var/www/directsourcing
git checkout dev
git pull origin dev
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py search_index --rebuild -f
npm install
npm run production
chown -R ubuntu:ubuntu /var/www/directsourcing/