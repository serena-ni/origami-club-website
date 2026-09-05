<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import ScrollProgress from '../components/ScrollProgress.svelte';
  import SiteHeader from '../components/SiteHeader.svelte';
  import SiteFooter from '../components/SiteFooter.svelte';
  import { galleryItems } from '../data/galleryItems.js';

  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';

  injectAnalytics({ mode: dev ? 'development' : 'production' });

  const links = [
    { href: '/', label: 'home' },
    { href: '/#about', label: 'about' },
    { href: '/gallery', label: 'gallery' },
    { href: '/#join', label: 'join us' }
  ];

  const storageKey = 'origami-gallery-school-year';
  const yearOrder = ['2026-2027', '2025-2026'];
  const yearLabels = {
    '2026-2027': '2026 - 2027',
    '2025-2026': '2025 - 2026',
    all: 'all years'
  };

  let selectedYear = '2025-2026';
  let shouldAnimateGallery = true;

  function getPhotosForYear(year) {
    if (year === '2025-2026' || year === 'all') {
      return [...galleryItems].sort((left, right) => new Date(right.date) - new Date(left.date));
    }

    return [];
  }

  $: visiblePhotos = getPhotosForYear(selectedYear);

  $: yearSubtitle = selectedYear === 'all'
    ? 'all current club photos in one place.'
    : selectedYear === '2025-2026'
      ? 'all current club photos are saved in the 2025-2026 album.'
      : 'the 2026-2027 album is ready for new photos.';

  function selectYear(year) {
    selectedYear = year;
    shouldAnimateGallery = false;
    localStorage.setItem(storageKey, year);

    window.requestAnimationFrame(() => {
      shouldAnimateGallery = true;
    });
  }

  onMount(() => {
    const savedYear = localStorage.getItem(storageKey);
    if (savedYear && [...yearOrder, 'all'].includes(savedYear)) {
      selectedYear = savedYear;
    }
  });
</script>

<ScrollProgress />
<SiteHeader {links} />

<main class="gallery-page-main">
  <section id="gallery" class="gallery-page-section">
    <div class="container">
      <h2 in:fade={{ duration: 400 }}>club photo albums</h2>
      <p class="gallery-subtitle" in:fade={{ delay: 70, duration: 400 }}>{yearSubtitle}</p>

      <div class="year-tabs" in:fade={{ delay: 120, duration: 400 }}>
        {#each [...yearOrder, 'all'] as year}
          <button
            type="button"
            class:active={selectedYear === year}
            class="year-tab"
            onclick={() => selectYear(year)}
          >
            {yearLabels[year]}
          </button>
        {/each}
      </div>

      {#key selectedYear}
        <div class:gallery-fade={shouldAnimateGallery} class="gallery-photo-grid" in:fade={{ duration: 300 }}>
          {#each visiblePhotos as photo, index (photo.name)}
            <article class="gallery-photo-card" in:fly={{ y: 16, duration: 380, delay: index * 35 }}>
              <img src={photo.image} alt={photo.name} loading="lazy" />
              <div>
                <p class="album-category">{photo.category}</p>
                <h3>{photo.name}</h3>
                <p>{photo.paperSize} - {photo.time}</p>
              </div>
            </article>
          {/each}
        </div>
      {/key}

      {#if visiblePhotos.length === 0}
        <div class="empty-gallery glass-card">
          <h3>no photos yet for this year.</h3>
          <br>
          <p>current photos are in the "2025-2026" and "all years" albums</p>
        </div>
      {/if}
    </div>
  </section>
</main>

<SiteFooter />
