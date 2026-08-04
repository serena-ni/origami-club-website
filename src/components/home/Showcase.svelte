<script>
  import { fade, fly } from 'svelte/transition';

  export let currentShowcaseIndex = 0;
  export let showcase;
  export let cycleShowcase;
</script>

<section id="showcase" class="section-block muted-block">
  <div class="container showcase-grid">
    <div class="section-heading" in:fade={{ duration: 360 }}>
      <h2>member showcase</h2>
    </div>

    {#if showcase}
      <div class="showcase-card glass-card" aria-live="polite" in:fly={{ y: 16, duration: 420 }}>
        <button type="button" class="carousel-arrow" aria-label="previous creation" onclick={() => cycleShowcase(-1)}>
          <i class="fas fa-chevron-left"></i>
        </button>

        {#key currentShowcaseIndex}
          <div class="showcase-panel" in:fade={{ duration: 260 }}>
            <img src={showcase.photo} alt={`${showcase.model} by ${showcase.creator}`} loading="lazy" />
            <div>
              <p class="card-kicker">{showcase.creator}</p>
              <h3>{showcase.model}</h3>
              <p>{showcase.fact}</p>
            </div>
          </div>
        {/key}

        <button type="button" class="carousel-arrow" aria-label="next creation" onclick={() => cycleShowcase(1)}>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    {/if}
  </div>
</section>
