/* ------------------------------------------------------------------
   Bordee - duel de bateaux vue de dessus, 2 joueurs sur un clavier.
   Modes : duel (1 contre 1) et aventure (1-2 joueurs contre une citadelle).
   Assets : Kenney Pirate Pack (CC0) - voir assets/kenney-license.txt
------------------------------------------------------------------ */

const cv  = document.getElementById('cv');
const ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;

/* ---------- langues ----------------------------------------------- */

/* Tous les libelles affiches passent par t(). Les donnees de jeu (cartes,
   bonus, fortifications) ne portent qu'une cle, jamais un texte : ajouter une
   langue se limite donc a completer ce dictionnaire.                      */
const TEXTES = {
  fr: {
    titre: 'BORDÉE',
    accroche: 'duel de bateaux · deux joueurs sur un clavier',
    duel: 'DUEL', aventure: 'AVENTURE',
    equipage: 'Équipage', solo: 'Solo', aDeux: 'À deux',
    toucheSolo: 'Z Q S D + Espace',
    toucheDuo: 'ZQSD + Espace · flèches + Entrée',
    appareiller: 'APPAREILLER',
    aideMenu: '↑ ↓ mode · ← → carte · %s · Entrée pour appareiller',
    aideBonus: 'B bonus', aideEquipage: '1 / 2 équipage',

    bonus: 'Bonus',
    bonusRappel: 'barques à récupérer · 4 max sur la carte · armement et mobilité cumulables · attention aux mauvaises surprises',
    bonus_perce: 'Perforants',    bonus_perce_aide: 'traversent les obstacles',
    bonus_gerbe: 'Double bordée',  bonus_gerbe_aide: '6 boulets au lieu de 3',
    bonus_portee: 'Longue portée', bonus_portee_aide: 'portée doublée',
    bonus_rafale: 'Tir en rafale', bonus_rafale_aide: 'les 5 bordées à la suite',
    bonus_vent: 'Vent arrière',    bonus_vent_aide: '+60 % de vitesse, 10 s',
    bonus_brulot: 'Brûlot',        bonus_brulot_aide: 'à éviter : 3 points de coque',

    briefTitre: 'Aucun bonus en aventure : la citadelle ne fait pas de cadeaux.',
    briefSous: 'réduisez toutes les pièces au silence — elles portent plus loin que vous',
    briefCanons: '%s canons', briefCanonsSous: 'les murs sont indestructibles',
    briefPortee: 'portée %s px', briefPorteeSous: 'la vôtre : %s px',
    briefEquipage: 'équipage %s',
    briefEquipageSolo: 'touches 1 et 2 pour changer',
    briefEquipageDuo: 'les pièces encaissent 50 % de plus',

    carte_archipel: 'Archipel',    carte_archipel_sous: 'une grande île, deux îlots, cinq rochers',
    carte_detroit: 'Le Détroit',   carte_detroit_sous: 'une île, un îlot, trois rochers',
    carte_large: 'Haute mer',      carte_large_sous: 'rien que de l’eau, duel à découvert',
    carte_citadelle: 'La Citadelle', carte_citadelle_sous: 'un fort isolé · 6 canons à réduire',
    carte_angle: 'L’Angle',        carte_angle_sous: 'courtines + bastion · 12 canons à réduire',
    carte_passes: 'Les Passes',    carte_passes_sous: '2 tours à canon tournant · brûlots par 3 passes',

    joueur1: 'Joueur 1', joueur2: 'Joueur 2',
    fort_citadelle: 'Citadelle', fort_bastion: 'Bastion', fort_tours: 'Tours',
    hudCanons: 'CANONS À RÉDUIRE AU SILENCE',
    hudBatterie: '%s / %s en batterie',
    hudReduit: 'réduit au silence',

    gagne: '%s l’emporte !',
    victoire: 'Batteries réduites au silence !',
    defaite: 'Équipage perdu en mer',
    defaiteSous1: '%s canon tenait encore',
    defaiteSousN: '%s canons tenaient encore',
    rejouer: 'R pour rejouer · Échap pour le menu',
    erreurServeur: 'Lance le jeu via un serveur local (voir README.md).',
    docTitre: 'Bordée — duel de bateaux',
    docAide: 'J1 : Z Q S D + Espace · J2 : flèches + Entrée · R : rejouer · L : langue'
  },
  en: {
    titre: 'BROADSIDE',
    accroche: 'ship duel · two players, one keyboard',
    duel: 'DUEL', aventure: 'CAMPAIGN',
    equipage: 'Crew', solo: 'Solo', aDeux: 'Two players',
    toucheSolo: 'W A S D + Space',
    toucheDuo: 'WASD + Space · arrows + Enter',
    appareiller: 'SET SAIL',
    aideMenu: '↑ ↓ mode · ← → map · %s · Enter to set sail',
    aideBonus: 'B pickups', aideEquipage: '1 / 2 crew',

    bonus: 'Pickups',
    bonusRappel: 'dinghies to collect · 4 max on the map · gunnery and mobility stack · beware of nasty surprises',
    bonus_perce: 'Armour piercing', bonus_perce_aide: 'shots go through cover',
    bonus_gerbe: 'Double broadside', bonus_gerbe_aide: '6 shots instead of 3',
    bonus_portee: 'Long range',      bonus_portee_aide: 'double the range',
    bonus_rafale: 'Rapid fire',      bonus_rafale_aide: 'all 5 broadsides at once',
    bonus_vent: 'Following wind',    bonus_vent_aide: '+60 % speed, 10 s',
    bonus_brulot: 'Fire ship',       bonus_brulot_aide: 'avoid it: 3 hull points',

    briefTitre: 'No pickups in the campaign: the citadel grants no favours.',
    briefSous: 'silence every gun — they outrange you, so you must come to them',
    briefCanons: '%s guns', briefCanonsSous: 'the walls cannot be breached',
    briefPortee: 'range %s px', briefPorteeSous: 'yours: %s px',
    briefEquipage: 'crew of %s',
    briefEquipageSolo: 'press 1 or 2 to change',
    briefEquipageDuo: 'guns take 50 % more punishment',

    carte_archipel: 'Archipelago', carte_archipel_sous: 'one large island, two islets, five rocks',
    carte_detroit: 'The Strait',   carte_detroit_sous: 'one island, one islet, three rocks',
    carte_large: 'Open sea',       carte_large_sous: 'nothing but water, no cover at all',
    carte_citadelle: 'The Citadel', carte_citadelle_sous: 'a lone fort · 6 guns to silence',
    carte_angle: 'The Corner',      carte_angle_sous: 'curtain walls + bastion · 12 guns to silence',
    carte_passes: 'The Channels',   carte_passes_sous: '2 turrets · fire ships from 3 channels',

    joueur1: 'Player 1', joueur2: 'Player 2',
    fort_citadelle: 'Citadel', fort_bastion: 'Bastion', fort_tours: 'Turrets',
    hudCanons: 'GUNS LEFT TO SILENCE',
    hudBatterie: '%s / %s still firing',
    hudReduit: 'silenced',

    gagne: '%s wins!',
    victoire: 'All guns silenced!',
    defaite: 'Crew lost at sea',
    defaiteSous1: '%s gun was still firing',
    defaiteSousN: '%s guns were still firing',
    rejouer: 'R to replay · Esc for the menu',
    erreurServeur: 'Serve the game over HTTP (see README.md).',
    docTitre: 'Broadside — ship duel',
    docAide: 'P1: W A S D + Space · P2: arrows + Enter · R: replay · L: language'
  }
};

const LANGUES = ['fr', 'en'];

function langueParDefaut() {
  try {
    const memo = localStorage.getItem('bordee.langue');
    if (LANGUES.includes(memo)) return memo;
  } catch (e) { /* stockage indisponible : on retombe sur le navigateur */ }
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

let langue = langueParDefaut();

function choisirLangue(l) {
  langue = l;
  document.documentElement.lang = l;
  document.title = t('docTitre');
  const aide = document.getElementById('hint');
  if (aide) aide.textContent = t('docAide');
  try { localStorage.setItem('bordee.langue', l); } catch (e) { /* sans memoire */ }
}

// t('cle', a, b) remplace les %s successifs par les arguments fournis
function t(cle, ...args) {
  let s = (TEXTES[langue] && TEXTES[langue][cle]) || TEXTES.fr[cle] || cle;
  for (const a of args) s = s.replace('%s', a);
  return s;
}

/* ---------- atlas ------------------------------------------------ */

const TILE = 64;
const TILES_COLS = 16;

// Les 24 bateaux : 6 pavillons x 4 etats de degats. index = pavillon + 6 * etat
const SHIP_XY = [
  [408, 0], [408, 115], [204, 115], [68, 192], [68, 77], [68, 307],
  [0, 192], [0, 307], [0, 77], [340, 345], [340, 230], [340, 115],
  [340, 0], [272, 345], [272, 230], [272, 115], [272, 0], [204, 345],
  [204, 230], [204, 0], [136, 345], [136, 230], [136, 115], [136, 0]
];
const SHIP_W = 66, SHIP_H = 113, SHIP_SC = 0.85;

const FX = {
  ball:   { x: 120, y: 29,  w: 10, h: 10 },
  exp1:   { x: 0,   y: 0,   w: 74, h: 75 },
  exp2:   { x: 544, y: 145, w: 60, h: 59 },
  exp3:   { x: 544, y: 426, w: 42, h: 41 },
  fire1:  { x: 614, y: 466, w: 18, h: 39 },
  fire2:  { x: 120, y: 0,   w: 11, h: 27 },
  barque: { x: 606, y: 145, w: 20, h: 38 },   // dinghyLarge1
  epave:  { x: 588, y: 426, w: 20, h: 38 },   // dinghyLarge3, coque defoncee
  canon:  { x: 88,  y: 422, w: 29, h: 16 },   // pointe vers la droite
  futLache:{ x: 439, y: 496, w: 20, h: 12 },  // cannonLoose, tube demonte
  wood: [
    { x: 88,  y: 449, w: 15, h: 7 },
    { x: 408, y: 472, w: 26, h: 10 },
    { x: 116, y: 440, w: 15, h: 10 },
    { x: 88,  y: 440, w: 26, h: 7 }
  ]
};
const EXPLO_FRAMES = [FX.exp3, FX.exp2, FX.exp1, FX.exp1, FX.exp2, FX.exp3];

/* --- tiles de forteresse, releve fait sur le canal alpha des bords ---
   13/14 tour isolee · 15 mur vertical · 16 mur horizontal
   29 tour sur mur N-S · 30 tour sur mur E-O
   45 tour +S · 46 tour +E · 61 tour +N · 62 tour +O
   77 tour S+E (coin NO) · 78 tour S+O (coin NE)
   93 tour N+E (coin SO) · 94 tour N+O (coin SE)
   31 canon vers l'EST · 32 canon vers l'OUEST (sur mur vertical)
   47 canon vers le NORD · 48 canon vers le SUD (sur mur horizontal)
   60 porte dans mur vertical · 76 porte dans mur horizontal
   89/91 mur vertical en ruine · 90/92 mur horizontal en ruine

   Les tiles 31/32/47/48 ne connaissent que 4 orientations. On leur prefere un
   mur nu (15/16) surmonte du sprite `cannon` dessine en rotation libre : les
   pieces peuvent alors pivoter vers leur cible.                          */

const T_MUR_V = 15, T_MUR_H = 16, T_PORTE_H = 76;
const T_TOUR  = { NO: 77, NE: 78, SO: 93, SE: 94 };
const RUINE_V = [89, 91], RUINE_H = [90, 92];
const CAP = { N: -Math.PI / 2, S: Math.PI / 2, E: 0, O: Math.PI };

/* ---------- cartes ------------------------------------------------ */

const MAP_W = 20, MAP_H = 11;   // 20 x 11 tiles = 1280 x 704

// Blocs d'autotiles reperes dans le tilesheet Kenney
const ILE_HERBE  = [[6, 7, 8, 9], [22, 23, 24, 25], [38, 39, 40, 41], [54, 55, 56, 57]];
const ILOT_SABLE = [[1, 2, 3], [17, 18, 19], [33, 34, 35]];
const HAUT_FOND  = [[10, 11, 12], [26, 27, 28], [42, 43, 44]];

// citGrid : null, ou { f: index du fort, k: -1 pour un mur / index de la piece }
let layerSea, layerLand, solid, platBalle, citGrid, PROPS, ROCKS, SORTIES;
let forts, cit;   // cit = la fortification principale (titre du HUD)

const idx = (c, r) => r * MAP_W + c;

function stamp(layer, col, row, block, bloquant) {
  for (let r = 0; r < block.length; r++) {
    for (let c = 0; c < block[r].length; c++) {
      const x = col + c, y = row + r;
      if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
      layer[idx(x, y)] = block[r][c];
      if (bloquant) solid[idx(x, y)] = true;
    }
  }
}

// Ile 4x4 sable + herbe, avec sa vegetation posee en coordonnees relatives
function ileHerbe(col, row) {
  stamp(layerLand, col, row, ILE_HERBE, true);
  const ox = col * TILE, oy = row * TILE;
  PROPS.push({ t: 71, x: ox + 86,  y: oy + 100 });
  PROPS.push({ t: 70, x: ox + 174, y: oy + 70 });
  PROPS.push({ t: 72, x: ox + 54,  y: oy + 190 });
  PROPS.push({ t: 70, x: ox + 192, y: oy + 200 });
}

/* Ilot de sable 3x3. `deco` habille le centre : 'epave' (barque echouee) ou
   'debris' (tube de canon demonte et planche).
   Ce decor est pose en SPRITES et non en tiles : les tiles 81-84 du pack, qui
   portent le meme motif, sont des tuiles de rivage — une ligne de maree claire
   en haut, du sable mouille en bas. Au milieu d'un ilot ces bandes se lisent
   comme une flaque d'eau en travers du sable.                              */
function ilotSable(col, row, deco, transparent) {
  stamp(layerLand, col, row, ILOT_SABLE, true);
  /* Un ilot qui porte une piece DOIT laisser filer les boulets : sinon
     l'anneau de sable encaisse tout et la piece au centre est inatteignable,
     donc le niveau ingagnable.                                             */
  if (transparent) {
    for (let r = row; r < row + 3; r++) {
      for (let c = col; c < col + 3; c++) platBalle[idx(c, r)] = true;
    }
  }
  /* Le centre du bloc dans le tilesheet (tile_18) est du sable de base a
     (238,221,185), alors que l'interieur des 8 tuiles du pourtour est a
     (250,232,194) : pose tel quel, il laisse un carre plus sombre au milieu de
     l'ilot. Les tuiles de remplissage 68/69 sont pile a la bonne teinte.    */
  layerLand[idx(col + 1, row + 1)] = pioche([68, 69]);
  const ox = col * TILE, oy = row * TILE;
  PROPS.push({ t: 87, x: ox + 72,  y: oy + 76 });
  PROPS.push({ t: 88, x: ox + 130, y: oy + 134 });
  if (deco === 'epave') {
    PROPS.push({ f: FX.epave, x: ox + 96, y: oy + 104, rot: -0.7, sc: 1.15 });
  } else if (deco === 'debris') {
    PROPS.push({ f: FX.futLache, x: ox + 82,  y: oy + 92,  rot: -0.25, sc: 1.1 });
    PROPS.push({ f: FX.wood[1],  x: ox + 116, y: oy + 118, rot: 0.85,  sc: 1.1 });
  }
}

// Un prop est soit une tile de 64 px, soit un sprite libre que l'on peut pivoter
function dessinerProp(p, g, k) {
  if (!p.f) { drawTile(p.t, (p.x - TILE / 2) * k, (p.y - TILE / 2) * k, g, k); return; }
  const w = p.f.w * (p.sc || 1) * k, h = p.f.h * (p.sc || 1) * k;
  g.save();
  g.translate(p.x * k, p.y * k);
  g.rotate(p.rot || 0);
  g.drawImage(sprites, p.f.x, p.f.y, p.f.w, p.f.h, -w / 2, -h / 2, w, h);
  g.restore();
}

/* Massif de terre defini par un predicat : la tile de bord est choisie selon
   le voisinage. Hors carte compte comme terre, de sorte qu'un massif ancre
   dans un coin file sous le bord de l'ecran au lieu de s'y terminer par une
   plage.
   `transparent` rend le massif traversable par les boulets. Les terres qui
   portent une fortification le sont toujours : sinon la terre encaisserait
   tous les tirs et les murs seraient inatteignables.                      */
function terre(estTerre, transparent) {
  const T = (c, r) => (c < 0 || r < 0 || c >= MAP_W || r >= MAP_H) || estTerre(c, r);
  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      if (!estTerre(c, r)) continue;
      const n = T(c, r - 1), s = T(c, r + 1), o = T(c - 1, r), e = T(c + 1, r);
      let t;
      if (!n && !o)      t = 6;                      // coin nord-ouest
      else if (!n && !e) t = 9;                      // coin nord-est
      else if (!s && !o) t = 54;                     // coin sud-ouest
      else if (!s && !e) t = 57;                     // coin sud-est
      else if (!n) t = pioche([7, 8]);               // bord nord
      else if (!s) t = pioche([55, 56]);             // bord sud
      else if (!o) t = pioche([22, 38]);             // bord ouest
      else if (!e) t = pioche([25, 41]);             // bord est
      else t = pioche([23, 24, 39, 40]);             // interieur
      layerLand[idx(c, r)] = t;
      solid[idx(c, r)] = true;
      platBalle[idx(c, r)] = !!transparent;
    }
  }
}

