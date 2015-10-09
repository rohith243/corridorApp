# corridorApp

##  installation steps

- git clone *< repo url >*
- npm install
- bower install
- mongod --dbpath data *(command in other terminal in the same folder or path)*
- npm start
##Most important for devs to commit
###for securirity reasons we prevent the devs from accidental commits from confidentail data
git update-index --assume-unchanged routes/confidentials/mail-config.json 
git update-index --assume-unchanged public/confidentials/phonebook.json 
git ls-files -z data/ | xargs -0 git update-index --assume-unchanged



- Access http://localhost:3000/


username: admin
password: admin