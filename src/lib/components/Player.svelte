<script>
  import { useThrelte, useFrame } from '@threlte/core';
  import { RigidBody } from '@threlte/rapier';
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { writable } from 'svelte/store';
  import { playerState } from '../stores/gameStore';

  const playerRef = writable(null);
  const position = [0, 2, 0];
  const isJumping = writable(false);

  // Force de saut
  const JUMP_FORCE = 5;
  // Vitesse de déplacement
  const MOVE_SPEED = 3;

  // Obtenir le contexte Threlte
  const { camera } = useThrelte();

  // Initialiser la position du joueur dans le store
  onMount(() => {
    playerState.set({
      position,
      isJumping: false,
      rigidBody: null
    });
  });

  // Abonnement au rigidbody
  let rigidBodyInstance;
  playerRef.subscribe(value => {
    rigidBodyInstance = value;

    if (rigidBodyInstance) {
      playerState.update(state => ({ ...state, rigidBody: rigidBodyInstance }));
    }
  });

  // Mettre à jour le joueur à chaque frame
  useFrame((state, delta) => {
    if (!rigidBodyInstance) return;

    // Récupération de la position actuelle
    const currentPosition = rigidBodyInstance.translation();
    const currentVelocity = rigidBodyInstance.linvel();

    // Vérifier si le joueur est sur le sol
    const origin = { x: currentPosition.x, y: currentPosition.y - 0.5, z: currentPosition.z };
    const direction = { x: 0, y: -1, z: 0 };

    // Accéder au monde via rigidBodyInstance
    const world = rigidBodyInstance.world;

    if (world) {
      const hit = world.castRay(origin, direction, {
        maxToi: 0.6
      });

      const isPlayerJumping = !hit;
      isJumping.set(isPlayerJumping);

      // Mettre à jour le store avec les nouvelles valeurs
      playerState.set({
        position: currentPosition,
        velocity: currentVelocity,
        isJumping: isPlayerJumping,
        rigidBody: rigidBodyInstance
      });
    }
  });

  // Fonction pour appliquer le saut
  export function jump() {
    if (!rigidBodyInstance || $isJumping) return;
    rigidBodyInstance.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
  }

  // Fonction pour déplacer le joueur
  export function move(direction) {
    if (!rigidBodyInstance) return;

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

    rigidBodyInstance.applyImpulse(force, true);
  }
</script>

<RigidBody
  bind:rigidBody={$playerRef}
  position={position}
  type="dynamic"
  lockRotations
  linearDamping={0.5}
  colliders="cuboid"
>
  <!-- Cube représentant le joueur -->
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#FF5733" />
  </mesh>

  <!-- Indicateur de direction (face avant) -->
  <mesh position={[0, 0, 0.51]}>
    <boxGeometry args={[0.2, 0.2, 0.1]} />
    <meshStandardMaterial color="#0000FF" />
  </mesh>
</RigidBody>