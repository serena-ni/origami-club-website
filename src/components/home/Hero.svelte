<script>
  import { fade, fly } from 'svelte/transition';

  export let countdownText;
  export let meetings = [];

  $: nextMeeting = meetings[0];
</script>

<section id="hero" class="hero-section">
  <div class="container hero-grid">
    <div class="hero-copy" in:fade={{ duration: 450 }}>
      <p class="eyebrow">leland high school</p>
      <h2>origami club</h2>
      <p class="hero-lead">where anyone can make beautiful things</p>
      <div class="hero-actions">
        <a href="#generator" class="primary-btn">start folding</a>
        <a href="#fold-of-the-week" class="secondary-btn">see this week&apos;s fold</a>
      </div>
      <br>
    </div>

    {#if nextMeeting}
      <div class="hero-aside" in:fly={{ y: 18, duration: 500, delay: 90 }}>
        <article class="glass-card countdown-card">
          <p class="card-kicker">next meeting</p>
          <h4>{new Date(nextMeeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
          <h3>{nextMeeting.model}</h3>
          <p>{countdownText}</p>
        </article>
      </div>
    {/if}
  </div>
</section>
