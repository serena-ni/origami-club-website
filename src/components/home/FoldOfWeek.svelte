<script>
  import { fade, fly } from 'svelte/transition';

  export let featuredFold;
</script>

{#if featuredFold}
  <section id="fold-of-the-week" class="section-block muted-block">
    <div class="container feature-grid">
      <div class="feature-image-card" in:fly={{ y: 20, duration: 450 }}>
        <img src={featuredFold.image} alt={featuredFold.name} loading="lazy" />
      </div>

      <div class="feature-copy" in:fade={{ duration: 420, delay: 80 }}>
        <p class="eyebrow">fold of the week</p>
        <h2>{featuredFold.name}</h2>
          <br>
        <div class="detail-grid">
          <article class="detail-pill"><span>difficulty</span><strong>{featuredFold.difficultyLabel}</strong></article>
          <article class="detail-pill"><span>time</span><strong>{featuredFold.time}</strong></article>
          <article class="detail-pill"><span>paper</span><strong>{featuredFold.paperSize}</strong></article>
        </div>
          <br>
        <ul class="fact-list">
          {#each featuredFold.facts as fact}
            <li>{fact}</li>
          {/each}
        </ul>
      </div>
    </div>
  </section>
{/if}
