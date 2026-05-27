// =====================================================
// COPA 2026 BRASIL — APP PRINCIPAL
// =====================================================

// ——— STATE ———
let currentSection = 'home';
let currentFormation = '4-3-3';
let selectedSlotIndex = -1;
let lineup = new Array(11).fill(null);
let usedPlayerIds = new Set();
let isFreeMode = false;
let isDraggingSlot = false;
let dragStartIndex = -1;
let customSlots = []; // Armazena posições personalizadas

// Placeholder para jogadores sem foto
const PLACEHOLDER_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E";
window.PLACEHOLDER_IMG = PLACEHOLDER_IMG;

function getPlayerPhoto(player) {
  if (!player) return '';
  // Formata o nome para usar como arquivo de imagem (ex: "Alisson" -> "alisson.jpg")
  const fileName = player.shortName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `assets/${fileName}.jpg`;
}

// =====================================================
// NAVIGATION
// =====================================================
function navigateTo(section) {
  currentSection = section;
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.nav-links a[data-section="${section}"]`);
  if (link) link.classList.add('active');

  if (section === 'leaderboard') {
    document.getElementById('home').style.display = 'none';
    document.getElementById('squad').style.display = 'none';
    document.getElementById('builder').style.display = 'none';
    document.getElementById('betting').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    window.scrollTo(0, 0);
    loadLeaderboard();
  } else if (section === 'betting') {
    document.getElementById('home').style.display = 'none';
    document.getElementById('squad').style.display = 'none';
    document.getElementById('builder').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('betting').style.display = 'block';
    window.scrollTo(0, 0);
    loadBettingMatches();
  } else {
    document.getElementById('home').style.display = 'flex';
    document.getElementById('squad').style.display = 'block';
    document.getElementById('builder').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('betting').style.display = 'none';

    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.getElementById('navLinks').classList.remove('open');
}

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// =====================================================
// SQUAD SECTION — PLAYER CARDS
// =====================================================
function renderPlayerCards(filter = 'all') {
  const grid = document.getElementById('playersGrid');
  grid.innerHTML = '';

  const filtered = PLAYERS.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'GK') return p.position === 'GK';
    if (filter === 'DEF') return ['RB', 'CB', 'LB'].includes(p.position);
    if (filter === 'MID') return ['CDM', 'CM', 'CAM'].includes(p.position);
    if (filter === 'ATK') return ['RW', 'LW', 'ST'].includes(p.position);
    return true;
  });

  filtered.forEach((player, i) => {
    const tier = player.rating >= 90 ? 'elite' : player.rating >= 85 ? 'gold' : player.rating >= 80 ? 'silver' : 'bronze';
    const a = player.attributes;

    const card = document.createElement('div');
    card.className = 'player-card animate-in';
    card.dataset.tier = tier;
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      <div class="player-card-header">
        <div class="player-rating-badge">
          <div class="rating-num">${player.rating}</div>
          <div class="position-tag">${player.position}</div>
        </div>
        <div class="player-avatar">
          <img src="${getPlayerPhoto(player)}" onerror="this.onerror=null;this.src=window.PLACEHOLDER_IMG;" alt="${player.name}" />
        </div>
        <div class="player-info">
          <div class="name">${player.shortName}</div>
          <div class="club">${player.club}</div>
          <div class="traits">
            ${player.traits.slice(0, 2).map(t => `<span class="trait-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="player-number">${player.number}</div>
      </div>
      <div class="player-card-stats">
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.PAC)}">${a.PAC}</div>
          <div class="stat-label">PAC</div>
        </div>
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.SHO)}">${a.SHO}</div>
          <div class="stat-label">SHO</div>
        </div>
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.PAS)}">${a.PAS}</div>
          <div class="stat-label">PAS</div>
        </div>
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.DRI)}">${a.DRI}</div>
          <div class="stat-label">DRI</div>
        </div>
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.DEF)}">${a.DEF}</div>
          <div class="stat-label">DEF</div>
        </div>
        <div class="stat-item">
          <div class="stat-val ${getStatColor(a.PHY)}">${a.PHY}</div>
          <div class="stat-label">PHY</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function getStatColor(val) {
  if (val >= 85) return 'high';
  if (val >= 65) return 'mid';
  return 'low';
}

function filterPlayers(filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
  renderPlayerCards(filter);
}

// =====================================================
// DRAG AND DROP LOGIC
// =====================================================
let draggedPlayerId = null;
let draggedFromSlot = null;

function dragStartFromSidebar(e, playerId) {
  draggedPlayerId = playerId;
  draggedFromSlot = null;
  e.dataTransfer.setData('text/plain', playerId);
  e.dataTransfer.effectAllowed = 'copy';
}

function dragStartFromSlot(e, slotIndex, playerId) {
  draggedPlayerId = playerId;
  draggedFromSlot = slotIndex;
  e.dataTransfer.setData('text/plain', playerId);
  e.dataTransfer.effectAllowed = 'move';
}

