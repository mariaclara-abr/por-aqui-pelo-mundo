import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Termos de Serviço";
const DESCRIPTION =
  "Regras de uso do Por Aqui Pelo Mundo, incluindo o caráter estimativo dos roteiros e custos e os limites da nossa responsabilidade.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/termos" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

const EMAIL = (
  <a href="mailto:rejane_abrantes@yahoo.com.br">rejane_abrantes@yahoo.com.br</a>
);

const SECTIONS: LegalSection[] = [
  {
    title: "Aceite dos termos",
    body: (
      <p>
        Ao acessar ou usar o Por Aqui Pelo Mundo, você concorda com estes Termos e com a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>. Se não concordar, não use
        o site.
      </p>
    ),
  },
  {
    title: "O que é o serviço",
    body: (
      <p>
        Somos uma plataforma de planejamento de viagens baseada em curadoria humana. As
        atrações, dicas, notas e roteiros refletem a experiência e a opinião de quem
        visitou cada lugar. A inteligência artificial, quando usada, apenas organiza essa
        curadoria existente.
      </p>
    ),
  },
  {
    title: "Roteiros e valores são estimativas",
    body: (
      <>
        <p>
          <strong>
            Os roteiros, horários, durações, deslocamentos e custos exibidos no site são
            estimativas e referências para ajudar no planejamento. Eles não significam
            exatamente o que você vai viver.
          </strong>
        </p>
        <p>
          Por exemplo: se você escolher um roteiro econômico e acabar gastando mais do que o
          valor estimado no site, o Por Aqui Pelo Mundo não se responsabiliza pela
          diferença. Preços, câmbio, taxas, filas, clima, trânsito, horários de
          funcionamento e disponibilidade mudam o tempo todo e fogem do nosso controle.
        </p>
        <p>
          Antes de viajar ou pagar por qualquer coisa, confirme preços, horários, regras de
          entrada, necessidade de reserva, vistos, vacinas, seguros e demais exigências
          diretamente com os estabelecimentos, companhias e órgãos oficiais.
        </p>
      </>
    ),
  },
  {
    title: "Curadoria é opinião",
    body: (
      <p>
        As notas de curadoria (de 1 a 5 estrelas) e os comentários são avaliações pessoais
        de quem visitou o lugar e não uma garantia de qualidade, segurança ou satisfação.
        Sua experiência pode ser diferente. Estabelecimentos podem mudar, fechar ou perder
        qualidade depois da visita.
      </p>
    ),
  },
  {
    title: "Roteiros gerados com IA",
    body: (
      <p>
        Roteiros gerados com apoio de IA são sugestões automáticas montadas a partir da
        curadoria cadastrada e das informações que você preencheu. Podem conter imprecisões
        ou ficar desatualizados. Revise tudo antes de seguir o roteiro, e a decisão final é
        sempre sua.
      </p>
    ),
  },
  {
    title: "Sua conta",
    body: (
      <ul>
        <li>Você deve ter 18 anos ou mais, ou ter autorização de um responsável.</li>
        <li>Informe dados verdadeiros e mantenha sua senha em segurança.</li>
        <li>Você é responsável pelas atividades feitas na sua conta.</li>
        <li>Podemos suspender ou encerrar contas que violem estes Termos.</li>
        <li>Você pode excluir sua conta a qualquer momento pedindo pelo nosso contato.</li>
      </ul>
    ),
  },
  {
    title: "Premium e pagamentos",
    body: (
      <>
        <p>
          O plano Premium libera recursos e conteúdos adicionais. Os valores, o período e o
          que está incluído são mostrados no momento da contratação. O pagamento é
          processado pelo Stripe.
        </p>
        <p>
          Respeitamos o direito de arrependimento previsto no Código de Defesa do Consumidor:
          em compras feitas pela internet, você pode desistir em até 7 dias corridos após a
          contratação, com devolução do valor pago. Para pedir, fale com a gente pelo e-mail{" "}
          {EMAIL}.
        </p>
      </>
    ),
  },
  {
    title: "Links de afiliados e terceiros",
    body: (
      <p>
        O site pode ter links para serviços de terceiros, como hospedagem e chip de
        internet. Alguns são links de afiliados: podemos receber uma comissão se você
        comprar, sem custo extra para você. Essas compras são feitas diretamente com o
        terceiro, que é o único responsável pelo produto, preço, atendimento e política de
        cancelamento.
      </p>
    ),
  },
  {
    title: "Propriedade intelectual",
    body: (
      <p>
        Textos, fotos, curadoria, roteiros, identidade visual e demais conteúdos do site
        pertencem ao Por Aqui Pelo Mundo ou a seus autores. É permitido o uso pessoal e não
        comercial. Não é permitido copiar, reproduzir, revender, extrair em massa ou
        distribuir o conteúdo sem autorização por escrito.
      </p>
    ),
  },
  {
    title: "Conteúdo enviado por você",
    body: (
      <p>
        Perguntas, avaliações e outros conteúdos que você enviar devem ser verdadeiros e
        respeitosos, sem ofensas, spam ou violação de direitos de terceiros. Você mantém a
        autoria, mas nos autoriza a exibir esse conteúdo no site. Podemos remover o que
        violar estes Termos.
      </p>
    ),
  },
  {
    title: "Uso adequado",
    body: (
      <ul>
        <li>Não tente invadir, sobrecarregar ou prejudicar o site e seus sistemas.</li>
        <li>Não use robôs ou automações para copiar o conteúdo.</li>
        <li>Não use o site para fins ilegais ou para enganar outras pessoas.</li>
      </ul>
    ),
  },
  {
    title: "Limitação de responsabilidade",
    body: (
      <>
        <p>
          O site é oferecido como ferramenta de apoio ao planejamento. Na medida permitida
          pela lei, o Por Aqui Pelo Mundo não se responsabiliza por:
        </p>
        <ul>
          <li>gastos acima do estimado, mudanças de preço, câmbio ou taxas;</li>
          <li>diferenças entre o roteiro e o que você de fato viver na viagem;</li>
          <li>horários, locais, serviços ou atrações que mudaram, fecharam ou estão indisponíveis;</li>
          <li>perdas, atrasos, cancelamentos, acidentes ou problemas durante a viagem;</li>
          <li>produtos e serviços de terceiros contratados por links do site;</li>
          <li>falhas ou indisponibilidade temporária do site.</li>
        </ul>
        <p>
          Nada nestes Termos limita direitos que o Código de Defesa do Consumidor garante a
          você e que não possam ser afastados por contrato.
        </p>
      </>
    ),
  },
  {
    title: "Disponibilidade do site",
    body: (
      <p>
        Trabalhamos para manter o site no ar, mas não garantimos funcionamento ininterrupto.
        Podemos alterar, suspender ou encerrar funcionalidades a qualquer momento, avisando
        quando houver impacto relevante.
      </p>
    ),
  },
  {
    title: "Mudanças nos termos",
    body: (
      <p>
        Podemos atualizar estes Termos. A data da última atualização fica no topo da
        página. Continuar usando o site depois da mudança significa que você aceita a nova
        versão.
      </p>
    ),
  },
  {
    title: "Lei aplicável e contato",
    body: (
      <p>
        Estes Termos seguem as leis do Brasil. Dúvidas ou pedidos? Fale com a gente pelo e-mail{" "}
        {EMAIL}.
      </p>
    ),
  },
];

export default function TermosPage() {
  return (
    <LegalPage
      eyebrow="Documentos"
      title={TITLE}
      updatedAt="3 de outubro de 2026"
      intro="Estes Termos explicam as regras de uso do Por Aqui Pelo Mundo. Leia com atenção, especialmente a parte que explica que roteiros e valores são estimativas."
      sections={SECTIONS}
    />
  );
}
