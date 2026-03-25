# TV corporativa online

Projeto simples para exibir um video em loop nas TVs da empresa usando um unico link hospedado na Vercel.

## Como funciona

1. As TVs acessam uma unica URL da Vercel.
2. A pagina carrega o video definido em `config.json`.
3. A cada intervalo configurado, a pagina verifica se o `config.json` mudou.
4. Quando voce troca o video no GitHub e a Vercel faz novo deploy, as TVs atualizam sozinhas.

## Estrutura

- `index.html`: pagina principal da TV.
- `app.js`: carrega o `config.json`, toca o video e verifica atualizacoes.
- `config.json`: define qual video sera exibido.
- `videos/`: pasta onde voce coloca os arquivos `.mp4`.

## Como trocar o video

1. Coloque o novo video dentro da pasta `videos/`.
2. Atualize `config.json` com:
   - `videoUrl`: caminho do novo arquivo.
   - `version`: altere esse valor sempre que trocar o video.
3. Faça `git add .`
4. Faça `git commit -m "Atualiza video da TV"`
5. Faça `git push`

Depois disso, a Vercel faz o deploy automaticamente e as TVs vao puxar a nova configuracao.

## Sugestao de uso

- Deixe as TVs abrindo a URL em modo navegador fullscreen.
- Prefira videos `.mp4` com codec H.264 para maior compatibilidade.
- Se a TV tiver opcao de iniciar navegador automatico ao ligar, configure isso.

## Passo a passo GitHub + Vercel

1. Crie um repositorio no GitHub.
2. Envie estes arquivos para esse repositorio.
3. Crie uma conta na Vercel e importe o repositorio.
4. A Vercel vai gerar uma URL publica, por exemplo:

`https://sua-tv-corporativa.vercel.app`

5. Abra essa URL nas TVs.

## Observacao importante

Este repositorio nao inclui um video real por padrao. Antes do primeiro deploy, crie a pasta `videos/` e adicione o arquivo usado em `config.json`, por exemplo:

`videos/video-semana.mp4`
