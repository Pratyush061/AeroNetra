with open("src/components/3d/DroneCanvas.tsx", "r") as f:
    content = f.read()

# Fix 1: useTexture is defined but never used
content = content.replace('import { useTexture } from "@react-three/drei";\n', '')

# Fix 2: CONFIG is assigned a value but never used
content = content.replace('''
const CONFIG = {
  particleCount: 3000, // For the new globe
  effectRadius: 3.0,
};
''', '')

# Replace particleCount references
content = content.replace("const particleCount = CONFIG.particleCount;", "const particleCount = 3000;")


# Fix 3: react-hooks/immutability
# We can bypass this by assigning it inside the useFrame loop or passing it in the shader creation
# Since sphereTexture is useMemo(() => ..., []), it doesn't change, we can just create it earlier.

reorder_code = """
  const sphereTexture = useMemo(() => createEquirectangularTexture(), []);

  const particleShaderMaterial = useMemo(() => new THREE.ShaderMaterial({
"""
content = content.replace("const particleShaderMaterial = useMemo(() => new THREE.ShaderMaterial({", reorder_code)
content = content.replace("uTexture: { value: null }, // Equirectangular texture", "uTexture: { value: sphereTexture }, // Equirectangular texture")

remove_use_effect_code = """
  // Create equirectangular texture
  const sphereTexture = useMemo(() => createEquirectangularTexture(), []);

  useEffect(() => {
    if (particleShaderMaterial) {
      particleShaderMaterial.uniforms.uTexture.value = sphereTexture;
    }
  }, [sphereTexture, particleShaderMaterial]);
"""
content = content.replace(remove_use_effect_code, "")

with open("src/components/3d/DroneCanvas.tsx", "w") as f:
    f.write(content)
