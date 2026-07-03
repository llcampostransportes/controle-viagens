# Controle de Viagens — Código-fonte

Este é o código-fonte legível do app "Controle de Viagens" (L. L. Campos Transportes).
O arquivo que roda de verdade no GitHub Pages (`index.html`) é gerado **a partir destes
arquivos**, empacotado (minificado) num único `.html`. Este README explica como tudo
se encaixa, caso você (ou outro desenvolvedor) precise mexer no código no futuro.

## Arquivos deste pacote

| Arquivo                  | O que é                                                             |
|---------------------------|----------------------------------------------------------------------|
| `entry-sheets.jsx`         | Ponto de entrada. Só monta o app React na página.                   |
| `app-sheets-source.jsx`    | **O código de verdade.** Todos os componentes, telas, cálculos e a integração com o Google Sheets estão neste único arquivo (é grande, mas é tudo que existe). |
| `README.md`                | Este arquivo.                                                       |

Não existe CSS separado — todo o estilo visual está embutido dentro do próprio
`app-sheets-source.jsx`, usando o estilo nativo do React (`style={{...}}`), mais um
pequeno bloco `<style>` (dentro do próprio JSX) que importa as fontes do Google e
define a regra de impressão dos relatórios em PDF.

## Dependências / bibliotecas usadas

- **React 19** e **React DOM 19** — framework da interface.
- **Google Identity Services** (`https://accounts.google.com/gsi/client`) — carregado
  por um `<script>` direto no HTML final, não é um pacote instalado. É o que faz o
  login com Google funcionar.
- Nenhuma outra biblioteca externa (sem Tailwind, sem Bootstrap, sem banco de dados).

Não existe um `package.json` nem uma pasta `node_modules` neste pacote — o projeto
não tem um "ambiente de projeto" tradicional configurado. Ele foi escrito e
empacotado manualmente.

## Como o `index.html` final é gerado

O arquivo publicado no GitHub Pages é o resultado de "empacotar" (bundle) esses dois
arquivos `.jsx` num único arquivo JavaScript, e depois colar esse resultado dentro de
um HTML simples. Isso foi feito usando a ferramenta **esbuild**. Se um desenvolvedor
precisar refazer esse processo no futuro, os passos são:

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

Em poucas linhas:

- O app usa o **Google Identity Services** pra pedir login (OAuth2) direto no
  navegador, sem precisar de servidor. O identificador do app nesse processo é o
  **Client ID**: `916443066549-qj84og3gajuru9734bgjgd207rfs3l6e.apps.googleusercontent.com`
  (não é secreto — é normal esse código aparecer no código-fonte de apps que rodam no navegador).
- Depois de logada, a pessoa recebe um "token" temporário que autoriza o app a ler e
  escrever numa planilha específica, usando a **Google Sheets API (v4)** diretamente
  via `fetch` (sem biblioteca extra).
- A planilha usada é fixa no código, identificada pelo seu ID:
  `1-1H2_kpa624M7v7Sfs3e8F2488gjMrrJ1D898CTHa9U`.
- Cada "tipo de dado" do app (caminhões, viagens, vales, boletos, empresas,
  fechamentos, despesas do veículo, taxas, motoristas, contas bancárias) fica numa
  **aba separada** dentro dessa planilha, com o mesmo nome (ex: aba "Boletos", aba
  "Vales").
- Quando você salva algo no app, ele reescreve a aba inteira correspondente
  (apaga tudo e escreve de novo com os dados atualizados) — é simples e evita
  inconsistência, mas significa que duas pessoas salvando ao mesmo tempo podem, em
  teoria, sobrescrever uma a outra (é raro acontecer no uso normal, mas vale saber).
- Quem tem acesso aos dados é controlado pelo **compartilhamento da planilha no
  Google Drive**, não pelo Client ID — é por isso que só você e seu esposo, com o
  e-mail liberado como editor, conseguem usar.

## Onde guardar isso no GitHub

Sugestão: dentro do mesmo repositório `controle-viagens`, crie uma pasta nova
chamada `source/` (ou `codigo-fonte/`) e coloque estes três arquivos lá dentro.
O `index.html` publicado continua sozinho na raiz do repositório — o GitHub Pages
só usa o que está na raiz, então a pasta `source/` fica só guardada, sem interferir
em nada do que já funciona.
