<script>
  import { fade } from 'svelte/transition';

  export let submitting = false;
  export let formMessage = '';
  export let handleSubmit;
</script>

<section id="join" class="section-block muted-block join-section">
  <div class="container">
    <div class="section-heading narrow-heading" in:fade={{ duration: 360 }}>
      <h2>say hello and start your journey</h2>
    </div>

    <form
      action="https://api.web3forms.com/submit"
      method="POST"
      class="contact-form"
      id="form"
      autocomplete="off"
      onsubmit={handleSubmit}
    >
      <input type="hidden" name="access_key" value="2b3128b8-9dca-41c1-931f-997d1e220151" />
      <input type="hidden" name="subject" value="Origami Club Signup" />
      <input type="checkbox" name="botcheck" style="display:none" />

      <div class="form-grid">
        <label class="form-group">
          <span class="label-text">name <span class="required-asterisk" aria-hidden="true">*</span></span>
          <input id="name" type="text" name="name" autocomplete="off" placeholder="your name" required />
        </label>

        <label class="form-group">
          <span class="label-text">email <span class="required-asterisk" aria-hidden="true">*</span></span>
          <input id="email" type="email" name="email" autocomplete="off" placeholder="you@example.com" required />
        </label>
      </div>

      <label class="form-group">
        tell us about yourself
        <textarea name="message" rows="4" placeholder="are you brand new, coming with friends, or looking to see what the club is like?"></textarea>
      </label>

      <button class="submit-btn" class:loading={submitting} disabled={submitting}>
        {submitting ? 'sending...' : 'join the club'}
      </button>
      <p class="form-message">{formMessage}</p>
    </form>
  </div>
</section>
