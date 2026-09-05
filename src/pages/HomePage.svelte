<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import ScrollProgress from '../components/ScrollProgress.svelte';
  import SiteHeader from '../components/SiteHeader.svelte';
  import SiteFooter from '../components/SiteFooter.svelte';
  import Hero from '../components/home/Hero.svelte';
  import Join from '../components/home/Join.svelte';
  import Showcase from '../components/home/Showcase.svelte';
  import { galleryItems } from '../data/galleryItems.js';

  const links = [
    { href: '/', label: 'home' },
    { href: '#gallery', label: 'gallery' },
    { href: '#join', label: 'join us' }
  ];

  const foldLibrary = galleryItems.map((item) => ({
    ...item,
    category: item.category,
    tags: {
      
      'sea turtles': ['intermediate', 'animals'],
      bunny: ['beginner', 'animals'],
      clover: ['beginner', 'flowers'],
      miura: ['advanced', 'modular'],
      lotus: ['beginner', 'flowers'],
      'christmas tree': ['intermediate', 'seasonal'],
      tulips: ['beginner', 'flowers'],
      foxes: ['intermediate', 'animals'],
      bats: ['intermediate', 'seasonal'],
      hearts: ['beginner', 'seasonal'],
      butterfly: ['beginner', 'animals'],
      'lucky stars': ['beginner', 'modular']

    }[item.name] ?? ['all'],
    difficultyLabel: item.difficulty === 1 ? 'easy' : item.difficulty === 2 ? 'gentle' : 'stretch',
    facts: item.name === 'miura'
      ? ['best when you like precise repetition', 'a great pattern to study geometry']
      : item.name === 'lucky stars'
        ? ['lovely for group folding sessions', 'perfect for a jar full of tiny wins']
        : item.name === 'christmas tree'
          ? ['a cozy seasonal build', 'looks lovely in green or patterned paper']
          : ['great for practicing clean symmetry', 'works well with calm, steady folds']
  }));

  const showMemberShowcase = false;
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

  const meetings = [
    {
      date: '2026-10-06T13:02:00',
      theme: 'lucky stars',
      model: 'lucky stars',
    },
  ];

  const memberShowcase = [
    {
      creator: 'name',
      model: 'project',
      photo: foldLibrary.find((item) => item.name === 'foxes')?.image,
      fact: 'short description'
    },
    {
      creator: 'name',
      model: 'project',
      photo: foldLibrary.find((item) => item.name === 'lotus')?.image,
      fact: 'short description'
    },
    {
      creator: 'name',
      model: 'project',
      photo: foldLibrary.find((item) => item.name === 'lucky stars')?.image,
      fact: 'short description'
    }
  ];

  let submitting = false;
  let formMessage = '';
  let countdownText = '';
  let currentShowcaseIndex = 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    submitting = true;
    formMessage = '';

    const form = event.currentTarget;

    fetch(form.action, {
      method: form.method || 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then((response) => {
        if (response.ok) {
          formMessage = "thanks for joining us! we can't wait to meet you.";
          form.reset();
          return;
        }

        formMessage = 'something went sideways. please try again in a moment.';
      })
      .catch((error) => {
        console.error(error);
        formMessage = 'network hiccup. please try again in a moment.';
      })
      .finally(() => {
        submitting = false;
      });
  }

  function updateCountdown() {
    const nextMeeting = meetings[0];
    const targetTime = new Date(nextMeeting.date).getTime();
    const now = Date.now();
    const remaining = Math.max(targetTime - now, 0);
    const totalMinutes = Math.floor(remaining / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    countdownText = days > 0
      ? `${days} day${days === 1 ? '' : 's'} - ${hours} hour${hours === 1 ? '' : 's'} away`
      : `${hours} hour${hours === 1 ? '' : 's'} - ${minutes} minute${minutes === 1 ? '' : 's'} away`;
  }

  function cycleShowcase(direction) {
    currentShowcaseIndex = (currentShowcaseIndex + direction + memberShowcase.length) % memberShowcase.length;
  }

  $: showcase = memberShowcase[currentShowcaseIndex];

  onMount(() => {
    const savedYear = localStorage.getItem(storageKey);
    if (savedYear && [...yearOrder, 'all'].includes(savedYear)) {
      selectedYear = savedYear;
    }

    updateCountdown();

    const showcaseTimer = window.setInterval(() => {
      cycleShowcase(1);
    }, 7000);

    const countdownTimer = window.setInterval(updateCountdown, 60000);

    return () => {
      window.clearInterval(showcaseTimer);
      window.clearInterval(countdownTimer);
    };
  });
</script>

<ScrollProgress />
<SiteHeader {links} />

<main class="home-page-main">
  <Hero {countdownText} {meetings} />
  {#if showMemberShowcase}
    <Showcase {currentShowcaseIndex} {showcase} {cycleShowcase} />
  {/if}
  <section id="gallery" class="gallery-page-section section-block muted-block">
    <div class="container">
      <div class="section-heading narrow-heading" in:fade={{ duration: 400 }}>
        <h2>club photo albums</h2>
        <p class="gallery-subtitle">{yearSubtitle}</p>
      </div>

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
                <p>{photo.date} · {photo.paperSize} · {photo.time}</p>
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
  <Join bind:submitting bind:formMessage {handleSubmit} />
</main>

<SiteFooter />
