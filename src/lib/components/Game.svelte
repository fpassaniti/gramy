<script>
  import { Canvas } from '@threlte/core';
  import { OrbitControls, Grid } from '@threlte/extras';
  import { Physics, RigidBody } from '@threlte/rapier';
  import Player from './Player.svelte';
  import Ground from './Ground.svelte';
  import Controls from './Controls.svelte';
  import * as THREE from 'three';
</script>

<div class="game-container">
  <Canvas>
    <!-- Configuration de la scène -->
    <Physics debug={false} gravity={[0, -9.81, 0]}>
      <!-- Éclairage -->
      <directionalLight position={[3, 10, 10]} intensity={1.5} castShadow />
      <ambientLight intensity={0.5} />

      <!-- Caméra avec contrôles orbitaux (pour le développement) -->
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        target={[0, 1, 0]}
      />

      <!-- Grid pour aider à la visualisation -->
      <Grid size={20} cellSize={1} />

      <!-- Joueur -->
      <Player />

      <!-- Sol/Plateau -->
      <Ground />

      <!-- Gestionnaire des contrôles -->
      <Controls />
    </Physics>
  </Canvas>
</div>

<style>
  .game-container {
    width: 100%;
    height: 100%;
    background-color: #87CEEB;
  }
</style>