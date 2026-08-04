<script>
  import { onMount } from 'svelte';
  import favicon from '../../images/assets/favicon.png';

  let { links = [] } = $props();
  let headerEl;
  let menuOpen = $state(false);
  let currentSection = $state('hero');

  function normalizeHref(href) {
    if (!href) {
      return '';
    }

    if (href === '/') {
      return '/';
    }

    if (href.startsWith('/#')) {
      return href.slice(1);
    }

    return href;
  }

  function updateCurrentSection() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) {
      return;
    }

    const headerHeight = headerEl?.offsetHeight ?? 88;
    const probePoint = window.scrollY + headerHeight + 72;

    let visibleSection = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= probePoint) {
        visibleSection = section.id;
      }
    }

    currentSection = visibleSection;
  }

  function updateHeaderHeight() {
    if (!headerEl) {
      return;
    }

    document.documentElement.style.setProperty('--header-height', `${headerEl.offsetHeight}px`);
  }

  function handleNavClick(event, href) {
    const normalizedHref = normalizeHref(href);

    if (!normalizedHref.startsWith('#')) {
      menuOpen = false;
      return;
    }

    const target = document.querySelector(normalizedHref);
    if (!target) {
      menuOpen = false;
      return;
    }

    event.preventDefault();
    menuOpen = false;

    const headerOffset = headerEl?.offsetHeight ?? 88;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  function isActiveLink(link) {
    const href = normalizeHref(link.href);

    if (href === '/') {
      return currentSection === 'hero';
    }

    if (href.startsWith('#')) {
      return currentSection === href.slice(1);
    }

    return window.location.pathname === href || window.location.pathname.endsWith(href);
  }

  onMount(() => {
    updateHeaderHeight();
    updateCurrentSection();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', updateCurrentSection, { passive: true });

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', updateCurrentSection);
    };
  });

</script>

<header bind:this={headerEl}>
  <nav>
    <div class="nav-container">
      <a href="/" class="logo-container" onclick={(event) => handleNavClick(event, '/')}>
        <img src={favicon} class="logo-img" alt="Leland Origami Club logo" />
        <div>
          <h1 class="logo">leland origami club</h1>
        </div>
      </a>

      <button
        class="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'close navigation menu' : 'open navigation menu'}
        aria-expanded={menuOpen}
        onclick={() => {
          menuOpen = !menuOpen;
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class:open={menuOpen} class="nav-links">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class:active={isActiveLink(link)}
              onclick={(event) => handleNavClick(event, link.href)}
              aria-current={isActiveLink(link) ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
</header>
