-- Add Admin column to operateri table
ALTER TABLE operateri ADD Admin bit NOT NULL DEFAULT 0;

-- Set edunova@edunova.hr as admin
UPDATE operateri SET Admin = 1 WHERE email = 'edunova@edunova.hr';