const CIT = {
  duo: 1.5,             // a deux la puissance de feu double mais le fort divise
                        // son attention : les pieces encaissent 50 % de plus
  canonPv: 5,
  // La portee joueur vaut vitesse x duree de vie du boulet : ~420 x 1.3 = 545 px.
  // Les canons portent volontairement PLUS LOIN : aucune position ne permet de
  // toucher le fort sans etre soi-meme sous le feu. Pour riposter il faut
  // traverser une bande d'environ 115 px ou l'on encaisse sans pouvoir rendre.
  canonPortee: 660,
  canonArc: 1.05,       // demi-ouverture du champ de tir, ~60 deg
  canonCadence: 1.76,   // delai entre deux coups : 2,2 s / 1,25, soit +25 % de cadence
  canonVitesse: 300,
  canonEcart: 0.055,    // imprecision de visee
  canonAnticipe: 0.8,   // 1 = anticipation parfaite du deplacement
  canonPivot: 1.7,      // rad/s : vitesse de rotation de la piece
  canonAligne: 0.10     // il faut etre a moins de ca de la visee pour tirer
};

/* Une carte peut porter plusieurs fortifications. L'objectif n'est pas la
   maconnerie mais l'artillerie : la partie est gagnee quand toutes les pieces
   de la carte sont hors de combat. Les murs ne sont donc qu'un obstacle
   indestructible, et comme les pieces sont reparties sur toute la muraille,
   il faut la longer - impossible de gagner en pilonnant un seul point.    */
function creerFort(cle, principal) {
  const f = { cle, principal, tiles: [], murs: [], canons: [], cx: 0, cy: 0, detruite: false };
  forts.push(f);
  return f;
}

function poserMur(f, c, r, tile, orient) {
  layerLand[idx(c, r)] = tile;
  solid[idx(c, r)] = true;
  platBalle[idx(c, r)] = false;
  citGrid[idx(c, r)] = { f: forts.indexOf(f), k: -1 };
  f.tiles.push({ c, r });
  f.murs.push({ c, r, orient });
}

// Un mur nu, la piece elle-meme etant un sprite dessine en rotation par-dessus
/* `opts.arc` ouvre le secteur : Math.PI donne une piece qui pivote sur 360.
   `opts.garderSol` laisse la tuile de terrain en place — indispensable quand
   la piece est posee sur du sable : y ecrire une tuile de tour, dont le tour
   est transparent, percerait un carre de mer au milieu de l'ilot. Le support
   se dessine alors en decor par-dessus le sol.                             */
function poserCanon(f, c, r, base, orient, opts) {
  const o = opts || {};
  const pv = Math.round(CIT.canonPv * (nbJoueurs === 2 ? CIT.duo : 1));
  if (!o.garderSol) layerLand[idx(c, r)] = orient === 'v' ? T_MUR_V : T_MUR_H;
  solid[idx(c, r)] = true;
  platBalle[idx(c, r)] = false;
  citGrid[idx(c, r)] = { f: forts.indexOf(f), k: f.canons.length };
  f.tiles.push({ c, r });
  f.canons.push({
    c, r, orient, garderSol: !!o.garderSol,
    x: c * TILE + TILE / 2, y: r * TILE + TILE / 2,
    base, angle: base, arc: o.arc || CIT.canonArc, pv, pvMax: pv,
    cool: 1 + Math.random() * CIT.canonCadence, flash: 0
  });
}

// Une breche : le decor passe en ruine et laisse desormais filer les boulets
function brecher(c, r, orient) {
  const i = idx(c, r);
  layerLand[i] = pioche(orient === 'v' ? RUINE_V : RUINE_H);
  platBalle[i] = true;
  citGrid[i] = null;
}

function finaliserFort(f) {
  f.cx = f.tiles.reduce((a, t) => a + t.c * TILE + TILE / 2, 0) / f.tiles.length;
  f.cy = f.tiles.reduce((a, t) => a + t.r * TILE + TILE / 2, 0) / f.tiles.length;
}

/* --- niveau 1 : enceinte 6 x 5 dans le coin haut-gauche ---
   INVARIANT : chaque piece doit avoir une ligne de tir vers l'eau navigable,
   sinon le niveau est ingagnable puisque la victoire exige de toutes les
   reduire au silence. Le fort etant colle a l'angle, son enceinte forme un
   anneau ferme et seuls les murs sud et est donnent sur la mer : une piece
   posee au nord ou a l'ouest serait enfermee derriere son propre perimetre,
   le joueur ne pourrait jamais l'atteindre. Les six pieces sont donc
   reparties 3 au sud et 3 a l'est.                                        */
function batirCitadelle() {
  const c0 = 1, c1 = 6, r0 = 1, r1 = 5;
  const f = creerFort('citadelle', true);

  poserMur(f, c0, r0, T_TOUR.NO, 'h');
  poserMur(f, c1, r0, T_TOUR.NE, 'h');
  poserMur(f, c0, r1, T_TOUR.SO, 'h');
  poserMur(f, c1, r1, T_TOUR.SE, 'h');

  for (let c = c0 + 1; c < c1; c++) poserMur(f, c, r0, T_MUR_H, 'h');   // mur nord
  for (let r = r0 + 1; r < r1; r++) poserMur(f, c0, r, T_MUR_V, 'v');   // mur ouest
  poserMur(f, 4, r1, T_PORTE_H, 'h');                                   // porte sud

  poserCanon(f, 2, r1, CAP.S, 'h');    // mur sud
  poserCanon(f, 3, r1, CAP.S, 'h');
  poserCanon(f, 5, r1, CAP.S, 'h');
  poserCanon(f, c1, 2, CAP.E, 'v');    // mur est
  poserCanon(f, c1, 3, CAP.E, 'v');
  poserCanon(f, c1, 4, CAP.E, 'v');

  PROPS.push({ t: 87, x: 2 * TILE + 40, y: 2 * TILE + 44 });
  PROPS.push({ t: 88, x: 4 * TILE + 50, y: 3 * TILE + 30 });
  PROPS.push({ t: 71, x: 3 * TILE + 20, y: 4 * TILE + 36 });
  PROPS.push({ t: 70, x: 5 * TILE + 30, y: 2 * TILE + 24 });
  finaliserFort(f);
}

/* --- niveau 2 : on ne voit que l'angle d'une citadelle bien plus vaste ---
   Deux courtines en L qui epousent le coin haut-droit et filent hors champ :
   la courtine nord (ligne 1) face au sud, la courtine est (colonne 18) face
   a l'ouest, reliees par une tour d'angle. 4 pieces sur chacune.
   Les murs sont colles au bord : une seule bande de terre derriere eux, juste
   de quoi lire la place forte, tout le reste est de la mer.               */
const COURTINE = { rang: 1, col: 18 };

function batirCourtines() {
  const f = creerFort('citadelle', true);
  const { rang, col } = COURTINE;
  const canonsN = [2, 7, 12, 16];      // colonnes armees de la courtine nord
  const canonsE = [3, 5, 7, 9];        // lignes armees de la courtine est

  for (let c = 0; c < col; c++) {
    if (canonsN.includes(c)) poserCanon(f, c, rang, CAP.S, 'h');
    else poserMur(f, c, rang, T_MUR_H, 'h');
  }
  poserMur(f, col, rang, T_TOUR.NE, 'h');   // tour d'angle, murs S + O
  for (let r = rang + 1; r < MAP_H; r++) {
    if (canonsE.includes(r)) poserCanon(f, col, r, CAP.O, 'v');
    else poserMur(f, col, r, T_MUR_V, 'v');
  }

  PROPS.push({ t: 87, x: 4 * TILE + 40,  y: 20 });
  PROPS.push({ t: 88, x: 10 * TILE + 20, y: 30 });
  PROPS.push({ t: 71, x: 19 * TILE + 24, y: 4 * TILE + 30 });
  PROPS.push({ t: 70, x: 19 * TILE + 36, y: 8 * TILE + 20 });
  finaliserFort(f);
}

/* --- niveau 3 : deux tours a canon tournant, la cote perce de trois passes ---
   La cote fait une equerre d'une seule tuile d'epaisseur : moitie droite du
   bord haut, tout le bord droit, moitie droite du bord bas. Trois tuiles de
   mer y sont menagees (`SORTIES`) : ce sont les embouchures d'ou sortent les
   brulots.
   Les deux ilots sont transparents aux boulets, sinon leur anneau de sable
   protegerait la tour du centre et le niveau serait ingagnable.           */
const COTE = { colMin: 10, passeHaut: 14, passeDroite: 5, passeBas: 14 };

