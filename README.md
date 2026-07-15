# Controle de Viagens — Código-fonte

Este é o código-fonte legível do app "Controle de Viagens" (L. L. Campos Transportes).
O arquivo que roda de verdade no GitHub Pages (`index.html`) é gerado **a partir destes
arquivos**, empacotado (minificado) num único `.html`. Este README explica como tudo
se encaixa, o que o app já faz hoje, e como retomar o desenvolvimento numa conversa nova
com o Claude caso esta aqui não possa mais continuar.

**Versão atual:** v2026.07.05-40

## Arquivos deste pacote

| Arquivo                  | O que é                                                             |
|---------------------------|----------------------------------------------------------------------|
| `entry-sheets.jsx`         | Ponto de entrada. Só monta o app React na página.                   |
| `app-sheets-source.jsx`    | **O código de verdade.** Todos os componentes, telas, cálculos e a integração com o Google Sheets estão neste único arquivo. |
| `README.md`                | Este arquivo.                                                       |

Não existe CSS separado — todo o estilo visual está embutido dentro do próprio
`app-sheets-source.jsx`, usando o estilo nativo do React (`style={{...}}`).

## Como retomar isso numa conversa nova com o Claude

Se por qualquer motivo esta conversa não puder continuar, abra uma conversa nova e
mande pro Claude os três arquivos deste pacote (`app-sheets-source.jsx`,
`entry-sheets.jsx`, `README.md`) junto com uma mensagem tipo: *"Esse é um app de
controle de viagens de transportadora que já está em produção. Aqui está o
código-fonte atual — preciso que você continue evoluindo a partir daqui, sem
recomeçar do zero."* O Claude deve ler o código, entender a estrutura (ela é
bem repetitiva — cada "módulo" novo, tipo Seguro ou Troca de Óleo, segue o mesmo
padrão dos outros) e seguir adicionando ou ajustando funcionalidades.

## O que o app faz hoje (visão geral por aba)

- **🚚 Viagens** — cadastro de caminhões, lançamento de viagens (origem/destino, km,
  contrato, adiantamento/saldo a receber, abastecimentos e gastos extras por viagem),
  cálculo de comissão do motorista (13% sobre valor de comissão menos pedágio, com
  opção de comissão prefixada pra rotas curtas, e desconto de "carregamento" quando
  teve troca de motorista no meio da viagem), gestão de vales/reembolsos, fechamento
  de saldo por motorista (com histórico e ferramenta de correção manual caso algo
  entre errado num fechamento), relatório mensal por caminhão (receita, comissão,
  abastecimento, despesas, líquido).
- **🧾 Boletos** — lançamento de boletos avulsos ou vinculados a nota fiscal (com
  ferramenta de dividir o valor total da nota em parcelas iguais, revisão antes de
  salvar, e trava pra não deixar a soma passar do valor da nota), relatório com
  filtro de período, empresa e status (pendente/vencido/pago).
- **⛽ Abastecimentos** — relatório agrupado por posto, com litragem separada por
  Diesel e Arla, valor por litro calculado automaticamente, e ferramenta de colar e
  somar créditos copiados de extrato/PDF.
- **🛢️ Troca de Óleo** — alerta automático quando um caminhão passa de 25.000km desde
  a última troca (calculado a partir do km das viagens), com opção de marcar
  caminhões cuja manutenção é feita pela fábrica (fica de fora do alerta). Tem também
  uma seção separada de "Outros Serviços" (pneu, freio, suspensão etc.) que não entra
  na conta da troca de óleo.
- **🛣️ Sem Parar** — lançamento de pedágio por vencimento (pedágio − crédito, mais um
  espaço pra "outras arrecadações" que não são por placa), com botão de confirmar que
  gera um boleto e lança a despesa no relatório mensal automaticamente.
- **🛡️ Seguro** — lançamento combinado de cavalo + carreta (valores separados, mas
  contam juntos na placa do cavalo no relatório mensal), com vencimento fixo todo
  dia 15 (antecipado pra sexta-feira anterior se cair em fim de semana), e confirmação
  manual que gera o boleto e a despesa.

### Outras funcionalidades transversais
- **⚙️ Configurações**: porcentagem da comissão dos motoristas, km padrão de troca
  de óleo, e **vencimento por seguradora** (dia do mês + se antecipa pra sexta-feira
  quando cai em fim de semana) ficam ajustáveis pela própria Laís. Cada caminhão
  também pode ter seu próprio km de troca de óleo, diferente do padrão.
