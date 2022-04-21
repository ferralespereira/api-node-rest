# This is an Api Rest developed in nodejs for a [Forum](https://foro.javierfolder.com/)

<p align="center">
  <img src="https://github.com/ferralespereira/foro-angular/blob/master/src/assets/img/jforo1.svg" width="350" title="Foro Angular">
</p>

<p align="center">
<strong> This is the Api Rest of the Frontend in https://github.com/ferralespereira/foro-angular</strong>
</p>
<br>

## To run proyect you'll need 3 steps:

### First step (Clone the proyect):

* Clone the project with git:
```bash
git clone https://route-of-the-project
```

* Install project dependences :
```bash
sudo apt install npm
```

* Update dependences:
```bash
sudo npm update
```

* Give all permision to 'ulpload/users' folder:
```bash
sudo chmod a+rwx ulpload/users
```

* Build ".env" file like ".env.example" file. [To know more about this.](https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file-for-node-js-and-npm/)

### Second step (Install Mongo)

* to install mongo:
```bash
sudo apt install mongodb
```

#### Some Mongodb tips:
* para acceder a la consola de mongo:
```bash
mongo
```

* para mostrar las bases de datos:
```bash
show dbs
```

* para utilizar una base de datos especifica:
```bash
use dataBaseName
```

* para mostrar las tablas de la base de datos q estoy utilizando:
```bash
show tables
```

* para mostrar los valores de una tabla:
```bash
myCursor = db.tableName.find( {} )
```

* to remove document:
```bash
db.table.remove({_id:ObjectId("5e88b02db3fbf26334ef610e")});
```

### Third step (Prepar apache):
* eject:
```bash
sudo a2enmod rewrite
```
* Install Apache Passager Library:
```bash
sudo apt-get install libapache2-mod-passenger
```
* Config the Apache2 *.confi file adding this code:
```apache
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

* restart apache:
```bash
sudo systemctl restart apache2
```

## Some Tips:
* To run de project in develop mode:
```bash
node index.js
```