function allowDrop(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copyMove';
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function dropSlot(e, targetSlotIndex) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');

  if (draggedPlayerId === null) return;
  const player = PLAYERS.find(p => p.id === draggedPlayerId);
  if (!player) return;

  if (draggedFromSlot !== null) {
    // Swap players between slots
    const targetExistingPlayer = lineup[targetSlotIndex];
    lineup[targetSlotIndex] = player;
    lineup[draggedFromSlot] = targetExistingPlayer;
  } else {
    // Drop from sidebar
    // Remove player from any other slot they might be in
    const existingIndex = lineup.findIndex(p => p && p.id === player.id);
    if (existingIndex !== -1) {
      lineup[existingIndex] = null;
    }
    lineup[targetSlotIndex] = player;
    usedPlayerIds.add(player.id);
  }

  draggedPlayerId = null;
  draggedFromSlot = null;

  // Select the newly dropped slot
  selectedSlotIndex = targetSlotIndex;

  renderField();
  renderSidebarPlayers();
  updateStrength();
}

// =====================================================
// SVG FIELD RENDERING
// =====================================================
function renderField() {
  const svg = document.getElementById('fieldSvg');
  const W = 400, H = 560;

  let svgContent = `
    <defs>
      <pattern id="grassPattern" x="0" y="0" width="100" height="80" patternUnits="userSpaceOnUse">
        <rect width="100" height="40" fill="#15803d" />
        <rect y="40" width="100" height="40" fill="#166534" />
      </pattern>
      
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
      </radialGradient>

      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="slotGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(0,200,83,0.3)"/>
        <stop offset="100%" stop-color="rgba(0,200,83,0)"/>
      </radialGradient>
      <radialGradient id="slotGradFilled" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
      </radialGradient>
      <radialGradient id="slotGradSelected" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(59,130,246,0.6)"/>
        <stop offset="100%" stop-color="rgba(59,130,246,0.1)"/>
      </radialGradient>
    </defs>

    <!-- Gramado com Listras -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#grassPattern)"/>
    
    <!-- Efeito de Sombra nas Bordas -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#vignette)"/>

    <!-- Linhas do Campo com Brilho -->
    <g stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" filter="url(#glow)">
      <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="2"/>
      <line x1="20" y1="${H / 2}" x2="${W - 20}" y2="${H / 2}"/>
      <circle cx="${W / 2}" cy="${H / 2}" r="60"/>
      
      <!-- Grande Área Superior -->
      <rect x="${W / 2 - 80}" y="20" width="160" height="70"/>
      <rect x="${W / 2 - 40}" y="20" width="80" height="25"/>
      
      <!-- Grande Área Inferior -->
      <rect x="${W / 2 - 80}" y="${H - 90}" width="160" height="70"/>
      <rect x="${W / 2 - 40}" y="${H - 45}" width="80" height="25"/>
    </g>

    <circle cx="${W / 2}" cy="${H / 2}" r="4" fill="rgba(255,255,255,0.8)"/>

  `;

  // Usa customSlots se estiver no modo livre, caso contrário usa a formação padrão
  const slotsToRender = isFreeMode ? customSlots : FORMATIONS[currentFormation].slots;

  slotsToRender.forEach((slot, i) => {
    const cx = (slot.x / 100) * W;
    const cy = (slot.y / 100) * H;
    const player = lineup[i];
    const isSelected = selectedSlotIndex === i;
    const isFilled = !!player;

    let fillGrad = 'url(#slotGrad)';
    let strokeColor = 'rgba(255,255,255,0.5)';
    let strokeWidth = 2;

    if (isSelected) {
      fillGrad = 'url(#slotGradSelected)';
      strokeColor = '#ffd700';
      strokeWidth = 3;
    } else if (isFilled) {
      fillGrad = 'url(#slotGradFilled)';
      strokeColor = '#00c853';
      strokeWidth = 2.5;
    }

    svgContent += `
      <g class="field-slot ${isSelected ? 'selected' : ''} ${isFilled ? 'filled' : ''}"
         data-index="${i}" 
         onclick="selectSlot(${i})"
         onpointerdown="startSlotDrag(event, ${i})"
         ondragover="allowDrop(event)"
         ondragleave="dragLeave(event)"
         ondrop="dropSlot(event, ${i})"
         ${!isFreeMode && isFilled ? `draggable="true" ondragstart="dragStartFromSlot(event, ${i}, ${player.id})"` : ''}
         style="cursor: ${isFilled ? 'grab' : 'pointer'};">
         
        <circle cx="${cx}" cy="${cy}" r="28" fill="${fillGrad}" stroke="${strokeColor}" stroke-width="${strokeWidth}" class="slot-ring"
          ${isSelected ? 'filter="url(#glow)"' : ''}/>
          
        ${isFilled ? `
          <foreignObject x="${cx - 20}" y="${cy - 24}" width="40" height="40" style="border-radius: 50%; overflow: hidden; pointer-events: none;">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center;">
              <img src="${getPlayerPhoto(player)}" onerror="this.onerror=null;this.src=window.PLACEHOLDER_IMG;" style="width: 100%; height: 100%; object-fit: cover;" alt=""/>
            </div>
          </foreignObject>
          <text x="${cx}" y="${cy + 24}" class="slot-name" font-size="9" fill="#fff" font-weight="bold" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.8))">${player.shortName}</text>
          <text x="${cx}" y="${cy - 16}" class="slot-rating" font-size="10" font-weight="900" fill="#ffd700" filter="drop-shadow(1px 1px 2px rgba(0,0,0,0.8))">${player.rating}</text>
        ` : `
          <text x="${cx}" y="${cy + 1}" class="slot-label" font-size="11" fill="rgba(255,255,255,0.7)">${slot.label}</text>
          <text x="${cx}" y="${cy + 15}" class="slot-name" font-size="7" fill="rgba(255,255,255,0.4)">${slot.pos}</text>
        `}
      </g>
    `;
  });

  svg.innerHTML = svgContent;
}

