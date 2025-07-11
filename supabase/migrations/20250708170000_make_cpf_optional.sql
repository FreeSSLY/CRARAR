-- Tornar a coluna CPF opcional na tabela de tutores
ALTER TABLE public.tutores ALTER COLUMN cpf DROP NOT NULL;
