with open('chorale.html', 'rb') as f:
    text = f.read().decode('utf-8', errors='replace')

import re
text = re.sub(r'Erg.n', 'Ergün', text)

with open('chorale.html', 'wb') as f:
    f.write(text.encode('utf-8'))
