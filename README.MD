# This is a Api Rest developed in nodejs for a Forum.

## To run proyect you'll need 3 steps:
### First step (Clone the proyect):
* Clone the project with git: `git clone https://route-of-the-project` 
* Install project dependences : `sudo apt install npm`
* Update dependences: `sudo npm update`
* Give all permision to 'ulpload/users' folder: `sudo chmod a+rwx ulpload/users`
* Build ".env" file like ".env.example" file. [To know more about this.](https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file-for-node-js-and-npm/)

### Second step (Install Mongo)
* to install mongo `sudo apt install mongodb`
* Some Mongodb tips:
* para acceder a la consola de mongo `mongo`
* para mostrar las bases de datos `show dbs`
* para utilizar una base de datos especifica `use dataBaseName`
* para mostrar las tablas de la base de datos q estoy utilizando `show tables`
* para mostrar los valores de una tabla `myCursor = db.tableName.find( {} )`
* to remove document `db.table.remove({_id:ObjectId("5e88b02db3fbf26334ef610e")});`

### Third step (Prepar apache):
* eject: `sudo a2enmod rewrite`
* Install Apache Passager Library: `sudo apt-get install libapache2-mod-passenger`
* Config the Apache2 *.confi file adding this code:
```
<VirtualHost *:80>
    ServerName yourserver.com

    # Tell Apache and Passenger where your app's code directory is
    DocumentRoot /var/www/Route_of_your_project_folder
    PassengerAppRoot /var/www/Route_of_your_project_folder

    # Tell Passenger that your app is a Node.js app
    PassengerAppType node
    PassengerStartupFile index.js

    # Relax Apache security settings
    <Directory /var/www/Route_of_your_project_folder>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted
    </Directory>
</VirtualHost>
```
* restart apache: `sudo systemctl restart apache2`


## Some Tips:
* To run de project in develop mode: `node index.js`