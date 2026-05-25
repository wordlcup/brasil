// =====================================================
// ADMIN LOGIC (Processar Rodada)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  renderAdminPlayers();

  document.getElementById('processRoundBtn').addEventListener('click', processRound);
});

function logMsg(msg) {
  const logs = document.getElementById('adminLogs');
  logs.innerHTML += `<div>> ${msg}</div>`;
  logs.scrollTop = logs.scrollHeight;
}

function renderAdminPlayers() {
  const list = document.getElementById('adminPlayerList');
  list.innerHTML = '';

  // Usamos a função getPlayerPhoto global definida em app.js, 
  // porém como admin.html não carrega app.js, precisamos replicá-la ou importar.
  // Vou replicar de forma simplificada aqui pois a do app.js depende da constante PLACEHOLDER
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

  const confirmBtn = confirm("Tem certeza que deseja processar a rodada? Os pontos serão somados a TODOS os times no banco de dados.");
  if (!confirmBtn) return;

  const btn = document.getElementById('processRoundBtn');
  btn.disabled = true;
  btn.textContent = "Processando...";
  document.getElementById('adminLogs').innerHTML = "";
  
  logMsg("Buscando times do Supabase...");

  try {
    // 1. Busca todos os times
    const { data: teams, error: fetchError } = await supabase.from('teams').select('*');
    
    if (fetchError) throw fetchError;
    logMsg(`${teams.length} times encontrados.`);

    let updatedCount = 0;

    // 2. Calcula e atualiza a pontuação de cada time
    for (const team of teams) {
      const lineup = team.lineup || []; // array of player IDs
      
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
    alert(`Sucesso! ${updatedCount} times receberam pontos nesta rodada.`);
    
    // Limpar os inputs
    inputs.forEach(i => i.value = '');

  } catch (error) {
    console.error(error);
    logMsg(`ERRO FATAL: ${error.message || 'Erro desconhecido'}`);
    alert("Erro ao processar rodada. Veja os logs.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Processar Pontuações (Somar ao Ranking)";
  }
}
