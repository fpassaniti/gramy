<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { writable } from 'svelte/store';
  import { playerState } from '../stores/gameStore';

  // Store pour les touches enfoncées
  const keysPressed = writable({});

  // Forces de mouvement
  const MOVE_SPEED = 3;
  const JUMP_FORCE = 5;

  let rigidBody;

  // S'abonner au store playerState pour obtenir la référence au rigidBody
  const unsubscribePlayerState = playerState.subscribe(state => {
    rigidBody = state.rigidBody;
  });

  // Fonction pour appliquer une force au joueur
  function applyForce(force) {
    if (!rigidBody) return;
    rigidBody.applyImpulse(force, true);
  }

  // Fonction de saut
  function jump() {
    const state = $playerState;
    if (!rigidBody || state.isJumping) return;
    applyForce({ x: 0, y: JUMP_FORCE, z: 0 });
  }

  // Fonction de déplacement
  function move(direction) {
    if (!rigidBody) return;

    const force = { x: 0, y: 0, z: 0 };

    switch (direction) {
      case 'left':
        force.x = -MOVE_SPEED;
        break;
      case 'right':
        force.x = MOVE_SPEED;
        break;
      case 'forward':
        force.z = -MOVE_SPEED;
        break;
      case 'backward':
        force.z = MOVE_SPEED;
        break;
    }

    applyForce(force);
  }

  // Gérer les touches
  function handleKeyDown(e) {
    keysPressed.update(keys => ({ ...keys, [e.code]: true }));

    // Gestion du saut (barre d'espace)
    if (e.code === 'Space') {
      jump();
    }
  }

  function handleKeyUp(e) {
    keysPressed.update(keys => ({ ...keys, [e.code]: false }));
  }

  onMount(() => {
    // Ajouter les écouteurs d'événements
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // Démarrer la boucle de mouvement
    frameId = requestAnimationFrame(loop);
  });

  onDestroy(() => {
    // Nettoyer
    unsubscribePlayerState();
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    if (frameId) cancelAnimationFrame(frameId);
  });

  // Gestionnaire de mouvement
  function handleMovement() {
    const keys = $keysPressed;

    // Flèche gauche ou A
    if (keys['ArrowLeft'] || keys['KeyA']) {
      move('left');
    }

    // Flèche droite ou D
    if (keys['ArrowRight'] || keys['KeyD']) {
      move('right');
    }

    // Flèche haut ou W
    if (keys['ArrowUp'] || keys['KeyW']) {
      move('forward');
    }

    // Flèche bas ou S
    if (keys['ArrowDown'] || keys['KeyS']) {
      move('backward');
    }
  }

  // Boucle de rendu pour appliquer le mouvement
  const clock = new THREE.Clock();
  let frameId;

  function loop() {
    clock.getDelta(); // avance le temps
    handleMovement();
    frameId = requestAnimationFrame(loop);
  }

  // le démarrage et l'arrêt de la boucle sont gérés plus haut
</script>

<!-- Ce composant ne rend rien visuellement, il gère uniquement les contrôles -->