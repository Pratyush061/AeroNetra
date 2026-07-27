## 2023-10-27 - [DroneCanvas memory optimization]
**Learning:** React Three Fiber's `useFrame` executes up to 120 times per second, making object allocation (like `new THREE.Vector3()` or `.clone()`) highly detrimental to performance due to garbage collection pressure.
**Action:** Always pre-allocate THREE objects (Vector3, Matrix4, etc.) outside the component or in module scope, and reuse them using `.set()`, `.copy()`, `.add()`, etc., within render loops.
