## How to setup database   

* Install python 2.7   

* Add system environment paths:    

    C:\Python27
    C:\Python27\Scripts
 
* Open command prompt as Administrator and run:
 
    pip install pony
    pip install pymysql  

* If "pip" is not recognized, [download get-pip.py](https://bootstrap.pypa.io/get-pip.py) and run this command as Administrator:

    python get-pip.py  

* Download and save [the Python Code from Pony ORM editor](https://editor.ponyorm.com/user/sdipu/VaccineDB#python-code) to `"db.py"` file.

* Now setup database by running: 

    python db.py > db.sql
   
* An output of SQL commands can be found in `db.sql` file.