function batirPasses() {
  const { colMin, passeHaut, passeDroite, passeBas } = COTE;
  const bordHaut  = (c) => c >= colMin && c !== passeHaut;
  const bordDroit = (r) => r !== passeDroite;
  const bordBas   = (c) => c >= colMin && c !== passeBas;
  terre((c, r) => (r === 0 && bordHaut(c))
               || (c === MAP_W - 1 && bordDroit(r))
               || (r === MAP_H - 1 && bordBas(c)), false);

  // une passe pousse le brulot vers le large : cap dirige vers l'interieur
  SORTIES.push(
    { x: passeHaut * TILE + TILE / 2,   y: 24,                   cap: CAP.S },
    { x: W - 24,                        y: passeDroite * TILE + TILE / 2, cap: CAP.O },
    { x: passeBas * TILE + TILE / 2,    y: H - 24,               cap: CAP.N }
  );

  const f = creerFort('tours', true);
  for (const [col, row] of [[13, 3], [6, 6]]) {
    ilotSable(col, row, null, true);
    // la tour se pose en decor sur le sable, la piece pivote sur 360 degres
    const cc = col + 1, rr = row + 1;
    PROPS.push({ t: 13, x: cc * TILE + TILE / 2, y: rr * TILE + TILE / 2 });
    poserCanon(f, cc, rr, CAP.O, 'h', { arc: Math.PI, garderSol: true });
  }
  finaliserFort(f);
}

// Bastion 3 x 3 : quatre tours d'angle, une piece par face
function batirBastion(c0, r0) {
  const f = creerFort('bastion', false);
  const c1 = c0 + 2, r1 = r0 + 2;
  poserMur(f, c0, r0, T_TOUR.NO, 'h');
  poserMur(f, c1, r0, T_TOUR.NE, 'h');
  poserMur(f, c0, r1, T_TOUR.SO, 'h');
  poserMur(f, c1, r1, T_TOUR.SE, 'h');
  poserCanon(f, c0 + 1, r0, CAP.N, 'h');
  poserCanon(f, c0 + 1, r1, CAP.S, 'h');
  poserCanon(f, c0, r0 + 1, CAP.O, 'v');
  poserCanon(f, c1, r0 + 1, CAP.E, 'v');
  finaliserFort(f);
}

const SPAWN_DUEL = [
  { x: 170,  y: 576, cap: 0 },
  { x: 1110, y: 128, cap: Math.PI }
];

const CARTES = {
  duel: [
    {
      cle: 'archipel',
      spawns: SPAWN_DUEL,
      build() {
        stamp(layerSea,  1, 5, HAUT_FOND, false);
        stamp(layerSea, 14, 2, HAUT_FOND, false);
        ileHerbe(8, 3);
        ilotSable(2, 1, 'epave');
        ilotSable(15, 6, 'debris');
        ROCKS.push(
          { t: 49, x: 420, y: 212, r: 22 }, { t: 50, x: 862, y: 560, r: 25 },
          { t: 51, x: 704, y: 104, r: 20 }, { t: 65, x: 332, y: 482, r: 22 },
          { t: 66, x: 980, y: 250, r: 24 }
        );
      }
    },
    {
      cle: 'detroit',
      spawns: SPAWN_DUEL,
      build() {
        stamp(layerSea, 9, 6, HAUT_FOND, false);
        ileHerbe(4, 5);
        ilotSable(13, 1, 'epave');
        ROCKS.push(
          { t: 51, x: 760, y: 200, r: 22 },
          { t: 50, x: 620, y: 610, r: 22 },
          { t: 66, x: 980, y: 420, r: 24 }
        );
      }
    },
    {
      cle: 'large',
      spawns: SPAWN_DUEL,
      build() {
        stamp(layerSea,  2, 2, HAUT_FOND, false);
        stamp(layerSea, 15, 7, HAUT_FOND, false);
      }
    }
  ],
  aventure: [
    {
      cle: 'citadelle',
      canons: 6,
      spawns: [
        { x: 950,  y: 596, cap: -Math.PI / 2 },
        { x: 1108, y: 552, cap: -Math.PI / 2 }
      ],
      build() {
        stamp(layerSea, 16, 2, HAUT_FOND, false);
        terre((c, r) => c <= 7 && r <= 6, true);   // une plage devant chaque courtine
        batirCitadelle();
        ilotSable(10, 6, 'debris');
        ROCKS.push(
          { t: 51, x: 622, y: 168, r: 22 },
          { t: 49, x: 880, y: 240, r: 22 },
          { t: 65, x: 402, y: 508, r: 23 },
          { t: 66, x: 700, y: 590, r: 24 }
        );
      }
    },
    {
      cle: 'angle',
      canons: 12,
      spawns: [
        { x: 110, y: 616, cap: -Math.PI / 4 },
        { x: 252, y: 644, cap: -Math.PI / 4 }
      ],
      build() {
        // la citadelle en L epouse le coin haut-droit et sort du cadre
        terre((c, r) => r <= COURTINE.rang || c >= COURTINE.col, true);
        batirCourtines();

        // l'ilot du bastion, lui non plus, n'arrete pas les boulets
        terre((c, r) => c >= 9 && c <= 13 && r >= 4 && r <= 8, true);
        batirBastion(10, 5);
        PROPS.push({ t: 87, x: 9 * TILE + 40,  y: 7 * TILE + 40 });
        PROPS.push({ t: 88, x: 13 * TILE + 20, y: 4 * TILE + 40 });

        stamp(layerSea, 2, 6, HAUT_FOND, false);
        stamp(layerSea, 14, 5, HAUT_FOND, false);
        ROCKS.push(
          { t: 49, x: 300, y: 290,  r: 22 },
          { t: 51, x: 450, y: 250,  r: 20 },
          { t: 50, x: 170, y: 470,  r: 22 },
          { t: 65, x: 480, y: 560,  r: 24 },
          { t: 66, x: 520, y: 430,  r: 22 },
          // la passe est, elargie par le recul de la courtine, garde ses ecueils
          { t: 51, x: 1010, y: 300, r: 22 },
          { t: 49, x: 1060, y: 640, r: 20 }
        );
      }
    },
    {
      cle: 'passes',
      canons: 2,
      spawns: [
        { x: 220, y: 110, cap: Math.PI / 4 },
        { x: 352, y: 148, cap: Math.PI / 4 }
      ],
      build() {
        batirPasses();
        stamp(layerSea, 2, 4, HAUT_FOND, false);
        stamp(layerSea, 15, 7, HAUT_FOND, false);
        ROCKS.push(
          { t: 51, x: 620, y: 180, r: 22 },
          { t: 50, x: 240, y: 470, r: 23 },
          { t: 65, x: 1000, y: 470, r: 22 },
          { t: 66, x: 760, y: 600, r: 22 }
        );
      }
    }
  ]
};

function construireCarte(m, id) {
  const n = MAP_W * MAP_H;
  layerSea  = new Array(n).fill(0);
  layerLand = new Array(n).fill(0);
  solid     = new Array(n).fill(false);
  platBalle = new Array(n).fill(false);
  citGrid   = new Array(n).fill(null);
  PROPS = [];
  ROCKS = [];
  SORTIES = [];
  forts = [];
  cit = null;
  CARTES[m][id].build();
  cit = forts.find(f => f.principal) || forts[0] || null;
}

/* ---------- helpers ---------------------------------------------- */

function tileSrc(i) {
  const k = i - 1;
  return { x: (k % TILES_COLS) * TILE, y: ((k / TILES_COLS) | 0) * TILE };
}
const clamp = (v, a, b) => (v < a ? a : (v > b ? b : v));
const rnd = (a, b) => a + Math.random() * (b - a);
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const pioche = (arr) => arr[(Math.random() * arr.length) | 0];

// ecart angulaire signe le plus court entre deux caps
function ecartAngle(a, b) {
  return ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
}

function tournerVers(cur, cible, pasMax) {
  const d = clamp(ecartAngle(cur, cible), -pasMax, pasMax);
  return cur + d;
}

function bloqueA(x, y, r) {
  if (x < r || y < r || x > W - r || y > H - r) return true;
  for (const rk of ROCKS) {
    const dx = x - rk.x, dy = y - rk.y;
    if (dx * dx + dy * dy < (rk.r + r) * (rk.r + r)) return true;
  }
  const c0 = clamp(((x - r) / TILE) | 0, 0, MAP_W - 1);
  const c1 = clamp(((x + r) / TILE) | 0, 0, MAP_W - 1);
  const r0 = clamp(((y - r) / TILE) | 0, 0, MAP_H - 1);
  const r1 = clamp(((y + r) / TILE) | 0, 0, MAP_H - 1);
  for (let ry = r0; ry <= r1; ry++) {
    for (let cx = c0; cx <= c1; cx++) {
      if (solid[idx(cx, ry)]) return true;
    }
  }
  return false;
}

const horsCarte = (x, y) => x < 0 || y < 0 || x > W || y > H;

// Ce que rencontre un boulet : null, 'hors', 'obstacle', ou l'index de la
// tile de citadelle touchee.
function obstacleBoulet(x, y) {
  if (horsCarte(x, y)) return 'hors';
  for (const rk of ROCKS) {
    const dx = x - rk.x, dy = y - rk.y;
    if (dx * dx + dy * dy < rk.r * rk.r) return 'obstacle';
  }
  const i = idx(clamp((x / TILE) | 0, 0, MAP_W - 1), clamp((y / TILE) | 0, 0, MAP_H - 1));
  if (!solid[i] || platBalle[i]) return null;
  return citGrid[i] ? i : 'obstacle';
}

// Point vers lequel le joueur pointe sa bordee : la piece encore en batterie
// la plus proche. La visee suit donc l'objectif reel, et glisse d'elle-meme
// vers la suivante des qu'une piece est reduite au silence.
function canonLePlusProche(x, y) {
  let best = null, bd = Infinity;
  for (const f of forts) {
    for (const k of f.canons) {
      if (k.pv <= 0) continue;
      const d = dist(x, y, k.x, k.y);
      if (d < bd) { bd = d; best = { x: k.x, y: k.y }; }
    }
  }
  return best;
}

/* ---------- bonus -------------------------------------------------- */

const BONUS = [
  { id: 'perce',  col: '#c77dff' },
  { id: 'gerbe',  col: '#ffb703' },
  { id: 'portee', col: '#4ade80' },
  { id: 'rafale', col: '#ff4757' },
  { id: 'vent',   col: '#38bdf8', duree: 10 },
  /* Le brulot n'est pas un bonus : le ramasser coute MALUS_DEGATS points de
     coque. Il n'est pas destructible, il faut donc l'eviter. `malus` le retire
     de la legende de l'accueil - la surprise ne joue qu'une fois - mais en jeu
     il est signale sans ambiguite : anneau rouge sombre, tete de mort et meche
     allumee. Une surprise, pas une injustice.                               */
  { id: 'brulot', col: '#c1121f', malus: true }
];
// tirage a poids egal : avec 6 entrees, une barque sur six est un brulot
const BONUS_VISIBLES = BONUS.filter(b => !b.malus);
const MALUS_DEGATS = 3;
const nomBonus  = (b) => t('bonus_' + b.id);
const aideBonus = (b) => t('bonus_' + b.id + '_aide');

/* Deux emplacements distincts et cumulables : `bonus` pour l'armement, compte
   en bordees ; `mobilite` pour les bonus a duree, compte en secondes. Un bonus
   porteur d'un champ `duree` va dans le second.                            */
/* Multiplicateurs du vent arriere. La giration suit la vitesse de facon a
   conserver le rayon de giration : VITESSE/GIRATION vaut 46 px a vide, et le
   couple 1.60/1.38 le laisse a 54 px comme le reglage precedent. Augmenter la
   vitesse sans la giration transformerait le bateau en patinoire.          */
const VENT_V = 1.60, VENT_G = 1.38;
const BONUS_TIRS = 5, BONUS_MAX = 4, BONUS_R = 34;

let bonusActif = true;      // curseur de l'ecran de choix
let items, prochainBonus;

// Les encarts du HUD masqueraient un bonus qui apparaitrait dessous
function sousHud(x, y) {
  if (y > 120) return false;
  if (mode === 'aventure') return true;   // barre de citadelle en plus des encarts
  return x < 290 || x > W - 290;
}

function positionLibre() {
  for (let essai = 0; essai < 80; essai++) {
    const x = rnd(70, W - 70), y = rnd(70, H - 70);
    if (bloqueA(x, y, 42) || sousHud(x, y)) continue;
    if (bateaux.some(s => dist(x, y, s.x, s.y) < 150)) continue;
    if (items.some(it => dist(x, y, it.x, it.y) < 130)) continue;
    return { x, y };
  }
  return null;
}

function majBonus(dt) {
  if (!bonusActif || mode === 'aventure') return;   // pas de barques face au fort

  if (!fini) {
    prochainBonus -= dt;
    if (prochainBonus <= 0) {
      if (items.length < BONUS_MAX) {
        const p = positionLibre();
        if (p) items.push({ x: p.x, y: p.y, type: (Math.random() * BONUS.length) | 0, t: rnd(0, 6.28) });
      }
      prochainBonus = rnd(5.5, 9.5);
    }
  }

  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    it.t += dt;
    for (const s of bateaux) {
      if (s.coule) continue;
      if (dist(s.x, s.y, it.x, it.y) < BONUS_R + 14) {
        const b = BONUS[it.type];
        if (b.malus) {
          boom(it.x, it.y, 1.5);
          epave(it.x, it.y);
          toucher(s, it.x, it.y, MALUS_DEGATS);
        } else if (b.duree) {
          s.mobilite = { type: it.type, reste: b.duree };   // chrono des le ramassage
        } else {
          s.bonus = { type: it.type, tirs: BONUS_TIRS };
        }
        effets.push({ type: 'anneau', x: it.x, y: it.y, t: 0, vie: 0.5, col: b.col });
        items.splice(i, 1);
        break;
      }
    }
  }
}

