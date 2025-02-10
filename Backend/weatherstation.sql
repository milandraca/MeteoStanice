use master;
go

drop database if exists weatherstation;
go
create database weatherstation collate Croatian_CI_AS;
go
use weatherstation;
go


create table drzava(
sifra int not null primary key identity(1,1), -- ovo je primarni kljuc
naziv varchar(50) not null
);

create table regija(
sifra int not null primary key identity(1,1),
naziv varchar (50) not null ,
drzava_sifra int not null references drzava(sifra)
);

create table mjesto(
sifra int not null primary key identity(1,1),
naziv varchar(30) not null,
brojposte int,
regija_sifra int  not null references regija(sifra)
);

create table meteostanica( 
sifra int not null primary key identity(1,1),
naziv varchar (50) not null,
longitude DECIMAL(9,6),
latitude DECIMAL(9,6),
mjesto int not null references mjesto(sifra)
);

create table podaci( 
id bigint IDENTITY(1,1) NOT NULL,
meteostanica_sifra int not null references meteostanica(sifra),
vrijeme datetime not null,
brzinavjetra int,
temperatura decimal(3,1) ,
relativnavlaga decimal(4,2),
kolicinapadalina decimal(4,2)
);


-- 1 (Ovo je šifra koju je dodjelila baza)
insert into drzava 
(naziv) values
('Hrvatska');

insert into drzava(naziv) values
-- 2
('Srbija');



insert into regija (naziv, drzava) values
-- 1
('Osječko-baranjska županija',1 ),
-- 2
('Vojvodina',2 );

insert into mjesto(naziv, brojposte, regija) values
('Jagodnjak',null,1 ),
('Novi Sad',null, 2);


insert into meteostanica (naziv, longitude, latitude, mjesto) 
values 
('GW1101', NULL, NULL, 1),
('WH2650A',NULL, NULL, 2),
('GW2001', NULL, NULL, 1);

insert into podaci(sifra, vrijeme, brzinavjetra, temperatura, relativnavlaga, kolicinapadalina) values
(1, getDate(),  null, null, null, null)


-- select * from meteostanica;

