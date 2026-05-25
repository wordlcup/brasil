// =====================================================
// ADMIN LOGIC
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof supabase === 'undefined') {
    alert("Supabase não configurado.");
    return;
  }

  // 1. Checa a sessão ao carregar a página
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    showAdminPanel();
  } else {
    // Escuta mudanças de auth para lidar com o login
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) showAdminPanel();
    });
  }

  document.getElementById('processRoundBtn').addEventListener('click', processRound);
});

function showAdminPanel() {
  document.getElementById('adminLoginContainer').style.display = 'none';
  document.getElementById('adminMainContainer').style.display = 'block';

  // Carrega os dados só depois do login
  renderAdminPlayers();
  loadAdminTeams();
  loadAdminMatches();
}

async function loginAdmin() {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (!email || !password) {
    alert("Preencha e-mail e senha.");
    return;
  }

  const btn = document.getElementById('adminLoginBtn');
  btn.disabled = true;
  btn.textContent = "Validando...";

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Erro ao fazer login: " + error.message);
    }
    // Se der sucesso, o evento onAuthStateChange vai mostrar o painel.
  } catch (err) {
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Fazer Login";
  }
}

async function logoutAdmin() {
  await supabase.auth.signOut();
  document.getElementById('adminLoginContainer').style.display = 'block';
  document.getElementById('adminMainContainer').style.display = 'none';
  document.getElementById('adminEmail').value = '';
  document.getElementById('adminPassword').value = '';
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById('section-' + tab).classList.add('active');
}

function logMsg(msg) {
  const logs = document.getElementById('adminLogs');
  logs.innerHTML += `<div>> ${msg}</div>`;
  logs.scrollTop = logs.scrollHeight;
}

function renderAdminPlayers() {
  const list = document.getElementById('adminPlayerList');
  list.innerHTML = '';

  const getPhoto = (player) => {
    const name = player.shortName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return `assets/photos/${name}.jpg`;
  };

  PLAYERS.forEach(player => {
    const item = document.createElement('div');
    item.className = 'admin-player-item';

    item.innerHTML = `
      <div class="mini-avatar" style="border-radius: 50%; overflow: hidden; background: #333;">
        <img src="${getPhoto(player)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E'"/>
      </div>
      <div class="info">
        <div class="name">${player.shortName}</div>
        <div class="pos">${player.positionLabel} · ${player.club}</div>
      </div>
      <input type="number" step="0.1" class="score-input" data-id="${player.id}" placeholder="Pts (ex: 5.5)" />
    `;

    list.appendChild(item);
  });
}

async function processRound() {
  const inputs = document.querySelectorAll('.score-input');
  const scores = {};

  inputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && val !== 0) {
      scores[parseInt(input.dataset.id)] = val;
    }
  });

  if (Object.keys(scores).length === 0) {
    alert("Insira a pontuação de pelo menos um jogador!");
    return;
  }

  const confirmBtn = confirm("Tem certeza? Isso atualizará o ranking geral de times e o dashboard individual de jogadores.");
  if (!confirmBtn) return;

  const btn = document.getElementById('processRoundBtn');
  btn.disabled = true;
  btn.textContent = "Processando...";
  document.getElementById('adminLogs').innerHTML = "";

  logMsg("Buscando times do Supabase...");

  try {
    // 1. Atualiza Pontuação dos JOGADORES (player_stats)
    logMsg("Atualizando banco de dados de jogadores (player_stats)...");

    // Como Supabase não tem um "upsert de incremento" direto fácil via client JS, 
    // a gente puxa os stats atuais e soma.
    const { data: currentStats, error: statFetchError } = await supabase.from('player_stats').select('*');
    if (statFetchError) throw statFetchError;

    const statsMap = {};
    if (currentStats) {
      currentStats.forEach(s => statsMap[s.player_id] = parseFloat(s.total_points || 0));
    }

    const updates = [];
    for (const [playerIdStr, roundScore] of Object.entries(scores)) {
      const pId = parseInt(playerIdStr);
      const currentPoints = statsMap[pId] || 0;
      updates.push({ player_id: pId, total_points: currentPoints + roundScore });
    }

    if (updates.length > 0) {
      const { error: upsertError } = await supabase.from('player_stats').upsert(updates);
      if (upsertError) throw upsertError;
      logMsg(`Dashboard de jogadores atualizado (${updates.length} craques mudaram).`);
    }

    // 2. Atualiza Pontuação dos TIMES
    const { data: teams, error: fetchError } = await supabase.from('teams').select('*');
    if (fetchError) throw fetchError;
    logMsg(`${teams.length} times encontrados.`);

    let updatedCount = 0;

    for (const team of teams) {
      const lineup = team.lineup || [];

      let roundScore = 0;
      lineup.forEach(playerId => {
        if (scores[playerId]) {
          roundScore += scores[playerId];
        }
      });

      if (roundScore > 0) {
        const newTotal = parseFloat(team.total_score || 0) + roundScore;
        logMsg(`Time '${team.team_name}' fez +${roundScore} pts. Total: ${newTotal}`);

        const { error: updateError } = await supabase
          .from('teams')
          .update({ total_score: newTotal })
          .eq('id', team.id);

        if (updateError) {
          logMsg(`Erro ao atualizar time '${team.team_name}': ${updateError.message}`);
        } else {
          updatedCount++;
        }
      }
    }

    logMsg(`Processamento concluído! ${updatedCount} times foram atualizados.`);
    alert(`Sucesso! Rodada processada e painéis atualizados.`);

    inputs.forEach(i => i.value = '');

  } catch (error) {
    console.error(error);
    logMsg(`ERRO FATAL: ${error.message || 'Erro desconhecido'}`);
    alert("Erro ao processar rodada. Veja os logs.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Processar Pontuações da Rodada";
  }
}

