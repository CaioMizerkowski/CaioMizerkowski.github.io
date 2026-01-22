// ============================================
// Rastreador de Negociações D&D 5e
// Sistema de Matt Colville adaptado
// ============================================

// Estado da negociação
let negotiationState = {
    phase: 'setup', // 'setup', 'active', 'outcome'
    attitude: 'neutral',
    modifiers: [],
    request: '',
    motivations: [],
    pitfalls: [],
    usedMotivations: [],
    revealedTraits: [],
    interest: 2,
    patience: 3,
    actionLog: []
};

// Dados de atitudes
const attitudes = {
    hostile: { interest: 1, patience: 2 },
    suspicious: { interest: 2, patience: 2 },
    neutral: { interest: 2, patience: 3 },
    open: { interest: 3, patience: 3 },
    friendly: { interest: 3, patience: 4 },
    trusting: { interest: 3, patience: 5 }
};

// Nomes das personalidades
const traitNames = {
    benevolence: 'Benevolência',
    discovery: 'Descoberta',
    freedom: 'Liberdade',
    greed: 'Ganância',
    authority: 'Autoridade Superior',
    justice: 'Justiça',
    legacy: 'Legado',
    peace: 'Paz',
    power: 'Poder',
    protection: 'Proteção',
    revelry: 'Festividade',
    vengeance: 'Vingança'
};

// Mensagens de resultado
const outcomeMessages = {
    0: {
        title: 'Não, e algo ruim...',
        description: 'O NPC rejeita completamente o pedido e toma uma ação hostil contra o grupo.'
    },
    1: {
        title: 'Não...',
        description: 'O NPC rejeita o pedido. A negociação termina sem acordo.'
    },
    2: {
        title: 'Não, mas algo bom...',
        description: 'O NPC rejeita o pedido, mas oferece uma alternativa benéfica ou informação útil.'
    },
    3: {
        title: 'Sim, mas algo ruim...',
        description: 'O NPC aceita o pedido, mas há uma consequência negativa ou custo associado.'
    },
    4: {
        title: 'Sim...',
        description: 'O NPC aceita o pedido do grupo.'
    },
    5: {
        title: 'Sim, e algo bom...',
        description: 'O NPC aceita o pedido e oferece algo adicional benéfico ao grupo.'
    }
};

// ============================================
// Inicialização
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeEventListeners();
    updatePhaseVisibility();
});

// ============================================
// Event Listeners
// ============================================

function initializeEventListeners() {
    // Setup phase
    document.getElementById('start-negotiation-btn').addEventListener('click', startNegotiation);

    // Trait counters
    document.querySelectorAll('input[name="motivation"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => updateTraitCounter('motivation', 3));
    });

    document.querySelectorAll('input[name="pitfall"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => updateTraitCounter('pitfall', 2));
    });

    // Active phase
    document.getElementById('restart-btn').addEventListener('click', resetNegotiation);
    document.getElementById('toggle-log-btn').addEventListener('click', toggleActionLog);
    document.getElementById('action-read-btn').addEventListener('click', () => openActionModal('read'));
    document.getElementById('action-argue-btn').addEventListener('click', () => openActionModal('argue'));
    document.getElementById('action-offer-btn').addEventListener('click', acceptOffer);

    // Outcome phase
    document.getElementById('new-negotiation-btn').addEventListener('click', resetNegotiation);

    // Modal
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);

    // Reference tables toggle
    document.getElementById('toggle-reference-btn').addEventListener('click', toggleReferenceTables);
}

// ============================================
// Trait Counter
// ============================================

function updateTraitCounter(type, max) {
    const checkboxes = document.querySelectorAll(`input[name="${type}"]:checked`);
    const counter = document.getElementById(`${type}-counter`);
    counter.textContent = `${checkboxes.length} selecionadas (recomendado: ${max})`;
}

// ============================================
// Start Negotiation
// ============================================

