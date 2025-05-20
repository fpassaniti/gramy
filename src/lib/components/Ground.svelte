<script>
  import { RigidBody } from '@threlte/rapier';
  import * as THREE from 'three';
</script>

<RigidBody position={[0, -0.5, 0]} type="fixed" colliders="cuboid">
  <!-- Plateau de jeu -->
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
    <boxGeometry args={[20, 20, 1]} />
    <meshStandardMaterial color="#8BC34A" />
  </mesh>
</RigidBody>