async function loadAdminTeams() {
  const tbody = document.getElementById('adminTeamsList');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Carregando times...</td></tr>';

  if (typeof supabase === 'undefined') return;

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhum time cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    data.forEach(team => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: bold;">${team.team_name}</td>
        <td>${team.owner_name}</td>
        <td style="color: var(--text-muted); font-size: 0.9rem;">${team.owner_email || '—'}</td>
        <td style="color: var(--text-muted);">${team.formation}</td>
        <td style="font-weight: bold; color: var(--blue-accent);">${parseFloat(team.total_score).toFixed(1)}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Erro ao carregar times.</td></tr>';
  }
}

// =====================================================
// JOGOS E BOLÃO LOGIC
// =====================================================

async function createMatch() {
  const teamA = document.getElementById('newTeamA').value.trim();
  const teamB = document.getElementById('newTeamB').value.trim();

  if (!teamA || !teamB) {
    alert('Preencha os dois times!');
    return;
  }

  try {
    const { error } = await supabase.from('matches').insert([
      { team_a: teamA, team_b: teamB, status: 'open' }
    ]);
    if (error) throw error;

    document.getElementById('newTeamA').value = '';
    document.getElementById('newTeamB').value = '';
    loadAdminMatches();
    alert('Jogo criado com sucesso!');
  } catch (err) {
    console.error(err);
    alert('Erro ao criar jogo: ' + err.message);
  }
}

async function loadAdminMatches() {
  const openList = document.getElementById('adminMatchesList');
  const closedList = document.getElementById('adminClosedMatchesList');
  openList.innerHTML = '<div style="color:var(--text-muted)">Carregando...</div>';
  closedList.innerHTML = '<div style="color:var(--text-muted)">Carregando...</div>';

  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*, guesses(*, teams(owner_name, owner_email))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    openList.innerHTML = '';
    closedList.innerHTML = '';

    if (!data || data.length === 0) {
      openList.innerHTML = '<div style="color:var(--text-muted)">Nenhum jogo cadastrado.</div>';
      return;
    }

    data.forEach(match => {
      const el = document.createElement('div');
      el.style.background = 'var(--bg-glass-light)';
      el.style.padding = '12px 16px';
      el.style.borderRadius = '8px';
      el.style.border = '1px solid var(--border-subtle)';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.gap = '12px';

      // Renderiza palpites (se houver)
      let guessesHtml = '';
      if (match.guesses && match.guesses.length > 0) {
        guessesHtml = `<div style="margin-top: 8px; font-size: 0.85rem; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
          <strong style="color: var(--text-muted);">Palpites Registrados (${match.guesses.length}):</strong>
          <ul style="list-style: none; padding: 0; margin: 4px 0 0 0; max-height: 150px; overflow-y: auto;">
            ${match.guesses.map(g => `
              <li style="padding: 4px 0; border-bottom: 1px dashed var(--border-subtle);">
                <span style="color: var(--blue-accent); font-weight: bold;">[${g.guess_a} x ${g.guess_b}]</span> - 
                ${g.teams?.owner_name} <span style="color: var(--text-muted); font-size: 0.75rem;">(${g.teams?.owner_email})</span>
                ${match.status === 'closed' ? ` <span style="color: #10b981;">(+${g.points_earned} pts)</span>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>`;
      } else {
        guessesHtml = `<div style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted);">Nenhum palpite ainda.</div>`;
      }

      if (match.status === 'open') {
        el.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 1.1rem;">${match.team_a} x ${match.team_b}</div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="number" id="score_a_${match.id}" placeholder="0" class="score-input" style="width: 50px;">
              <span>X</span>
              <input type="number" id="score_b_${match.id}" placeholder="0" class="score-input" style="width: 50px;">
              <button class="btn btn-sm btn-primary" onclick="closeMatchAndCalculatePoints('${match.id}')">Encerrar e Calcular</button>
            </div>
          </div>
          ${guessesHtml}
        `;
        openList.appendChild(el);
      } else {
        el.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: bold; font-size: 1.1rem;">${match.team_a} <span style="color: var(--blue-accent); font-size: 1.3rem; margin: 0 12px;">${match.score_a} x ${match.score_b}</span> ${match.team_b}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); background: var(--bg-primary); padding: 4px 8px; border-radius: 4px;">Encerrado</div>
          </div>
          ${guessesHtml}
        `;
        closedList.appendChild(el);
      }
    });

  } catch (err) {
    console.error(err);
  }
}

