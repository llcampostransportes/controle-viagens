# Controle de Viagens — Código-fonte

Este é o código-fonte legível do app "Controle de Viagens" (L. L. Campos Transportes).
O arquivo que roda de verdade no GitHub Pages (`index.html`) é gerado **a partir destes
arquivos**, empacotado (minificado) num único `.html`. Este README explica como tudo
se encaixa, o que o app já faz hoje, e como retomar o desenvolvimento numa conversa nova
com o Claude caso esta aqui não possa mais continuar.

**Versão atual:** v2026.07.05-120

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
- **Correção do dígito verificador na leitura do código de barras**: a
  FEBRABAN mudou a fórmula da data de vencimento em fevereiro de 2025 (a
  data-base antiga estourou o limite); corrigido pra nova regra. Além disso,
  o app agora confere o "dígito verificador" (o mesmo cálculo que os bancos
  fazem) antes de aceitar uma leitura da câmera, evitando salvar um código
  que o banco recusaria depois.
- **Linha digitável, não só código de barras**: ao escanear um boleto, o app
  gera e guarda a linha digitável (os 47 números com pontinhos, formato que
  os apps de banco esperam pra "colar e pagar"), além do código de barras
  cru. Tem também uma opção de **digitar a linha manualmente** quando a
  câmera não conseguir ler (comum em boleto com dobra, papel curvado, ou
  código de barras pequeno na tela).
- **Dashboard — clicar num caminhão abre o Relatório mensal detalhado**: em
  vez de ir pra Viagens, agora abre direto o relatório daquela placa, com uma
  seta "← Voltar" no topo pra retornar ao Dashboard, e um link "ver todos os
  caminhões" pra trocar sem fechar tudo.
- **Dashboard com período flexível**: antes só dava pra escolher um mês
  fechado; agora tem o mesmo dropdown de período das outras telas (Hoje,
  Esta semana, Este mês, Tudo, ou um intervalo escolhido).
- **Foto do caminhão com compressão progressiva**: se a primeira compressão
  ainda ficar grande demais pra uma célula da planilha (o que dependia muito
  do quanto de detalhe a foto tinha), o app agora tenta de novo com menos
  qualidade/tamanho, em vez de travar salvando sempre a mesma foto grande
  demais.
- **Upload de documento pro Google Drive**: fotos/PDFs de documento anual
  (CRLV) agora sobem pro Google Drive da própria pessoa (numa pasta que o
  app cria sozinho) em vez de tentar caber na célula da planilha — sem
  limite de tamanho. Precisa de uma permissão adicional (`drive.file`) da
  conta Google, só de arquivos criados pelo próprio app.
- **IPVA (cavalo) separado de Taxa de licenciamento (carreta)**: cada um com
  seu próprio texto e alerta, já que carreta não paga IPVA de verdade.
- **Placa editável**: em Configurações → Caminhões/Carretas, dá pra corrigir
  a placa direto ali, sem afetar nenhum dado já lançado (o sistema liga tudo
  por um ID interno, não pela placa).
- **Campos de CRLV/documentação nas Carretas também**: RENAVAM, chassi,
  **CRV**, ano fabricação/modelo, cor, categoria, município, UF — numa seção
  própria (sem foto do veículo, já que carreta não precisa).
- **Correção automática de ano digitado errado**: em todos os campos de
  data do sistema, se a pessoa digitar só os 2 últimos dígitos do ano (ex:
  "26" em vez de "2026"), o sistema completa sozinho pro ano certo.
- **Relatório de Recebimento — período padrão corrigido**: antes vinha só
  com "hoje"; agora vem do início do mês até hoje, evitando que um
  recebimento de outro dia pareça estar "faltando" no relatório.
- **Sino de alertas dividido em dois**: 🛢️ troca de óleo tem indicador
  próprio, separado do 🔔 resto dos alertas (documentos, IPVA/licenciamento,
  comissão e frete sem valor).

- **Correção do leitor de código de barras**: o leitor de câmera precisava de
  uma segunda biblioteca (`@zxing/browser`, separada da `@zxing/library`) que
  não estava sendo carregada — corrigido, agora o leitor funciona de verdade.
- **Correção automática de ano digitado errado**: em todos os 34 campos de
  data do sistema, se a pessoa digitar só os 2 últimos dígitos do ano (ex:
  "26" em vez de "2026") e isso acabar salvando como "0026", o sistema já
  corrige sozinho pro ano certo (20XX) assim que o campo muda.
