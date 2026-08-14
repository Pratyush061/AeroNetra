import re

with open("src/components/sections/Hero.tsx", "r") as f:
    content = f.read()

# I need to verify that `statusDotRef` isn't assigned to multiple elements in a way that causes issues.
# Looking closely at my file read above, I assigned `statusDotRef` to two different <span> tags.

content = content.replace('<span ref={statusDotRef} className="w-1.5 h-1.5 bg-green-500 rounded-full" />', '<span className="w-1.5 h-1.5 bg-green-500 rounded-full" />')

with open("src/components/sections/Hero.tsx", "w") as f:
    f.write(content)
