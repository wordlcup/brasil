# ⚽ Copa 2026 Brasil — Team Builder & Bolão

Este é um projeto interativo voltado para torcedores da Seleção Brasileira para a Copa do Mundo de 2026. A aplicação permite escalar jogadores em diferentes formações táticas, calcular a força coletiva do time, salvar a escalação em um ranking global e participar de um sistema de palpites (bolão).

## 🚀 Funcionalidades

- **Campo Interativo (SVG):** Arraste e solte (Drag and Drop) os jogadores diretamente no campo ou selecione as posições para ver os atletas compatíveis.
- **Formações Táticas:** Suporte para 4-3-3, 4-4-2, 3-5-2, 4-2-3-1 e 4-1-4-1.
- **Cálculo de Força Coletiva:** Algoritmo que calcula o *rating* do time baseado nos atributos individuais dos jogadores, bônus de entrosamento por clube e preenchimento de posições.
- **Integração com Supabase:**
    - **Ranking Global:** Salve seu time e compita pelo topo do ranking de pontuação.
    - **Autenticação Simples:** Sistema de login por e-mail e senha para gerenciar seu time e palpites.
    - **Bolão (Betting):** Seção para dar palpites em jogos reais e acumular pontos.
- **Painel Administrativo:** Interface exclusiva para gerenciamento de jogos, encerramento de partidas e distribuição automática de pontos para os usuários.
- **Compartilhamento:** Gere links exclusivos da sua escalação para compartilhar no WhatsApp ou redes sociais.
- **Design Responsivo:** Interface moderna inspirada em cards de jogos de futebol (estilo FIFA/FC), totalmente adaptada para dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Design System customizado), JavaScript Vanila.
- **Gráficos:** SVG Dinâmico para renderização do campo.
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth).
- **Ícones/Fontes:** Google Fonts (Outfit & Inter).

## 📂 Estrutura do Projeto

- `js/app.js`: Lógica principal da aplicação, navegação e integração com o campo.
- `js/players.js`: Banco de dados estático dos jogadores e lógica do algoritmo de força.
- `js/admin.js`: Funcionalidades do painel de administração e processamento de rodadas.
- `js/supabase.js`: Configuração do cliente Supabase (necessário configurar suas chaves).
- `css/style.css`: Sistema de design, animações e layout responsivo.

## ⚙️ Configuração

Para rodar o projeto localmente e utilizar as funções de banco de dados, você deve:

1. Criar um projeto no **Supabase**.
2. Criar as tabelas `teams`, `matches`, `guesses` e `player_stats`.
3. Configurar suas credenciais no arquivo `js/supabase.js`:
   ```javascript
   const SUPABASE_URL = 'SUA_URL';
   const SUPABASE_KEY = 'SUA_KEY';
   ```

## 📄 Licença

Este projeto é para fins de estudo e entretenimento.

---
Desenvolvido com 💚 para a torcida brasileira! 🇧🇷🏆

*Veja o projeto online*