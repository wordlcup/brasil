// =====================================================
// DADOS DOS JOGADORES — SELEÇÃO BRASILEIRA COPA 2026
// ESCALAÇÃO OFICIAL
// =====================================================

const PLAYERS = [
  // ——— GOLEIROS ———
  {
    id: 1, name: "Alisson", shortName: "Alisson", number: 1,
    position: "GK", positionLabel: "Goleiro", club: "Liverpool", age: 33,
    rating: 91, avatar: "AL",
    apiId: null, // Ex: substitua null pelo número que achou na busca (ex: 7345)
    attributes: { PAC: 56, SHO: 17, PAS: 63, DRI: 65, DEF: 91, PHY: 87 },
    traits: ["Líder", "Seguro com os pés"]
  }, // Foto: assets/alisson.jpg
  {
    id: 2, name: "Ederson", shortName: "Ederson", number: 12,
    position: "GK", positionLabel: "Goleiro", club: "Fenerbahçe", age: 31,
    rating: 89, avatar: "ED",
    apiId: null, // Coloque o ID do Ederson aqui
    attributes: { PAC: 54, SHO: 14, PAS: 76, DRI: 68, DEF: 89, PHY: 84 },
    traits: ["Distribuição precisa"]
  }, // Foto: assets/ederson.jpg
  {
    id: 3, name: "Weverton", shortName: "Weverton", number: 23,
    position: "GK", positionLabel: "Goleiro", club: "Grêmio", age: 37,
    rating: 83, avatar: "WV",
    apiId: null, // Coloque o ID do Weverton aqui
    attributes: { PAC: 48, SHO: 12, PAS: 58, DRI: 55, DEF: 84, PHY: 82 },
    traits: ["Experiente", "Reflexos"]
  }, // Foto: assets/weverton.jpg

  // ——— DEFENSORES ———
  {
    id: 4, name: "Alex Sandro", shortName: "A. Sandro", number: 6,
    position: "LB", positionLabel: "Lateral Esq.", club: "Flamengo", age: 35,
    rating: 81, avatar: "AS",
    attributes: { PAC: 79, SHO: 62, PAS: 73, DRI: 74, DEF: 80, PHY: 77 },
    traits: ["Experiente"]
  }, // Foto: assets/asandro.jpg
  {
    id: 5, name: "Bremer", shortName: "Bremer", number: 3,
    position: "CB", positionLabel: "Zagueiro", club: "Juventus", age: 29,
    rating: 86, avatar: "BR",
    attributes: { PAC: 80, SHO: 35, PAS: 55, DRI: 58, DEF: 87, PHY: 88 },
    traits: ["Físico", "Marcação forte"]
  }, // Foto: assets/bremer.jpg
  {
    id: 6, name: "Danilo", shortName: "Danilo", number: 2,
    position: "RB", positionLabel: "Lateral Dir.", club: "Flamengo", age: 34,
    rating: 82, avatar: "DA",
    attributes: { PAC: 78, SHO: 65, PAS: 76, DRI: 74, DEF: 81, PHY: 78 },
    traits: ["Capitão", "Experiente"]
  }, // Foto: assets/danilo.jpg
  {
    id: 7, name: "Douglas Santos", shortName: "D. Santos", number: 16,
    position: "LB", positionLabel: "Lateral Esq.", club: "Zenit", age: 31,
    rating: 79, avatar: "DS",
    attributes: { PAC: 82, SHO: 58, PAS: 72, DRI: 73, DEF: 78, PHY: 76 },
    traits: ["Veloz"]
  }, // Foto: assets/dsantos.jpg
  {
    id: 8, name: "Gabriel Magalhães", shortName: "G. Magalhães", number: 5,
    position: "CB", positionLabel: "Zagueiro", club: "Arsenal", age: 28,
    rating: 86, avatar: "GM",
    attributes: { PAC: 74, SHO: 52, PAS: 62, DRI: 60, DEF: 86, PHY: 89 },
    traits: ["Físico", "Gol de cabeça"]
  }, // Foto: assets/gmagalhaes.jpg
  {
    id: 9, name: "Ibañez", shortName: "Ibañez", number: 22,
    position: "CB", positionLabel: "Zagueiro", club: "Al-Ahli", age: 28,
    rating: 81, avatar: "IB",
    attributes: { PAC: 82, SHO: 38, PAS: 58, DRI: 60, DEF: 82, PHY: 84 },
    traits: ["Velocista"]
  }, // Foto: assets/ibanez.jpg
  {
    id: 10, name: "Léo Pereira", shortName: "L. Pereira", number: 4,
    position: "CB", positionLabel: "Zagueiro", club: "Flamengo", age: 30,
    rating: 83, avatar: "LP",
    attributes: { PAC: 75, SHO: 42, PAS: 65, DRI: 62, DEF: 84, PHY: 86 },
    traits: ["Leitura de jogo"]
  }, // Foto: assets/lpereira.jpg
  {
    id: 11, name: "Marquinhos", shortName: "Marquinhos", number: 14,
    position: "CB", positionLabel: "Zagueiro", club: "PSG", age: 32,
    rating: 87, avatar: "MQ",
    attributes: { PAC: 78, SHO: 38, PAS: 72, DRI: 70, DEF: 87, PHY: 84 },
    traits: ["Líder defensivo", "Leitura de jogo"]
  }, // Foto: assets/marquinhos.jpg
  {
    id: 12, name: "Wesley", shortName: "Wesley", number: 21,
    position: "RB", positionLabel: "Lateral Dir.", club: "Roma", age: 21,
    rating: 78, avatar: "WE",
    attributes: { PAC: 88, SHO: 60, PAS: 68, DRI: 76, DEF: 74, PHY: 75 },
    traits: ["Explosivo", "Jovem"]
  }, // Foto: assets/wesley.jpg

  // ——— MEIO-CAMPISTAS ———
  {
    id: 13, name: "Bruno Guimarães", shortName: "B. Guimarães", number: 15,
    position: "CM", positionLabel: "Meia", club: "Newcastle", age: 28,
    rating: 87, avatar: "BG",
    attributes: { PAC: 72, SHO: 74, PAS: 84, DRI: 81, DEF: 79, PHY: 83 },
    traits: ["Motor do time", "Passe longo"]
  }, // Foto: assets/bguimaraes.jpg
  {
    id: 14, name: "Casemiro", shortName: "Casemiro", number: 5,
    position: "CDM", positionLabel: "Volante", club: "Manchester United", age: 34,
    rating: 86, avatar: "CA",
    attributes: { PAC: 58, SHO: 71, PAS: 77, DRI: 72, DEF: 88, PHY: 89 },
    traits: ["Destruidor", "Liderança"]
  }, // Foto: assets/casemiro.jpg
  {
    id: 15, name: "Danilo Santos", shortName: "Danilo S.", number: 8,
    position: "CM", positionLabel: "Meia", club: "Botafogo", age: 23,
    rating: 79, avatar: "DL",
    attributes: { PAC: 74, SHO: 70, PAS: 78, DRI: 76, DEF: 72, PHY: 78 },
    traits: ["Promessa"]
  }, // Foto: assets/danilos.jpg
  {
    id: 16, name: "Fabinho", shortName: "Fabinho", number: 13,
    position: "CDM", positionLabel: "Volante", club: "Al-Ittihad", age: 32,
    rating: 84, avatar: "FA",
    attributes: { PAC: 62, SHO: 68, PAS: 76, DRI: 70, DEF: 86, PHY: 86 },
    traits: ["Interceptação"]
  }, // Foto: assets/fabinho.jpg
  {
    id: 17, name: "Lucas Paquetá", shortName: "Paquetá", number: 10,
    position: "CAM", positionLabel: "Meia Ata.", club: "Flamengo", age: 28,
    rating: 86, avatar: "PQ",
    attributes: { PAC: 74, SHO: 78, PAS: 82, DRI: 86, DEF: 55, PHY: 72 },
    traits: ["Criativo", "Gol de longe"]
  }, // Foto: assets/paqueta.jpg

  // ——— ATACANTES ———
  {
    id: 18, name: "Endrick", shortName: "Endrick", number: 9,
    position: "ST", positionLabel: "Centroavante", club: "Lyon", age: 19,
    rating: 83, avatar: "EN",
    attributes: { PAC: 86, SHO: 84, PAS: 63, DRI: 82, DEF: 28, PHY: 79 },
    traits: ["Prodígio", "Finalizador"]
  }, // Foto: assets/endrick.jpg
  {
    id: 19, name: "Gabriel Martinelli", shortName: "Martinelli", number: 18,
    position: "LW", positionLabel: "Ponta Esq.", club: "Arsenal", age: 24,
    rating: 85, avatar: "MT",
    attributes: { PAC: 91, SHO: 81, PAS: 71, DRI: 84, DEF: 40, PHY: 73 },
    traits: ["Explosivo", "Intensidade"]
  }, // Foto: assets/martinelli.jpg
  {
    id: 20, name: "Igor Thiago", shortName: "Igor Thiago", number: 20,
    position: "ST", positionLabel: "Centroavante", club: "Brentford", age: 23,
    rating: 80, avatar: "IT",
    attributes: { PAC: 78, SHO: 82, PAS: 66, DRI: 72, DEF: 30, PHY: 82 },
    traits: ["Aéreo", "Finalizador"]
  }, // Foto: assets/igorthiago.jpg
  {
    id: 21, name: "Luiz Henrique", shortName: "L. Henrique", number: 19,
    position: "RW", positionLabel: "Ponta Dir.", club: "Zenit", age: 24,
    rating: 82, avatar: "LH",
    attributes: { PAC: 89, SHO: 76, PAS: 70, DRI: 83, DEF: 28, PHY: 66 },
    traits: ["Veloz", "Dribla"]
  }, // Foto: assets/lhenrique.jpg
  {
    id: 22, name: "Matheus Cunha", shortName: "M. Cunha", number: 17,
    position: "ST", positionLabel: "Centroavante", club: "Manchester United", age: 27,
    rating: 84, avatar: "MC",
    attributes: { PAC: 84, SHO: 82, PAS: 73, DRI: 83, DEF: 34, PHY: 76 },
    traits: ["Versátil"]
  }, // Foto: assets/mcunha.jpg
  {
    id: 23, name: "Neymar Jr.", shortName: "Neymar", number: 10,
    position: "CAM", positionLabel: "Meia Ata.", club: "Santos", age: 34,
    rating: 88, avatar: "NJ",
    attributes: { PAC: 78, SHO: 82, PAS: 88, DRI: 93, DEF: 30, PHY: 58 },
    traits: ["Gênio", "Bola parada", "Drible de elite"]
  }, // Foto: assets/neymar.jpg
  {
    id: 24, name: "Raphinha", shortName: "Raphinha", number: 11,
    position: "RW", positionLabel: "Ponta Dir.", club: "Barcelona", age: 29,
    rating: 87, avatar: "RP",
    attributes: { PAC: 88, SHO: 84, PAS: 80, DRI: 88, DEF: 44, PHY: 70 },
    traits: ["Falta", "Dribles"]
  }, // Foto: assets/raphinha.jpg
  {
    id: 25, name: "Rayan", shortName: "Rayan", number: 26,
    position: "LW", positionLabel: "Ponta Esq.", club: "Bournemouth", age: 19,
    rating: 78, avatar: "RY",
    attributes: { PAC: 90, SHO: 74, PAS: 68, DRI: 82, DEF: 25, PHY: 64 },
    traits: ["Jovem talento", "Velocidade"]
  }, // Foto: assets/rayan.jpg
  {
    id: 26, name: "Vinícius Jr.", shortName: "Vini Jr.", number: 7,
    position: "LW", positionLabel: "Ponta Esq.", club: "Real Madrid", age: 25,
    rating: 95, avatar: "VJ",
    attributes: { PAC: 96, SHO: 87, PAS: 78, DRI: 97, DEF: 32, PHY: 68 },
    traits: ["Driblador de elite", "Velocista", "Bola de Ouro"]
  }, // Foto: assets/vinijr.jpg
];

