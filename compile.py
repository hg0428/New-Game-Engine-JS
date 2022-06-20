import os
import re
from jsmin import jsmin
directory = 'engine/'
source = 'script.js'
target = 'engine.min.js'
importCmd = re.compile('(\s*)//\s*import\s*\{\{(.+)\}\}')
fileContent = open(directory+source).read()
while True:
    imp = importCmd.search(fileContent)
    if not imp: break
    print(imp.span())
    leading, fname = imp.group(1, 2)
    fcontent = leading[1:] + open(directory+fname).read()
    fcontent = fcontent.replace('\n', f'\n{leading}')
    fileContent = fileContent[:imp.start()] + '\n' + fcontent + fileContent[imp.end():]

os.listdir(directory)
fileContent = jsmin(fileContent)
open(target, 'w+').write(fileContent)