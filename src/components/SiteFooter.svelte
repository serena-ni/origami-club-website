<script>
  const socialLinks = [
    {
      href: 'https://linktr.ee/lelandorigami',
      label: 'Linktree',
      icon: 'https://cdn.brandfetch.io/id_tNIm05N/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1668070417741'
    },
    { href: 'https://instagram.com/lelandorigami', label: 'Instagram', icon: 'fa-instagram' },
    { href: 'https://discord.gg/PkvPx3NABZ', label: 'Discord', icon: 'fa-discord' }
  ];
</script>

<footer>
  <div class="footer-grid">
    <div>
      <p class="footer-kicker">meet us</p>
      <p class="footer-copy">tuesdays at lunch</p>
      <p class="footer-copy">sportsfolio</p>
    </div>

    <div>
      <p class="footer-kicker">contact</p>
      <p class="footer-copy"><a href="mailto:lelandorigami@gmail.com">lelandhs.origami@gmail.com</a></p>
      <br>
      <div class="footer-socials">
        {#each socialLinks as link}
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
            {#if link.label === 'Linktree'}
              <img class="tree-link-icon" src={link.icon} alt="" aria-hidden="true" loading="lazy" />
            {:else}
              <i class={`fab ${link.icon}`}></i>
            {/if}
          </a>
        {/each}
      </div>
    </div>

    <div>
      <p class="footer-quote">“a single sheet of paper holds the potential to unfold boundless imagination.” - eric joisel</p>
    </div>
  </div>

  <p class="footer-bottom">&copy; 2026 leland origami club</p>
</footer>
