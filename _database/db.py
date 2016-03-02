from datetime import datetime
from decimal import Decimal
from pony.orm import *

db = Database("mysql", host="localhost", port=3306, user="root", passwd="", db="VaccineDB")

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    uname = Required(str, 35, unique=True)
    email = Required(str, 50, unique=True)
    password = Required(str, 25)
    confirmed = Required(bool, default=0)
    access = Optional(int, default=0)
    name = Required("Name")
    phones = Set("Phone")
    address = Required("Address")
    avatar = Required("Image", reverse="users")
    images = Set("Image", reverse="user")
    children = Set("Child")


class Phone(db.Entity):
    id = PrimaryKey(int, auto=True)
    user = Required(User)
    ccode = Optional(str, 7, nullable=True)
    number = Required(str, 20, unique=True, lazy=False)
    confirmed = Required(bool, default=0)
    center = Required("Center")


class Address(db.Entity):
    id = PrimaryKey(int, auto=True)
    State = Required(str, 30)
    City = Required(str, 30)
    Region = Required(str, 30)
    PostCode = Required(int)
    users = Set(User)
    children = Set("Child")
    centers = Set("Center")


class Child(db.Entity):
    id = PrimaryKey(int, auto=True)
    dob = Required(datetime)
    user = Required(User)
    name = Required("Name")
    height = Optional(Decimal, default=0.0)
    weight = Optional(Decimal, default=0.0)
    images = Set("Image", reverse="child")
    avatar = Required("Image", reverse="children")
    address = Required(Address)


class Name(db.Entity):
    id = PrimaryKey(int, auto=True)
    users = Set(User)
    children = Set(Child)
    first = Required(str, 25)
    middle = Optional(str, 25, nullable=True, lazy=True)
    last = Required(str, 25)
    nick = Optional(str, 25, nullable=True, lazy=True)


class Image(db.Entity):
    id = PrimaryKey(int, auto=True)
    photo = Required(buffer, lazy=True)
    vaccine = Required("Vaccine")
    users = Set(User, reverse="avatar")
    center = Required("Center")
    user = Required(User, reverse="images")
    child = Required(Child, reverse="images")
    children = Set(Child, reverse="avatar")


class Vaccine(db.Entity):
    id = PrimaryKey(int, auto=True)
    title = Required(str)
    doses = Set("Dose")
    centers = Set("Center")
    images = Set(Image)


class Center(db.Entity):
    id = PrimaryKey(int, auto=True)
    title = Required(str, 50)
    images = Set(Image)
    vaccines = Set(Vaccine)
    address = Required(Address)
    phones = Set(Phone)


class Dose(db.Entity):
    id = PrimaryKey(int, auto=True)
    dab = Required(int, default=0)
    vaccine = Required(Vaccine)


sql_debug(True)
db.generate_mapping(create_tables=True)