/* ---------- brulots : barques explosives lancees sur les joueurs ----
   Elles sortent des passes de mer menagees dans la cote (`SORTIES`), foncent
   sur le bateau le plus proche et explosent au contact. Contrairement au
   brulot-piege du duel, celles-ci se detruisent au canon - c'est meme la
   seule facon de s'en debarrasser proprement.                             */

const BRULOT = {
  vitesse: 112,     // bien plus lent qu'un bateau (195) : on peut les distancer
  giration: 1.8,    // poursuite volontairement molle, on peut les semer en virant
  pv: 2,            // deux boulets au but
  degats: 3,
  cadence: 10,      // secondes entre deux salves : une barque par passe, toutes ensemble
  rayon: 20,
  sonde: 88,        // portee du palpeur d'obstacle, ~0,8 s de route
  pasSonde: 22,     // le palpeur est echantillonne, pas teste seulement au bout
  patience: 1.2     // secondes d'immobilite avant de changer de bord
};

/* Palpeurs : on essaie le cap voulu, puis des ecarts croissants de part et
   d'autre, et on prend le premier degage. La barque contourne donc l'ile par
   le bord le plus proche de sa cible au lieu de s'y ecraser. `contourne`
   memorise le bord choisi pour eviter qu'elle hesite d'un cote a l'autre.
   Le rayon est ECHANTILLONNE sur toute sa longueur : ne tester que son
   extremite laisse passer les obstacles proches — un rocher a 40 px se
   glisse sous un palpeur de 88 px et la barque vient s'y epingler.        */
function rayonLibre(b, a) {
  for (let d = BRULOT.pasSonde; d <= BRULOT.sonde; d += BRULOT.pasSonde) {
    if (bloqueA(b.x + Math.cos(a) * d, b.y + Math.sin(a) * d, BRULOT.rayon)) return false;
  }
  return true;
}

function capLibre(b, vise) {
  for (const ecart of [0, 0.3, 0.6, 0.95, 1.3, 1.7, 2.1, 2.5]) {
    const bords = ecart === 0 ? [1] : [b.contourne || 1, -(b.contourne || 1)];
    for (const signe of bords) {
      const a = vise + signe * ecart;
      if (rayonLibre(b, a)) {
        b.contourne = ecart === 0 ? 0 : signe;
        return a;
      }
    }
  }
  return vise;   // cerne de toutes parts : le detecteur d'arret prendra le relais
}

function majBrulots(dt) {
  if (!SORTIES.length) return;

  if (!fini) {
    prochainBrulot -= dt;
    if (prochainBrulot <= 0) {
      // salve : toutes les passes crachent en meme temps, on est pris a revers
      for (const p of SORTIES) {
        brulots.push({
          x: p.x, y: p.y, cap: p.cap, t: rnd(0, 6.28), pv: BRULOT.pv,
          contourne: 0, immobile: 0, jx: p.x, jy: p.y
        });
      }
      prochainBrulot = BRULOT.cadence;
    }
  }

  for (let i = brulots.length - 1; i >= 0; i--) {
    const b = brulots[i];
    b.t += dt;

    // cap sur le bateau vivant le plus proche
    let cible = null, dmin = Infinity;
    for (const s of bateaux) {
      if (s.coule) continue;
      const d = dist(b.x, b.y, s.x, s.y);
      if (d < dmin) { dmin = d; cible = s; }
    }
    if (cible) {
      const vise = capLibre(b, Math.atan2(cible.y - b.y, cible.x - b.x));
      b.cap = tournerVers(b.cap, vise, BRULOT.giration * dt);
    }

    // deplacement axe par axe : elles longent les cotes au lieu de s'y coller
    const nx = b.x + Math.cos(b.cap) * BRULOT.vitesse * dt;
    const ny = b.y + Math.sin(b.cap) * BRULOT.vitesse * dt;
    if (!bloqueA(nx, b.y, BRULOT.rayon)) b.x = nx;
    if (!bloqueA(b.x, ny, BRULOT.rayon)) b.y = ny;

    /* Filet de securite : les palpeurs suffisent contre une ile ronde, pas
       contre une poche en U. Si la barque n'a plus avance depuis un moment,
       on inverse son bord de contournement pour la decoller.              */
    if (dist(b.x, b.y, b.jx, b.jy) < 12) {
      b.immobile += dt;
      if (b.immobile > BRULOT.patience) {
        b.contourne = -(b.contourne || 1);
        b.immobile = 0;
        b.jx = b.x; b.jy = b.y;
      }
    } else {
      b.immobile = 0;
      b.jx = b.x; b.jy = b.y;
    }

    if (cible && dmin < BRULOT.rayon + RAYON_COQUE) {
      exploserBrulot(b, true);
      toucher(cible, b.x, b.y, BRULOT.degats);
      brulots.splice(i, 1);
    }
  }
}

function exploserBrulot(b, aBord) {
  boom(b.x, b.y, aBord ? 1.5 : 1.1);
  epave(b.x, b.y);
  effets.push({ type: 'anneau', x: b.x, y: b.y, t: 0, vie: 0.5, col: '#c1121f' });
}

function dessinerBrulots() {
  for (const b of brulots) {
    ctx.globalAlpha = 0.16 + (0.5 + Math.sin(b.t * 6) * 0.5) * 0.14;
    ctx.fillStyle = '#c1121f';
    ctx.beginPath();
    ctx.arc(b.x, b.y, BRULOT.rayon + 8, 0, 6.2832);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.cap - Math.PI / 2);   // le sprite de barque pointe vers le bas
    const f = FX.epave;
    ctx.drawImage(sprites, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h);
    const m = Math.sin(b.t * 13) > 0 ? FX.fire1 : FX.fire2;
    const k = 0.55 + Math.sin(b.t * 9) * 0.1;
    ctx.drawImage(sprites, m.x, m.y, m.w, m.h,
      -m.w * k / 2, -f.h / 2 - m.h * k + 5, m.w * k, m.h * k);
    ctx.restore();

    if (b.pv < BRULOT.pv) {   // coque entamee : une jauge, comme pour les pieces
      ctx.fillStyle = 'rgba(13,34,51,.65)';
      ctx.fillRect(b.x - 12, b.y - 26, 24, 5);
      ctx.fillStyle = '#c1121f';
      ctx.fillRect(b.x - 11, b.y - 25, 22 * (b.pv / BRULOT.pv), 3);
    }
  }
}

/* ---------- une blague pour le joueur 1 ---------------------------
   Taper A E A E en duel envoie un missile teleguide sur le joueur 2. C'est
   volontairement hors sujet - un engin guide dans un jeu de bateaux a voile -
   et ca ne sert qu'a voir la tete de l'adversaire. Non documente cote joueur,
   une seule fois par partie, et sans effet en aventure.
   Note : 'a' est deja une touche de barre du joueur 1, donc la sequence fait
   aussi zigzaguer le bateau. C'est tant mieux, ca masque la manoeuvre.    */

const CODE = ['a', 'e', 'a', 'e'];
const CODE_DELAI = 1.5;          // secondes max entre deux frappes
const MISSILE = {
  vitesse: 380,
  accel: 320,
  giration: 3.4,                 // teleguidage serre : la blague doit aboutir
  monte: 0.55,                   // il grimpe avant de piquer sur sa cible
  rayon: 16,
  duree: 14                      // securite si la cible disparait en vol
};

function guetterCode(k) {
  if (mode !== 'duel' || fini || !missileArme) return;
  if (temps - dernierAppui > CODE_DELAI) sequence = [];
  dernierAppui = temps;
  sequence.push(k);
  if (sequence.length > CODE.length) sequence.shift();
  if (sequence.length === CODE.length && CODE.every((c, i) => sequence[i] === c)) {
    sequence = [];
    lancerMissile();
  }
}

function lancerMissile() {
  const tireur = bateaux[0], cible = bateaux[1];
  if (!tireur || !cible || tireur.coule || cible.coule) return;
  missileArme = false;
  missile = {
    x: tireur.x, y: tireur.y, cap: -Math.PI / 2,   // depart a la verticale
    v: 90, t: 0, fumee: 0, cible
  };
  fumee(tireur.x, tireur.y, 0, 1, 10);
}

function majMissile(dt) {
  if (!missile) return;
  const m = missile;
  m.t += dt;

  // apres la montee, il vire sur la cible et ne la lache plus
  if (m.t > MISSILE.monte && !m.cible.coule) {
    m.cap = tournerVers(m.cap, Math.atan2(m.cible.y - m.y, m.cible.x - m.x), MISSILE.giration * dt);
  }
  m.v = Math.min(MISSILE.vitesse, m.v + MISSILE.accel * dt);
  m.x += Math.cos(m.cap) * m.v * dt;
  m.y += Math.sin(m.cap) * m.v * dt;

  // trainee de fumee
  m.fumee -= dt;
  if (m.fumee <= 0) {
    m.fumee = 0.025;
    effets.push({
      type: 'fumee', x: m.x - Math.cos(m.cap) * 16, y: m.y - Math.sin(m.cap) * 16,
      t: 0, vie: rnd(0.5, 0.9), vx: rnd(-14, 14), vy: rnd(-14, 14), r: rnd(3, 6)
    });
  }

  if (!m.cible.coule && dist(m.x, m.y, m.cible.x, m.cible.y) < MISSILE.rayon + RAYON_COQUE) {
    // il ne survole pas les iles par hasard : un missile, ca vole
    for (let i = 0; i < 10; i++) {
      boom(m.cible.x + rnd(-46, 46), m.cible.y + rnd(-52, 52), rnd(1, 1.9), i * 0.06);
    }
    epave(m.cible.x, m.cible.y);
    toucher(m.cible, m.x, m.y, PV_MAX);
    missile = null;
    return;
  }
  if (m.t > MISSILE.duree) missile = null;
}

function dessinerMissile() {
  if (!missile) return;
  const m = missile;
  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.cap);

  // souffle
  const g = 10 + Math.sin(m.t * 45) * 5;
  ctx.fillStyle = '#ffb703';
  ctx.beginPath();
  ctx.moveTo(-15, -3.5); ctx.lineTo(-15 - g, 0); ctx.lineTo(-15, 3.5);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.moveTo(-15, -1.8); ctx.lineTo(-15 - g * 0.55, 0); ctx.lineTo(-15, 1.8);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#5b6770';                       // ailerons
  ctx.beginPath();
  ctx.moveTo(-14, -4); ctx.lineTo(-19, -9); ctx.lineTo(-8, -4);
  ctx.moveTo(-14, 4);  ctx.lineTo(-19, 9);  ctx.lineTo(-8, 4);
  ctx.fill();

  ctx.fillStyle = '#cfd8dd';                       // fuselage
  ctx.beginPath();
  ctx.roundRect(-15, -4, 26, 8, 3);
  ctx.fill();

  ctx.fillStyle = '#e8453f';                       // ogive
  ctx.beginPath();
  ctx.moveTo(11, -4); ctx.lineTo(20, 0); ctx.lineTo(11, 4);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* ---------- entites ---------------------------------------------- */

const PV_MAX = 9, VITESSE = 195, GIRATION = 4.2, RECHARGE = 1.15;
const RAFALE = 0.19;   // fraction du rechargement conservee par le tir en rafale
const RAYON_COQUE = 26;

// Boulet de bord : c'est ce couple qui fixe la portee des joueurs, et donc
// la reference a laquelle se compare CIT.canonPortee.
const BOULET_VIE = 1.3, BOULET_V = 420;
const PORTEE_JOUEUR = Math.round(BOULET_VIE * BOULET_V);

function creerBateau(cfg) {
  return {
    cle: cfg.cle, pavillon: cfg.pavillon, equipe: cfg.equipe,
    teinte: cfg.teinte, touches: cfg.touches,
    x: cfg.x, y: cfg.y, cap: cfg.cap,
    vx: 0, vy: 0, pv: PV_MAX, cool: 0, coule: false, alpha: 1,
    bonus: null, mobilite: null, sillage: []
  };
}

let bateaux, boulets, effets, brulots, prochainBrulot, fini, resultat, vainqueur, temps;
let missile, missileArme, sequence, dernierAppui;
let ecran = 'menu';          // 'menu' | 'jeu'
let mode = 'duel';           // 'duel' | 'aventure'
let carteChoisie = 0;
let nbJoueurs = 2;

const PROFILS = [
  { cle: 'joueur1', pavillon: 3, teinte: '#e8453f', touches: 'p1' },
  { cle: 'joueur2', pavillon: 5, teinte: '#4a9fe0', touches: 'p2' }
];

