SELECT name, collation_name FROM sys.databases;
GO
ALTER DATABASE db_ab2f7a_weatherstation SET SINGLE_USER WITH
ROLLBACK IMMEDIATE;
GO
ALTER DATABASE db_ab2f7a_weatherstation COLLATE Croatian_CI_AS;
GO
ALTER DATABASE db_ab2f7a_weatherstation SET MULTI_USER;
GO
SELECT name, collation_name FROM sys.databases;
GO

create table operateri(
sifra int not null primary key identity(1,1),
email varchar(50) not null,
lozinka varchar(200) not null
);

-- Lozinka edunova generirana pomoæu https://bcrypt-generator.com/
insert into operateri values ('edunova@edunova.hr',
'$2a$13$JpDMSmBb5sbGnwDOnsacceDwXBBDDJTZ4bsXlO7DA9sHbIXziu76G');



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
sifra int not null identity(1,1) ,
meteostanica_sifra int not null references meteostanice(sifra),
vrijeme datetime not null,
brzinavjetra decimal(4,1),
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

update podaci set temperatura=temperatura/10;
GO

CREATE TRIGGER DijeliTemperaturu
ON podaci
AFTER INSERT
AS
BEGIN
    UPDATE podaci
    SET temperatura = inserted.temperatura / 10.0
    FROM podaci
    INNER JOIN inserted ON podaci.sifra = inserted.sifra;
END;
GO

update podaci set brzinavjetra=brzinavjetra/10;
GO

CREATE TRIGGER DijeliBrzinuVjetra
ON podaci
AFTER INSERT
AS
BEGIN
    UPDATE podaci
    SET brzinavjetra = inserted.brzinavjetra / 10.0
    FROM podaci
    INNER JOIN inserted ON podaci.sifra = inserted.sifra;
END;
GO
