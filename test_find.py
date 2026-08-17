with open(r'd:\Endeavor\frontend\src\Home\Homepage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\r\n', '\n')

homepage_start = content.find("const Homepage = () => {")
print("homepage_start:", homepage_start)

start_idx = content.find("  return (\n", homepage_start)
print("start_idx:", start_idx)

# print surrounding lines
if start_idx != -1:
    start_line_no = content[:start_idx].count('\n') + 1
    print("Found at line:", start_line_no)
    print("Surrounding lines:")
    lines = content[start_idx:start_idx+200].split('\n')
    for line in lines[:5]:
        print(line)

end_marker = "  );\n};"
end_idx = content.find(end_marker, start_idx)
print("end_idx:", end_idx)
if end_idx != -1:
    end_line_no = content[:end_idx].count('\n') + 1
    print("End marker found at line:", end_line_no)