async function closeMatchAndCalculatePoints(matchId) {
  const scoreA = parseInt(document.getElementById(`score_a_${matchId}`).value);
  const scoreB = parseInt(document.getElementById(`score_b_${matchId}`).value);

  if (isNaN(scoreA) || isNaN(scoreB)) {
    alert('Preencha o placar oficial antes de encerrar o jogo.');
    return;
  }

  if (!confirm(`Confirmar encerramento com placar: ${scoreA} x ${scoreB}? Os pontos serão calculados e distribuídos.`)) return;

  try {
    // 1. Atualizar o match para fechado e salvar o placar real
    const { error: matchError } = await supabase
      .from('matches')
      .update({ score_a: scoreA, score_b: scoreB, status: 'closed' })
      .eq('id', matchId);

    if (matchError) throw matchError;

    // 2. Buscar palpites deste jogo
    const { data: guesses, error: guessesError } = await supabase
      .from('guesses')
      .select('*')
      .eq('match_id', matchId);

    if (guessesError) throw guessesError;

    let totalPointsAwarded = 0;
    const teamPointsMap = {}; // para acumular pontos por time se quisermos dar batch update

    // 3. Avaliar pontuação e fazer update na tabela de guesses
    for (const guess of guesses) {
      let points = 0;
      // Acertou na mosca
      if (guess.guess_a === scoreA && guess.guess_b === scoreB) {
        points = 5;
      } else {
        // Acertou o vencedor ou se foi empate
        const realDiff = scoreA - scoreB;
        const guessDiff = guess.guess_a - guess.guess_b;

        // Se ambos forem > 0 (A venceu), ambos < 0 (B venceu), ou ambos == 0 (empate)
        if (Math.sign(realDiff) === Math.sign(guessDiff)) {
          points = 1;
        }
      }

      if (points > 0) {
        totalPointsAwarded += points;
        teamPointsMap[guess.team_id] = (teamPointsMap[guess.team_id] || 0) + points;

        // Salva pontos ganhos no próprio palpite para histórico
        await supabase
          .from('guesses')
          .update({ points_earned: points })
          .eq('id', guess.id);
      }
    }

    // 4. Somar os pontos aos totais dos times no Cartola
    // Opcional: Para evitar ler e escrever um a um, poderiamos puxar todos os times afetados, somar e dar update.
    for (const [teamId, pts] of Object.entries(teamPointsMap)) {
      const { data: teamData, error: teamFetchError } = await supabase
        .from('teams')
        .select('total_score')
        .eq('id', teamId)
        .single();

      if (!teamFetchError && teamData) {
        const novoTotal = parseFloat(teamData.total_score || 0) + pts;
        await supabase
          .from('teams')
          .update({ total_score: novoTotal })
          .eq('id', teamId);
      }
    }

    alert(`Jogo encerrado com sucesso!\nForam distribuídos um total de ${totalPointsAwarded} pontos para os usuários baseados nos palpites.`);
    loadAdminMatches();
    loadAdminTeams(); // recarrega a tabela de times para mostrar novos totais
  } catch (err) {
    console.error(err);
    alert('Erro ao calcular pontos: ' + err.message);
  }
}

// =====================================================
// INTEGRAÇÃO COM RAPIDAPI (Free API Live Football Data)
// =====================================================

async function searchPlayerAPI() {
  const query = document.getElementById('apiSearchName').value.trim();
  const resultsContainer = document.getElementById('apiResults');

  if (!query) {
    alert('Digite o nome de um jogador para buscar!');
    return;
  }

  resultsContainer.innerHTML = '<div style="color: var(--text-muted); padding: 12px;">Buscando na RapidAPI... ⏳</div>';

  // Nota: O Host exato depende de qual API gratuita você assinou no RapidAPI.
  // Baseado no seu JSON, este costuma ser o endpoint padrão de busca.
  const url = `https://free-api-live-football-data.p.rapidapi.com/football-get-search-all?search=${encodeURIComponent(query)}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e7860bf2f5msh300f8f2a345c9cbp178791jsn70ebfd950088',
      'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.response && data.response.suggestions) {
      // Filtra apenas os resultados que são do tipo "player"
      const players = data.response.suggestions.filter(item => item.type === 'player');

      if (players.length === 0) {
        resultsContainer.innerHTML = '<div style="color: #f87171; padding: 12px;">Nenhum jogador encontrado com esse nome.</div>';
        return;
      }

      resultsContainer.innerHTML = players.map(p => `
        <div style="background: var(--bg-glass-light); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-primary);">${p.name}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Clube: ${p.teamName}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">ID Oficial da API</div>
            <div style="font-family: monospace; font-size: 1.2rem; color: var(--primary); font-weight: bold;">${p.id}</div>
          </div>
        </div>
      `).join('');
    } else {
      resultsContainer.innerHTML = '<div style="color: #f87171; padding: 12px;">Resposta inesperada da API. Verifique o console.</div>';
      console.log(data);
    }
  } catch (err) {
    console.error('Erro na API:', err);
    resultsContainer.innerHTML = `<div style="color: #f87171; padding: 12px;">Erro de conexão: ${err.message}</div>`;
  }
}
