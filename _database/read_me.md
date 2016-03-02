## Database setup   

1. Install python 2.7   

2. Add system environment paths:      
```` 
    C:\Python27
    C:\Python27\Scripts
````
 
3. Open command prompt as Administrator and run:
````  
    pip install pony
    pip install pymysql  
````

4. If "pip" is not recognized, [download get-pip.py](https://bootstrap.pypa.io/get-pip.py) and run this command as Administrator:
````  
    python get-pip.py  
````

5. Download and save [the Python Code from Pony ORM editor](https://editor.ponyorm.com/user/sdipu/VaccineDB#python-code) to `"db.py"` file.

6. Now setup database by running: 
````  
    python db.py > db.sql
````
   
7. An output of SQL commands can be found in `db.sql` file.
