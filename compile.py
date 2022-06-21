import os
import re
import lpjsmin
directory = 'engine/'
source = 'script.js'
target = 'engine.min.js'
importCmd = re.compile('(\s*)/\*\s*import\s*\{\{(.+)\}\}\s*\*/')
fileContent = open(directory+source).read()

def parse(fileContent):
    while True:
        imp = importCmd.search(fileContent)
        if not imp: break
        leading, fname = imp.group(1, 2)
        fcontent = leading[1:] + parse(open(directory+fname).read())
        fcontent = fcontent.replace('\n', f'\n{leading}')
        fileContent = fileContent[:imp.start()] + '\n' + fcontent + fileContent[imp.end():]
    return fileContent

fileContent = parse(fileContent)
os.listdir(directory)
fileContent = fileContent.replace('\n\n', '\n')
open(target, 'w+').write(fileContent)
lpjsmin.minify(target)