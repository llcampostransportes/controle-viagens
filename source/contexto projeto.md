# Contexto do Projeto — Controle de Viagens (L.L. Campos Transportes)

> Este documento existe pra que qualquer pessoa — inclusive uma nova conversa com o
> Claude, sem nenhum histórico anterior — consiga entender o projeto do zero e
> continuar o desenvolvimento sem perder contexto. Guarde ele junto com os arquivos
> de código-fonte mais recentes.

**Última atualização deste documento:** referente à versão **v2026.07.05-2**

---

## 1. Visão geral do negócio

**Quem usa:** Laís, dona (junto com o marido) da **L.L. Campos Transportes**, uma
transportadora. Ela é quem lança os dados no dia a dia; o marido tem acesso
combinado como **somente leitura** (não deve editar).

**Que problema o sistema resolve:** antes, o controle da transportadora era feito em
planilhas soltas e anotações manuais. Esse app centraliza, num só lugar, tudo que
a operação de uma transportadora pequena/média precisa acompanhar dia a dia:

- Quais viagens foram feitas, por qual caminhão, quanto falta receber do frete
- Quanto de comissão cada motorista tem a receber, e o controle de vales/reembolsos
  descontados dessa comissão
- Contas a pagar (boletos), separadas por empresa e status
- Gastos com combustível (Diesel e Arla), por posto, comparando o preço por litro
- Manutenção preventiva (troca de óleo a cada 25.000 km, outros serviços)
- Pedágio (Sem Parar) e Seguro dos caminhões/carretas, com geração automática do
  financeiro (boleto) e do custo por placa

**Como é usado no dia a dia:** Laís acessa o app pelo celular ou notebook (é uma
página web, funciona como um site, sem precisar instalar nada), faz login com a
conta Google da empresa, e lança as informações à medida que as viagens acontecem.
Tudo fica salvo automaticamente numa planilha do Google Sheets — o app é, na
prática, uma "camada" bonita e organizada por cima dessa planilha, que faz os
cálculos e organiza a visualização.

---

## 2. Tecnologias utilizadas

- **React 19** e **React DOM 19** — é o framework que constrói toda a interface.
- **JavaScript com JSX** — **não é TypeScript**. Os arquivos têm extensão `.jsx`,
  não `.tsx` (isso já foi confundido antes numa conversa — vale reforçar aqui pra
  não repetir o engano).
- **Google Identity Services (GIS)** — biblioteca do Google carregada direto no
  HTML (`https://accounts.google.com/gsi/client`) pra fazer o login/autenticação.
  Não é um pacote instalado via npm.
- **Google Sheets API v4** — usada via `fetch` puro (sem biblioteca cliente do
  Google), pra ler e escrever na planilha.
- **esbuild** — ferramenta usada só na hora de "empacotar" o código: pega os
  arquivos `.jsx`, junta tudo, minifica, e gera um único arquivo `.js` que é colado
  dentro do `index.html` final. É essa etapa que transforma o código-fonte legível
  no arquivo que de fato roda no navegador.
- **Sem framework de build tradicional** (sem Vite, sem Create React App, sem
  Next.js). O processo de build é manual, feito por mim (Claude) sempre que preciso
  gerar uma nova versão do `index.html`.
- **Sem banco de dados** — os dados "moram" inteiramente na planilha do Google
  Sheets, que funciona como banco de dados do sistema.
- **Hospedagem: GitHub Pages** — o `index.html` final é publicado no repositório
  `llcampostransportes/controle-viagens`, e fica acessível em:
  `https://llcampostransportes.github.io/controle-viagens/`

---

## 3. Integrações e autenticação

### Como funciona o login via Google

O app usa o fluxo de **OAuth2 do lado do navegador** (sem servidor por trás). Quando
a pessoa clica em "Conectar com Google":

1. O Google Identity Services abre a tela de login/consentimento do Google.
2. Depois de aprovado, o Google devolve um **token de acesso temporário** (válido
   por cerca de 1 hora).
3. Esse token é guardado só na memória do navegador (não é salvo em lugar nenhum
   persistente) e usado em toda chamada à API do Google Sheets daquela sessão.
4. O app **renova esse token sozinho a cada 45 minutos**, de forma silenciosa (sem
   pedir login de novo), pra sessões longas não pararem de salvar por token vencido
   — isso foi uma correção feita depois de um problema real que causou perda
   temporária de dados (recuperados via backup).

### Como a permissão de acesso é controlada

**Importante: quem tem acesso ao quê não é controlado pelo código do app — é
controlado pelo compartilhamento da planilha no Google Drive.**

- Se a conta Google da pessoa tiver sido adicionada como **Editor** na planilha,
  ela consegue ler e escrever normalmente pelo app.
