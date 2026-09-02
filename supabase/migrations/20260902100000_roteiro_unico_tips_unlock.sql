-- 'roteiro_unico_1pais' também libera todas as dicas Premium do site, mas só
-- por um período limitado (10 dias a partir da compra) — diferente do acesso
-- ao próprio roteiro, que continua valendo pra sempre (ver expiration_date).
-- Fica null para premium_mensal/premium_anual, cujo acesso às dicas já segue
-- o expiration_date normal da assinatura.
alter table subscriptions add column tips_unlock_expiration timestamptz;
