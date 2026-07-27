with open("src/components/3d/DroneCanvas.tsx", "r") as f:
    content = f.read()

# Add sphereTexture to useMemo dependency array for particleShaderMaterial
content = content.replace("}), []);", "}), [sphereTexture]);")

with open("src/components/3d/DroneCanvas.tsx", "w") as f:
    f.write(content)