- Se tiver sido adicionada como **Leitor** (é o caso do marido da Laís, hoje), o
  app deixa ver tudo normalmente, mas qualquer tentativa de salvar falha (o Google
  bloqueia do lado dele, não é o app que decide isso), e aparece um aviso claro na
  tela avisando que o acesso é somente leitura.
- Se a conta não tiver **nenhum** acesso à planilha, o app não consegue carregar
  dado nenhum.

Ou seja: pra dar ou tirar acesso de alguém, o caminho é sempre pelo
**Google Drive → Compartilhar**, na planilha em si — nunca pelo código do app.

### APIs e serviços externos conectados

- **Google Identity Services** — autenticação.
- **Google Sheets API v4** — leitura e escrita de dados.
- Nenhuma outra API externa. O app **não envia dados pra nenhum outro lugar**
  (não fala com Receita Federal, não tem backend próprio, não tem analytics).

---

## 4. IDs, chaves e credenciais

| Identificador | Valor | Pra que serve | É sensível? |
|---|---|---|---|
| **Google Client ID** | `916443066549-qj84og3gajuru9734bgjgd207rfs3l6e.apps.googleusercontent.com` | Identifica o app junto ao Google durante o login OAuth2. | **Não é secreto.** Esse tipo de ID é feito pra aparecer no código de apps que rodam no navegador — é assim que o OAuth2 "público" (sem servidor) funciona. Não precisa esconder. |
| **ID da planilha (Spreadsheet ID)** | `1-1H2_kpa624M7v7Sfs3e8F2488gjMrrJ1D898CTHa9U` | Identifica exatamente qual planilha do Google Sheets o app lê e escreve. | **Moderadamente sensível.** Sozinho, esse ID não dá acesso a ninguém (quem não tiver permissão no Drive não consegue ler nada só sabendo o ID). Mas é uma boa prática **não divulgar publicamente** — por exemplo, evitar deixar em repositórios públicos sem necessidade, já que reduz a "obscuridade" de qual planilha é a de verdade. |
| **Client Secret** | Não existe / não é usado | O tipo de login usado (aplicativo público, "token client") não usa Client Secret — só funciona com o Client ID. | Não aplicável. |
| **API Key do Google** | Não é usada | O app não usa uma "API Key" separada; a autorização vem inteiramente do login OAuth2 da pessoa. | Não aplicável. |

### Como guardar isso com segurança

- **O Client ID pode continuar público** sem problema — inclusive já está visível
  no código-fonte, que é normal.
- **O ID da planilha**: se um dia o repositório do GitHub for tornado público, vale
  a pena considerar deixar o repositório **privado**, já que o código inteiro
  (incluindo esse ID) fica visível pra qualquer pessoa num repositório público. Hoje
  a proteção real de quem acessa os dados é o compartilhamento do Google Drive, mas
  reduzir a exposição do ID é uma camada extra de cuidado.
- Nenhuma outra credencial (senha, chave de API, token fixo) existe neste projeto
  pra se preocupar em proteger.

---

## 5. Estrutura de arquivos

| Arquivo | O que é | Como se relaciona com os outros |
|---|---|---|
| `app-sheets-source.jsx` | **O código-fonte de verdade.** Um arquivo único e grande que contém todos os componentes React, todas as telas, todos os cálculos (comissão, relatórios, etc.) e toda a lógica de leitura/escrita na Google Sheets API. | É o arquivo que preciso editar sempre que uma alteração é pedida. |
| `entry-sheets.jsx` | Arquivo pequeno (poucas linhas). Só importa o React e o `app-sheets-source.jsx`, e manda "montar" o app na página. | Serve de ponto de entrada pro processo de empacotamento (build) — é o arquivo que o `esbuild` usa como partida pra juntar tudo. |
| `README.md` | Documentação técnica do projeto: lista de funcionalidades, dependências, como gerar o `index.html` a partir do código-fonte, como a integração com o Google Sheets funciona. | Complementa este documento (`contexto_projeto.md`) com detalhes mais técnicos/operacionais. |
| `contexto_projeto.md` | Este arquivo. Visão de negócio + técnica completa, pensado pra começar uma conversa nova do zero. | É o documento "mestre" — deve ser o primeiro a ser compartilhado numa conversa nova. |
| `codigo-fonte-controle-viagens-v[versão].jsx` | Cópias de **marco** do `app-sheets-source.jsx`, tiradas a cada 10 alterações (ou em momentos importantes), pra servir de ponto de restauração caso algo dê errado numa versão mais nova. | É uma cópia "congelada" do `app-sheets-source.jsx` num momento específico — não é editado depois de criado. |
| `index.html` (entregue separadamente, não faz parte deste pacote de código-fonte) | O arquivo final, gerado a partir dos dois `.jsx` acima (empacotados e minificados pelo esbuild). É esse arquivo que sobe no GitHub Pages e roda de verdade no navegador da Laís. | É **gerado a partir** do código-fonte — nunca deve ser editado diretamente, porque qualquer edição direta nele se perderia na próxima vez que eu gerar uma versão nova a partir do `.jsx`. |