- **Relatório de Recebimento — período padrão corrigido**: antes vinha com
  "De" e "Até" iguais a hoje, então um saldo/adiantamento recebido em outro
  dia não aparecia até a pessoa alargar o filtro manualmente. Agora o padrão
  é do início do mês até hoje.
- **Dashboard — "maior rendimento" em vez de "maior faturamento"**: o cartão
  de destaque agora ranqueia pelo líquido (receita menos comissão,
  carregamento, abastecimento, gastos e despesas do veículo), não pelo
  faturamento bruto — e mostra a foto do caminhão bem grande.
- **Upload do documento anual pro Google Drive**: em vez de guardar a
  foto/PDF direto na célula da planilha (que tem limite de tamanho), agora
  sobe pro Google Drive da própria pessoa (numa pasta criada automaticamente
  pelo app) e guarda só o link — sem limite de tamanho pra anexar. Precisa de
  uma permissão adicional (`drive.file`, só arquivos criados pelo próprio
  app) da conta Google.
- **Placa editável**: em Configurações → Caminhões/Carretas, a placa agora
  pode ser corrigida direto ali (útil pra digitação errada). Como o sistema
  usa um ID interno pra ligar os dados, mudar a placa não afeta nada mais.
- **Taxa de licenciamento (carreta) separada de IPVA (cavalo)**: como carreta
  não paga IPVA, o texto e o alerta ficaram certos — "taxa de licenciamento"
  pra carreta, "IPVA" pra cavalo — cada um com seu próprio aviso no sino.
- **Sino de alertas dividido em dois**: 🛢️ troca de óleo tem seu próprio
  indicador, separado do 🔔 resto dos alertas (documentos, IPVA/licenciamento,
  comissão e frete sem valor) — pra não ficar escondido entre os avisos
  administrativos.
- **Leitor de código de barras também em "+ Lançar boleto"**: antes só
  funcionava editando um boleto já existente; agora cada boleto dentro da
  tela de "novo lançamento" (que divide nota em parcelas) também tem seu
  próprio botão de leitor.

- **IPVA marcado por ano** (separado do documento): em Configurações →
  Caminhões/Carretas, um botão "Marcar pago"/"Desmarcar" pra registrar se o
  IPVA do ano atual já foi pago — separado de ter o documento (CRLV) anexado,
  já que às vezes o IPVA já saiu mas o CRLV do ano ainda não chegou. Vira um
  alerta próprio no sino, distinto do alerta de documento não anexado.

- **Anexar documento anual do caminhão e da carreta (CRLV)**: em
  Configurações → Caminhões (e agora também Carretas, numa seção própria, sem
  precisar de foto do veículo), dá pra anexar uma foto **ou um PDF** do
  documento pago de cada ano, e preencher RENAVAM, chassi, **CRV**, ano
  fabricação/modelo, cor, categoria, município e UF. O sino de alertas avisa
  sozinho, sem precisar lembrar de nenhuma data, se o **ano atual** ainda não
  tiver documento anexado pra alguma placa (cavalo ou carreta). Fica um
  histórico dos anos anteriores também, com link pra ver o arquivo de cada um.