// Lógica para Arrastar Slots no Modo Livre
function toggleFreeMode() {
  isFreeMode = !isFreeMode;
  const status = document.getElementById('freeModeStatus');
  const btn = document.getElementById('freeModeBtn');

  if (isFreeMode) {
    // Inicializa posições personalizadas com a formação atual
    customSlots = JSON.parse(JSON.stringify(FORMATIONS[currentFormation].slots));
    status.textContent = "ON";
    btn.style.background = "var(--primary)";
    btn.style.color = "white";
  } else {
    status.textContent = "OFF";
    btn.style.background = "var(--bg-primary)";
    btn.style.color = "var(--primary)";
  }
  renderField();
}

function startSlotDrag(e, index) {
  if (!isFreeMode) return;
  isDraggingSlot = true;
  dragStartIndex = index;
  document.addEventListener('pointermove', moveSlot);
  document.addEventListener('pointerup', stopSlotDrag);
}

function moveSlot(e) {
  if (!isDraggingSlot || dragStartIndex === -1) return;

  const svg = document.getElementById('fieldSvg');
  const rect = svg.getBoundingClientRect();

  // Converte coordenadas do mouse para coordenadas internas do SVG (0-100)
  let x = ((e.clientX - rect.left) / rect.width) * 100;
  let y = ((e.clientY - rect.top) / rect.height) * 100;

  // Limites do campo
  customSlots[dragStartIndex].x = Math.max(5, Math.min(95, x));
  customSlots[dragStartIndex].y = Math.max(5, Math.min(95, y));

  renderField();
}

function stopSlotDrag() {
  isDraggingSlot = false;
  dragStartIndex = -1;
  document.removeEventListener('pointermove', moveSlot);
  document.removeEventListener('pointerup', stopSlotDrag);
}

// =====================================================
// FORMATION BUTTONS
// =====================================================
function renderFormationButtons() {
  const container = document.getElementById('formationSelect');
  container.innerHTML = '';

  Object.keys(FORMATIONS).forEach(key => {
    const btn = document.createElement('button');
    btn.className = `formation-btn ${key === currentFormation ? 'active' : ''}`;
    btn.textContent = key;
    btn.onclick = () => changeFormation(key);
    container.appendChild(btn);
  });
}

function changeFormation(key) {
  currentFormation = key;
  lineup = new Array(11).fill(null);
  usedPlayerIds = new Set();
  selectedSlotIndex = -1;
  renderFormationButtons();
  renderField();
  renderSidebarPlayers();
  updateStrength();
}

// =====================================================
// SLOT SELECTION & SIDEBAR PLAYER LIST
// =====================================================
function selectSlot(index) {
  selectedSlotIndex = index;
  renderField();
  renderSidebarPlayers();
}

function renderSidebarPlayers() {
  const container = document.getElementById('sidebarPlayers');
  const title = document.getElementById('sidebarTitle');
  const subtitle = document.getElementById('sidebarSubtitle');
  const searchInput = document.getElementById('searchPlayer');

  if (selectedSlotIndex < 0) {
    title.textContent = 'Selecione uma posição';
    subtitle.textContent = 'Clique em um slot no campo para começar';
    container.innerHTML = `
      <div class="sidebar-empty-state">
        <span class="icon">🏃‍♂️</span>
        <h4>Monte sua Seleção</h4>
        <p>Arraste jogadores diretamente para o campo ou clique em um slot para escolher.</p>
      </div>
    `;

    // Mostra todos os jogadores permitindo drag and drop genérico
    renderAllPlayersForDrag(container, searchInput.value.toLowerCase());
    return;
  }

  const formation = FORMATIONS[currentFormation];
  const slot = formation.slots[selectedSlotIndex];
  const compatiblePositions = POSITION_GROUPS[slot.pos] || [slot.pos];

  title.textContent = `Posição: ${slot.label} (${slot.pos})`;
  subtitle.textContent = `Posições compatíveis: ${compatiblePositions.join(', ')}`;

  const searchTerm = searchInput.value.toLowerCase();

  const sorted = [...PLAYERS].sort((a, b) => {
    const aCompat = compatiblePositions.includes(a.position) ? 1 : 0;
    const bCompat = compatiblePositions.includes(b.position) ? 1 : 0;
    if (aCompat !== bCompat) return bCompat - aCompat;
    return b.rating - a.rating;
  });

  const filtered = sorted.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm) && !p.shortName.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  container.innerHTML = '';

  if (lineup[selectedSlotIndex]) {
    const removeItem = document.createElement('div');
    removeItem.className = 'sidebar-player-item';
    removeItem.style.borderColor = '#f87171';
    removeItem.style.background = 'rgba(248, 113, 113, 0.08)';
    removeItem.innerHTML = `
      <div class="mini-avatar" style="background: linear-gradient(135deg, #f87171, #dc2626); color: white;">✕</div>
      <div class="item-info">
        <div class="item-name" style="color: #f87171;">Remover jogador</div>
        <div class="item-detail">${lineup[selectedSlotIndex].shortName}</div>
      </div>
    `;
    removeItem.onclick = () => removePlayerFromSlot(selectedSlotIndex);
    container.appendChild(removeItem);
  }

  filtered.forEach(player => {
    const isUsed = usedPlayerIds.has(player.id) && (!lineup[selectedSlotIndex] || lineup[selectedSlotIndex].id !== player.id);
    const isCompatible = compatiblePositions.includes(player.position);

    const item = document.createElement('div');
    item.className = `sidebar-player-item ${isUsed ? 'disabled' : ''}`;

    if (!isCompatible && !isUsed) {
      item.style.opacity = '0.55';
    }

    item.innerHTML = `
      <div class="mini-avatar">
        <img src="${getPlayerPhoto(player)}" onerror="this.onerror=null;this.src=window.PLACEHOLDER_IMG;" alt="${player.name}"/>
      </div>
      <div class="item-info">
        <div class="item-name">${player.shortName}</div>
        <div class="item-detail">${player.positionLabel} · ${player.club}</div>
      </div>
      <div class="item-rating">${player.rating}</div>
    `;

    if (!isUsed) {
      item.onclick = () => assignPlayer(selectedSlotIndex, player);
      item.draggable = true;
      item.ondragstart = (e) => dragStartFromSidebar(e, player.id);
    }

    container.appendChild(item);
  });
}

