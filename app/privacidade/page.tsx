import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Política de Privacidade";
const DESCRIPTION =
  "Saiba quais dados o Por Aqui Pelo Mundo coleta, para que usa e como você controla suas informações.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacidade" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

const EMAIL = (
  <a href="mailto:rejane_abrantes@yahoo.com.br">rejane_abrantes@yahoo.com.br</a>
);

const SECTIONS: LegalSection[] = [
  {
    title: "Quem somos",
    body: (
      <p>
        O Por Aqui Pelo Mundo (poraquipelomundo.com) é uma plataforma de planejamento de
        viagens baseada em curadoria humana: atrações, dicas e roteiros vêm da experiência
        de quem visitou cada lugar. Para fins da Lei Geral de Proteção de Dados (LGPD, Lei
        13.709/2018), somos a controladora dos dados tratados neste site.
      </p>
    ),
  },
  {
    title: "Quais dados coletamos",
    body: (
      <>
        <p>Coletamos apenas o necessário para o site funcionar:</p>
        <ul>
          <li>
            <strong>Cadastro e login:</strong> nome, e-mail e foto de perfil. Ao entrar com
            o Google, recebemos somente nome, e-mail e foto da sua conta Google. Não
            acessamos seus contatos, e-mails, arquivos ou qualquer outro dado do Google.
          </li>
          <li>
            <strong>Senha:</strong> se você criar conta com e-mail e senha, a senha é
            armazenada de forma criptografada pelo nosso provedor de autenticação. Nós não
            conseguimos ler a sua senha.
          </li>
          <li>
            <strong>Conteúdo que você cria:</strong> roteiros, atrações salvas, destinos,
            datas, preferências de viagem, perguntas e avaliações que você enviar.
          </li>
          <li>
            <strong>Pagamento:</strong> se você assinar o Premium, o pagamento é processado
            pelo Stripe. Não recebemos nem guardamos número de cartão. Guardamos apenas o
            status da sua assinatura.
          </li>
          <li>
            <strong>Dados técnicos:</strong> um identificador anônimo guardado no seu
            navegador (para lembrar preferências e contar visitas sem identificar você) e
            registros técnicos básicos de acesso, como tipo de navegador e endereço IP.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Para que usamos seus dados",
    body: (
      <ul>
        <li>Criar e manter a sua conta e permitir o login.</li>
        <li>Salvar, organizar e compartilhar os seus roteiros.</li>
        <li>Gerar roteiros com apoio de inteligência artificial, quando você pedir.</li>
        <li>Processar a assinatura Premium e liberar o acesso correspondente.</li>
        <li>Responder perguntas e mensagens enviadas por você.</li>
        <li>Manter o site seguro, prevenir abusos e corrigir falhas.</li>
        <li>Cumprir obrigações legais.</li>
      </ul>
    ),
  },
  {
    title: "Base legal",
    body: (
      <p>
        Tratamos seus dados com base na execução do serviço que você pediu (criar conta,
        salvar roteiros, assinar o Premium), no seu consentimento quando ele for necessário,
        no cumprimento de obrigações legais e no nosso legítimo interesse em manter o site
        seguro e funcionando, sempre respeitando seus direitos.
      </p>
    ),
  },
  {
    title: "Inteligência artificial",
    body: (
      <p>
        Quando você usa o recurso de roteiro com IA, as informações que você preenche
        (destino, datas, perfil da viagem, preferências) são enviadas à Anthropic, empresa
        responsável pelo modelo de IA, apenas para gerar a resposta. A IA organiza a
        curadoria já cadastrada no site. Não envie dados pessoais sensíveis (documentos,
        saúde, senhas) nos campos livres.
      </p>
    ),
  },
  {
    title: "Com quem compartilhamos",
    body: (
      <>
        <p>Não vendemos seus dados. Compartilhamos apenas com prestadores que fazem o site funcionar:</p>
        <ul>
          <li>
            <strong>Supabase:</strong> banco de dados, autenticação e armazenamento de
            fotos.
          </li>
          <li>
            <strong>Google:</strong> login com a conta Google, quando você escolher essa
            opção.
          </li>
          <li>
            <strong>Stripe:</strong> processamento de pagamentos.
          </li>
          <li>
            <strong>Anthropic:</strong> geração de roteiros com IA.
          </li>
          <li>
            <strong>Vercel:</strong> hospedagem do site.
          </li>
        </ul>
        <p>
          Esses prestadores podem processar dados em servidores fora do Brasil, seguindo as
          garantias previstas na LGPD. Também podemos divulgar dados se houver ordem
          judicial ou exigência legal.
        </p>
      </>
    ),
  },
  {
    title: "Roteiros compartilhados",
    body: (
      <p>
        Se você gerar um link para compartilhar um roteiro, qualquer pessoa com o link
        poderá ver o conteúdo daquele roteiro. Compartilhe apenas com quem quiser e evite
        incluir informações pessoais no roteiro.
      </p>
    ),
  },
  {
    title: "Links de afiliados",
    body: (
      <p>
        Alguns links do site levam a parceiros, como serviços de hospedagem e chip de
        internet. Se você comprar por eles, podemos receber uma comissão, sem custo
        adicional para você. Ao clicar, você sai do nosso site e passa a seguir a política
        de privacidade do parceiro.
      </p>
    ),
  },
  {
    title: "Cookies e armazenamento local",
    body: (
      <p>
        Usamos cookies e o armazenamento local do navegador para manter você conectado,
        lembrar seu roteiro em andamento e guardar um identificador anônimo de visitante.
        Você pode apagar esses dados nas configurações do navegador. Se bloquear
        completamente, algumas funções, como o login, podem deixar de funcionar.
      </p>
    ),
  },
  {
    title: "Por quanto tempo guardamos",
    body: (
      <p>
        Guardamos seus dados enquanto sua conta existir ou for necessário para prestar o
        serviço. Ao excluir a conta, apagamos ou anonimizamos seus dados, exceto os que
        precisarmos manter para cumprir obrigações legais, como registros de pagamento.
      </p>
    ),
  },
  {
    title: "Seus direitos",
    body: (
      <>
        <p>Pela LGPD, você pode a qualquer momento pedir:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos ou desatualizados;</li>
          <li>exclusão dos dados e da conta;</li>
          <li>portabilidade dos dados;</li>
          <li>informação sobre com quem compartilhamos;</li>
          <li>revogação de consentimento.</li>
        </ul>
        <p>
          Para exercer qualquer direito, fale com a gente pelo e-mail {EMAIL}. Você também pode
          registrar reclamação na Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </>
    ),
  },
  {
    title: "Segurança",
    body: (
      <p>
        Usamos conexão criptografada (HTTPS), controle de acesso e provedores reconhecidos
        para proteger seus dados. Nenhum sistema é totalmente imune a falhas, mas agimos
        para reduzir riscos e, se houver incidente relevante, avisaremos você e a ANPD
        conforme a lei.
      </p>
    ),
  },
  {
    title: "Crianças e adolescentes",
    body: (
      <p>
        O site é voltado a adultos que planejam viagens, inclusive em família. Não coletamos
        dados de menores de 18 anos de forma intencional. Se você é responsável e acredita
        que um menor enviou dados, entre em contato para removermos.
      </p>
    ),
  },
  {
    title: "Mudanças nesta política",
    body: (
      <p>
        Podemos atualizar esta política para refletir mudanças no site ou na lei. A data da
        última atualização fica no topo desta página. Mudanças relevantes serão avisadas no
        site.
      </p>
    ),
  },
  {
    title: "Contato",
    body: <p>Dúvidas sobre privacidade? Fale com a gente pelo e-mail {EMAIL}.</p>,
  },
];

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Documentos"
      title={TITLE}
      updatedAt="3 de outubro de 2026"
      intro="Sua privacidade importa para a gente. Aqui explicamos, de forma simples, quais dados o Por Aqui Pelo Mundo coleta, por que, com quem compartilha e como você controla tudo isso."
      sections={SECTIONS}
    />
  );
}
