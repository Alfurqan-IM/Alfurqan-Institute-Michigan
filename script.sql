show databases;
use alfurqan_institute_michigan;
show tables;
-- create user table 
create table users (
user_id int auto_increment primary key,
fisrt_name varchar(50) not null,
last_name varchar(50) not null,
user_name varchar(50) unique default "---" unique,
email varchar(255) unique not null,
password varchar(30) check(char_length(password) between 8 and 30) not null,
role enum('admin','user') default 'user',
phone varchar(30) not null unique,
image text,
gender enum('male','female') default 'female',
address varchar(1000) default 'please update your address' not null,
city varchar(50) default 'please update your city' not null,
state varchar(50) default 'please update your state' not null,
notification bool default false not null,
blacklisted bool default false not null,
verificationString text,
isVerified bool default false not null,
verified datetime,
passwordToken text,
passwordExpirationDate datetime
); 
alter table users add country varchar(50) default 'please update your country' not null after state;
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
select * from users;
select * from token;
describe token;
alter table users add createdAt datetime default current_timestamp, add updatedAt datetime default current_timestamp on update current_timestamp;
alter table token add createdAt datetime default current_timestamp, add updatedAt datetime default current_timestamp on update current_timestamp;
alter table users change password password varchar(100) check(char_length(password) between 8 and 100) not null;
ALTER TABLE users DROP CHECK users_chk_1;
alter table token change userAgent userAgent varchar(500) default null;
delete from users where user_id in (12);
alter table token change userAgent userAgent bool not null default true; 
-- create banner table
 CREATE TABLE banner (
    banner_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) default null,
    description TEXT default null,
    image VARCHAR(255) default '/uploads/example.jpeg',
    image_public_id VARCHAR(255) default null,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select * from banner;
describe banner;
-- create banner table
 CREATE TABLE enquiries (
    enq_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) not null,
    email varchar(255) unique not null,
    message TEXT not null,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
alter table enquiries add column status enum('pending','resolved') default 'pending';
alter table enquiries modify column status enum('pending','resolved') default 'pending' after message;
select * from enquiries;
describe enquiries;
SELECT CONSTRAINT_NAME
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'enquiries'
  AND CONSTRAINT_TYPE = 'UNIQUE';
ALTER TABLE enquiries DROP INDEX email;
-- create banner table
 CREATE TABLE programmes (
    programme_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL, -- Removed UNIQUE, changed to TEXT
    heading VARCHAR(100),
    about TEXT NOT NULL,
    time VARCHAR(100) NOT NULL, -- Changed TEXT to VARCHAR
    year YEAR, -- Replaced VARCHAR(50) with YEAR
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE programmesImages (
    img_id INT AUTO_INCREMENT PRIMARY KEY,
    programme_id int,
    image1 VARCHAR(255) default '/uploads/example.jpeg',
    image1_public_id VARCHAR(255) default null,
    image2 VARCHAR(255) default '/uploads/example.jpeg',
    image2_public_id VARCHAR(255) default null,
    image3 VARCHAR(255) default '/uploads/example.jpeg',
    image3_public_id VARCHAR(255) default null,
    foreign key (programme_id) references programmes(programme_id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE programmeOutcomes (
    outcome_id INT AUTO_INCREMENT PRIMARY KEY,
    programme_id int,
    outcome1 VARCHAR(255) default '/uploads/example.jpeg',
    outcome2 VARCHAR(255) default '/uploads/example.jpeg',
    outcome3 VARCHAR(255) default '/uploads/example.jpeg',
    foreign key (programme_id) references programmes(programme_id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

show tables;
select * from programmes;
select * from programmesimages;
select * from programmeoutcomes;
describe programmes;
ALTER TABLE programmes MODIFY COLUMN year INT NOT NULL;
alter table programmesimages change image3_public_id image2_public_id varchar(255);
show databases;
use apiaries_16;
select * from product_images;

CREATE TABLE programme_reg (
    reg_id INT AUTO_INCREMENT PRIMARY KEY,
    programme_id INT NOT NULL,
    user_id INT NOT NULL,
    programme ENUM(
        "Ta'afiz Alqur'an",
        'Arabic Language studies',
        'Vocational Training',
        'Islamic studies',
        'Islamic Conference',
        'Free Iftar Meal'
    ) NOT NULL,
    category ENUM(
        "Youth",
        'Adult'
    ) NOT NULL,
    discovery_method ENUM(
        'Masjid',
        'Social Media',
        'Email Campaign',
        'Referral',
        'Website',
        'Event/Workshop',
        'Advertisement',
        'Friends',
        'Other'
    ) NOT NULL,
    FOREIGN KEY (programme_id) REFERENCES programmes(programme_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE programme_reg
MODIFY COLUMN  programme ENUM(
        'Ta-afiz Alquran',
        'Arabic Language studies',
        'Vocational Training',
        'Islamic studies',
        'Islamic Conference',
        'Free Iftar Meal'
    ) NOT NULL;

CREATE TABLE feedbackComplaints (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    programme_id INT,
    subject VARCHAR(255) NOT NULL,
    notes TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (programme_id) REFERENCES programmes(programme_id)
);
CREATE TABLE quran_surahs (
    surah_id INT AUTO_INCREMENT PRIMARY KEY,
    surah VARCHAR(255) default null,
    verse int,
    translation TEXT default null,
    transliteration TEXT default null,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
describe feedbackComplaints;
show tables;
select * from users;
select * from quran_surahs;
select * from programme_reg;
describe programme_reg;
select * from feedbackcomplaints;
SHOW CREATE TABLE feedbackcomplaints;
describe feedbackcomplaints;
ALTER TABLE feedbackcomplaints DROP FOREIGN KEY `feedbackcomplaints_ibfk_2`;
ALTER TABLE feedbackcomplaints DROP COLUMN programme_id;
SELECT 
    CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_NAME = 'feedbackcomplaints';
alter table users add column img_public_id varchar(255) null after image; 




