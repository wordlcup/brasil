// =====================================================
// ADMIN LOGIC
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  renderAdminPlayers();
  document.getElementById('processRoundBtn').addEventListener('click', processRound);
  loadAdminTeams();
});

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
