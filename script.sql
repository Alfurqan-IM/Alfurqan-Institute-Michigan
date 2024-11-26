show databases;
use alfurqan_institute_michigan;
show tables;
-- create user table 
create table users (
user_id int auto_increment primary key,
fisrt_name varchar(50) not null,
last_name varchar(50) not null,
user_name varchar(50) not null unique,
email varchar(255) unique not null,
password varchar(30) check(char_length(password) between 8 and 30) not null,
role enum('admin','user') default 'user',
phone varchar(30) not null unique,
image text,
gender enum('male','female') default 'female',
address varchar(1000) default 'please update your address' not null,
city varchar(50) default 'please update your city' not null,
state varchar(50) default 'please update your state' not null,
state varchar(50) default 'please update your country' not null,
notification bool default false not null,
blacklisted bool default false not null,
verificationString text,
isVerified bool default false not null,
verified datetime,
passwordToken text,
passwordExpirationDate datetime
); 
-- create token table 
create table token(
token_id int primary key auto_increment,
refreshToken varchar(100) not null,
ip varchar(100) not null,
userAgent varchar(100) not null,
isValid bool not null,
user int,
foreign key(user) references users(user_id) on delete cascade
); 