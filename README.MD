# JFP NOTES

## To run proyect:
* Clone the project with git: `git clone https://route-of-the-project` 
* Install project dependences : `npm install`
* Update dependences: `npm update`

## Install Mongo
* to install mongo `sudo apt install mongodb`
* para acceder a la consola de mongo `mongo`
* para mostrar las bases de datos `show dbs`
* para utilizar una base de datos especifica `use dataBaseName`
* para mostrar las tablas de la base de datos q estoy utilizando `show tables`
* para mostrar los valores de una tabla `myCursor = db.tableName.find( {} )`
* to remove document `db.table.remove({_id:ObjectId("5e88b02db3fbf26334ef610e")});`

## To run the proyect within apache2:
* eject: `sudo a2enmod rewrite`
* Install Apache Passager Library: `apt-get install libapache2-mod-passenger`
* Config the Apache2 *.confi file adding this code:
```
<VirtualHost *:80>
    ServerName yourserver.com

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/myapp/code/public
    PassengerAppRoot /var/www/myapp/code

    # Tell Passenger that your app is a Node.js app
    PassengerAppType node
    PassengerStartupFile index.js

    # Relax Apache security settings
    <Directory /var/www/myapp/code/public>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted
    </Directory>
</VirtualHost>
```
* restart apache: `sudo systemctl restart apache2`

## To run the proyect in production whitout Apache2:
I am using the `pm2` package to keep running the proyect even when i leaved the instance. For it we'll need:
* (ojo, this step isn't verify) Install nodemon to: `npm install -g nodemon`
* Install pm2: `npm install pm2 -g`
* Once it's installed, go to the project folder and start the project: `sudo pm2 start index.js`
* To keep running the project once the instance was reboteed: `sudo pm2 startup`
* To see what are the process that pm2 have working: `sudo pm2 list`
* To see if el server is making some error or any report: `sudo pm2 logs`
* To restart all proccess that are running in pm2: `sudo pm2 restart all`