import re

with open("src/components/3d/DroneCanvas.tsx", "r") as f:
    content = f.read()

# Remove the one inside useFrame
old_useFrame = """      materialRef.current.uniforms.uProgress.value = progressRef.current;
      materialRef.current.uniforms.uReducedMotion.value = prefersReducedMotion ? 1.0 : 0.0;
    }

    // Expose to window for e2e tests
    if (typeof window !== 'undefined') {
      (window as any).__DRONE_PROGRESS = progressRef.current;
    }
  });"""

new_useFrame = """      materialRef.current.uniforms.uProgress.value = progressRef.current;
      materialRef.current.uniforms.uReducedMotion.value = prefersReducedMotion ? 1.0 : 0.0;
    }
  });"""

content = content.replace(old_useFrame, new_useFrame)

# Add it to handleScroll
old_handleScroll = """      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      progressRef.current = clampedProgress;
      if (typeof window !== 'undefined') {
        (window as any).__DRONE_PROGRESS = clampedProgress;
      }
    };"""

new_handleScroll = """      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      progressRef.current = clampedProgress;
      if (typeof window !== 'undefined') {
        (window as any).__DRONE_PROGRESS = clampedProgress;
      }
    };"""
# It's already there! Let's just make sure it's in the right place
with open("src/components/3d/DroneCanvas.tsx", "w") as f:
    f.write(content)