- **Cavalo x Carreta**: placas de carreta ficam separadas das placas de cavalo —
  não aparecem em lançamento de viagem, filtro de frota, abastecimento nem troca de
  óleo. Uma correção automática detecta e ajusta placas que ficaram marcadas errado
  (olhando o histórico de Seguro), e também dá pra marcar/desmarcar manualmente.
  O Relatório mensal mostra "Cavalo/Carreta" juntos numa coluna só, baseado no que
  foi lançado no Seguro daquele mês.
- **Seguro com seguradoras diferentes por veículo**: cavalo e carreta do mesmo
  lançamento podem ter seguradoras diferentes (ex: ATCMG no cavalo, TRANSPOSEG na
  carreta) — o "Confirmar e gerar financeiro" gera um **boleto separado por
  seguradora**, cada um com o vencimento certo dela. Excluir um lançamento já
  confirmado remove também o boleto e a despesa gerados a partir dele (ajustando,
  em vez de apagar, se o boleto for compartilhado com outra placa).
- **Categorias de empresa** (Boletos): cada empresa cadastrada tem uma categoria
  (Caminhões, Despesas Operacionais, Financiamentos/Bancos e Cartões, Funcionários,
  Administrativo, Outros), e a lista de empresas fica agrupada por categoria. Tem
  uma tela de "gerenciar empresas" pra renomear (atualiza os boletos antigos junto,
  fundindo em vez de duplicar se o novo nome já existir) e trocar a categoria. Nome
  de empresa sempre em maiúscula, automaticamente.
- **Filtro de empresas em Boletos**: uma coluna lateral fixa (redimensionável — dá
  pra arrastar o canto e deixar maior) com um dropdown "Filtrar por empresa", onde
  dá pra marcar/desmarcar quais empresas aparecem na tela, nos cartõezinhos de
  totais e no relatório/PDF — tudo ao mesmo tempo, sem repetir a seleção em cada
  lugar. Cada empresa pode ser marcada como "não aparece no relatório de boletos a
  pagar" (em "gerenciar empresas"), útil pra quem o pagamento é feito direto com a
  empresa, sem passar pela transportadora — ela já vem desmarcada por padrão.
- **Trava de segurança**: boletos já pagos e viagens já lançadas abrem travadas
  pra edição — aparece um botão "Editar" no lugar de "Salvar", que precisa ser
  clicado antes de poder mexer em qualquer campo, evitando alteração acidental.
- **Boletos**: campos de **desconto** (com descrição) e **juros**, mostrando o
  valor final pago.
- **Sem Parar por remessa**: cada remessa (data de vencimento) aparece separada
  na tela/PDF/CSV, com seu próprio subtotal e status (pendente/confirmado). O
  "Confirmar e gerar financeiro" só processa remessas ainda não confirmadas —
  não duplica mais boleto de uma remessa que já tinha sido paga. Despesa por
  placa nunca fica negativa (mesmo quando o crédito é maior que o pedágio); o
  boleto continua com o valor real da fatura. Tem um botão "já confirmado?"
  pra corrigir manualmente lançamentos antigos que ficaram com status errado.
- **Aviso de comissão sem valor lançado**: se uma viagem tem motorista definido
  mas ainda não tem o valor da comissão preenchido (ex: esperando o valor da
  viagem chegar), aparece um aviso no topo do app e a viagem some do "sumido" —
  fica visível na tela de Comissão, zerada e destacada em vermelho com "⚠️ falta
  valor", em vez de simplesmente não aparecer em lugar nenhum.
- **Filtro e ordenação na lista de viagens**: por status (todas/pendentes/pagas)
  e por ordem (data da viagem ou ordem de lançamento), sem afetar os cartões de
  estatística do topo.
- **Editar lançamentos**: além de excluir, agora dá pra editar diretamente troca de
  óleo, outros serviços, despesas do veículo, taxas de viagem, Sem Parar, vales e
  reembolsos, e lançamentos de Seguro ainda não confirmados — sem precisar excluir
  e lançar tudo de novo por um erro de digitação.
- Cadastro de motoristas e contas bancárias, com opção de adicionar novos direto nos
  formulários ("+ nova placa...", "+ novo motorista...", "+ nova conta...").
- Ferramenta de unificar motoristas com nome grafado de forma diferente (ex:
  "TIAGO" vs "Tiago"), corrigindo viagens/vales/fechamentos antigos sem mexer em
  valores.
- Confirmação antes de excluir qualquer lançamento (vale, boleto, despesa, taxa etc).
- Modo de acesso somente leitura: se a pessoa só tiver permissão de leitura na
  planilha, o app mostra um aviso claro em vez de travar ou mostrar planilha "vazia".
- Backup manual (baixar/importar um `.json` com tudo) e um botão "Salvar" pra forçar
  salvar na hora, além do salvamento automático a cada ação.
