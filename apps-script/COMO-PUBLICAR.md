# Como colocar a planilha no ar

Passo a passo pra você (Johni) criar a planilha, publicar o Apps Script e me passar a URL. Depois
disso eu termino a configuração no app.

## 1. Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha nova.
2. Renomeie para algo como "Lá Na Cabaninha — Banco de Dados".
3. Crie **5 abas** (clique no `+` no rodapé), com estes nomes EXATOS (maiúsculas/minúsculas
   importam):
   - `Eventos`
   - `Financeiro`
   - `Fornecedores`
   - `Estoque`
   - `Usuarios`

## 2. Colunas de cada aba

Na **linha 1** de cada aba, cole os cabeçalhos abaixo (uma coluna por célula, começando na
coluna A). A ordem não importa muito, mas os **nomes têm que ser exatamente esses**.

**Eventos**
```
id	aniversariante	idade	contatoNome	contatoTelefone	contatoEmail	endereco	data	horario	tema	caminho	colecaoId	corFavorita	corNaoGosta	naoPodeFaltar	responsavelMontagem	horarioRecreacao	horarioSpa	observacoes	checklist	contratoAceito	contratoAceitoEm	cpfContratante	rgContratante	quantidadeCabanas	valorContrato	formaPagamento	itensAlugados	itensAdicionais
```

**Financeiro**
```
id	descricao	categoria	tipo	valor	data	eventoId	fornecedorId
```

**Fornecedores**
```
id	nome	categoria	contato
```

**Estoque**
```
id	categoria	nome	quantidade	nota
```

**Usuarios** (essa aba não é lida por ninguém além do próprio sistema de login — não aparece em
nenhuma tela do app)
```
email	senha	role
```

Preencha a aba **Usuarios** com estas 2 linhas (pode trocar as senhas depois se quiser, contanto
que me avise ou troque você mesmo direto na planilha):

| email | senha | role |
|---|---|---|
| admin@lanacabaninha.com.br | Cabaninha@2026 | admin |
| equipe@lanacabaninha.com.br | Equipe@2026 | colaborador |

### Importante: formatar colunas como texto simples

Antes de colar dados, selecione as colunas `id`, `data`, `horario`, `contratoAceitoEm` (nas abas
que tiverem) e formate como **Texto simples**: menu `Formatar → Número → Texto simples`. Isso
evita que o Google Sheets "converta" datas ou IDs sozinho e bagunce os dados. Fazer isso em todas
as abas antes de colar qualquer coisa é o mais seguro.

## 3. Popular o Estoque com os itens reais

1. Abra o arquivo [`apps-script/estoque-seed.tsv`](estoque-seed.tsv) (está na pasta do projeto).
2. Selecione todo o conteúdo e copie.
3. Na aba **Estoque** da planilha, clique na célula A1 e cole (`Ctrl+V`). Como é um `.tsv`
   (separado por tabulação), o Google Sheets já distribui cada valor na coluna certa
   automaticamente.
4. Confira se apareceram 222 linhas de itens (mais o cabeçalho na linha 1).

As abas Eventos, Financeiro e Fornecedores ficam **vazias** mesmo — só com o cabeçalho na linha
1. Elas vão se preencher sozinhas conforme você for usando o app.

## 4. Publicar o Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Vai abrir um editor com um arquivo `Código.gs` vazio (ou com um `function myFunction(){}`
   padrão). Apague tudo.
3. Abra o arquivo [`apps-script/Codigo.gs`](Codigo.gs) (está na pasta do projeto), copie o
   conteúdo inteiro e cole no editor do Apps Script.
4. Salve (ícone de disquete ou `Ctrl+S`).
5. Clique em **Implantar → Nova implantação** (canto superior direito).
6. No tipo, clique no ícone de engrenagem e escolha **App da Web**.
7. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
8. Clique em **Implantar**. Ele vai pedir autorização — clique em **Autorizar acesso**, escolha
   sua conta Google e, se aparecer um aviso de "app não verificado", clique em **Avançado → Acessar
   [nome do projeto] (não seguro)** — é normal, é porque é um script seu, não passou por revisão
   do Google (não tem risco, é só um aviso padrão).
9. Depois de implantar, ele mostra uma **URL do app da Web** terminando em `/exec`. Copie essa
   URL inteira.

## 5. Me envie a URL

Me manda essa URL aqui no chat que eu termino a configuração e testamos tudo junto (login,
criar evento, marcar dano, lançamento financeiro) antes de subir pra produção.

**Atenção:** se você editar o código do Apps Script depois (eu mandar alguma correção, por
exemplo), colar o código novo sozinho não atualiza a URL já publicada — é preciso ir em
**Implantar → Gerenciar implantações → editar (ícone de lápis) → Nova versão → Implantar** de
novo.