function reset() {
  construireCarte(mode, carteChoisie);
  const carte = CARTES[mode][carteChoisie];
  const n = mode === 'aventure' ? nbJoueurs : 2;
  bateaux = [];
  for (let i = 0; i < n; i++) {
    bateaux.push(creerBateau({
      ...PROFILS[i],
      equipe: mode === 'aventure' ? 'joueur' : PROFILS[i].touches,
      ...carte.spawns[i]
    }));
  }
  boulets = [];
  effets = [];
  items = [];
  prochainBonus = 4;
  brulots = [];
  missile = null;
  missileArme = true;
  sequence = [];
  dernierAppui = 0;
  prochainBrulot = 0;   // premiere salve des le coup d'envoi, pas apres un delai
  fini = false;
  resultat = null;
  vainqueur = null;
  temps = 0;
}

function etat(s) {
  if (s.coule) return 3;
  return clamp(((PV_MAX - s.pv) / 3) | 0, 0, 2);
}

// Vers quoi le joueur pointe sa bordee : l'adversaire, ou la citadelle
function cibleDe(s) {
  if (mode === 'aventure') return canonLePlusProche(s.x, s.y);
  return bateaux.find(o => o !== s) || null;
}

/* ---------- entrees ---------------------------------------------- */

/* Le pilotage est lu sur `e.code`, c'est-a-dire la POSITION physique de la
   touche, et non sur `e.key` qui donne le caractere produit. `KeyW/A/S/D`
   tombent ainsi sur Z Q S D en AZERTY et sur W A S D en QWERTY, sans alias
   ni collision : plus besoin d'accepter 'a' comme 'gauche', ce qui laissait
   la touche A barrer a babord sur un clavier francais.
   Les commandes qui sont de vraies LETTRES (r, m, b, l) restent sur `e.key`,
   comme la sequence de l'easter egg : ce sont des caracteres, pas des
   positions. Les chiffres acceptent les deux, la rangee du haut d'un AZERTY
   ne produisant pas de chiffre sans Maj.                                   */

const enfoncees = new Set();
const TOUCHES = {
  p1: { haut: ['KeyW'], bas: ['KeyS'], gauche: ['KeyA'], droite: ['KeyD'], feu: ['Space'] },
  p2: {
    haut: ['ArrowUp'], bas: ['ArrowDown'], gauche: ['ArrowLeft'], droite: ['ArrowRight'],
    feu: ['Enter', 'NumpadEnter']
  }
};
const tenue = (liste) => liste.some(k => enfoncees.has(k));
const AVALEES = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                         'Space', 'Enter', 'NumpadEnter', 'Tab']);

addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  const c = e.code || '';
  if (AVALEES.has(c)) e.preventDefault();

  if (ecran === 'menu') { toucheMenu(k, c); return; }

  guetterCode(k);
  if (k === 'r') { reset(); return; }
  if (c === 'Escape' || k === 'm') { ecran = 'menu'; enfoncees.clear(); return; }
  enfoncees.add(c);
});
addEventListener('keyup', e => enfoncees.delete(e.code || ''));
addEventListener('blur', () => enfoncees.clear());

function toucheMenu(k, c) {
  const gauche = c === 'ArrowLeft'  || c === 'KeyA';
  const droite = c === 'ArrowRight' || c === 'KeyD';
  const vertic = c === 'ArrowUp' || c === 'ArrowDown' || c === 'KeyW' || c === 'KeyS' || c === 'Tab';

  if (vertic) {
    mode = mode === 'duel' ? 'aventure' : 'duel';
    carteChoisie = 0;
  } else if (mode === 'duel' && (gauche || droite)) {
    const n = CARTES.duel.length;
    carteChoisie = (carteChoisie + (droite ? 1 : n - 1)) % n;
  } else if (mode === 'aventure' && (gauche || droite)) {
    const n = CARTES.aventure.length;
    carteChoisie = (carteChoisie + (droite ? 1 : n - 1)) % n;
  }
  if (mode === 'aventure') {
    // en AZERTY la rangee du haut ne donne pas de chiffre sans Maj : on
    // accepte donc aussi la position de la touche
    if (k === '1' || c === 'Digit1' || c === 'Numpad1') nbJoueurs = 1;
    if (k === '2' || c === 'Digit2' || c === 'Numpad2') nbJoueurs = 2;
  }
  if (k === 'l') choisirLangue(LANGUES[(LANGUES.indexOf(langue) + 1) % LANGUES.length]);
  if (k === 'b' && mode === 'duel') bonusActif = !bonusActif;
  if (c === 'Enter' || c === 'NumpadEnter' || c === 'Space') { reset(); ecran = 'jeu'; }
}

function versCanvas(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
}

const dedans = (p, z) => p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h;

cv.addEventListener('mousemove', e => {
  if (ecran !== 'menu') return;
  const p = versCanvas(e);
  survol = zonesMenu().find(z => dedans(p, z)) || null;
  cv.style.cursor = survol ? 'pointer' : 'default';
});

cv.addEventListener('click', e => {
  if (ecran !== 'menu') return;
  const z = zonesMenu().find(zz => dedans(versCanvas(e), zz));
  if (!z) return;
  if (z.role === 'langue')   choisirLangue(z.id);
  if (z.role === 'mode')     { mode = z.id; carteChoisie = 0; }
  if (z.role === 'carte')    carteChoisie = z.id;
  if (z.role === 'equipage') nbJoueurs = z.id;
  if (z.role === 'bonus')    bonusActif = !bonusActif;
  if (z.role === 'go')       { reset(); ecran = 'jeu'; }
});

/* ---------- effets ----------------------------------------------- */

function boom(x, y, taille, delai) {
  effets.push({ type: 'boom', x, y, t: 0, vie: 0.34, sc: taille, delai: delai || 0 });
}

function fumee(x, y, dx, dy, n) {
  for (let i = 0; i < (n || 5); i++) {
    effets.push({
      type: 'fumee', x, y, t: 0, vie: rnd(0.35, 0.7),
      vx: dx * rnd(20, 60) + rnd(-25, 25), vy: dy * rnd(20, 60) + rnd(-25, 25),
      r: rnd(4, 9)
    });
  }
}

function epave(x, y) {
  for (let i = 0; i < 12; i++) {
    effets.push({
      type: 'bois', x, y, t: 0, vie: rnd(1.4, 2.6),
      vx: rnd(-70, 70), vy: rnd(-70, 70), rot: rnd(0, 6.28), vr: rnd(-2, 2),
      img: pioche(FX.wood)
    });
  }
}

/* ---------- tir --------------------------------------------------- */

function tirer(s, cible) {
  if (!cible) return;
  const b = s.bonus;
  const type   = b ? BONUS[b.type].id : null;
  const perce  = type === 'perce';
  const gerbe  = type === 'gerbe';
  const longue = type === 'portee';
  const rafale = type === 'rafale';

  const postes   = gerbe ? [-40, -24, -8, 8, 24, 40] : [-26, 0, 26];
  const eventail = gerbe ? 0.245 : 0;    // demi-ouverture de la gerbe (~14 deg)
  const ecart    = 0.035;                // dispersion aleatoire
  const vie      = longue ? BOULET_VIE * 1.55 : BOULET_VIE;
  const vmin     = longue ? BOULET_V + 50 : BOULET_V - 20;

  const hx = Math.cos(s.cap), hy = Math.sin(s.cap);
  const ex = cible.x - s.x, ey = cible.y - s.y;
  // produit vectoriel : le signe donne le bord ou se trouve la cible
  const bord = (hx * ey - hy * ex) >= 0 ? 1 : -1;
  const angleFeu = s.cap + bord * Math.PI / 2;
  const fx = Math.cos(angleFeu), fy = Math.sin(angleFeu);

  postes.forEach((t, i) => {
    // en gerbe, chaque poste tire en eventail : biais de -1 a +1 le long de la coque
    const biais = gerbe ? (i - (postes.length - 1) / 2) / ((postes.length - 1) / 2) : 0;
    const a = angleFeu + biais * eventail + rnd(-ecart, ecart);
    const ox = s.x + hx * t + fx * 20;
    const oy = s.y + hy * t + fy * 20;
    boulets.push({
      x: ox, y: oy,
      vx: Math.cos(a) * rnd(vmin, vmin + 40), vy: Math.sin(a) * rnd(vmin, vmin + 40),
      vie, perce, equipe: s.equipe, teinte: b ? BONUS[b.type].col : null
    });
    fumee(ox, oy, fx, fy);
  });

  // en rafale les 5 bordees s'enchainent presque sans rechargement ; on allege
  // le recul, sinon cinq coups coup sur coup deportent le bateau hors controle
  s.cool = rafale ? RECHARGE * RAFALE : RECHARGE;
  const recul = rafale ? 11 : 26;
  s.vx -= fx * recul;
  s.vy -= fy * recul;

  if (b && --b.tirs <= 0) s.bonus = null;
}

/* ---------- citadelle --------------------------------------------- */

function majCitadelle(dt) {
  for (const f of forts) for (const k of f.canons) {
    if (k.flash > 0) k.flash -= dt;
    if (k.pv <= 0 || f.detruite) continue;
    k.cool -= dt;

    // cible la plus proche dans le secteur de la piece
    let meilleure = null, meilleureD = CIT.canonPortee;
    for (const s of bateaux) {
      if (s.coule) continue;
      const d = dist(k.x, k.y, s.x, s.y);
      if (d > meilleureD) continue;
      if (Math.abs(ecartAngle(k.base, Math.atan2(s.y - k.y, s.x - k.x))) > k.arc) continue;
      meilleure = s; meilleureD = d;
    }

    // la piece pivote vers sa visee, ou revient dans l'axe de son secteur
    let vise = k.base;
    if (meilleure) {
      // anticipation imparfaite : le tir reste esquivable
      const vol = meilleureD / CIT.canonVitesse;
      const vx = meilleure.x + meilleure.vx * vol * CIT.canonAnticipe;
      const vy = meilleure.y + meilleure.vy * vol * CIT.canonAnticipe;
      const brut = Math.atan2(vy - k.y, vx - k.x);
      vise = k.base + clamp(ecartAngle(k.base, brut), -k.arc, k.arc);
    }
    k.angle = tournerVers(k.angle, vise, CIT.canonPivot * dt);

    // pas de tir tant que la piece n'est pas en batterie : le pivot telegraphe
    if (!meilleure || k.cool > 0) continue;
    if (Math.abs(ecartAngle(k.angle, vise)) > CIT.canonAligne) continue;

    const a = k.angle + rnd(-CIT.canonEcart, CIT.canonEcart);
    const ox = k.x + Math.cos(k.angle) * 38, oy = k.y + Math.sin(k.angle) * 38;
    boulets.push({
      x: ox, y: oy,
      vx: Math.cos(a) * CIT.canonVitesse, vy: Math.sin(a) * CIT.canonVitesse,
      vie: CIT.canonPortee / CIT.canonVitesse + 0.3,
      perce: false, equipe: 'citadelle', teinte: null
    });
    fumee(ox, oy, Math.cos(k.angle), Math.sin(k.angle), 6);
    k.flash = 0.12;
    k.cool = CIT.canonCadence * rnd(0.85, 1.25);
  }
}

/* La maconnerie est indestructible : seules les pieces encaissent. Un boulet
   qui frappe un pan de mur n'est qu'un coup perdu, ce qui interdit de gagner
   en pilonnant un point fixe.                                              */
function degatCitadelle(i, bl) {
  const g = citGrid[i];
  const f = forts[g.f];
  boom(bl.x, bl.y, 0.75);
  if (g.k < 0) return;

  const k = f.canons[g.k];
  if (k.pv <= 0 || --k.pv > 0) return;

  boom(k.x, k.y, 1.2);
  if (k.garderSol) {
    /* Piece posee sur un socle a elle (une tour sur son ilot) : on se contente
       de retirer le canon. Y ecrire une ruine remplacerait le sable par une
       tuile de mur eventree, dont les marges transparentes laisseraient voir
       la mer — un carre bleu en plein milieu de l'ilot. La tour reste debout,
       simplement desarmee, et sa maconnerie continue d'arreter les boulets. */
    citGrid[idx(k.c, k.r)] = { f: g.f, k: -1 };
  } else {
    brecher(k.c, k.r, k.orient);        // l'embrasure eventree laisse filer les boulets
  }
  if (f.canons.every(p => p.pv <= 0)) raserFort(f);
}

/* Toutes les pieces d'une fortification sont hors de combat : ses murs
   s'effondrent. Les gravats restent infranchissables aux coques mais
   laissent passer les boulets, ce qui degage une ligne de tir vers ce que le
   fort masquait.                                                           */
function raserFort(f) {
  f.detruite = true;
  for (const m of f.murs) brecher(m.c, m.r, m.orient);
  // la cascade suit les tiles du fort : marche aussi bien pour un carre que
  // pour une courtine en L dont le centre de gravite tombe hors des murs
  for (let i = 0; i < Math.min(24, f.tiles.length * 2); i++) {
    const t = pioche(f.tiles);
    boom(t.c * TILE + rnd(0, TILE), t.r * TILE + rnd(0, TILE), rnd(0.8, 1.7), i * 0.08);
  }
  if (forts.every(o => o.detruite)) { fini = true; resultat = 'victoire'; }
}

/* ---------- update ------------------------------------------------ */

