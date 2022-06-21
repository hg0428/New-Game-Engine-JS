import os
import re
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
        fcontent = fcontent.replace('\n', f'\n{leading[1:]}')
        fileContent = fileContent[:imp.start()] + '\n' + fcontent + fileContent[imp.end():]
    return fileContent

def minify(content): # Breaks the code.
    content = content.replace('\n\n', '\n')
    content = content.replace('\t', '')
    content = content.replace('  ', '')
    ops = '=:+-=<>*/,|!&?'
    for op in ops:
        content = content.replace(' '+op, op)
        content = content.replace(op+' ', op)
    content = content.replace(') {', '){')
    content = content.replace('else {', 'else{')
    content = content.replace('} else', '}else')
    single = re.compile('//.*?\n')
    content = single.sub('', content)
    #Remove multiline comments later.
    return content

fileContent = parse(fileContent)
#fileContent = minify(fileContent)
open(target, 'w+').write(fileContent)
print(f'Compiled to {target}!')