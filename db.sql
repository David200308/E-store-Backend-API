CREATE DATABASE STOREDB;
USE STOREDB;

CREATE TABLE USERINFO (
    userID int NOT NULL, 
    userName VARCHAR(255) NOT NULL, 
    userPassword VARCHAR(255) NOT NULL, 
    userStatus BIT(1) NOT NULL, 
    createTime DATETIME NOT NULL,
    tempToken VARCHAR(255)
);

CREATE TABLE PAYMENT (
    paymentID varchar(255) NOT NULL, 
    userID int NOT NULL, 
    paymentValue FLOAT NOT NULL, 
    paymentCreationTime DATETIME NOT NULL, 
    paymentStatus BIT(1) NOT NULL, 
    primary key (paymentID, userID)
);

CREATE TABLE CART (
    userID int NOT NULL,
    productID VARCHAR(255) NOT NULL,
    orderID VARCHAR(255) NOT NULL,
    quantity int NOT NULL,
);

CREATE TABLE PRODUCT (
    productID VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL
);