function startNegotiation() {
    // Validate selections
    const motivations = Array.from(document.querySelectorAll('input[name="motivation"]:checked')).map(cb => cb.value);
    const pitfalls = Array.from(document.querySelectorAll('input[name="pitfall"]:checked')).map(cb => cb.value);

    if (motivations.length === 0) {
        alert('Selecione pelo menos uma Motivação');
        return;
    }

    if (pitfalls.length === 0) {
        alert('Selecione pelo menos uma Armadilha');
        return;
    }

    // Check for overlap
    const overlap = motivations.filter(m => pitfalls.includes(m));
    if (overlap.length > 0) {
        alert('Uma característica não pode ser tanto Motivação quanto Armadilha');
        return;
    }

    // Get attitude
    const attitude = document.getElementById('attitude-select').value;
    const baseStats = attitudes[attitude];

    // Calculate modifiers
    let interestMod = 0;
    let patienceMod = 0;

    if (document.getElementById('mod-bad-rep').checked) interestMod -= 1;
    if (document.getElementById('mod-good-rep').checked) patienceMod += 1;
    if (document.getElementById('mod-one-lang').checked) patienceMod += 1;
    if (document.getElementById('mod-three-lang').checked) patienceMod += 2;

    // Set state
    negotiationState = {
        phase: 'active',
        attitude: attitude,
        modifiers: [],
        request: document.getElementById('party-request').value || 'Nenhum pedido especificado',
        motivations: motivations,
        pitfalls: pitfalls,
        usedMotivations: [],
        revealedTraits: [],
        interest: Math.max(0, Math.min(5, baseStats.interest + interestMod)),
        patience: Math.max(0, Math.min(5, baseStats.patience + patienceMod)),
        actionLog: []
    };

    // Log initial state
    const mods = [];
    if (interestMod !== 0) mods.push(`Interesse ${interestMod > 0 ? '+' : ''}${interestMod}`);
    if (patienceMod !== 0) mods.push(`Paciência ${patienceMod > 0 ? '+' : ''}${patienceMod}`);

    negotiationState.actionLog.push({
        type: 'setup',
        description: `Negociação iniciada. Atitude: ${getAttitudeName(attitude)}. ${mods.length > 0 ? 'Modificadores: ' + mods.join(', ') : ''}`,
        interestChange: null,
        patienceChange: null
    });

    saveState();
    updatePhaseVisibility();
    updateMeters();
    renderActionLog();

    // Display request
    document.getElementById('display-request').textContent = negotiationState.request;
}

function getAttitudeName(attitude) {
    const names = {
        hostile: 'Hostil',
        suspicious: 'Suspicioso',
        neutral: 'Neutro',
        open: 'Aberto',
        friendly: 'Amigável',
        trusting: 'Confiante'
    };
    return names[attitude] || attitude;
}

// ============================================
// Toggle Action Log
// ============================================

function toggleActionLog() {
    const log = document.getElementById('action-log');
    const btn = document.getElementById('toggle-log-btn');
    log.classList.toggle('hidden');
    btn.classList.toggle('collapsed');
}

// ============================================
// Action Modal
// ============================================

let currentAction = null;
let selectedResult = null;

function openActionModal(actionType) {
    currentAction = actionType;
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    if (actionType === 'read') {
        modalTitle.textContent = 'Ler o NPC (Intuição)';
        modalBody.innerHTML = `
            <p>O grupo tenta ler o NPC para descobrir suas Motivações ou Armadilhas.</p>
            <div class="form-group">
                <label>Resultado do teste:</label>
                <div class="result-buttons">
                    <button class="btn-result" data-result="fail">≤ 11 (Falha)</button>
                    <button class="btn-result" data-result="partial">12-16 (Falha Parcial)</button>
                    <button class="btn-result" data-result="success">≥ 17 (Sucesso)</button>
                </div>
            </div>
        `;

        // Add click handlers for result buttons
        document.querySelectorAll('.btn-result').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                selectedResult = btn.dataset.result;
                if (currentAction === 'read') {
                    processReadAction();
                } else if (currentAction === 'argue') {
                    processArgueAction();
                }
                closeModal();
            });
        });
    } else if (actionType === 'argue') {
        modalTitle.textContent = 'Fazer Argumento';
        showArgumentTypeSelection();
    }

    modal.classList.remove('hidden');
}

let selectedArgumentType = null;
let selectedTrait = null;
let isLie = false;

function showArgumentTypeSelection() {
    const modalBody = document.getElementById('modal-body');
    const unusedMotivations = negotiationState.motivations.filter(m => !negotiationState.usedMotivations.includes(m));
    const hasUnusedMotivations = unusedMotivations.length > 0;

    modalBody.innerHTML = `
        <p>Escolha o tipo de argumento:</p>
        <div class="argument-buttons">
            <button class="btn-argument-type" data-type="motivation" ${!hasUnusedMotivations ? 'disabled' : ''}>Apelar para Motivação${!hasUnusedMotivations ? ' (todas usadas)' : ''}</button>
            <button class="btn-argument-type" data-type="pitfall">Apelar para Armadilha</button>
            <button class="btn-argument-type" data-type="neutral">Argumento Neutro</button>
        </div>
    `;

    document.querySelectorAll('.btn-argument-type').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedArgumentType = btn.dataset.type;

            // Fade out current content
            modalBody.style.opacity = '0';
            setTimeout(() => {
                if (selectedArgumentType === 'motivation' || selectedArgumentType === 'pitfall') {
                    showTraitSelection();
                } else {
                    showLieSelection();
                }
                // Fade in new content
                modalBody.style.opacity = '1';
            }, 200);
        });
    });
}

