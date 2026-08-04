<script>
  import { onDestroy, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import {
    buildFilterState,
    filterModels,
    filterOptions,
    getRelatedModels,
    getSelectedFilterLabel,
    origamiModels,
    pickRandomModel,
    toggleInArray
  } from '../../data/origami/catalog.js';

  const animationDuration = 960;
  const shuffleInterval = 110;

  let filters = buildFilterState();
  let activeModel = null;
  let isGenerating = false;
  let generationToken = 0;
  let shuffleTick = 0;
  let shuffleDeck = [];
  let confettiPieces = [];
  let shuffleTimer;
  let finishTimer;
  let confettiTimer;

  $: matchingModels = filterModels(origamiModels, filters);
  $: relatedModels = getRelatedModels(activeModel, origamiModels, 3);
  $: matchLabel = getSelectedFilterLabel(matchingModels.length);

  function clearTimers() {
    if (shuffleTimer) {
      window.clearInterval(shuffleTimer);
      shuffleTimer = undefined;
    }

    if (finishTimer) {
      window.clearTimeout(finishTimer);
      finishTimer = undefined;
    }

    if (confettiTimer) {
      window.clearTimeout(confettiTimer);
      confettiTimer = undefined;
    }
  }

  function setInitialModel() {
    activeModel = pickRandomModel(origamiModels);
  }

  function buildShuffleDeck() {
    const source = matchingModels.length ? matchingModels : origamiModels;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }

  function createConfettiPieces() {
    return Array.from({ length: 9 }, (_, index) => ({
      id: `${generationToken}-${index}`,
      left: 8 + Math.random() * 84,
      top: 10 + Math.random() * 56,
      delay: Math.round(Math.random() * 180),
      rotation: Math.round(Math.random() * 260),
      duration: 900 + Math.round(Math.random() * 300),
      scale: 0.8 + Math.random() * 0.6,
      shape: index % 3 === 0 ? 'circle' : index % 3 === 1 ? 'square' : 'triangle'
    }));
  }

  function chooseModel(sourceModels) {
    const pool = sourceModels.length ? sourceModels : origamiModels;
    return pickRandomModel(pool);
  }

  function selectFilter(group, value) {
    filters = {
      ...filters,
      [group]: toggleInArray(filters[group], value)
    };
  }

  function clearFilters() {
    filters = buildFilterState();
  }

  function generateRecommendation() {
    if (isGenerating || !matchingModels.length) {
      return;
    }

    clearTimers();
    generationToken += 1;
    isGenerating = true;
    shuffleDeck = buildShuffleDeck();
    shuffleTick += 1;

    shuffleTimer = window.setInterval(() => {
      shuffleDeck = buildShuffleDeck();
      shuffleTick += 1;
    }, shuffleInterval);

    finishTimer = window.setTimeout(() => {
      clearTimers();
      activeModel = chooseModel(matchingModels);
      isGenerating = false;
      confettiPieces = createConfettiPieces();

      confettiTimer = window.setTimeout(() => {
        confettiPieces = [];
      }, 1350);
    }, animationDuration);
  }

  function generateAnother() {
    generateRecommendation();
  }

  onMount(() => {
    setInitialModel();
  });

  onDestroy(() => {
    clearTimers();
  });
</script>

<section id="generator" class="section-block muted-block generator-section">
  <div class="container">
    <div class="generator-layout">
      <div class="generator-copy" in:fade={{ duration: 360 }}>
        <h2>discover your next project</h2>
      </div>

      <div class="generator-controls-card" in:fly={{ y: 18, duration: 420 }}>
        <div class="filter-stack">
          <div class="filter-group">
            <div class="filter-group-header">
              <p>difficulty</p>
              <button type="button" class="filter-reset" onclick={clearFilters}>clear all</button>
            </div>

            <div class="chip-grid">
              {#each filterOptions.difficulties as difficulty}
                <button
                  type="button"
                  class:active={filters.difficulties.includes(difficulty.toLowerCase())}
                  class="filter-chip"
                  onclick={() => selectFilter('difficulties', difficulty.toLowerCase())}
                >
                  {difficulty}
                </button>
              {/each}
            </div>
          </div>

          <div class="filter-group">
            <p class="filter-group-label">category</p>
            <div class="chip-grid category-grid">
              {#each filterOptions.categories as category}
                <button
                  type="button"
                  class:active={filters.categories.includes(category.value)}
                  class="filter-chip"
                  onclick={() => selectFilter('categories', category.value)}
                >
                  {category.label}
                </button>
              {/each}
            </div>
          </div>

          <div class="filter-group">
            <p class="filter-group-label">estimated time</p>
            <div class="chip-grid time-grid">
              {#each filterOptions.timeBuckets as timeBucket}
                <button
                  type="button"
                  class:active={filters.timeBuckets.includes(timeBucket.value)}
                  class="filter-chip"
                  onclick={() => selectFilter('timeBuckets', timeBucket.value)}
                >
                  {timeBucket.label}
                </button>
              {/each}
            </div>
          </div>
        </div>

        <button type="button" class="generate-button" disabled={isGenerating || !matchingModels.length} onclick={generateRecommendation}>
          {isGenerating ? 'shuffling ideas...' : "generate"}
        </button>

        <p class="match-count" aria-live="polite">{matchLabel}</p>
      </div>

      <div class="generator-result-column">
        {#if isGenerating}
          <div class="shuffle-stage" aria-live="polite">
            {#key shuffleTick}
              <div class="shuffle-deck" in:fade={{ duration: 160 }}>
                {#each shuffleDeck as card, index}
                  <article class="shuffle-card" style={`--delay:${index * 60}ms`} in:fly={{ y: 10, duration: 180, delay: index * 45 }}>
                    <img src={card.thumbnailUrl} alt={card.name} loading="lazy" />
                    <div>
                      <p>{card.name}</p>
                      <span>{card.category}</span>
                    </div>
                  </article>
                {/each}
              </div>
            {/key}
          </div>
        {/if}

        {#if activeModel}
          <article class:generating={isGenerating} class="result-card" aria-live="polite" in:fly={{ y: 16, duration: 420 }}>
            {#if confettiPieces.length}
              <div class="confetti-layer" aria-hidden="true">
                {#each confettiPieces as piece}
                  <span
                    class={`confetti-piece ${piece.shape}`}
                    style={`left:${piece.left}%; top:${piece.top}%; --piece-delay:${piece.delay}ms; --piece-duration:${piece.duration}ms; --piece-rotation:${piece.rotation}deg; --piece-scale:${piece.scale}`}
                  ></span>
                {/each}
              </div>
            {/if}

            <div class="result-copy">
              <div class="result-header">
                <div>
                  <p class="card-kicker">top recommendation</p>
                  <h3>{activeModel.name}</h3>
                </div>

                <span class="difficulty-badge">{activeModel.difficulty}</span>
              </div>

              <div class="badge-row result-tags">
                <span>{activeModel.category}</span>
                <span>{activeModel.displayTime}</span>
              </div>

              <div class="result-actions">
                <a href={activeModel.tutorialUrl} class="primary-btn learn-btn" target="_blank" rel="noreferrer">learn how</a>
                <button type="button" class="secondary-btn" disabled={isGenerating || !matchingModels.length} onclick={generateAnother}>generate another</button>
              </div>

              <div class="related-section">
                <div class="related-header">
                  <p class="card-kicker">related recommendations</p>
                  <span>{relatedModels.length} nearby ideas</span>
                </div>

                <div class="related-grid">
                  {#each relatedModels as relatedModel}
                    <a href={relatedModel.tutorialUrl} target="_blank" rel="noreferrer" class="related-card">
                      <img src={relatedModel.thumbnailUrl} alt={relatedModel.name} loading="lazy" />
                      <div>
                        <p>{relatedModel.name}</p>
                        <span>{relatedModel.category} · {relatedModel.displayTime}</span>
                      </div>
                    </a>
                  {/each}
                </div>
              </div>
            </div>
          </article>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .generator-section {
    text-transform: lowercase;
  }

  .generator-section {
    scroll-margin-top: calc(var(--header-height) + 1.5rem);
  }

  .generator-layout {
    display: grid;
    gap: 1.25rem;
    max-width: 65rem;
    margin-inline: auto;
  }

  .generator-copy {
    display: grid;
    gap: 0.5rem;
    padding: 0;
    text-align: left;
  }

  .generator-copy h2 {
    text-align: left;
  }

  .generator-intro,
  .match-count,
  .filter-group-label,
  .filter-group-header p,
  .related-header span,
  .related-card span,
  .shuffle-card span {
    color: var(--ink-soft);
  }

  .generator-intro {
    font-size: 1.03rem;
    line-height: 1.55;
    padding-inline: 0;
  }

  .generator-controls-card,
  .result-card,
  .shuffle-card,
  .related-card {
    border: 1px solid rgba(56, 65, 60, 0.08);
    background: rgba(255, 253, 248, 0.88);
  }

  .generator-controls-card,
  .result-card {
    border-radius: 30px;
    box-shadow: none;
  }

  .generator-controls-card {
    display: grid;
    gap: 1rem;
    padding: clamp(0.95rem, 2vw, 1.15rem);
  }

  .filter-stack {
    display: grid;
    gap: 1rem;
  }

  .filter-group {
    display: grid;
    gap: 0.7rem;
  }

  .filter-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .filter-group-header p,
  .filter-group-label {
    font-family: 'Outfit', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.74rem;
  }

  .filter-reset {
    border: 0;
    background: transparent;
    color: var(--sage-deep);
    cursor: pointer;
    padding: 0;
  }

  .chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .category-grid .filter-chip {
    padding-inline: 0.8rem;
  }

  .filter-chip {
    border: 1px solid rgba(127, 148, 128, 0.14);
    background: rgba(255, 255, 255, 0.72);
    color: var(--ink-soft);
    border-radius: 999px;
    padding: 0.68rem 0.9rem;
    cursor: pointer;
    transition: transform 0.24s var(--ease-soft), background-color 0.24s var(--ease-soft), color 0.24s var(--ease-soft), border-color 0.24s var(--ease-soft);
  }

  .filter-chip:hover {
    transform: translateY(-1px);
    border-color: rgba(127, 148, 128, 0.28);
  }

  .filter-chip.active {
    background: rgba(168, 184, 165, 0.22);
    border-color: rgba(127, 148, 128, 0.22);
    color: var(--ink);
  }

  .generate-button,
  .secondary-btn,
  .primary-btn.learn-btn {
    min-height: 3.2rem;
    border-radius: 999px;
    font-family: 'Outfit', sans-serif;
  }

  .generate-button {
    width: 100%;
    border: 0;
    background: linear-gradient(135deg, rgba(168, 184, 165, 0.98), rgba(127, 148, 128, 0.95));
    color: #fffdf8;
    padding: 0.95rem 1.25rem;
    cursor: pointer;
    box-shadow: 0 18px 30px rgba(127, 148, 128, 0.18);
    transition: transform 0.24s var(--ease-soft), box-shadow 0.24s var(--ease-soft), opacity 0.24s var(--ease-soft);
  }

  .generate-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 22px 36px rgba(127, 148, 128, 0.22);
  }

  .generate-button:disabled,
  .secondary-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .match-count {
    text-align: center;
    font-size: 0.95rem;
  }

  .generator-result-column {
    display: grid;
    gap: 1rem;
  }

  .shuffle-stage {
    min-height: 0;
  }

  .shuffle-deck {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .shuffle-card {
    display: grid;
    gap: 0.65rem;
    padding: 0.7rem;
    border-radius: 22px;
    box-shadow: 0 12px 24px rgba(94, 112, 94, 0.08);
  }

  .shuffle-card img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 18px;
    object-fit: cover;
  }

  .shuffle-card p,
  .shuffle-card span {
    margin: 0;
    line-height: 1.25;
  }

  .result-card {
    position: relative;
    display: grid;
    gap: 1.35rem;
    overflow: hidden;
    padding: 1.25rem;
    min-height: auto;
  }

  .result-card.generating {
    opacity: 0.92;
  }

  .confetti-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(168, 184, 165, 0.65);
    opacity: 0;
    animation: confettiFloat var(--piece-duration) ease-out var(--piece-delay) forwards;
  }

  .confetti-piece.circle {
    border-radius: 999px;
    background: rgba(220, 238, 247, 0.95);
  }

  .confetti-piece.square {
    border-radius: 4px;
    background: rgba(168, 184, 165, 0.8);
  }

  .confetti-piece.triangle {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 11px solid rgba(127, 148, 128, 0.82);
    background: transparent;
  }

  .result-copy {
    display: grid;
    gap: 1.1rem;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .difficulty-badge {
    align-self: start;
    padding: 0.55rem 0.85rem;
    border-radius: 999px;
    background: rgba(220, 238, 247, 0.74);
    color: var(--ink);
    font-size: 0.82rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .result-tags {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .result-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .learn-btn {
    text-decoration: none;
  }

  .related-section {
    display: grid;
    gap: 0.75rem;
  }

  .related-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 0.75rem;
  }

  .related-header span {
    font-size: 0.9rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .related-card {
    display: grid;
    gap: 0.6rem;
    padding: 0.7rem;
    border-radius: 20px;
    text-decoration: none;
    transition: transform 0.25s var(--ease-soft), box-shadow 0.25s var(--ease-soft), border-color 0.25s var(--ease-soft);
  }

  .related-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(94, 112, 94, 0.1);
    border-color: rgba(127, 148, 128, 0.2);
  }

  .related-card img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 16px;
  }

  .related-card p,
  .related-card span {
    margin: 0;
    display: block;
  }

  .related-card p {
    color: var(--ink);
    font-weight: 700;
  }

  .related-card span {
    font-size: 0.85rem;
  }

  @keyframes confettiFloat {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0) rotate(calc(var(--piece-rotation) * 1deg)) scale(var(--piece-scale));
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translate3d(calc((var(--piece-rotation) - 120) * 0.7px), -46px, 0) rotate(calc(var(--piece-rotation) * 1deg)) scale(var(--piece-scale));
    }
  }

  @media (max-width: 1024px) {
    .related-grid,
    .shuffle-deck {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 900px) {
    .generator-layout {
      grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
      align-items: start;
    }

    .generator-copy {
      grid-column: 1 / -1;
      max-width: 48rem;
    }

    .generator-controls-card {
      position: sticky;
      top: calc(var(--header-height) + 1rem);
    }
  }

  @media (max-width: 768px) {
    .result-header,
    .related-header {
      flex-direction: column;
      align-items: start;
    }

    .result-actions {
      flex-direction: column;
    }

    .generate-button,
    .result-actions > * {
      width: 100%;
    }
  }

  @media (max-width: 620px) {
    .generator-layout {
      transform: scale(0.96);
      transform-origin: top center;
    }
  }
</style>