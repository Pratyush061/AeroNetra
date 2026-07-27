with open("src/components/3d/DroneCanvas.tsx", "r") as f:
    content = f.read()

content = content.replace("""    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffffff") },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uHoverState: { value: 0.0 }, // 0 to 1 smooth transition
      uProgress: { value: 0.0 }, // 0 = wrapped, 1 = unwrapped
      uTexture: { value: null }, // Equirectangular texture
    },
      uColor: { value: new THREE.Color("#ffffff") },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uHoverState: { value: 0.0 }, // 0 to 1 smooth transition
    },""", """    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffffff") },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uHoverState: { value: 0.0 }, // 0 to 1 smooth transition
      uProgress: { value: 0.0 }, // 0 = wrapped, 1 = unwrapped
      uTexture: { value: null }, // Equirectangular texture
    },""")

with open("src/components/3d/DroneCanvas.tsx", "w") as f:
    f.write(content)