// =====================================================
// FORMAÇÕES DISPONÍVEIS
// =====================================================
const FORMATIONS = {
  "4-3-3": {
    label: "4-3-3",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 73 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 73 },
      { pos: "CM", label: "MEI", x: 68, y: 52 },
      { pos: "CM", label: "MEI", x: 50, y: 48 },
      { pos: "CM", label: "MEI", x: 32, y: 52 },
      { pos: "RW", label: "PD", x: 78, y: 28 },
      { pos: "ST", label: "CA", x: 50, y: 22 },
      { pos: "LW", label: "PE", x: 22, y: 28 },
    ]
  },
  "4-4-2": {
    label: "4-4-2",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 74 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 74 },
      { pos: "RW", label: "MD", x: 78, y: 52 },
      { pos: "CM", label: "MEI", x: 58, y: 50 },
      { pos: "CM", label: "MEI", x: 42, y: 50 },
      { pos: "LW", label: "ME", x: 22, y: 52 },
      { pos: "ST", label: "CA", x: 62, y: 24 },
      { pos: "ST", label: "CA", x: 38, y: 24 },
    ]
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 74 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 74 },
      { pos: "CDM", label: "VOL", x: 62, y: 58 },
      { pos: "CDM", label: "VOL", x: 38, y: 58 },
      { pos: "RW", label: "PD", x: 76, y: 38 },
      { pos: "CAM", label: "MEA", x: 50, y: 38 },
      { pos: "LW", label: "PE", x: 24, y: 38 },
      { pos: "ST", label: "CA", x: 50, y: 18 },
    ]
  },
  "3-5-2": {
    label: "3-5-2",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "CB", label: "ZAG", x: 72, y: 76 },
      { pos: "CB", label: "ZAG", x: 50, y: 76 },
      { pos: "CB", label: "ZAG", x: 28, y: 76 },
      { pos: "RB", label: "ALD", x: 84, y: 54 },
      { pos: "CM", label: "MEI", x: 65, y: 52 },
      { pos: "CDM", label: "VOL", x: 50, y: 56 },
      { pos: "CM", label: "MEI", x: 35, y: 52 },
      { pos: "LB", label: "ALE", x: 16, y: 54 },
      { pos: "ST", label: "CA", x: 62, y: 24 },
      { pos: "ST", label: "CA", x: 38, y: 24 },
    ]
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 74 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 74 },
      { pos: "CDM", label: "VOL", x: 50, y: 60 },
      { pos: "RW", label: "MD", x: 80, y: 42 },
      { pos: "CM", label: "MEI", x: 60, y: 44 },
      { pos: "CM", label: "MEI", x: 40, y: 44 },
      { pos: "LW", label: "ME", x: 20, y: 42 },
      { pos: "ST", label: "CA", x: 50, y: 20 },
    ]
  },
  "4-3-1-2": {
    label: "4-3-1-2 (Losango)",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 74 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 74 },
      { pos: "CDM", label: "VOL", x: 50, y: 60 },
      { pos: "CM", label: "MEI", x: 70, y: 50 },
      { pos: "CM", label: "MEI", x: 30, y: 50 },
      { pos: "CAM", label: "MEA", x: 50, y: 38 },
      { pos: "ST", label: "CA", x: 60, y: 22 },
      { pos: "ST", label: "CA", x: 40, y: 22 },
    ]
  },
  "3-4-3": {
    label: "3-4-3",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "CB", label: "ZAG", x: 70, y: 76 },
      { pos: "CB", label: "ZAG", x: 50, y: 76 },
      { pos: "CB", label: "ZAG", x: 30, y: 76 },
      { pos: "RM", label: "MD", x: 85, y: 55 },
      { pos: "CM", label: "MEI", x: 60, y: 50 },
      { pos: "CM", label: "MEI", x: 40, y: 50 },
      { pos: "LM", label: "ME", x: 15, y: 55 },
      { pos: "RW", label: "PD", x: 75, y: 25 },
      { pos: "ST", label: "CA", x: 50, y: 20 },
      { pos: "LW", label: "PE", x: 25, y: 25 },
    ]
  },
  "5-3-2": {
    label: "5-3-2",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RWB", label: "ALA D", x: 88, y: 70 },
      { pos: "CB", label: "ZAG", x: 70, y: 76 },
      { pos: "CB", label: "ZAG", x: 50, y: 78 },
      { pos: "CB", label: "ZAG", x: 30, y: 76 },
      { pos: "LWB", label: "ALA E", x: 12, y: 70 },
      { pos: "CM", label: "MEI", x: 65, y: 50 },
      { pos: "CM", label: "MEI", x: 35, y: 50 },
      { pos: "CDM", label: "VOL", x: 50, y: 58 },
      { pos: "ST", label: "CA", x: 60, y: 25 },
      { pos: "ST", label: "CA", x: 40, y: 25 },
    ]
  },
  "4-2-2-2": {
    label: "4-2-2-2 (Quadrado)",
    slots: [
      { pos: "GK", label: "GOL", x: 50, y: 90 },
      { pos: "RB", label: "LD", x: 82, y: 74 },
      { pos: "CB", label: "ZAG", x: 64, y: 76 },
      { pos: "CB", label: "ZAG", x: 36, y: 76 },
      { pos: "LB", label: "LE", x: 18, y: 74 },
      { pos: "CDM", label: "VOL", x: 60, y: 58 },
      { pos: "CDM", label: "VOL", x: 40, y: 58 },
      { pos: "RM", label: "MD", x: 75, y: 38 },
      { pos: "LM", label: "ME", x: 25, y: 38 },
      { pos: "ST", label: "CA", x: 60, y: 20 },
      { pos: "ST", label: "CA", x: 40, y: 20 },
    ]
  },
};

