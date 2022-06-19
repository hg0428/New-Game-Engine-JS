import os
import re
directory = 'engine'
source = 'engine/script.js'
target = 'engine.min.js'
importCmd = re.compile('(\s*)//\s*import\s*\{\{(.+)\}\}')

imports = importCmd.findall(open(source).read())
print(imports)
os.listdir(directory)