**Fluxo resumido:** edito `app-sheets-source.jsx` → rodo o esbuild com
`entry-sheets.jsx` como entrada → gero o `bundle.js` → colo dentro do template HTML
→ isso vira o novo `index.html` → Laís sobe esse arquivo no GitHub, substituindo o
antigo.

---

## 6. Todas as features do sistema (estado atual)

### 🚚 Viagens
- Cadastro de caminhões (placas), com confirmação antes de excluir.
- Lançamento de viagens: origem, destino, km início/fim, data de fim, número de
  contrato, adiantamento e saldo a receber (com datas de recebimento), empresa,
  motorista.
- **Abastecimentos por viagem**: data, litragem, km, valor, posto, número do
  cupom/NFC-e, e o **tipo (Diesel ou Arla)**.
- **Gastos extras por viagem**: valor, descrição, posto e número do cupom (pra
  casos como lubrificação lançada no mesmo cupom do abastecimento), e opção de
  marcar "motorista pagou do próprio bolso" (isso gera um reembolso automático na
  comissão dele).
- **Cálculo de comissão**: por padrão, 13% sobre (valor de comissão − pedágio).
  Duas variações possíveis:
  - **Comissão com valor fixo**: pra rotas curtas/transferência, ignora o cálculo
    de 13% e usa um valor digitado direto.
  - **Carregamento**: quando teve troca de motorista no meio da viagem (outro
    motorista foi carregar e recebeu por isso), esse valor é descontado antes de
    calcular os 13%.
- **Comissão por motorista**: tela dedicada mostrando, por motorista: gerado,
  reembolsos, pago (vales), saldo devido. Lançamento de vale/reembolso avulso, com
  opção de repetir por X meses (parcelamento). Fechamento de saldo (marca como
  pago), com histórico de fechamentos anteriores.
  - Cada fechamento **guarda exatamente quais viagens e vales entraram nele**
    (não só a data) — isso evita um bug antigo em que uma viagem do mesmo dia do
    fechamento podia ser "perdida" (nem contada como paga, nem como pendente).
  - Ferramenta de **"ajustar lançamentos"**: permite desmarcar manualmente algo
    que entrou errado num fechamento já feito, sem apagar nada, só corrigindo a
    lista do que pertence a esse fechamento.
  - Ferramenta de **unificar motoristas com nome grafado diferente** (ex: "TIAGO"
    vs "Tiago"), corrigindo viagens/vales/fechamentos antigos sem alterar valores.
- Cartão de **Comissão** no topo com alternância entre "Pendente" (só o que ainda
  não foi fechado) e "Total geral" (tudo, incluindo já pago).
- **Relatório mensal** por caminhão: receita, comissão, abastecimento, gastos,
  despesas do veículo, líquido. Inclui lançamento de despesas do caminhão (seguro,
  Sem Parar antigos, taxas individuais) e um "cofrinho" de taxa de viagem a dividir
  proporcionalmente entre os caminhões.
- Telas de "Viagens a receber" e "Viagens recebidas", com botão de baixar PDF.

### 🧾 Boletos
- Lançamento avulso ou vinculado a nota fiscal.
- **Divisão automática em parcelas**: informa o valor total da nota e em quantas
  parcelas dividir — o app calcula o valor de cada uma (ajustando arredondamento
  na última) e mostra uma **tela de revisão** onde é possível editar data e valor
  de cada parcela antes de confirmar, com **trava que impede a soma ultrapassar o
  valor total da nota**.
- Cadastro de empresas (com opção de adicionar nova direto no formulário).
- Cadastro de contas bancárias (incluindo opção "Cartão"), com opção de adicionar
  nova direto no formulário.
- Relatório com filtro de período, empresa e **status** (pendente/vencido/pago),
  com CSV e PDF.

### ⛽ Abastecimentos
- Relatório agrupado por posto, com período livre.
- Litragem separada por **Diesel** e **Arla**.
- **Valor por litro (R$/L)** calculado automaticamente em cada linha.
- CSV e PDF.

### 🛢️ Troca de Óleo
- Alerta automático quando um caminhão passa de **25.000 km rodados** desde a
  última troca (calculado a partir do km lançado nas viagens).
- Opção de marcar um caminhão como "manutenção feita pela fábrica" — esse
  caminhão sai do alerta e do acompanhamento de km.
- Lançamento de troca (data, km, se trocou filtro, observação).
- Seção separada de **"Outros Serviços"** (pneu, freios, suspensão, correia,
  bateria, revisão geral, elétrica, ou outro) — o km lançado aqui é só histórico,
  **não entra** na conta dos 25.000 km.