function showTraitSelection() {
    const modalBody = document.getElementById('modal-body');
    const traits = selectedArgumentType === 'motivation' ? negotiationState.motivations : negotiationState.pitfalls;
    const typeName = selectedArgumentType === 'motivation' ? 'Motivação' : 'Armadilha';

    modalBody.innerHTML = `
        <p>Qual ${typeName}?</p>
        <div class="trait-buttons">
            ${traits.map(t => {
        const disabled = selectedArgumentType === 'motivation' && negotiationState.usedMotivations.includes(t);
        return `<button class="btn-trait" data-trait="${t}" ${disabled ? 'disabled' : ''}>
                    ${traitNames[t]} ${disabled ? '(usada)' : ''}
                </button>`;
    }).join('')}
        </div>
    `;

    document.querySelectorAll('.btn-trait').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedTrait = btn.dataset.trait;

            // Skip roll selection for pitfalls - process immediately
            if (selectedArgumentType === 'pitfall') {
                isLie = false;
                selectedResult = 'fail'; // Doesn't matter, pitfall is automatic
                processArgueAction();
                closeModal();
            } else {
                // Fade out current content
                const modalBody = document.getElementById('modal-body');
                modalBody.style.opacity = '0';
                setTimeout(() => {
                    showLieSelection();
                    // Fade in new content
                    modalBody.style.opacity = '1';
                }, 200);
            }
        });
    });
}

