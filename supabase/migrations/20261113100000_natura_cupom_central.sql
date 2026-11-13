-- Cadastro central da Natura (linha única): cupom do mês, validade (só no
-- painel), link fixo da loja e condições. Todos os cards de parceria cujo
-- link é da Natura leem daqui, então trocar o cupom atualiza tudo de uma vez.
create table natura_settings (
  id smallint primary key default 1 check (id = 1),
  coupon_code text not null default '',
  coupon_expires_on date,
  store_url text not null default 'https://www.minhaloja.natura.com/consultoria/rejaneabrantes?marca=natura',
  conditions text not null default '',
  updated_at timestamptz not null default now()
);
insert into natura_settings (id) values (1);

alter table natura_settings enable row level security;
create policy "Authors manage natura settings" on natura_settings
  for all using (public.is_author()) with check (public.is_author());

-- Visão pública: nunca expõe a validade. O cupom some sozinho depois do dia
-- de validade (inclusive), no fuso de São Paulo.
create view natura_public as
select
  store_url,
  case
    when coupon_code <> ''
     and (coupon_expires_on is null or coupon_expires_on >= (now() at time zone 'America/Sao_Paulo')::date)
    then coupon_code
  end as coupon_code,
  nullif(conditions, '') as conditions
from natura_settings;
grant select on natura_public to anon, authenticated;

-- Texto padrão aprovado nos cards Natura já cadastrados (qualquer um dos 3 espaços).
update attractions set
  exclusive_perk_description = E'**Não esqueça dos cuidados durante a viagem! ☀️**\n\nProtetor solar, hidratante labial e outros itens essenciais ajudam a aproveitar cada passeio com conforto e proteção. Confira a seleção de produtos da **Natura** que preparamos para você e aproveite os benefícios exclusivos do **Por Aqui Pelo Mundo**!',
  exclusive_perk_cta_label = 'CONFERIR PRODUTOS'
where exclusive_perk_url ilike '%minhaloja.natura.com%';
update attractions set
  exclusive_perk_2_description = E'**Não esqueça dos cuidados durante a viagem! ☀️**\n\nProtetor solar, hidratante labial e outros itens essenciais ajudam a aproveitar cada passeio com conforto e proteção. Confira a seleção de produtos da **Natura** que preparamos para você e aproveite os benefícios exclusivos do **Por Aqui Pelo Mundo**!',
  exclusive_perk_2_cta_label = 'CONFERIR PRODUTOS'
where exclusive_perk_2_url ilike '%minhaloja.natura.com%';
update attractions set
  exclusive_perk_3_description = E'**Não esqueça dos cuidados durante a viagem! ☀️**\n\nProtetor solar, hidratante labial e outros itens essenciais ajudam a aproveitar cada passeio com conforto e proteção. Confira a seleção de produtos da **Natura** que preparamos para você e aproveite os benefícios exclusivos do **Por Aqui Pelo Mundo**!',
  exclusive_perk_3_cta_label = 'CONFERIR PRODUTOS'
where exclusive_perk_3_url ilike '%minhaloja.natura.com%';