### 🛣️ Sem Parar
- Lançamento por vencimento: placa, data, valor do pedágio, crédito. Total =
  pedágio − crédito.
- **"Outras arrecadações"**: valores que não são vinculados a uma placa específica,
  somados só no total geral do período.
- **Colar e somar créditos**: campo de texto onde é possível colar várias linhas
  copiadas de um extrato/PDF de crédito — o app reconhece placa e valor de cada
  linha e soma automaticamente por placa. Cada resultado tem um botão "usar esse
  valor" que preenche o formulário de lançamento, e fica marcado como "já usado"
  depois de aplicado.
- **Confirmar e gerar financeiro**: processa os lançamentos não confirmados do
  período, cria **um boleto** (empresa "Sem Parar") com o valor total, e lança a
  despesa por placa no relatório mensal.

### 🛡️ Seguro
- Lançamento combinado: placa do **cavalo** + valor, e placa da **carreta**
  (opcional) + valor, num lançamento só.
- **Confirmar e gerar financeiro**: cria um boleto (empresa "Seguro") com
  vencimento fixo **todo dia 15** (antecipado pra sexta-feira anterior se cair em
  sábado ou domingo), e lança a despesa no relatório mensal — cavalo e carreta
  **somados, na placa do cavalo** (não aparecem separados no relatório).

### Funcionalidades transversais
- **Backup manual**: baixar um `.json` com todos os dados, e importar de volta se
  precisar restaurar.
- **Botão "Salvar"**: força salvar tudo que ainda não foi confirmado, além do
  salvamento automático a cada ação.
- **Confirmação antes de excluir** qualquer lançamento (viagem, vale, boleto,
  despesa, taxa, troca de óleo, etc.), mostrando valor/data pra evitar exclusão
  acidental.
- **Modo somente leitura**: detecta quando a conta logada só tem permissão de
  leitura na planilha e avisa claramente, sem travar o app.
- **Renovação automática do token do Google** a cada 45 minutos, com nova
  tentativa automática de salvar em caso de falha (e um aviso vermelho persistente
  se mesmo assim não conseguir, com botão de tentar de novo).
- **Aviso ao fechar a aba** com alterações ainda não confirmadas na planilha.
- **Logo da empresa** no cabeçalho e na tela de login.

---

## 7. Rotina de versionamento adotada

Confirmado e em vigor:

- **Toda alteração pedida** gera uma nova versão do `index.html` (numeração tipo
  `v2026.07.05-2` — ano.mês.dia-sequência do dia), sem misturar várias alterações
  num commit só.
- **A cada 10 alterações**, é gerada uma **versão de marco**: um pacote completo
  com o código-fonte (`app-sheets-source.jsx`, `entry-sheets.jsx`, `README.md`) e
  uma cópia do `.jsx` daquele momento nomeada
  `codigo-fonte-controle-viagens-v[versão].jsx`, pra servir de ponto de restauração.

**Última versão de marco (pacote completo) entregue: v2026.07.05-2.**

---

## 8. Como usar / próximos passos

### Se precisar continuar numa conversa nova com o Claude

1. Abra uma conversa nova.
2. Anexe estes arquivos, todos juntos, logo na primeira mensagem:
   - `contexto_projeto.md` (este documento)
   - `README.md`
   - `app-sheets-source.jsx`
   - `entry-sheets.jsx`
3. Escreva algo como: *"Esse é um projeto que já está em produção — leia o
   `contexto_projeto.md` e o `README.md` primeiro pra entender tudo, e depois o
   código-fonte. Preciso continuar evoluindo esse app, sem recomeçar do zero. Aqui
   está o que preciso agora: [sua próxima alteração]."*
4. **Sempre reforce a rotina de versionamento** logo no início, caso a nova
   conversa não puxe isso automaticamente: *"Lembre de gerar um arquivo de
   código-fonte novo a cada alteração, e a cada 10 alterações me entregar o pacote
   completo (código-fonte + README) como uma versão de marco."*

### Cuidados a manter sempre

- Nunca peça pra editar o `index.html` diretamente — qualquer alteração deve ser
  feita no `app-sheets-source.jsx`, e o `index.html` deve ser **gerado de novo** a
  partir dele.
- Sempre teste a versão nova antes de considerar "definitiva" — principalmente
  depois de mudanças em cálculos (comissão, financeiro automático) ou na forma como
  os dados são salvos.
- Se algo der muito errado, os recursos de recuperação disponíveis são, em ordem de
  praticidade: (1) botão "Baixar backup" feito recentemente, (2) histórico de
  versões do próprio Google Sheets (Arquivo → Histórico de versões), (3) uma
  versão de marco anterior do código-fonte, caso o problema seja no próprio código
  e não nos dados.