function renderAllPlayersForDrag(container, searchTerm) {
  const sorted = [...PLAYERS].sort((a, b) => b.rating - a.rating);
  const filtered = sorted.filter(p => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm) && !p.shortName.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  filtered.forEach(player => {
    const isUsed = usedPlayerIds.has(player.id);
    const item = document.createElement('div');
    item.className = `sidebar-player-item ${isUsed ? 'disabled' : ''}`;

    item.innerHTML = `
      <div class="mini-avatar">
        <img src="${getPlayerPhoto(player)}" onerror="this.onerror=null;this.src=window.PLACEHOLDER_IMG;" alt="${player.name}"/>
      </div>
      <div class="item-info">
        <div class="item-name">${player.shortName}</div>
        <div class="item-detail">${player.positionLabel} · ${player.club}</div>
      </div>
      <div class="item-rating">${player.rating}</div>
    `;

    if (!isUsed) {
      item.draggable = true;
      item.ondragstart = (e) => dragStartFromSidebar(e, player.id);
      // Se clicar quando não tem slot selecionado, alerta o usuário
      item.onclick = () => {
        alert("Arraste o jogador para o campo ou selecione um espaço primeiro.");
      };
    }

    container.appendChild(item);
  });
}

function filterSidebarPlayers() {
  renderSidebarPlayers();
}

function assignPlayer(slotIndex, player) {
  if (lineup[slotIndex]) {
    usedPlayerIds.delete(lineup[slotIndex].id);
  }

  lineup.forEach((p, i) => {
    if (p && p.id === player.id) {
      lineup[i] = null;
      usedPlayerIds.delete(player.id);
    }
  });

  lineup[slotIndex] = player;
  usedPlayerIds.add(player.id);

  renderField();
  renderSidebarPlayers();
  updateStrength();
}

function removePlayerFromSlot(slotIndex) {
  if (lineup[slotIndex]) {
    usedPlayerIds.delete(lineup[slotIndex].id);
    lineup[slotIndex] = null;
  }
  renderField();
  renderSidebarPlayers();
  updateStrength();
}

function resetBuilder() {
  lineup = new Array(11).fill(null);
  usedPlayerIds = new Set();
  selectedSlotIndex = -1;
  renderField();
  renderSidebarPlayers();
  updateStrength();
}

// =====================================================
// STRENGTH CALCULATION & DISPLAY
// =====================================================
function updateStrength() {
  const result = calcularForcaColetiva(lineup, currentFormation);

  const numberEl = document.getElementById('strengthNumber');
  const gradeEl = document.getElementById('gradeLabel');
  const barEl = document.getElementById('strengthBarFill');
  const bonusesEl = document.getElementById('bonusesList');
  const aiSuggestionsEl = document.getElementById('aiSuggestions');

  animateNumber(numberEl, result.score);
  gradeEl.textContent = result.grade;
  barEl.style.width = `${result.score}%`;

  if (result.grade.includes('Elite')) {
    gradeEl.style.color = '#e040fb';
    barEl.style.background = 'linear-gradient(90deg, #6366f1, #e040fb)'; // Cor Elite
  } else if (result.grade === 'Ouro') {
    gradeEl.style.color = '#ffd700';
    barEl.style.background = 'linear-gradient(90deg, #f59e0b, #ffd700)'; // Cor Ouro
  } else if (result.grade === 'Prata') {
    gradeEl.style.color = '#b0bec5';
    barEl.style.background = 'linear-gradient(90deg, #64748b, #b0bec5)'; // Cor Prata
  } else if (result.grade === 'Bronze') {
    gradeEl.style.color = '#cd7f32';
    barEl.style.background = 'linear-gradient(90deg, #92400e, #cd7f32)'; // Cor Bronze
  } else if (result.grade === '—') { // Adicionado para o caso inicial ou time vazio
    gradeEl.textContent = "AGUARDANDO";
    gradeEl.style.color = 'var(--text-muted)';
    barEl.style.background = 'var(--border-subtle)'; // Cor neutra
    barEl.style.width = '0%'; // Barra vazia
  } else {
    gradeEl.style.color = 'var(--text-muted)';
    barEl.style.background = 'var(--blue-accent)';
  }

  bonusesEl.innerHTML = result.bonuses.map(b => `
    <div class="bonus-item">
      <span class="bonus-label">${b.label}</span>
      <span class="bonus-value">${b.value}</span>
    </div>
  `).join('');

  // Atualiza IA Assistant
  const insights = getAIAssistantInsights(lineup, currentFormation);
  aiSuggestionsEl.innerHTML = insights.map(text => `
    <div style="margin-bottom: 6px; padding-left: 12px; border-left: 2px solid var(--primary);">${text}</div>
  `).join('');
}

