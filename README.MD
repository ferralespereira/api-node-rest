# JFP NOTES

## To run proyect:
* Clone the project with git: `git clone https://route-of-the-project` 
* Install project dependences : `npm install`
* Update dependences: `npm update`

## Mongo tips
* to install mongo `sudo apt install mongodb`
* para acceder a la consola de mongo `mongo`
* para mostrar las bases de datos `show dbs`
* para utilizar una base de datos especifica `use dataBaseName`
* para mostrar las tablas de la base de datos q estoy utilizando `show tables`
* para mostrar los valores de una tabla `myCursor = db.tableName.find( {} )`
* to remove document `db.table.remove({_id:ObjectId("5e88b02db3fbf26334ef610e")});`

## To run the proyect in production
I am using the `pm2` package to keep running the proyect even when i leaved the instance. For it we'll need:
* (ojo, this step isn't verify) Install nodemon to: `npm install -g nodemon`
* Install pm2: `npm install pm2 -g`
* Once it's installed, go to the project folder and start the project: `sudo pm2 start index.js`
* To keep running the project once the instance was reboteed: `sudo pm2 startup`
* To see what are the process that pm2 have working: `sudo pm2 list`
* To see if el server is making some error or any report: `sudo pm2 logs`
* To restart all proccess that are running in pm2: `sudo pm2 restart all`
