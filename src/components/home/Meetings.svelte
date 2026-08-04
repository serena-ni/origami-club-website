<script>
  import { fade, fly } from 'svelte/transition';

  export let meetings = [];
</script>

<section id="meetings" class="section-block">
  <div class="container">
    <div class="section-heading narrow-heading" in:fade={{ duration: 400 }}>
      <h2>upcoming meetings</h2>
      <br>
    </div>

    <div class="meeting-card-grid">
      {#each meetings as meeting, index}
        <article class="meeting-card" in:fly={{ y: 16, duration: 420, delay: index * 80 }}>
          <p class="card-kicker">{new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <h3>{meeting.model}</h3>
          <p>description</p>
          <a href={meeting.rsvp} class="text-link">link</a>
        </article>
      {/each}
    </div>
  </div>
</section>
