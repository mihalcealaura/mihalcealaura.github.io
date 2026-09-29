import re

html_file = 'aurion.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

outcomes_html = '''
<div class="outcomes-data">
    <div class="data-row">
        <div class="data-question">How did you feel while navigating the interface system?</div>
        <div class="data-answers">Pride, Fascination, Joy</div>
    </div>
    <div class="data-row">
        <div class="data-question">What was your impression of the physical prototype of the remote control?</div>
        <div class="data-answers">Fascination, Joy, Hope</div>
    </div>
    <div class="data-row">
        <div class="data-question">What was your experience like when performing Task 1 (Use the Screen Mirroring Function)?</div>
        <div class="data-answers">Fascination, Fear</div>
    </div>
    <div class="data-row">
        <div class="data-question">What was your experience like when performing Task 2 (Find a TV Series)?</div>
        <div class="data-answers">Pride, Admiration, Joy, Satisfaction</div>
    </div>
    <div class="data-row">
        <div class="data-question">What was your experience like when performing Task 3 (Change the System Language)?</div>
        <div class="data-answers">Pride, Fascination, Boredom, Satisfaction</div>
    </div>
</div>
'''

pattern = r'(<section id="outcomes" class="project-split-text">\s*<p>.*?</p>)'
replacement = r'\1\n        ' + outcomes_html.replace('\n', '\n        ')

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated HTML.")
