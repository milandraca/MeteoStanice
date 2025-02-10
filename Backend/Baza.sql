﻿use master;
go

drop database if exists weatherstation;
go
create database weatherstation collate Croatian_CI_AS;
go
use weatherstation;
go


create table drzave(
sifra int not null primary key identity(1,1), -- ovo je primarni kljuc
naziv varchar(50) not null
);

create table regije(
sifra int not null primary key identity(1,1),
naziv varchar (50) not null ,
drzava_sifra int not null references drzave(sifra)
);

create table mjesta(
sifra int not null primary key identity(1,1),
naziv varchar(30) not null,
brojposte int,
regija_sifra int  not null references regije(sifra)
);

create table meteostanice( 
sifra int not null primary key identity(1,1),
naziv varchar (50) not null,
longitude DECIMAL(9,6),
latitude DECIMAL(9,6),
mjesto_sifra int not null references mjesta(sifra)
);

create table podaci( 
id bigint IDENTITY(1,1) NOT NULL,
meteostanica_sifra int not null references meteostanice(sifra),
vrijeme datetime not null,
brzinavjetra int,
temperatura decimal(3,1) ,
relativnavlaga decimal(4,2),
kolicinapadalina decimal(4,2)
);


-- 1 (Ovo je šifra koju je dodjelila baza)
insert into drzave 
(naziv) values
('Hrvatska');

insert into drzave(naziv) values
-- 2
('Srbija');



insert into regije (naziv, drzava_sifra) values
-- 1
('Osječko-baranjska županija',1 ),
-- 2
('Vojvodina',2 );

insert into mjesta(naziv, brojposte, regija_sifra) values
('Jagodnjak',null,1 ),
('Novi Sad',null, 2);


insert into meteostanice (naziv, longitude, latitude, mjesto_sifra) 
values 
('GW1101', NULL, NULL, 1),
('WH2650A',NULL, NULL, 2),
('GW2001', NULL, NULL, 1);




-- select * from meteostanice;