// =====================================================
// POSIÇÕES COMPATÍVEIS POR SLOT
// =====================================================
const POSITION_GROUPS = {
  GK: ["GK"],
  RB: ["RB"],
  CB: ["CB"],
  LB: ["LB"],
  RM: ["RM", "RW", "CAM"], // Right Midfielder
  LM: ["LM", "LW", "CAM"], // Left Midfielder
  RWB: ["RWB", "RB", "RM"], // Right Wing Back
  LWB: ["LWB", "LB", "LM"], // Left Wing Back
  CDM: ["CDM", "CM"],
  CM: ["CM", "CAM", "CDM"],
  CAM: ["CAM", "CM", "RW", "LW"],
  RW: ["RW", "ST", "CAM", "LW"],
  LW: ["LW", "ST", "CAM", "RW"],
  ST: ["ST", "RW", "LW", "CAM"],
};

// =====================================================
// SINERGIAS ESPECIAIS (Bônus de Entrosamento)
// =====================================================
const SYNERGY_PAIRS = [
  { ids: [26, 17], label: "Dancinha (Vini + Paquetá)", bonus: 5 }, // Vini Jr e Paquetá
  { ids: [11, 1], label: "Muralha (Marquinhos + Alisson)", bonus: 3 }, // Marquinhos e Alisson
  { ids: [14, 13], label: "Cão de Guarda (Casemiro + Bruno G.)", bonus: 4 }, // Casemiro e Bruno G.
  { ids: [26, 18], label: "Real Futuro (Vini + Endrick)", bonus: 4 }, // Vini e Endrick
  { ids: [10, 6, 4], label: "Base Rubro-Negra", bonus: 6 } // Leo Pereira, Danilo e Alex Sandro
];

