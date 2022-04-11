## DirectSourcing

- Python: 3.8.x (64 bit)

- MySQL: 5.8.x

- Framework: Django 3.x , DjangoRestFramework 3.12.2

- MongoDB : 4.1



### How to Setup Locally

Clone Repository:

- $ ``git clone git@bitbucket.org:simplifyds/directsourcing-web.git``

Setup Environment Variables:

- Copy .env file from directsourcing onedrive and paste it in root folder of repository.

Database Dump

 - Import the lastest .sql dump present in directsourcing onedrive.

#### Python
Create a virtual environment:

- $ ``python -m venv env``

Activate the environment:

- $ ``  .\env\Scripts\activate``

Install Dependencies:

- (env) $ ``pip install -r requirements.txt``

Run Django Server:

- (env) $ ``python manage.py runserver``

#### NPM
Install Dependencies:

- `` npm install``


Run NPM server :

- `` npm start``



Run DB migrations:

- (env) $ ``python manage.py makemigrations``
- (env) $ ``python manage.py migrate``


Run Elastic Index:


- (env) $ ``python manage.py search_index --rebuild -f``



Celery :


- Run redis-server.exe from redis
- (env) $ ``celery -A directsourcing.celery worker --loglevel=info --pool=solo``