function animateNumber(el, target) {
  const current = parseInt(el.textContent) || 0;
  const diff = target - current;
  const duration = 600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(current + diff * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// =====================================================
// SHARE / URL ENCODING
// =====================================================
function encodeTeam() {
  const data = {
    f: currentFormation,
    p: lineup.map(p => p ? p.id : 0)
  };
  return btoa(JSON.stringify(data));
}

function decodeTeam(hash) {
  try {
    const data = JSON.parse(atob(hash));
    if (data.f && FORMATIONS[data.f]) {
      currentFormation = data.f;
      renderFormationButtons();
    }
    if (data.p && Array.isArray(data.p)) {
      lineup = data.p.map(id => {
        if (id === 0) return null;
        return PLAYERS.find(p => p.id === id) || null;
      });
      usedPlayerIds = new Set(lineup.filter(Boolean).map(p => p.id));
    }
    renderField();
    renderSidebarPlayers();
    updateStrength();
  } catch (e) {
    console.warn('Failed to decode team:', e);
  }
}

function shareTeam() {
  const filledCount = lineup.filter(Boolean).length;
  if (filledCount === 0) {
    alert('Escale pelo menos um jogador antes de compartilhar!');
    return;
  }

  // Captura visual do campo
  const fieldWrapper = document.querySelector('.field-wrapper');
  if (fieldWrapper && typeof html2canvas !== 'undefined') {
    html2canvas(fieldWrapper, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const imageDataURL = canvas.toDataURL('image/png');
      document.getElementById('generatedTeamImage').src = imageDataURL;
      const dlBtn = document.getElementById('downloadTeamImage');
      dlBtn.href = imageDataURL;
      dlBtn.style.display = 'inline-flex';
    }).catch(err => console.error("Erro ao gerar imagem:", err));
  }

  const hash = encodeTeam();
  const url = window.location.origin + window.location.pathname + '#team=' + hash;

  document.getElementById('shareLink').value = url;
  document.getElementById('shareModal').classList.add('active');
}

function closeShareModal() {
  document.getElementById('shareModal').classList.remove('active');
}

function copyShareLink() {
  const input = document.getElementById('shareLink');
  input.select();
  document.execCommand('copy');

  try {
    navigator.clipboard.writeText(input.value);
  } catch (e) { }

  closeShareModal();
  showToast();
}

function showToast() {
  const toast = document.getElementById('copiedToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

document.getElementById('shareModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeShareModal();
});

// =====================================================
// INITIALIZATION
// =====================================================
function init() {
  renderPlayerCards();
  renderFormationButtons();

  // Renderiza o campo vazio com a formação padrão inicial
  renderField();
  renderSidebarPlayers();
  updateStrength();

  // Carrega Top Players
  loadTopPlayers();

  // Checa se tem um time para carregar via URL (?time=UUID)
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('time');
  if (teamId) {
    // Carrega o time do Supabase
    loadTeamFromDatabase(teamId);
    return; // Não precisa checar o hash
  }

  // Checa link antigo via hash (#team=)
  const hash = window.location.hash;
  if (hash.startsWith('#team=')) {
    const teamData = hash.replace('#team=', '');
    decodeTeam(teamData);
    navigateTo('builder');
  }

  const sections = ['home', 'squad', 'builder'];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', init);

// =====================================================
// SUPABASE / LEADERBOARD / SAVE TEAM LOGIC
// =====================================================

let lastSavedTeamId = null;

function openSaveModal() {
  const filledCount = lineup.filter(Boolean).length;
  if (filledCount < 11) {
    alert('Você precisa escalar os 11 jogadores antes de salvar seu time no Ranking!');
    return;
  }
  document.getElementById('saveModal').classList.add('active');
}

function closeSaveModal() {
  document.getElementById('saveModal').classList.remove('active');
}

document.getElementById('saveModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeSaveModal();
});

document.getElementById('teamSavedModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('active');
});

function buildTeamUrl(teamId) {
  return window.location.origin + window.location.pathname + '?time=' + teamId;
}

async function submitTeamToRanking() {
  if (typeof supabase === 'undefined') {
    alert("Supabase não configurado. Verifique o arquivo js/supabase.js");
    return;
  }

  const ownerName = document.getElementById('ownerNameInput').value.trim();
  const ownerEmail = document.getElementById('ownerEmailInput').value.trim();
  const teamName = document.getElementById('teamNameInput').value.trim();
  const ownerPassword = document.getElementById('ownerPasswordInput').value.trim();

  if (!ownerName || !teamName || !ownerEmail || !ownerPassword) {
    alert('Preencha todos os campos: Nome, E-mail, Nome do Time e Senha.');
    return;
  }

  if (ownerPassword.length < 4) {
    alert('A senha deve ter pelo menos 4 caracteres.');
    return;
  }

  // Validação simples de e-mail
  if (!ownerEmail.includes('@') || !ownerEmail.includes('.')) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

  const filledCount = lineup.filter(Boolean).length;
  if (filledCount < 11) {
    alert('Escale os 11 jogadores.');
    return;
  }

  const playerIds = lineup.map(p => p.id);

  const btn = document.getElementById('submitTeamBtn');
  btn.disabled = true;
  btn.textContent = "Salvando...";

  try {
    // .select() retorna o registro inserido, incluindo o UUID gerado
    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          owner_name: ownerName,
          owner_email: ownerEmail,
          team_name: teamName,
          formation: currentFormation,
          lineup: playerIds,
          password: ownerPassword
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        alert('Este nome de time já existe! Escolha outro.');
      } else {
        alert('Erro ao salvar time: ' + error.message);
      }
      throw error;
    }

    closeSaveModal();

    // Pega o ID do time recém-inserido
    if (data && data.length > 0) {
      lastSavedTeamId = data[0].id;
      loggedTeamId = lastSavedTeamId;
      loggedOwnerName = ownerName;
      updateLoginNavBar();
      loadBettingMatches();

      // Captura visual para o modal de sucesso
      const fieldWrapper = document.querySelector('.field-wrapper');
      if (fieldWrapper && typeof html2canvas !== 'undefined') {
        html2canvas(fieldWrapper, {
          backgroundColor: null,
          scale: 2,
          useCORS: true
        }).then(canvas => {
          const imageDataURL = canvas.toDataURL('image/png');
          document.getElementById('generatedSavedTeamImage').src = imageDataURL;
          const dlBtn = document.getElementById('downloadSavedTeamImage');
          dlBtn.href = imageDataURL;
          dlBtn.style.display = 'inline-flex';
        });
      }

      const shareUrl = buildTeamUrl(lastSavedTeamId);

      // Mostra o modal de sucesso com o link
      document.getElementById('savedTeamTitle').textContent = teamName;
      document.getElementById('teamShareLink').value = shareUrl;
      document.getElementById('teamSavedModal').classList.add('active');
    } else {
      // Fallback: toast simples
      const toast = document.getElementById('successToast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

  } catch (err) {
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Salvar e Gerar Link";
  }
}

function copyTeamShareLink() {
  const input = document.getElementById('teamShareLink');
  input.select();
  document.execCommand('copy');
  try {
    navigator.clipboard.writeText(input.value);
  } catch (e) { }

  const toast = document.getElementById('copiedToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function openWhatsApp() {
  const link = document.getElementById('teamShareLink').value;
  const text = encodeURIComponent(`⚽ Veja minha escalação para a Copa 2026! 🇧🇷🏆\n\n${link}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// =====================================================
// LOAD TEAM FROM DATABASE (Via URL ou clique no ranking)
// =====================================================
async function loadTeamFromDatabase(teamId) {
  if (typeof supabase === 'undefined') return;

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error || !data) {
      console.warn('Time não encontrado:', error);
      return;
    }

    // Carregar a formação
    if (data.formation && FORMATIONS[data.formation]) {
      currentFormation = data.formation;
      renderFormationButtons();
    }

    // Carregar a escalação
    const playerIds = data.lineup || [];
    lineup = new Array(11).fill(null);
    usedPlayerIds = new Set();

    playerIds.forEach((pid, i) => {
      if (i < 11) {
        const player = PLAYERS.find(p => p.id === pid);
        if (player) {
          lineup[i] = player;
          usedPlayerIds.add(player.id);
        }
      }
    });

    selectedSlotIndex = -1;
    renderField();
    renderSidebarPlayers();
    updateStrength();

    // Mostra o banner de visualização
    showViewingBanner(data.team_name, data.owner_name);

    // Navega para o builder
    navigateTo('builder');

  } catch (err) {
    console.error('Erro ao carregar time:', err);
  }
}

function showViewingBanner(teamName, ownerName) {
  const banner = document.getElementById('viewingBanner');
  document.getElementById('viewingTeamName').textContent = teamName;
  document.getElementById('viewingOwnerName').textContent = ownerName;
  banner.style.display = 'flex';
}

function hideViewingBanner() {
  document.getElementById('viewingBanner').style.display = 'none';
}

// =====================================================
// LEADERBOARD (Ranking Global)
// =====================================================
async function loadLeaderboard() {
  if (typeof supabase === 'undefined') {
    document.getElementById('loadingRanking').textContent = "Supabase não configurado. Adicione suas credenciais no js/supabase.js";
    return;
  }

  const loading = document.getElementById('loadingRanking');
  const table = document.getElementById('leaderboardTable');
  const tbody = document.getElementById('leaderboardBody');

  loading.style.display = 'block';
  table.style.display = 'none';

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('total_score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;

    if (!data || data.length === 0) {
      loading.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🏟️</div>
        <div>Nenhum time cadastrado ainda. <strong style="color: var(--primary);">Seja o primeiro!</strong></div>
        <button class="btn btn-sm btn-primary" onclick="navigateTo('builder')" style="margin-top: 16px;">Monte seu Time</button>
      `;
      return;
    }

    tbody.innerHTML = '';
    data.forEach((team, index) => {
      const pos = index + 1;
      let posHtml = pos + 'º';
      if (pos === 1) posHtml = '🥇 1º';
      if (pos === 2) posHtml = '🥈 2º';
      if (pos === 3) posHtml = '🥉 3º';

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background 0.2s';
      tr.onmouseenter = () => tr.style.background = 'var(--bg-glass-light)';
      tr.onmouseleave = () => tr.style.background = 'transparent';
      tr.onclick = () => loadTeamFromDatabase(team.id);
      tr.title = 'Clique para ver a escalação';

      tr.innerHTML = `
        <td style="padding: 16px 12px; font-weight: bold; color: ${pos <= 3 ? '#f59e0b' : 'var(--text-primary)'};">${posHtml}</td>
        <td style="padding: 16px 12px;">
          <div style="font-weight: bold; color: var(--text-primary);">${team.team_name}</div>
          <span style="font-size:0.8rem;color:var(--text-muted);font-weight:normal;">${team.formation}</span>
        </td>
        <td style="padding: 16px 12px; color: var(--text-muted);">${team.owner_name}</td>
        <td style="padding: 16px 12px; font-weight: 900; color: var(--blue-accent); font-size: 1.1rem;">${parseFloat(team.total_score).toFixed(1)}</td>
      `;
      tbody.appendChild(tr);
    });

    loading.style.display = 'none';
    table.style.display = 'table';

  } catch (err) {
    console.error(err);
    loading.textContent = "Erro ao carregar o ranking.";
  }
}

// =====================================================
// LOGIN E DASHBOARD DE CRAQUES E BOLÃO
// =====================================================

let loggedTeamId = null;
let loggedOwnerName = null;

function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

function updateLoginNavBar() {
  const navLink = document.getElementById('loginNavLink');
  if (navLink) {
    if (loggedTeamId && loggedOwnerName) {
      navLink.innerHTML = `👤 ${loggedOwnerName}`;
      navLink.style.color = "var(--green-light)";
    } else {
      navLink.innerHTML = `🔑 Entrar`;
      navLink.style.color = "var(--primary)";
    }
  }
}

function handleLoginClick(e) {
  if (e) e.preventDefault();
  if (loggedTeamId) {
    if (confirm(`Você está logado como "${loggedOwnerName}". Deseja sair (fazer logout)?`)) {
      logoutUser();
    }
  } else {
    openLoginModal();
  }
}

function logoutUser() {
  loggedTeamId = null;
  loggedOwnerName = null;
  updateLoginNavBar();

  // Atualiza exibição do bolão
  loadBettingMatches();

  alert("Você saiu do seu time.");
}

document.getElementById('loginModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLoginModal();
});