// =====================================================
// ALGORITMO — FORÇA COLETIVA
// =====================================================
function getIndividualRating(player, targetPos = null) {
  const a = player.attributes;
  const pos = player.position;
  const weights = {
    GK: { PAC: 0.05, SHO: 0.01, PAS: 0.10, DRI: 0.05, DEF: 0.70, PHY: 0.09 },
    RB: { PAC: 0.20, SHO: 0.05, PAS: 0.15, DRI: 0.12, DEF: 0.38, PHY: 0.10 },
    CB: { PAC: 0.10, SHO: 0.02, PAS: 0.10, DRI: 0.05, DEF: 0.55, PHY: 0.18 },
    LB: { PAC: 0.20, SHO: 0.05, PAS: 0.15, DRI: 0.12, DEF: 0.38, PHY: 0.10 },
    RM: { PAC: 0.20, SHO: 0.10, PAS: 0.20, DRI: 0.20, DEF: 0.15, PHY: 0.15 },
    LM: { PAC: 0.20, SHO: 0.10, PAS: 0.20, DRI: 0.20, DEF: 0.15, PHY: 0.15 },
    RWB: { PAC: 0.25, SHO: 0.08, PAS: 0.18, DRI: 0.15, DEF: 0.24, PHY: 0.10 },
    LWB: { PAC: 0.25, SHO: 0.08, PAS: 0.18, DRI: 0.15, DEF: 0.24, PHY: 0.10 },
    CDM: { PAC: 0.08, SHO: 0.10, PAS: 0.20, DRI: 0.14, DEF: 0.38, PHY: 0.10 },
    CM: { PAC: 0.10, SHO: 0.14, PAS: 0.27, DRI: 0.20, DEF: 0.14, PHY: 0.15 },
    CAM: { PAC: 0.12, SHO: 0.20, PAS: 0.27, DRI: 0.27, DEF: 0.04, PHY: 0.10 },
    RW: { PAC: 0.22, SHO: 0.18, PAS: 0.14, DRI: 0.30, DEF: 0.04, PHY: 0.12 },
    LW: { PAC: 0.22, SHO: 0.18, PAS: 0.14, DRI: 0.30, DEF: 0.04, PHY: 0.12 },
    ST: { PAC: 0.15, SHO: 0.38, PAS: 0.10, DRI: 0.20, DEF: 0.02, PHY: 0.15 },
  };
  const w = weights[pos] || weights["CM"];

  let rating = (
    a.PAC * w.PAC + a.SHO * w.SHO + a.PAS * w.PAS +
    a.DRI * w.DRI + a.DEF * w.DEF + a.PHY * w.PHY
  );

  // Penalidade se estiver fora da posição ideal
  if (targetPos && targetPos !== pos) {
    const isCompatible = (POSITION_GROUPS[targetPos] || []).includes(pos);
    rating *= isCompatible ? 0.95 : 0.70; // 5% de perda se compatível, 30% se totalmente fora
  }

  return rating;
}

