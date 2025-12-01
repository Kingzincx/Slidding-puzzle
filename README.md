# Sliding Puzzle – Definitive Edition

  Versão web de um clássico puzzle deslizante (8/35 peças) construída apenas com HTML5, CSS3 e JavaScript Vanilla. Inclui múltiplos modos de jogo, mudança
  de temas, música ambiente, ranking local e até um autoresolvedor baseado no algoritmo A*.

  ## Funcionalidades principais

  - Menus animados com mudança dinâmica de secções (`index.html` + `srcs/main.js`).
  - Modo Clássico, Zen e Contra Relógio, cada um com regras, pontuação e música próprios.
  - Seleção de dificuldade 3x3 ou 6x6 (exceto Zen) e contagem decrescente antes do início da partida.
  - Sistema de contas local (registo/login) com persistência em `localStorage` e ranking ordenado por pontuação/tempo (`srcs/user.js`).
  - Três temas completos (default, anime, highschool) que alteram fundos, músicas de jogo e músicas de vitória.
  - Controlo de áudio com slider de volume, botão de pausa e atalho `P`, e reinício rápido do puzzle.
  - Autoresolvedor 3x3 com animação dos passos, suportado por A* e heurística de distância de Manhattan (`srcs/autosolve.js`).
  - Interface responsiva com estilos separados (`styles/*.css`) para facilitar personalização.

  ## Estrutura do projeto
  .
  ├── index.html
  ├── audios/              # Trilhas de jogo e vitória por tema + playlist Zen
  ├── imagens/             # GIFs de fundo para cada tema
  ├── styles/              # CSS modular (menu, jogo, tiles, áudio, etc.)
  ├── srcs/
  │   ├── main.js          # Gestão de estado global e temas
  │   ├── user.js          # Registo/login, ranking e storage
  │   ├── game_setup.js    # Seleção de modo/dificuldade e arranque do jogo
  │   ├── puzzle.js        # Geração, renderização e validação do puzzle
  │   ├── game_play.js     # Movimentos, pontuação, vitória e timers
  │   ├── utilities.js     # Funções utilitárias (formatos, pausa, saída)
  │   └── autosolve.js     # Autoresolvedor A*, modo Zen e helpers
  └── docs/README.docx     # Documento original em processamento de texto


  ## Como executar

  1. Garante que tens um navegador moderno (Chrome, Edge, Firefox ou similar).
  2. Faz download/clona o repositório e mantém a estrutura de pastas.
  3. Abre `index.html` diretamente no navegador (duplo clique ou `Open File`).
  4. Autoriza o uso de áudio se o navegador solicitar.

  > Não há dependências externas nem servidor – tudo corre no lado do cliente.

  ## Como jogar

  1. **Menu Principal**: escolhe Jogar, Opções ou Sair.
  2. **Jogar**: decide se queres jogar como convidado, iniciar sessão ou registar nova conta.
  3. **Modo/Dificuldade**:
     - Clássico ou Contra Relógio: seleciona entre 3x3 (fácil) e 6x6 (difícil).
     - Zen: arranca diretamente num loop infinito 3x3 sem pontuação.
  4. **Countdown**: aguarda a contagem de 3 segundos antes do puzzle ser apresentado.
  5. **Movimentos**: clica numa peça adjacente ao espaço vazio para a mover. No clássico cada movimento reduz 10 pontos, no Zen não há pontuação e no Contra
  Relógio tens 2m50s para completar o máximo de puzzles.
  6. **Pausa/Retomar**: usa o botão Pausar ou a tecla `P`. O menu de pausa permite retomar ou voltar ao menu inicial.
  7. **Autoresolvedor**: no modo 3x3 pressiona o botão “Autoresolver” para ver a solução animada.
  8. **Vitória**: observa as estatísticas (tempo, pontuação ou nº de puzzles) e decide se queres recomeçar ou regressar ao menu.

  ## Modos de jogo

  - **Modo Clássico**: foco em eficiência; o objetivo é terminar com a melhor pontuação possível. Ideal para competir no ranking.
  - **Modo Zen**: sem cronómetro nem pontuação; após completar um puzzle, outro é gerado automaticamente enquanto a playlist zen continua em loop.
  - **Modo Contra Relógio**: cronómetro regressivo de 170 segundos. Conta quantos puzzles completas antes de o tempo expirar.

  ## Sistema de contas e ranking

  - Todos os dados residem em `localStorage`, pelo que permanecem apenas no navegador do utilizador.
  - O registo guarda `username`, `password` (texto simples para fins académicos/demonstração), `highScore` e `time`.
  - O ranking ignora o tema e o convidado, ordenando pela maior pontuação e, em caso de empate, pelo menor tempo. No modo Contra Relógio regista-se o número
  de puzzles completos.

  ## Temas, áudio e acessibilidade

  - Temas disponíveis: `default`, `anime`, `highschool`. Alteram o GIF de fundo, a música principal e a música de vitória.
  - Slider de volume controla tanto a música de fundo como a playlist Zen; o valor é guardado entre sessões.
  - Botão “Limpar Dados” apaga todo o conteúdo de `localStorage` (temas, contas e ranking).
  - Os botões possuem etiquetas claras e o jogo aceita interações por teclado (atalho de pausa) além do rato.

  ## Autoresolvedor

  - Disponível apenas para puzzles 3x3 para garantir boa performance.
  - Implementação com algoritmo A* (`srcs/autosolve.js`), heurística de Manhattan e reconstrução do caminho para animar os movimentos.
  - Útil para estudo de algoritmos ou para desbloquear puzzles impossíveis gerados manualmente.
  ---