async function loginUser() {
  const email = document.getElementById('loginEmailInput').value.trim();
  const password = document.getElementById('loginPasswordInput').value.trim();

  if (!email || !email.includes('@')) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  if (!password) {
    alert("Por favor, insira sua senha.");
    return;
  }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = "Verificando...";

  try {
    const { data, error } = await supabase
      .from('teams')
      .select('id, owner_name, password')
      .eq('owner_email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      alert("❌ Nenhum time encontrado para este e-mail.");
      return;
    }

    // Verifica a senha
    const storedPassword = data[0].password;
    if (!storedPassword || storedPassword !== password) {
      alert("❌ Senha incorreta. Tente novamente.");
      return;
    }

    const teamId = data[0].id;
    loggedTeamId = teamId;
    loggedOwnerName = data[0].owner_name;
    updateLoginNavBar();

    // Limpa o campo de senha por segurança
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginEmailInput').value = '';

    closeLoginModal();

    alert(`✅ Bem-vindo de volta, ${data[0].owner_name}! Carregando sua escalação e liberando Bolão...`);

    // Reaproveitamos a função que carrega time do banco
    loadTeamFromDatabase(teamId);

    // Atualiza aba de apostas
    loadBettingMatches();

  } catch (err) {
    console.error(err);
    alert("Erro ao fazer login.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
}

async function loadTopPlayers() {
  const container = document.getElementById('topPlayersContainer');
  if (typeof supabase === 'undefined') {
    container.innerHTML = '<div style="color:var(--text-muted);">Supabase não configurado.</div>';
    return;
  }

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div style="color:var(--text-muted);width:100%;text-align:center;">Nenhum jogador pontuou ainda.</div>';
      return;
    }

    container.innerHTML = '';

    data.forEach((stat, index) => {
      const player = PLAYERS.find(p => p.id === stat.player_id);
      if (!player) return;

      const photoSrc = getPlayerPhoto(player);

      const posHtml = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
      const points = parseFloat(stat.total_points).toFixed(1);

      const card = document.createElement('div');
      card.style.background = index < 3 ? 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)' : '#ffffff';
      card.style.border = index < 3 ? '1px solid #fcd34d' : '1px solid var(--border-subtle)';
      card.style.borderRadius = '12px';
      card.style.padding = '16px';
      card.style.minWidth = '140px';
      card.style.textAlign = 'center';
      card.style.position = 'relative';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';

      card.innerHTML = `
        <div style="position: absolute; top: -10px; left: -10px; font-size: 1.5rem; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${posHtml}</div>
        <div style="width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 2px solid ${index < 3 ? '#f59e0b' : 'var(--border-subtle)'}; margin-bottom: 12px; background: #f8fafc;">
          <img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%2F%3E%3C%2Fsvg%3E'"/>
        </div>
        <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 4px; color: var(--text-primary);">${player.shortName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${player.positionLabel} · ${player.club}</div>
        <div style="font-size: 1.4rem; font-weight: 900; color: var(--blue-accent);">${points} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">pts</span></div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div style="color:red;">Erro ao carregar craques.</div>';
  }
}

// =====================================================
// BOLÃO LOGIC
// =====================================================

async function loadBettingMatches() {
  const authMessage = document.getElementById('bettingAuthMessage');
  const bettingContainer = document.getElementById('bettingContainer');

  if (!loggedTeamId) {
    authMessage.style.display = 'block';
    bettingContainer.style.display = 'none';
    return;
  }

  authMessage.style.display = 'none';
  bettingContainer.style.display = 'flex';
  bettingContainer.innerHTML = '<div style="color:var(--text-muted);text-align:center;">Buscando jogos...</div>';

  try {
    // Busca os jogos abertos
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (matchesError) throw matchesError;

    if (!matches || matches.length === 0) {
      bettingContainer.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:24px;">Nenhum jogo aberto no momento. Volte mais tarde!</div>';
      return;
    }

    // Busca os palpites já feitos pelo usuário logado
    const { data: guesses, error: guessesError } = await supabase
      .from('guesses')
      .select('*')
      .eq('team_id', loggedTeamId);

    if (guessesError) throw guessesError;

    const userGuesses = {};
    guesses.forEach(g => {
      userGuesses[g.match_id] = g;
    });

    bettingContainer.innerHTML = '';

    matches.forEach(match => {
      const existingGuess = userGuesses[match.id];
      const hasGuessed = !!existingGuess;

      const el = document.createElement('div');
      el.style.background = '#ffffff';
      el.style.padding = '24px';
      el.style.borderRadius = '12px';
      el.style.border = '1px solid var(--border-subtle)';
      el.style.textAlign = 'center';
      el.style.boxShadow = 'var(--shadow-sm)';

      el.innerHTML = `
        <h3 style="margin-bottom: 16px; color: var(--text-primary); text-transform: uppercase;">${match.team_a} x ${match.team_b}</h3>
        <div style="display: flex; gap: 16px; justify-content: center; align-items: center; margin-bottom: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; width: 80px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: var(--text-primary);">${match.team_a}</div>
            <input type="number" id="guess_a_${match.id}" ${hasGuessed ? 'disabled' : ''} value="${hasGuessed ? existingGuess.guess_a : ''}" min="0" class="score-input" style="width: 100%; font-size: 1.5rem; padding: 12px; text-align: center;">
          </div>
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-muted);">X</div>
          <div style="display: flex; flex-direction: column; align-items: center; width: 80px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: var(--text-primary);">${match.team_b}</div>
            <input type="number" id="guess_b_${match.id}" ${hasGuessed ? 'disabled' : ''} value="${hasGuessed ? existingGuess.guess_b : ''}" min="0" class="score-input" style="width: 100%; font-size: 1.5rem; padding: 12px; text-align: center;">
          </div>
        </div>
        ${hasGuessed
          ? `<div style="color: var(--primary); font-weight: bold;">✅ Palpite Registrado! Aguarde o resultado oficial.</div>`
          : `<button class="btn btn-primary" style="width: 100%; max-width: 250px;" onclick="submitGuess('${match.id}')">Salvar Palpite</button>`
        }
      `;
      bettingContainer.appendChild(el);
    });

  } catch (err) {
    console.error(err);
    bettingContainer.innerHTML = '<div style="color:red;text-align:center;">Erro ao carregar jogos.</div>';
  }
}

async function submitGuess(matchId) {
  if (!loggedTeamId) {
    alert("Você precisa estar logado!");
    return;
  }

  const guessA = parseInt(document.getElementById(`guess_a_${matchId}`).value);
  const guessB = parseInt(document.getElementById(`guess_b_${matchId}`).value);

  if (isNaN(guessA) || isNaN(guessB)) {
    alert("Por favor, preencha o placar corretamente!");
    return;
  }

  try {
    const { error } = await supabase.from('guesses').insert([
      {
        match_id: matchId,
        team_id: loggedTeamId,
        guess_a: guessA,
        guess_b: guessB
      }
    ]);

    if (error) {
      if (error.code === '23505') {
        alert("Você já enviou um palpite para este jogo!");
      } else {
        throw error;
      }
    } else {
      alert("Palpite registrado com sucesso! Boa sorte!");
      loadBettingMatches();
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar palpite: " + err.message);
  }
}