function update(dt) {
  temps += dt;

  /* Partie jouee : on gele tout ce qui pourrait encore changer l'issue. Sans
     ce garde-fou le joueur continuait a manoeuvrer, les brulots a le
     poursuivre et les boulets a voler : une victoire se transformait en
     defaite si l'on posait la manette. Seuls les effets visuels continuent,
     pour que la cascade d'explosions se joue jusqu'au bout.               */
  if (fini) { majEffets(dt); return; }

  for (const s of bateaux) {
    // le bonus de mobilite se consomme au temps qui passe, pas aux tirs
    if (s.mobilite && (s.mobilite.reste -= dt) <= 0) s.mobilite = null;
    const vent = !!s.mobilite;

    if (!s.coule) {
      const k = TOUCHES[s.touches];
      let ix = (tenue(k.droite) ? 1 : 0) - (tenue(k.gauche) ? 1 : 0);
      let iy = (tenue(k.bas) ? 1 : 0) - (tenue(k.haut) ? 1 : 0);
      const len = Math.hypot(ix, iy);
      if (len > 0) {
        ix /= len; iy /= len;
        // la giration monte avec la vitesse, sinon le bateau part en patinoire
        s.cap = tournerVers(s.cap, Math.atan2(iy, ix), GIRATION * (vent ? VENT_G : 1) * dt);
      }
      const vmax = VITESSE * (vent ? VENT_V : 1);
      const f = 1 - Math.exp(-5.5 * dt);
      s.vx += (ix * vmax - s.vx) * f;
      s.vy += (iy * vmax - s.vy) * f;

      s.cool = Math.max(0, s.cool - dt);
      if (tenue(k.feu) && s.cool === 0 && !fini) tirer(s, cibleDe(s));
    } else {
      s.vx *= Math.exp(-2.2 * dt);
      s.vy *= Math.exp(-2.2 * dt);
      s.alpha = Math.max(0.72, s.alpha - dt * 0.35);
    }

    // deplacement axe par axe : on glisse le long des obstacles
    const nx = s.x + s.vx * dt;
    if (!bloqueA(nx, s.y, RAYON_COQUE)) s.x = nx; else s.vx *= -0.15;
    const ny = s.y + s.vy * dt;
    if (!bloqueA(s.x, ny, RAYON_COQUE)) s.y = ny; else s.vy *= -0.15;

    // sillage
    const v = Math.hypot(s.vx, s.vy);
    const dernier = s.sillage[0];
    // sous le vent le sillage se resserre et grossit : ca se lit immediatement
    if (v > 25 && (!dernier || dist(s.x, s.y, dernier.x, dernier.y) > (vent ? 6 : 9))) {
      s.sillage.unshift({ x: s.x - Math.cos(s.cap) * 40, y: s.y - Math.sin(s.cap) * 40, a: 1, gros: vent });
      if (s.sillage.length > (vent ? 34 : 26)) s.sillage.pop();
    }
    s.sillage.forEach(p => { p.a -= dt * 0.75; });
    s.sillage = s.sillage.filter(p => p.a > 0);
  }

  // les coques se repoussent
  if (bateaux.length === 2) {
    const a = bateaux[0], b = bateaux[1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.hypot(dx, dy);
    if (d > 0.001 && d < 56) {
      const p = (56 - d) / 2, ux = dx / d, uy = dy / d;
      if (!bloqueA(a.x - ux * p, a.y - uy * p, RAYON_COQUE)) { a.x -= ux * p; a.y -= uy * p; }
      if (!bloqueA(b.x + ux * p, b.y + uy * p, RAYON_COQUE)) { b.x += ux * p; b.y += uy * p; }
    }
  }

  majBonus(dt);
  majBrulots(dt);
  majMissile(dt);
  majCitadelle(dt);   // update() rend la main plus haut si la partie est jouee

  // boulets
  for (let i = boulets.length - 1; i >= 0; i--) {
    const bl = boulets[i];
    bl.x += bl.vx * dt;
    bl.y += bl.vy * dt;
    bl.vie -= dt;
    let mort = bl.vie <= 0;

    if (!mort) {
      const o = obstacleBoulet(bl.x, bl.y);
      if (o === 'hors') {
        mort = true;
      } else if (o === 'obstacle') {
        // les perforants ignorent iles et rochers
        if (!bl.perce) { boom(bl.x, bl.y, 0.6); mort = true; }
      } else if (o !== null) {
        // Tile de citadelle. Les pieces sont sur les remparts : leurs propres
        // boulets passent au-dessus du fort, sinon les canons des murs nord et
        // ouest ne pourraient jamais tirer vers le large. Les perforants des
        // joueurs, eux, s'arretent sur le mur et l'entament.
        if (bl.equipe !== 'citadelle') { degatCitadelle(o, bl); mort = true; }
      }
    }

    if (!mort) {
      for (const s of bateaux) {
        if (s.coule || s.equipe === bl.equipe) continue;
        // on repasse le boulet dans le repere du bateau : rectangle coque
        const rx = bl.x - s.x, ry = bl.y - s.y;
        const c = Math.cos(-s.cap), sn = Math.sin(-s.cap);
        const long = rx * c - ry * sn;
        const travers = rx * sn + ry * c;
        if (Math.abs(long) < 46 && Math.abs(travers) < 20) {
          toucher(s, bl.x, bl.y);
          mort = true;
          break;
        }
      }
    }

    // les brulots lances sur les joueurs se detruisent au canon
    if (!mort && bl.equipe !== 'citadelle') {
      for (let j = brulots.length - 1; j >= 0; j--) {
        const b = brulots[j];
        if (dist(bl.x, bl.y, b.x, b.y) > BRULOT.rayon) continue;
        mort = true;
        if (--b.pv <= 0) { exploserBrulot(b, false); brulots.splice(j, 1); }
        else boom(bl.x, bl.y, 0.6);
        break;
      }
    }
    if (mort) boulets.splice(i, 1);
  }

  majEffets(dt);
}

function majEffets(dt) {
  for (let i = effets.length - 1; i >= 0; i--) {
    const e = effets[i];
    if (e.delai > 0) { e.delai -= dt; continue; }
    e.t += dt;
    if (e.vx !== undefined) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      const fr = Math.exp(-1.6 * dt);
      e.vx *= fr; e.vy *= fr;
    }
    if (e.rot !== undefined) e.rot += e.vr * dt;
    if (e.t >= e.vie) effets.splice(i, 1);
  }
}

function toucher(s, x, y, degats) {
  const avant = etat(s);
  s.pv = Math.max(0, s.pv - (degats || 1));
  boom(x, y, 0.85);
  if (etat(s) > avant && s.pv > 0) boom(s.x, s.y, 1.1);
  if (s.pv > 0 || s.coule) return;

  s.coule = true;
  s.bonus = null;
  s.mobilite = null;
  boom(s.x, s.y, 1.5);
  epave(s.x, s.y);

  if (mode === 'duel') {
    fini = true;
    resultat = 'duel';
    vainqueur = bateaux.find(o => o !== s);
  } else if (bateaux.every(o => o.coule)) {
    fini = true;
    resultat = 'defaite';
  }
}

/* ---------- rendu : mer et tiles ---------------------------------- */

let mer = null;
function prepareMer() {
  mer = document.createElement('canvas');
  mer.width = W;
  mer.height = H;
  const m = mer.getContext('2d');
  m.fillStyle = '#a9e1f4';
  m.fillRect(0, 0, W, H);
  m.strokeStyle = 'rgba(255,255,255,.26)';
  m.lineWidth = 3;
  m.lineCap = 'round';
  for (let y = 18; y < H; y += 46) {
    for (let x = -40; x < W; x += 190) {
      m.beginPath();
      m.moveTo(x, y);
      m.bezierCurveTo(x + 40, y - 9, x + 70, y + 9, x + 110, y);
      m.stroke();
    }
  }
  m.fillStyle = 'rgba(255,255,255,.14)';
  for (let i = 0; i < 260; i++) {
    const s = rnd(2, 5);
    m.fillRect(rnd(0, W), rnd(0, H), s, s);
  }
}

function drawTile(i, x, y, g, k) {
  const s = tileSrc(i);
  (g || ctx).drawImage(tuiles, s.x, s.y, TILE, TILE, x, y, TILE * (k || 1), TILE * (k || 1));
}

function drawFrame(f, x, y, w, h) {
  ctx.drawImage(sprites, f.x, f.y, f.w, f.h, x, y, w, h);
}

function drawCalque(layer, g, k) {
  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      const t = layer[idx(c, r)];
      if (t) drawTile(t, c * TILE * k, r * TILE * k, g, k);
    }
  }
}

/* ---------- rendu : partie ---------------------------------------- */