- Renovação automática do token do Google a cada 45 minutos (o token expira sozinho
  depois de ~1h; sem isso, sessões longas paravam de salvar silenciosamente), e
  tentativa automática de salvar de novo se uma gravação falhar, com botão de
  "Reconectar" pra quando a renovação silenciosa não funciona.
- Aviso ao tentar fechar a aba com alterações ainda não confirmadas na planilha.
- Relatórios em PDF com visual colorido (cabeçalho colorido, linhas listradas,
  status em cores) — incluindo a correção pra forçar o navegador a realmente
  imprimir essas cores (por padrão ele esconde cor de fundo na impressão).

## Dependências / bibliotecas usadas

- **React 19** e **React DOM 19**.
- **Google Identity Services** (`https://accounts.google.com/gsi/client`) — carregado
  por um `<script>` direto no HTML final, não é um pacote instalado. É o que faz o
  login com Google funcionar.
- Nenhuma outra biblioteca externa.

Não existe um `package.json` nem uma pasta `node_modules` neste pacote — o projeto
não tem um "ambiente de projeto" tradicional configurado. Ele foi escrito e
empacotado manualmente.

## Como o `index.html` final é gerado

O arquivo publicado no GitHub Pages é o resultado de "empacotar" (bundle) os dois
arquivos `.jsx` num único arquivo JavaScript, usando **esbuild**, e depois colar esse
resultado dentro de um HTML simples. Se um desenvolvedor precisar refazer esse
processo no futuro, os passos são:

1. Instalar o [Node.js](https://nodejs.org)
2. Instalar as dependências:
   ```bash
   npm install react@19 react-dom@19
   npm install --save-dev esbuild
   ```
3. Colocar `entry-sheets.jsx` e `app-sheets-source.jsx` na mesma pasta, com React
   instalado em `node_modules` ao lado.
4. Rodar o empacotamento:
   ```bash
   npx esbuild entry-sheets.jsx --bundle --minify --format=iife \
     --platform=browser --loader:.jsx=jsx \
     --define:process.env.NODE_ENV='"production"' \
     --outfile=bundle.js
   ```
5. Colar o conteúdo de `bundle.js` dentro de um HTML assim:
   ```html
   <!DOCTYPE html>
   <html lang="pt-BR">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Controle de Viagens</title>
     <script src="https://accounts.google.com/gsi/client" async defer></script>
   </head>
   <body style="margin:0;">
     <div id="root"></div>
     <script>
       /* conteúdo de bundle.js colado aqui */
     </script>
   </body>
   </html>
   ```
6. Esse HTML final é o que sobe pro GitHub, sempre com o nome `index.html`, na raiz
   do repositório (não numa subpasta), pra o GitHub Pages conseguir publicar.

## Como o app se conecta com o Google Sheets

- O app usa o **Google Identity Services** pra pedir login (OAuth2) direto no
  navegador, sem precisar de servidor. O identificador do app nesse processo é o
  **Client ID**: `916443066549-qj84og3gajuru9734bgjgd207rfs3l6e.apps.googleusercontent.com`
  (não é secreto — é normal esse código aparecer no código-fonte de apps que rodam no navegador).
- Depois de logada, a pessoa recebe um "token" temporário (válido por ~1h, renovado
  automaticamente pelo app) que autoriza a leitura e escrita numa planilha específica,
  usando a **Google Sheets API (v4)** diretamente via `fetch`.
- A planilha usada é fixa no código, identificada pelo seu ID:
  `1-1H2_kpa624M7v7Sfs3e8F2488gjMrrJ1D898CTHa9U`.
- Cada "tipo de dado" do app fica numa **aba separada** dentro dessa planilha, com o
  mesmo nome: `Caminhoes, Viagens, Vales, Boletos, Empresas, Fechamentos,
  DespesasVeiculo, TaxasPool, Motoristas, Contas, TrocasOleo, ServicosVeiculo,
  SemParar, Seguro, SemPararOutros, Config`.
- Quando algo é salvo, o app identifica **só a aba que realmente mudou** e reescreve
  apenas ela (não a planilha toda) — isso foi uma correção importante feita depois de
  um incidente em que uma gravação parcial deixou abas vazias.
- Quem tem acesso aos dados é controlado pelo **compartilhamento da planilha no
  Google Drive**, não pelo Client ID.

## Onde guardar isso no GitHub

Sugestão: dentro do mesmo repositório `controle-viagens`, uma pasta chamada
`source/` com estes três arquivos. O `index.html` publicado continua sozinho na raiz
do repositório — o GitHub Pages só usa o que está na raiz.
