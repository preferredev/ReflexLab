/**
 * Static training room: dark floor with a neon grid, three walls, simple
 * lighting. Purely decorative — targets and gameplay live elsewhere.
 */
export function Room() {
  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 6]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#101018" />
      </mesh>
      <gridHelper args={[24, 24, "#1e3a4a", "#16212e"]} position={[0, 0.01, 0]} />

      {/* Back wall (targets spawn in front of this) */}
      <mesh position={[0, 4, -8]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#0d0d16" />
      </mesh>

      {/* Side walls */}
      <mesh position={[-12, 4, 4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#0c0c14" />
      </mesh>
      <mesh position={[12, 4, 4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 8]} />
        <meshStandardMaterial color="#0c0c14" />
      </mesh>
    </group>
  );
}
