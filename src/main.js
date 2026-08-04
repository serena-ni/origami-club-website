import { mount } from 'svelte';
import HomePage from './pages/HomePage.svelte';

const target = document.getElementById('app');

if (target) {
  mount(HomePage, { target });
}
