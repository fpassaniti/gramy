import { writable } from 'svelte/store';

// Store pour suivre l'état du joueur
export const playerState = writable({
  position: { x: 0, y: 2, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  isJumping: false,
  rigidBody: null
});