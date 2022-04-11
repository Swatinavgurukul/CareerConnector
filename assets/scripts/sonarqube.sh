#!/bin/bash
# eval $(ssh-agent)
# ssh-add ~/.ssh/bitbucket_key
cd /var/www/directsourcing
git checkout dev
git pull origin dev
/var/www/sonar-scanner/bin/sonar-scanner   -Dsonar.projectKey=directsourcing   -Dsonar.sources=.   -Dsonar.host.url=http://143.110.188.199   -Dsonar.login=ada6e1daf788150a0e01d69eb2ea692f40b01dcd