function calcularForcaColetiva(lineup, formationKey = "4-3-3") {
  const players = lineup.filter(Boolean);
  if (players.length === 0) return { score: 0, grade: "—", bonuses: [] };

  const formation = FORMATIONS[formationKey];
  let totalRating = 0;
  let totalDef = 0, totalDri = 0, totalPas = 0;
  const clubCount = {};
  let hasLeader = false;
  const playerIds = players.map(p => p.id);

  lineup.forEach((p, index) => {
    if (p) {
      const targetPos = formation.slots[index].pos;
      totalRating += getIndividualRating(p, targetPos);

      totalDef += p.attributes.DEF;
      totalDri += p.attributes.DRI;
      totalPas += p.attributes.PAS;

      clubCount[p.club] = (clubCount[p.club] || 0) + 1;

      if (p.traits.some(t => t.includes("Líder") || t.includes("Capitão"))) {
        hasLeader = true;
      }
    }
  });

  const n = players.length;
  let mediaBase = totalRating / n;
  const defMedia = totalDef / n;
  const driPasMedia = (totalDri + totalPas) / n;

  let bonus = 0;
  const bonuses = [];

  if (defMedia > 72) { bonus += 3; bonuses.push({ label: "Bloco defensivo", value: "+3" }); }
  if (driPasMedia > 78) { bonus += 3; bonuses.push({ label: "Criatividade ofensiva", value: "+3" }); }
  if (hasLeader) { bonus += 2; bonuses.push({ label: "Liderança em campo", value: "+2" }); }
  if (n === 11) { bonus += 5; bonuses.push({ label: "Time completo", value: "+5" }); }

  // Sinergias Especiais
  SYNERGY_PAIRS.forEach(pair => {
    if (pair.ids.every(id => playerIds.includes(id))) {
      bonus += pair.bonus;
      bonuses.push({ label: pair.label, value: `+${pair.bonus}` });
    }
  });

  let quimica = 0;
  for (const club of Object.values(clubCount)) {
    if (club >= 2) quimica += (club - 1) * 2;
  }
  quimica = Math.min(quimica, 8);
  if (quimica > 0) { bonus += quimica; bonuses.push({ label: "Química de clube", value: `+${quimica}` }); }

  const score = Math.min(99, Math.round(mediaBase + bonus));
  let grade = "Bronze";
  if (score >= 92) grade = "Elite ⭐";
  else if (score >= 87) grade = "Ouro";
  else if (score >= 82) grade = "Prata";

  return { score, grade, bonuses };
}

window.PLAYERS = PLAYERS;
window.FORMATIONS = FORMATIONS;
window.POSITION_GROUPS = POSITION_GROUPS;
window.calcularForcaColetiva = calcularForcaColetiva;
window.getIndividualRating = getIndividualRating;
window.SYNERGY_PAIRS = SYNERGY_PAIRS;