function showLieSelection() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="lie-checkbox-container">
            <label class="checkbox-label">
                <input type="checkbox" id="lie-checkbox">
                Este argumento é uma mentira (teste de Enganação)
            </label>
        </div>
        <p style="margin-top: 20px;">Resultado do teste:</p>
        <div class="result-buttons">
            <button class="btn-result" data-result="fail">≤ 11 (Falha)</button>
            <button class="btn-result" data-result="partial">12-16 (Sucesso Parcial)</button>
            <button class="btn-result" data-result="success">≥ 17 (Sucesso)</button>
        </div>
    `;

    document.querySelectorAll('.btn-result').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            isLie = document.getElementById('lie-checkbox').checked;
            selectedResult = btn.dataset.result;
            processArgueAction();
            closeModal();
        });
    });
}

function closeModal() {
    document.getElementById('action-modal').classList.add('hidden');
    currentAction = null;
    selectedResult = null;
    selectedArgumentType = null;
    selectedTrait = null;
    isLie = false;
}

// ============================================
// Process Actions
// ============================================

function processReadAction() {
    const result = selectedResult;
    let interestChange = 0;
    let patienceChange = 0;
    let description = 'Teste de Intuição: ';

    if (result === 'fail') {
        patienceChange = -1;
        description += 'Falha. O NPC percebe que está sendo analisado.';
    } else if (result === 'partial') {
        description += 'Falha Parcial. O NPC é difícil de ler.';
    } else if (result === 'success') {
        // Find unrevealed traits
        const allTraits = [
            ...negotiationState.motivations.map(m => ({ trait: m, type: 'Motivação' })),
            ...negotiationState.pitfalls.map(p => ({ trait: p, type: 'Armadilha' }))
        ];
        const unrevealedTraits = allTraits.filter(t => !negotiationState.revealedTraits.includes(t.trait));

        if (unrevealedTraits.length > 0) {
            // Pick a random unrevealed trait
            const revealed = unrevealedTraits[Math.floor(Math.random() * unrevealedTraits.length)];
            negotiationState.revealedTraits.push(revealed.trait);
            description += `Sucesso! O grupo descobre: <strong>${traitNames[revealed.trait]}</strong> (${revealed.type})`;
        } else {
            description += 'Sucesso! Mas todas as características já foram reveladas.';
        }
    }

    applyChanges(interestChange, patienceChange, description, 'read');
}

function processArgueAction() {
    const argumentType = selectedArgumentType;
    const result = selectedResult;
    const trait = selectedTrait;
    const lie = isLie;

    let interestChange = 0;
    let patienceChange = 0;
    let description = '';

    // Check for lie failure first
    if (lie && result === 'fail') {
        // Lie detected - apply lie penalty + argument penalty
        if (argumentType === 'motivation') {
            description = `Argumento (Motivação: ${traitNames[trait]}) - MENTIRA DETECTADA: `;
            // Motivation failure + lie penalty
            patienceChange = -1;
            interestChange = -1;
            patienceChange -= 1;
            description += 'Falha. O NPC detectou a mentira!';
        } else if (argumentType === 'pitfall') {
            description = `Argumento (Armadilha: ${traitNames[trait]}) - MENTIRA DETECTADA: `;
            // Pitfall automatic failure + lie penalty
            interestChange = -1 - 1;
            patienceChange = -1 - 1;
            description += 'O NPC se ofende E detecta a mentira!';
        } else {
            description = 'Argumento Neutro - MENTIRA DETECTADA: ';
            // Neutral failure + lie penalty
            interestChange = -1 - 1;
            patienceChange = -1 - 1;
            description += 'Falha. O NPC detectou a mentira!';
        }
    } else {
        // Normal argument processing
        if (argumentType === 'motivation') {
            description = `Argumento (Motivação: ${traitNames[trait]}): `;

            if (result === 'fail') {
                patienceChange = -1;
                description += 'Falha.';
            } else if (result === 'partial') {
                interestChange = 1;
                patienceChange = -1;
                description += 'Sucesso Parcial.';
                // Mark motivation as used
                if (!negotiationState.usedMotivations.includes(trait)) {
                    negotiationState.usedMotivations.push(trait);
                }
            } else if (result === 'success') {
                interestChange = 1;
                description += 'Sucesso!';
                // Mark motivation as used
                if (!negotiationState.usedMotivations.includes(trait)) {
                    negotiationState.usedMotivations.push(trait);
                }
            }
        } else if (argumentType === 'pitfall') {
            description = `Argumento (Armadilha: ${traitNames[trait]}): O NPC se ofende automaticamente!`;
            interestChange = -1;
            patienceChange = -1;
        } else {
            description = 'Argumento Neutro: ';

            if (result === 'fail') {
                interestChange = -1;
                patienceChange = -1;
                description += 'Falha.';
            } else if (result === 'partial') {
                patienceChange = -1;
                description += 'Falha Parcial.';
            } else if (result === 'success') {
                interestChange = 1;
                patienceChange = -1;
                description += 'Sucesso.';
            }
        }

        if (lie && result !== 'fail') {
            description += ' (mentira bem-sucedida)';
        }
    }

    applyChanges(interestChange, patienceChange, description, 'argue');
}

// ============================================
// Apply Changes and Check End Conditions
// ============================================

function applyChanges(interestChange, patienceChange, description, actionType) {
    // Apply changes
    negotiationState.interest = Math.max(0, Math.min(5, negotiationState.interest + interestChange));
    negotiationState.patience = Math.max(0, Math.min(5, negotiationState.patience + patienceChange));

    // Log action
    negotiationState.actionLog.push({
        type: actionType,
        description: description,
        interestChange: interestChange,
        patienceChange: patienceChange
    });

    // Check end conditions
    if (negotiationState.interest === 5 || negotiationState.patience === 0) {
        endNegotiation();
    }

    saveState();
    updateMeters();
    renderActionLog();
}

// ============================================
// Accept Offer
// ============================================

function acceptOffer() {
    negotiationState.actionLog.push({
        type: 'offer',
        description: 'O grupo pediu para o NPC fazer uma oferta.',
        interestChange: null,
        patienceChange: null
    });

    endNegotiation();
}

// ============================================
// End Negotiation
// ============================================

function endNegotiation() {
    negotiationState.phase = 'outcome';

    const outcome = outcomeMessages[negotiationState.interest];
    const outcomeContent = document.getElementById('outcome-content');

    outcomeContent.innerHTML = `
            <h3>Interesse Final: ${negotiationState.interest}</h3>
            <h2>${outcome.title}</h2>
            <p class="outcome-description">${outcome.description}</p>
            <div class="outcome-request">
                <strong>Pedido original:</strong> ${negotiationState.request}
            </div>
    `;

    saveState();
    updatePhaseVisibility();
}

// ============================================
// Update UI
// ============================================

function updatePhaseVisibility() {
    const phases = ['setup', 'active', 'outcome'];
    phases.forEach(phase => {
        const element = document.getElementById(`${phase}-phase`);
        if (element) {
            element.classList.toggle('hidden', negotiationState.phase !== phase);
        }
    });
}

function updateMeters() {
    const interestValue = document.getElementById('interest-value');
    const patienceValue = document.getElementById('patience-value');
    const interestFill = document.getElementById('interest-fill');
    const patienceFill = document.getElementById('patience-fill');

    interestValue.textContent = negotiationState.interest;
    patienceValue.textContent = negotiationState.patience;

    const interestPercent = (negotiationState.interest / 5) * 100;
    const patiencePercent = (negotiationState.patience / 5) * 100;

    interestFill.style.width = `${interestPercent}%`;
    patienceFill.style.width = `${patiencePercent}%`;

    // Add pulse animation
    interestFill.style.animation = 'none';
    patienceFill.style.animation = 'none';
    setTimeout(() => {
        interestFill.style.animation = 'pulse 0.5s ease-out';
        patienceFill.style.animation = 'pulse 0.5s ease-out';
    }, 10);

    // Update outcome preview
    updateOutcomePreview();
}

function updateOutcomePreview() {
    const outcome = outcomeMessages[negotiationState.interest];
    const previewTitle = document.getElementById('preview-title');
    const previewDesc = document.getElementById('preview-desc');

    if (previewTitle && previewDesc && outcome) {
        previewTitle.textContent = outcome.title;
        previewDesc.textContent = outcome.description;

        // Add color coding based on interest level
        const currentOutcome = document.getElementById('current-outcome');
        currentOutcome.className = 'current-outcome-display';
        if (negotiationState.interest <= 1) {
            currentOutcome.classList.add('outcome-negative');
        } else if (negotiationState.interest >= 4) {
            currentOutcome.classList.add('outcome-positive');
        } else {
            currentOutcome.classList.add('outcome-neutral');
        }
    }
}

function renderActionLog() {
    const logContainer = document.getElementById('action-log');
    logContainer.innerHTML = '';

    negotiationState.actionLog.forEach((action, index) => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';

        let changeText = '';
        if (action.interestChange !== null || action.patienceChange !== null) {
            const changes = [];
            if (action.interestChange !== null && action.interestChange !== 0) {
                const sign = action.interestChange > 0 ? '+' : '';
                const className = action.interestChange > 0 ? 'change-positive' : 'change-negative';
                changes.push(`<span class="${className}">Interesse ${sign}${action.interestChange}</span>`);
            }
            if (action.patienceChange !== null && action.patienceChange !== 0) {
                const sign = action.patienceChange > 0 ? '+' : '';
                const className = action.patienceChange > 0 ? 'change-positive' : 'change-negative';
                changes.push(`<span class="${className}">Paciência ${sign}${action.patienceChange}</span>`);
            }
            if (changes.length > 0) {
                changeText = `<div class="log-changes">${changes.join(', ')}</div>`;
            }
        }

        logEntry.innerHTML = `
            <div class="log-number">#${index + 1}</div>
            <div class="log-content">
                <div class="log-description">${action.description}</div>
                ${changeText}
            </div>
        `;

        logContainer.appendChild(logEntry);
    });

    // Scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
}

// ============================================
// Reset
// ============================================

function resetNegotiation() {
    negotiationState = {
        phase: 'setup',
        attitude: 'neutral',
        modifiers: [],
        request: '',
        motivations: [],
        pitfalls: [],
        usedMotivations: [],
        revealedTraits: [],
        interest: 2,
        patience: 3,
        actionLog: []
    };

    // Reset form
    document.getElementById('attitude-select').value = 'neutral';
    document.getElementById('party-request').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
    });
    updateTraitCounter('motivation', 3);
    updateTraitCounter('pitfall', 2);

    saveState();
    updatePhaseVisibility();
}

// ============================================
// Reference Tables Toggle
// ============================================

function toggleReferenceTables() {
    const tables = document.getElementById('reference-tables');
    tables.classList.toggle('hidden');
}

// ============================================
// Local Storage
// ============================================

function saveState() {
    localStorage.setItem('negotiation-tracker', JSON.stringify(negotiationState));
}

function loadState() {
    const saved = localStorage.getItem('negotiation-tracker');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            // Only load if in active or outcome phase
            if (loaded.phase === 'active' || loaded.phase === 'outcome') {
                negotiationState = loaded;

                if (negotiationState.phase === 'active') {
                    document.getElementById('display-request').textContent = negotiationState.request;
                    updateMeters();
                    renderActionLog();
                } else if (negotiationState.phase === 'outcome') {
                    endNegotiation();
                }
            }
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
}