function draw() {
  ctx.drawImage(mer, 0, 0);
  drawCalque(layerSea, ctx, 1);

  // sillages, sous les coques
  ctx.fillStyle = '#ffffff';
  for (const s of bateaux) {
    for (const p of s.sillage) {
      ctx.globalAlpha = p.a * (p.gros ? 0.42 : 0.30);
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.gros ? 8 : 5) + (1 - p.a) * (p.gros ? 17 : 12), 0, 6.2832);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  drawCalque(layerLand, ctx, 1);
  for (const p of PROPS) dessinerProp(p, ctx, 1);
  for (const rk of ROCKS) drawTile(rk.t, rk.x - TILE / 2, rk.y - TILE / 2);

  dessinerCanons();

  for (const it of items) dessinerItem(it);
  dessinerBrulots();

  for (const s of bateaux) dessinerBateau(s);

  // boulets
  for (const bl of boulets) {
    if (bl.teinte) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = bl.teinte;
      ctx.beginPath();
      ctx.arc(bl.x, bl.y, 10, 0, 6.2832);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (bl.equipe === 'citadelle') {
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = '#2b3a44';
      ctx.beginPath();
      ctx.arc(bl.x, bl.y, 9, 0, 6.2832);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    drawFrame(FX.ball, bl.x - 6, bl.y - 6, 12, 12);
  }

  dessinerEffets();
  dessinerMissile();
  drawHud();
}

// Pieces de la citadelle : sprite pivote vers la visee courante, sur le mur nu
function dessinerCanons() {
  const f = FX.canon, sc = 1.25;
  for (const fort of forts) for (const k of fort.canons) {
    if (k.pv <= 0) continue;

    ctx.save();
    ctx.translate(k.x, k.y);
    ctx.rotate(k.angle);
    ctx.drawImage(sprites, f.x, f.y, f.w, f.h,
      -f.w * sc / 2, -f.h * sc / 2, f.w * sc, f.h * sc);
    ctx.restore();

    if (k.flash > 0) {
      ctx.globalAlpha = k.flash / 0.12;
      ctx.fillStyle = '#ffe27a';
      ctx.beginPath();
      ctx.arc(k.x + Math.cos(k.angle) * 26, k.y + Math.sin(k.angle) * 26, 9, 0, 6.2832);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // jauge de la piece, seulement une fois entamee
    if (k.pv < k.pvMax) {
      ctx.fillStyle = 'rgba(13,34,51,.65)';
      ctx.fillRect(k.x - 13, k.y - 27, 26, 5);
      ctx.fillStyle = '#e8453f';
      ctx.fillRect(k.x - 12, k.y - 26, 24 * (k.pv / k.pvMax), 3);
    }
  }
}

function anneauBonus(s, col, r) {
  ctx.globalAlpha = 0.30 + Math.sin(temps * 5) * 0.10;
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(s.x, s.y, r, 0, 6.2832);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function dessinerBateau(s) {
  // un anneau par emplacement : armement au plus pres, mobilite au-dessus
  if (!s.coule) {
    if (s.bonus) anneauBonus(s, BONUS[s.bonus.type].col, 44);
    if (s.mobilite) anneauBonus(s, BONUS[s.mobilite.type].col, 53);
  }

  const f = SHIP_XY[s.pavillon + 6 * etat(s) - 1];
  ctx.save();
  ctx.globalAlpha = s.alpha;
  ctx.translate(s.x, s.y);
  ctx.rotate(s.cap - Math.PI / 2);   // le sprite Kenney pointe vers le bas
  ctx.drawImage(sprites, f[0], f[1], SHIP_W, SHIP_H,
    -SHIP_W * SHIP_SC / 2, -SHIP_H * SHIP_SC / 2, SHIP_W * SHIP_SC, SHIP_H * SHIP_SC);

  // flammes quand la coque souffre
  const e = etat(s);
  if (!s.coule && e >= 1) {
    const n = e === 1 ? 1 : 3;
    for (let i = 0; i < n; i++) {
      const ph = temps * 9 + i * 2.1;
      const fr = Math.sin(ph) > 0 ? FX.fire1 : FX.fire2;
      const k = 0.75 + Math.sin(ph * 1.7) * 0.12;
      const fxx = -12 + i * 12, fyy = 6 + (i % 2) * 16;
      ctx.drawImage(sprites, fr.x, fr.y, fr.w, fr.h,
        fxx - fr.w * k / 2, fyy - fr.h * k, fr.w * k, fr.h * k);
    }
  }
  ctx.restore();
}

function dessinerEffets() {
  for (const e of effets) {
    if (e.delai > 0) continue;
    const k = e.t / e.vie;
    if (e.type === 'boom') {
      const fr = EXPLO_FRAMES[Math.min(EXPLO_FRAMES.length - 1, (k * EXPLO_FRAMES.length) | 0)];
      ctx.globalAlpha = 1 - k * k;
      drawFrame(fr, e.x - fr.w * e.sc / 2, e.y - fr.h * e.sc / 2, fr.w * e.sc, fr.h * e.sc);
    } else if (e.type === 'fumee') {
      ctx.globalAlpha = (1 - k) * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * (1 + k * 1.8), 0, 6.2832);
      ctx.fill();
    } else if (e.type === 'bois') {
      ctx.globalAlpha = 1 - k * k;
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rot);
      drawFrame(e.img, -e.img.w / 2, -e.img.h / 2, e.img.w, e.img.h);
      ctx.restore();
    } else if (e.type === 'anneau') {
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = e.col;
      ctx.lineWidth = 5 * (1 - k) + 1;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 18 + k * 55, 0, 6.2832);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// Un bonus flottant : anneau colore, barque qui tangue, badge du type
function dessinerItem(it) {
  const b = BONUS[it.type];
  const col = b.col;
  // le brulot bat plus vite : l'urgence se lit avant meme le pictogramme
  const pulse = 0.5 + Math.sin(it.t * (b.malus ? 6 : 3)) * 0.5;

  ctx.globalAlpha = 0.18 + pulse * 0.14;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(it.x, it.y, BONUS_R, 0, 6.2832);
  ctx.fill();

  ctx.globalAlpha = 0.55 + pulse * 0.35;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(it.x, it.y, BONUS_R - 2, 0, 6.2832);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(it.x, it.y + Math.sin(it.t * 2) * 2);
  ctx.rotate(Math.sin(it.t * 0.9) * 0.35);
  const f = b.malus ? FX.epave : FX.barque;
  ctx.drawImage(sprites, f.x, f.y, f.w, f.h, -f.w / 2, -f.h / 2, f.w, f.h);
  if (b.malus) {
    // meche allumee a la proue, qui vacille
    const m = Math.sin(it.t * 11) > 0 ? FX.fire1 : FX.fire2;
    const k = 0.5 + Math.sin(it.t * 7) * 0.09;
    ctx.drawImage(sprites, m.x, m.y, m.w, m.h,
      -m.w * k / 2, -f.h / 2 - m.h * k + 4, m.w * k, m.h * k);
  }
  ctx.restore();

  const by = it.y - BONUS_R - 13;
  ctx.fillStyle = b.malus ? 'rgba(74,10,14,.9)' : 'rgba(13,34,51,.82)';
  ctx.beginPath();
  ctx.roundRect(it.x - 17, by - 11, 34, 22, 6);
  ctx.fill();
  glyphe(ctx, b, it.x, by, col);
}

// Le badge se choisit sur l'identifiant, pas sur l'index : inserer un bonus
// au milieu du tableau ne decale plus les dessins.
function glyphe(g, b, cx, cy, col) {
  const id = b.id;
  g.strokeStyle = col;
  g.lineWidth = 2;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  if (id === 'perce') {                   // fleche a travers un mur
    g.fillStyle = 'rgba(255,255,255,.45)';
    g.fillRect(cx - 1.5, cy - 7, 3, 14);
    g.beginPath();
    g.moveTo(cx - 9, cy); g.lineTo(cx + 8, cy);
    g.moveTo(cx + 4, cy - 4); g.lineTo(cx + 8, cy); g.lineTo(cx + 4, cy + 4);
    g.stroke();
  } else if (id === 'gerbe') {            // trois traits en eventail
    g.beginPath();
    for (const a of [-0.5, 0, 0.5]) {
      g.moveTo(cx - 7, cy);
      g.lineTo(cx - 7 + Math.cos(a) * 15, cy + Math.sin(a) * 15);
    }
    g.stroke();
  } else if (id === 'portee') {           // chevrons
    g.beginPath();
    for (const dx of [-8, -1, 6]) {
      g.moveTo(cx + dx, cy - 5); g.lineTo(cx + dx + 5, cy); g.lineTo(cx + dx, cy + 5);
    }
    g.stroke();
  } else if (id === 'rafale') {           // trois boulets qui se suivent
    g.fillStyle = col;
    [-8, 0, 8].forEach((dx, i) => {
      g.beginPath();
      g.arc(cx + dx, cy, 3.4 - i * 0.7, 0, 6.2832);
      g.fill();
    });
    g.beginPath();
    g.moveTo(cx - 12, cy - 6); g.lineTo(cx - 4, cy - 6);
    g.moveTo(cx - 12, cy + 6); g.lineTo(cx - 4, cy + 6);
    g.stroke();
  } else if (id === 'vent') {             // deux rafales qui filent
    g.beginPath();
    g.moveTo(cx - 11, cy - 5);
    g.quadraticCurveTo(cx + 8, cy - 9, cx + 3, cy - 1);
    g.moveTo(cx - 11, cy + 4);
    g.quadraticCurveTo(cx + 12, cy - 1, cx + 6, cy + 8);
    g.stroke();
  } else {                                // brulot : tete de mort
    g.fillStyle = col;
    g.beginPath();
    g.arc(cx, cy - 2, 6, 0, 6.2832);
    g.fill();
    g.fillRect(cx - 3.5, cy + 3, 7, 4);
    g.fillStyle = 'rgba(74,10,14,1)';
    g.beginPath();
    g.arc(cx - 2.3, cy - 2.5, 1.9, 0, 6.2832);
    g.arc(cx + 2.3, cy - 2.5, 1.9, 0, 6.2832);
    g.fill();
    g.fillRect(cx - 0.7, cy + 3.5, 1.4, 3);
  }
}

function drawHud() {
  bateaux.forEach((s, i) => {
    const x = i === 0 ? 18 : W - 18 - 240;
    const y = 16;
    ctx.fillStyle = 'rgba(13,34,51,.55)';
    const lignes = (s.bonus ? 1 : 0) + (s.mobilite ? 1 : 0);
    ctx.fillRect(x, y, 240, 56 + lignes * 18);

    ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
    ctx.fillStyle = s.teinte;
    ctx.textAlign = 'left';
    ctx.fillText(t(s.cle), x + 12, y + 21);

    for (let h = 0; h < PV_MAX; h++) {
      ctx.fillStyle = h < s.pv ? s.teinte : 'rgba(255,255,255,.22)';
      ctx.fillRect(x + 12 + h * 24, y + 30, 19, 8);
    }

    const p = 1 - s.cool / RECHARGE;
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.fillRect(x + 12, y + 43, 216, 4);
    ctx.fillStyle = p >= 1 ? '#ffe27a' : 'rgba(255,226,122,.55)';
    ctx.fillRect(x + 12, y + 43, 216 * p, 4);

    // une ligne par emplacement occupe : pastilles pour les bordees restantes,
    // barre qui se vide pour le temps restant
    let ligne = y + 62;
    if (s.bonus) {
      const b = BONUS[s.bonus.type];
      ctx.fillStyle = b.col;
      ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
      ctx.fillText(nomBonus(b), x + 12, ligne + 4);
      for (let n = 0; n < BONUS_TIRS; n++) {
        ctx.fillStyle = n < s.bonus.tirs ? b.col : 'rgba(255,255,255,.2)';
        ctx.beginPath();
        ctx.arc(x + 228 - n * 14, ligne, 4, 0, 6.2832);
        ctx.fill();
      }
      ligne += 18;
    }
    if (s.mobilite) {
      const b = BONUS[s.mobilite.type];
      ctx.fillStyle = b.col;
      ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
      ctx.fillText(nomBonus(b), x + 12, ligne + 4);
      const q = s.mobilite.reste / b.duree;
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.fillRect(x + 132, ligne - 4, 96, 8);
      ctx.fillStyle = b.col;
      ctx.fillRect(x + 132, ligne - 4, 96 * q, 8);
    }
  });

  if (cit) drawHudCitadelle();
  if (fini) drawBanniere();
}

function drawHudCitadelle() {
  const total = forts.reduce((n, f) => n + f.canons.length, 0);
  const restants = forts.reduce((n, f) => n + f.canons.filter(k => k.pv > 0).length, 0);
  const multi = forts.length > 1;
  const w = 300, x = (W - w) / 2, y = 16;
  ctx.fillStyle = 'rgba(13,34,51,.55)';
  ctx.fillRect(x, y, w, multi ? 56 + forts.length * 20 : 56);

  ctx.textAlign = 'center';
  ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
  ctx.fillStyle = '#b6c6cf';
  ctx.fillText(t('hudCanons'), x + w / 2, y + 21);

  // une case par piece : on voit d'un coup d'oeil ce qui reste a faire
  const larg = (w - 28) / total;
  for (let i = 0; i < total; i++) {
    ctx.fillStyle = i < restants ? '#e8453f' : 'rgba(255,255,255,.18)';
    ctx.fillRect(x + 14 + i * larg, y + 29, larg - 2, 10);
  }

  ctx.font = '12px "Trebuchet MS", sans-serif';
  ctx.fillStyle = 'rgba(207,233,245,.7)';
  ctx.fillText(t('hudBatterie', restants, total), x + w / 2, y + 51);

  // detail par fortification quand la carte en compte plusieurs
  if (!multi) return;
  forts.forEach((f, i) => {
    const vivants = f.canons.filter(k => k.pv > 0).length;
    const yy = y + 60 + i * 20;
    ctx.textAlign = 'left';
    ctx.font = '12px "Trebuchet MS", sans-serif';
    ctx.fillStyle = f.detruite ? 'rgba(207,233,245,.35)' : 'rgba(207,233,245,.75)';
    ctx.fillText(t('fort_' + f.cle), x + 14, yy + 10);
    ctx.textAlign = 'right';
    ctx.fillStyle = f.detruite ? '#4ade80' : '#e8453f';
    ctx.fillText(f.detruite ? t('hudReduit') : vivants + ' / ' + f.canons.length, x + w - 14, yy + 10);
  });
}

function drawBanniere() {
  let titre, teinte, sous;
  if (resultat === 'duel' && vainqueur) {
    titre = t('gagne', t(vainqueur.cle));
    teinte = vainqueur.teinte;
  } else if (resultat === 'victoire') {
    titre = t('victoire');
    teinte = '#ffe27a';
  } else if (resultat === 'defaite') {
    const restants = forts.reduce((n, f) => n + f.canons.filter(k => k.pv > 0).length, 0);
    titre = t('defaite');
    teinte = '#e8453f';
    sous = t(restants > 1 ? 'defaiteSousN' : 'defaiteSous1', restants);
  } else return;

  ctx.fillStyle = 'rgba(13,34,51,.72)';
  ctx.fillRect(0, H / 2 - 66, W, 132);
  ctx.textAlign = 'center';
  ctx.fillStyle = teinte;
  ctx.font = 'bold 46px "Trebuchet MS", sans-serif';
  ctx.fillText(titre, W / 2, H / 2 + 2);
  ctx.fillStyle = '#cfe9f5';
  ctx.font = '18px "Trebuchet MS", sans-serif';
  ctx.fillText(sous ? sous + '  ·  ' + t('rejouer') : t('rejouer'), W / 2, H / 2 + 38);
}

/* ---------- rendu : menu ------------------------------------------ */

const CARD_W = 340, CARD_H = 230, CARD_Y = 180, CARD_GAP = 40;
const CARD_X0 = (W - (3 * CARD_W + 2 * CARD_GAP)) / 2;
// en aventure : les cartes occupent les memes emplacements qu'en duel, le
// dernier creneau accueillant le choix de l'equipage
/* L'equipage tenait dans le 3e creneau de cartes ; avec trois cartes
   d'aventure il entrait en collision. Il passe en rangee compacte sous les
   cartes, ce qui rend l'aventure extensible comme le duel.                 */
const EQ = { y: 416, h: 38, w: 150, ecart: 8, label: 108 };
const eqZone = (n) => ({
  x: W / 2 - (EQ.label + 2 * EQ.w + 2 * EQ.ecart) / 2 + EQ.label + (n - 1) * (EQ.w + EQ.ecart),
  y: EQ.y, w: EQ.w, h: EQ.h
});
const ONGLET = { y: 122, w: 216, h: 40 };
const TOG = { x: W / 2 - 150, y: 428, w: 300, h: 44 };
const GO  = { x: W / 2 - 140, y: 570, w: 280, h: 52 };

let survol = null;
let vignettes = { duel: [], aventure: [] };

function zonesMenu() {
  const z = [
    { role: 'mode', id: 'duel',     x: W / 2 - ONGLET.w - 8, y: ONGLET.y, w: ONGLET.w, h: ONGLET.h },
    { role: 'mode', id: 'aventure', x: W / 2 + 8,            y: ONGLET.y, w: ONGLET.w, h: ONGLET.h }
  ];
  CARTES[mode].forEach((_, i) => z.push({
    role: 'carte', id: i, x: CARD_X0 + i * (CARD_W + CARD_GAP), y: CARD_Y, w: CARD_W, h: CARD_H
  }));
  if (mode === 'aventure') {
    z.push({ role: 'equipage', id: 1, ...eqZone(1) });
    z.push({ role: 'equipage', id: 2, ...eqZone(2) });
  }
  if (mode === 'duel') z.push({ role: 'bonus', ...TOG });
  z.push({ role: 'go', ...GO });
  LANGUES.forEach((l, i) => z.push({
    role: 'langue', id: l,
    x: W - 26 - (LANGUES.length - i) * (DRAPEAU.w + 8), y: DRAPEAU.y,
    w: DRAPEAU.w, h: DRAPEAU.h
  }));
  return z;
}

/* Drapeaux dessines a la main : deux petits aplats valent mieux qu'une image
   a charger, et ca reste net a n'importe quelle echelle.                   */
const DRAPEAU = { w: 34, h: 23, y: 30 };

function dessinerDrapeau(l, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (l === 'fr') {
    ctx.fillStyle = '#0055a4'; ctx.fillRect(x, y, w / 3, h);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + w / 3, y, w / 3, h);
    ctx.fillStyle = '#ef4135'; ctx.fillRect(x + 2 * w / 3, y, w / 3, h);
  } else {
    ctx.fillStyle = '#012169'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = h / 3.4;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y); ctx.lineTo(x, y + h);
    ctx.stroke();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h / 7;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y); ctx.lineTo(x, y + h);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = h / 2.6;
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
    ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h / 4.5;
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2);
    ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function dessinerDrapeaux() {
  for (const z of zonesMenu()) {
    if (z.role !== 'langue') continue;
    const actif = langue === z.id;
    ctx.globalAlpha = actif ? 1 : (carteVisee('langue', z.id) ? 0.85 : 0.45);
    dessinerDrapeau(z.id, z.x, z.y, z.w, z.h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = actif ? '#ffe27a' : 'rgba(207,233,245,.4)';
    ctx.lineWidth = actif ? 2.5 : 1;
    ctx.strokeRect(z.x - 1, z.y - 1, z.w + 2, z.h + 2);
  }
}

function faireVignette(m, id) {
  const k = 0.25;
  const c = document.createElement('canvas');
  c.width = W * k;
  c.height = H * k;
  const g = c.getContext('2d');
  g.drawImage(mer, 0, 0, W, H, 0, 0, c.width, c.height);
  construireCarte(m, id);
  drawCalque(layerSea, g, k);
  drawCalque(layerLand, g, k);
  for (const p of PROPS) dessinerProp(p, g, k);
  for (const rk of ROCKS) drawTile(rk.t, (rk.x - TILE / 2) * k, (rk.y - TILE / 2) * k, g, k);
  return c;
}

function carteVisee(role, id) {
  return survol && survol.role === role && (id === undefined || survol.id === id);
}

function dessinerCarte(c, x, y, actif, vise, vignette) {
  ctx.fillStyle = actif ? 'rgba(255,226,122,.16)' : (vise ? 'rgba(255,255,255,.10)' : 'rgba(13,34,51,.55)');
  ctx.beginPath();
  ctx.roundRect(x, y, CARD_W, CARD_H, 10);
  ctx.fill();
  ctx.strokeStyle = actif ? '#ffe27a' : 'rgba(207,233,245,.25)';
  ctx.lineWidth = actif ? 3 : 1.5;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 10, CARD_W - 20, 176, 6);
  ctx.clip();
  ctx.drawImage(vignette, x + 10, y + 10, CARD_W - 20, 176);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = actif ? '#ffe27a' : '#cfe9f5';
  ctx.font = 'bold 19px "Trebuchet MS", sans-serif';
  ctx.fillText(t('carte_' + c.cle), x + CARD_W / 2, y + 210);
  ctx.fillStyle = 'rgba(207,233,245,.55)';
  ctx.font = '12px "Trebuchet MS", sans-serif';
  ctx.fillText(t('carte_' + c.cle + '_sous'), x + CARD_W / 2, y + 226);
}

function dessinerMenu() {
  ctx.drawImage(mer, 0, 0);
  ctx.fillStyle = 'rgba(13,34,51,.62)';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';

  ctx.fillStyle = '#ffe27a';
  ctx.font = 'bold 58px "Trebuchet MS", sans-serif';
  ctx.fillText(t('titre'), W / 2, 76);
  ctx.fillStyle = 'rgba(207,233,245,.7)';
  ctx.font = '16px "Trebuchet MS", sans-serif';
  ctx.fillText(t('accroche'), W / 2, 104);

  // onglets de mode
  for (const z of zonesMenu().filter(zz => zz.role === 'mode')) {
    const actif = mode === z.id;
    ctx.fillStyle = actif ? '#ffe27a' : (carteVisee('mode', z.id) ? 'rgba(255,255,255,.14)' : 'rgba(13,34,51,.55)');
    ctx.beginPath();
    ctx.roundRect(z.x, z.y, z.w, z.h, 20);
    ctx.fill();
    if (!actif) {
      ctx.strokeStyle = 'rgba(207,233,245,.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = actif ? '#0d2233' : '#cfe9f5';
    ctx.font = 'bold 17px "Trebuchet MS", sans-serif';
    ctx.fillText(t(z.id), z.x + z.w / 2, z.y + 26);
  }

  CARTES[mode].forEach((c, i) => dessinerCarte(
    c, CARD_X0 + i * (CARD_W + CARD_GAP), CARD_Y,
    i === carteChoisie, carteVisee('carte', i), vignettes[mode][i]
  ));

  if (mode === 'aventure') {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cfe9f5';
    ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
    ctx.fillText(t('equipage'), eqZone(1).x - 14, EQ.y + 25);

    [1, 2].forEach(n => {
      const z = eqZone(n);
      const actif = nbJoueurs === n;
      ctx.fillStyle = actif ? 'rgba(255,226,122,.18)'
        : (carteVisee('equipage', n) ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.04)');
      ctx.beginPath();
      ctx.roundRect(z.x, z.y, z.w, z.h, 19);
      ctx.fill();
      ctx.strokeStyle = actif ? '#ffe27a' : 'rgba(207,233,245,.2)';
      ctx.lineWidth = actif ? 2.5 : 1;
      ctx.stroke();

      for (let i = 0; i < n; i++) {   // apercu des pavillons concernes
        const f = SHIP_XY[PROFILS[i].pavillon - 1];
        ctx.drawImage(sprites, f[0], f[1], SHIP_W, SHIP_H,
          z.x + 12 + i * 22, z.y + 4, SHIP_W * 0.27, SHIP_H * 0.27);
      }
      ctx.textAlign = 'left';
      ctx.fillStyle = actif ? '#ffe27a' : '#cfe9f5';
      ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
      ctx.fillText(t(n === 1 ? 'solo' : 'aDeux'), z.x + (n === 1 ? 42 : 64), z.y + 25);
    });
    ctx.textAlign = 'center';
  }

  if (mode === 'duel') dessinerCurseurBonus(); else dessinerBriefing();

  const viseGo = carteVisee('go');
  ctx.fillStyle = viseGo ? '#ffe27a' : 'rgba(255,226,122,.85)';
  ctx.beginPath();
  ctx.roundRect(GO.x, GO.y, GO.w, GO.h, 26);
  ctx.fill();
  ctx.fillStyle = '#0d2233';
  ctx.font = 'bold 21px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('appareiller'), W / 2, GO.y + 34);

  dessinerDrapeaux();

  ctx.fillStyle = 'rgba(207,233,245,.45)';
  ctx.font = '13px "Trebuchet MS", sans-serif';
  ctx.fillText(t('aideMenu', t(mode === 'duel' ? 'aideBonus' : 'aideEquipage')), W / 2, 660);
}

// En aventure, l'espace du curseur bonus sert a annoncer la couleur
function dessinerBriefing() {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(207,233,245,.85)';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.fillText(t('briefTitre'), W / 2, TOG.y + 48);
  ctx.fillStyle = 'rgba(232,69,63,.9)';
  ctx.font = '13px "Trebuchet MS", sans-serif';
  ctx.fillText(t('briefSous'), W / 2, TOG.y + 70);

  const carte = CARTES.aventure[carteChoisie];
  const chips = [
    [t('briefCanons', carte.canons), t('briefCanonsSous'), '#b6c6cf'],
    [t('briefPortee', CIT.canonPortee), t('briefPorteeSous', PORTEE_JOUEUR), '#e8453f'],
    [t('briefEquipage', nbJoueurs), t(nbJoueurs === 1 ? 'briefEquipageSolo' : 'briefEquipageDuo'), '#ffe27a']
  ];
  chips.forEach(([titre, sous, col], i) => {
    const x = W / 2 - 320 + i * 220, y = TOG.y + 96;
    ctx.fillStyle = 'rgba(13,34,51,.5)';
    ctx.beginPath();
    ctx.roundRect(x, y - 16, 200, 32, 8);
    ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x + 20, y, 5, 0, 6.2832);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = col;
    ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
    ctx.fillText(titre, x + 36, y - 1);
    ctx.fillStyle = 'rgba(207,233,245,.6)';
    ctx.font = '11px "Trebuchet MS", sans-serif';
    ctx.fillText(sous, x + 36, y + 12);
  });
  ctx.textAlign = 'center';
}

function dessinerCurseurBonus() {
  ctx.fillStyle = carteVisee('bonus') ? 'rgba(255,255,255,.12)' : 'rgba(13,34,51,.55)';
  ctx.beginPath();
  ctx.roundRect(TOG.x, TOG.y, TOG.w, TOG.h, 22);
  ctx.fill();
  ctx.strokeStyle = bonusActif ? '#4ade80' : 'rgba(207,233,245,.25)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#cfe9f5';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.fillText(t('bonus'), TOG.x + 22, TOG.y + 28);

  const sw = { x: TOG.x + TOG.w - 76, y: TOG.y + 10, w: 54, h: 24 };
  ctx.fillStyle = bonusActif ? '#4ade80' : 'rgba(255,255,255,.22)';
  ctx.beginPath();
  ctx.roundRect(sw.x, sw.y, sw.w, sw.h, 12);
  ctx.fill();
  ctx.fillStyle = '#0d2233';
  ctx.beginPath();
  ctx.arc(bonusActif ? sw.x + sw.w - 12 : sw.x + 12, sw.y + 12, 9, 0, 6.2832);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = bonusActif ? 'rgba(207,233,245,.75)' : 'rgba(207,233,245,.35)';
  ctx.font = '13px "Trebuchet MS", sans-serif';
  ctx.fillText(t('bonusRappel'), W / 2, TOG.y + 66);

  /* La bande de legende occupe toute la largeur utile et se repartit selon le
     nombre de bonus : ajouter une entree retrecit les cartouches au lieu de
     les faire deborder de l'ecran. */
  const MARGE = 40, ECART = 10, n = BONUS_VISIBLES.length;
  const larg = Math.min(224, (W - 2 * MARGE - (n - 1) * ECART) / n);
  const pas = larg + ECART;
  const x0 = W / 2 - (n * pas - ECART) / 2;
  const dispo = larg - 50;   // place restante a droite du pictogramme
  BONUS_VISIBLES.forEach((b, i) => {
    const x = x0 + i * pas, y = TOG.y + 96;
    ctx.globalAlpha = bonusActif ? 1 : 0.32;
    ctx.fillStyle = 'rgba(13,34,51,.5)';
    ctx.beginPath();
    ctx.roundRect(x, y - 16, larg, 32, 8);
    ctx.fill();
    glyphe(ctx, b, x + 22, y, b.col);
    ctx.textAlign = 'left';
    ctx.fillStyle = b.col;
    policeAjustee(ctx, nomBonus(b), dispo, 13, true);
    ctx.fillText(nomBonus(b), x + 42, y - 1);
    ctx.fillStyle = 'rgba(207,233,245,.6)';
    policeAjustee(ctx, aideBonus(b), dispo, 11, false);
    ctx.fillText(aideBonus(b), x + 42, y + 12);
    ctx.globalAlpha = 1;
  });
}

/* Reduit la police jusqu'a ce que le texte tienne dans la largeur donnee.
   Filet de securite : un libelle un peu long ne debordera plus de son
   cartouche, il sera juste ecrit un peu plus petit. */
function policeAjustee(g, txt, largeurMax, taille, gras) {
  let t = taille;
  const police = () => (gras ? 'bold ' : '') + t + 'px "Trebuchet MS", sans-serif';
  g.font = police();
  while (t > 8 && g.measureText(txt).width > largeurMax) {
    t -= 0.5;
    g.font = police();
  }
}

/* ---------- boucle ------------------------------------------------ */

let last = 0;
function boucle(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  if (ecran === 'menu') {
    temps += dt;
    dessinerMenu();
  } else {
    update(dt);
    draw();
  }
  requestAnimationFrame(boucle);
}

/* ---------- chargement -------------------------------------------- */

let tuiles, sprites;

function charger(src) {
  return new Promise((ok, ko) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => ko(new Error('Image introuvable : ' + src));
    im.src = src;
  });
}

Promise.all([
  charger('assets/tiles_sheet.png'),
  charger('assets/shipsMiscellaneous_sheet.png')
]).then(([t, s]) => {
  tuiles = t;
  sprites = s;
  temps = 0;
  bateaux = [];
  choisirLangue(langue);   // applique la langue detectee au titre et au bandeau
  prepareMer();
  vignettes.duel = CARTES.duel.map((_, i) => faireVignette('duel', i));
  vignettes.aventure = CARTES.aventure.map((_, i) => faireVignette('aventure', i));
  construireCarte(mode, carteChoisie);
  ecran = 'menu';
  requestAnimationFrame(boucle);
}).catch(err => {
  ctx.fillStyle = '#0d2233';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ff8a80';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(err.message, W / 2, H / 2);
  ctx.fillText(t('erreurServeur'), W / 2, H / 2 + 30);
});