- **PDFs modernizados**: cabeçalhos de tabela padronizados no azul novo do
  sistema (#2563EB), com uma barrinha colorida de destaque abaixo do título
  de cada relatório — vale pra todos os PDFs (relatório mensal, boletos,
  recebimento, abastecimentos, troca de óleo, sem parar, seguro, e as listas
  de a receber/recebido/comissão).

- **Dashboard** (novo, na barra lateral): visão geral da frota por mês — cartão
  por caminhão (foto, viagens, abastecimento, receita, rendimento), destaques
  de "maior faturamento" e "menor gasto de abastecimento" (com foto grande do
  caminhão), e totais gerais. Clicar num caminhão leva direto pra Viagens
  filtrado naquela placa.
- **Leitor de código de barras de boleto** (câmera): no formulário de boleto,
  um botão "📷 Ler código de barras" abre a câmera (usa a biblioteca ZXing,
  carregada na hora, sem precisar de servidor) e, ao apontar pro código de
  barras de um boleto bancário, preenche sozinho o **valor** e a **data de
  vencimento** — só falta preencher a empresa. Guarda o código completo no
  boleto. Não funciona pra decodificar valor/vencimento de boleto de
  concessionária/convênio (formato diferente), mas ainda guarda o código lido.
- **Caminhões com foto, modelo e documentação**: em Configurações → Caminhões,
  cada placa pode ter foto (upload com redimensionamento automático), modelo, e
  campos de CRLV/documentação (RENAVAM, chassi, ano fabricação/modelo, cor,
  combustível, categoria, município, UF) — útil pra emitir multa ou conferir
  dado do veículo sem precisar do papel. O modal de Configurações virou um
  acordeão (Geral / Seguradoras / Caminhões), abrindo uma seção de cada vez.
- **Repaginada visual completa**: o app deixou o tema escuro antigo e ganhou
  uma cara mais atual — fonte Inter em tudo (números com dígitos tabulares,
  pra ficar alinhados em colunas de valores), cabeçalho claro com a logo solta
  (sem caixinha), barra de navegação vertical (logo, abas, Relatórios,
  Configurações, Salvar/Atualizar/Backup, e um botão "Sair" que avisa se tiver
  algo não salvo antes de desconectar), bordas mais arredondadas em tudo,
  cartões de estatística com degradê sutil e ícone, badges de status em
  pílula colorida, e destaque ao passar o mouse/tocar nas linhas de lista.
- **Sino de alertas** (no cabeçalho): consolida os avisos de troca de óleo,
  comissão sem valor e frete sem valor num só ícone com contador (🔔 X
  alertas), abrindo um painel com os detalhes ao clicar — a tela principal não
  fica mais cheia de faixas de aviso.
- **Filtros consolidados numa única linha** (Viagens, Boletos, Abastecimentos,
  Sem Parar, Seguro): cada tela tem uma barra só com os filtros relevantes
  (caminhão/empresa, período — com atalhos Hoje/Esta semana/Este mês/Tudo
  dentro do mesmo campo dropdown —, status/posto, e busca por texto).
- **Perfil do caminhão** (Abastecimentos): ao selecionar uma placa, mostra
  foto, KM atual, último abastecimento, consumo médio (km/l), gasto no mês,
  gráfico de consumo e histórico completo daquela placa.
- **Correção na fórmula da comissão**: o carregamento (troca de motorista) é
  descontado do valor final da comissão (depois de aplicar o percentual), não
  do valor base antes de calcular — e agora também entra como despesa própria
  no relatório mensal e no Dashboard.
- **Carregamento (troca de motorista)**: campo pra escolher qual motorista
  recebeu esse valor — gera reembolso automático pra ele na tela de Comissão,
  igual gastos extras e abastecimentos marcados "motorista pagou do próprio
  bolso".
- **Comissão já paga fora do sistema**: viagens antigas (cuja comissão já foi
  paga por fora) entram no relatório mensal normalmente, mas não aparecem
  como "a receber" de nenhum motorista.
- **Baixas parciais em boletos**: cada boleto pode ter várias baixas ao longo
  do tempo (ex: vale adiantado), com data, valor e observação — o
  relatório/PDF/CSV já descontam do total.
- **Busca de boletos mais completa**: busca por empresa, descrição,
  observação e nota fiscal.
- **Relatório de Recebimento** (novo): filtra por período e caminhão, mostra
  todos os contratos recebidos, com exportação em PDF.
- **Unificar postos com nome parecido**: ferramenta manual pra corrigir postos
  duplicados nos abastecimentos e gastos extras já lançados.
- **Correção em campos de KM**: os campos de KM ignoram ponto e vírgula
  digitados sem querer.

- **Repaginada visual completa**: o app deixou o tema escuro antigo e ganhou
  uma cara mais atual — cabeçalho claro, barra de navegação vertical (logo,
  abas de Viagens/Boletos/Abastecimentos/Troca de Óleo/Sem Parar/Seguro,
  seção de Relatórios, Configurações, Salvar/Atualizar/Backup e um botão
  "Sair" no final, que avisa se tiver algo não salvo antes de desconectar da
  conta Google).
- **Filtros consolidados numa única linha** (Viagens, Boletos e
  Abastecimentos): cada tela tem uma barra só com os filtros relevantes
  (caminhão/empresa, período — com atalhos Hoje/Esta semana/Este mês/Tudo
  dentro do mesmo campo dropdown —, status/posto, e uma busca por texto),
  em vez de coluna lateral ou campos espalhados. Em Boletos, o campo
  "Empresa" é um dropdown com busca e categorias, e tem um atalho pra
  "gerenciar empresas" (renomear, mudar categoria, ou marcar como "não
  aparece no relatório de boletos a pagar").
- **Cartões modernizados**: lista de viagens e cartões de troca de óleo com
  visual mais limpo — badge de status em pílula colorida (verde/amarelo/
  vermelho), ícones (📅 data, 📍 rota, 👤 motorista), barra de progresso de km
  até a próxima troca de óleo, e aviso "⚠️ Atenção" quando faltar 1.000 km ou
  menos pra trocar (além do aviso de "precisa trocar" quando já passou).
- **Perfil do caminhão** (Abastecimentos): cada placa cadastrada pode ter foto
  (upload direto, redimensionada automaticamente) e modelo, ajustáveis em
  Configurações → Caminhões. Ao selecionar uma placa em Abastecimentos, mostra
  um cartão com foto, KM atual, último abastecimento, consumo médio (km/l,
  calculado entre reabastecimentos de diesel), gasto no mês, um gráfico de
  consumo e o histórico completo daquela placa. Quando uma placa é selecionada
  em Viagens, o mesmo cartão de foto + modelo aparece no topo.
- **Correção na fórmula da comissão**: o carregamento (troca de motorista) é
  descontado do valor final da comissão (depois de aplicar o percentual), não
  do valor base antes de calcular — e agora também entra como despesa própria
  no relatório mensal, que antes não contabilizava esse valor em lugar nenhum.
- **Carregamento (troca de motorista)**: tem um campo pra escolher qual
  motorista recebeu esse valor — gera automaticamente um reembolso pra ele na
  tela de Comissão, igual já acontece com gastos extras e abastecimentos
  marcados "motorista pagou do próprio bolso".
- **Comissão já paga fora do sistema**: viagens antigas (lançadas só pro
  histórico, cuja comissão já foi paga por fora) podem ser marcadas assim —
  entram no relatório mensal normalmente, mas não aparecem como "a receber"
  de nenhum motorista, nem geram reembolso de gasto extra/abastecimento/
  carregamento.
- **Filtro de período na lista de viagens**: Tudo / Este mês / Hoje / Escolher
  mês — o cartão "Recebido" acompanha esse período (o "A Receber" continua
  sempre com o total geral). O cartão de Comissão tem uma opção "Saldo
  devido", somando só o que falta pagar pra cada motorista, e nunca mais
  filtra por placa — sempre mostra todos os motoristas.
- **Correção em campos de KM**: os campos de KM (troca de óleo, KM início/fim
  da viagem, KM do abastecimento) ignoram ponto e vírgula digitados sem
  querer, evitando o erro clássico de "320.186" virar 320 em vez de 320 mil.
- **Baixas parciais em boletos**: cada boleto pode ter várias baixas ao longo
  do tempo (ex: um vale adiantado pro funcionário), cada uma com data, valor e
  observação. O sistema mostra o saldo restante automaticamente, e o
  relatório/PDF/CSV de boletos já descontam as baixas do total.
- **Busca de boletos mais completa**: busca por empresa, descrição,
  observação e nota fiscal — antes só buscava pelo nome da empresa.
- **Relatório de Recebimento** (novo): filtra por período e caminhão, mostra
  todos os contratos recebidos (data da viagem, data recebido, caminhão,
  contrato, empresa, tipo e valor), com exportação em PDF.
- **Unificar postos com nome parecido**: ferramenta manual (você escolhe quais
  grafias são o mesmo lugar) pra corrigir postos duplicados nos abastecimentos
  e gastos extras já lançados — o campo Posto também ganhou autocomplete.
- **⚙️ Configurações**: porcentagem da comissão dos motoristas, km padrão de troca
  de óleo, e **vencimento por seguradora** (dia do mês + se antecipa pra sexta-feira
  quando cai em fim de semana) ficam ajustáveis pela própria Laís. Cada caminhão
  também pode ter seu próprio km de troca de óleo, diferente do padrão, além
  de foto e modelo.
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
  viagem chegar), aparece um aviso no topo do app e a viagem fica visível na
  tela de Comissão, zerada e destacada em vermelho com "⚠️ falta valor", em vez
  de simplesmente não aparecer em lugar nenhum. O mesmo vale pra viagens sem
  valor de frete lançado, que aparecem destacadas em "A Receber".
- **Editar lançamentos**: além de excluir, dá pra editar diretamente troca de
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
- Aviso ao tentar fechar a aba (ou clicar em "Sair") com alterações ainda não
  confirmadas na planilha.
- Relatórios em PDF com visual colorido (cabeçalho colorido, linhas listradas,
  status em cores) — incluindo a correção pra forçar o navegador a realmente
  imprimir essas cores (por padrão ele esconde cor de fundo na impressão).
- Ajustes responsivos gerais pra uso em celular (tabelas com rolagem
  horizontal, campos empilhados, modais que não passam da largura da tela).

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
