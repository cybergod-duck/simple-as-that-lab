import csv

input_file = r"c:\Users\ovjup\Dropbox\Voss Neural Research LLC\VNR  Projects\the-index\data_dir\data.csv"

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = []
    for row in reader:
        if len(row) == 3:
            industry, pain_point, slug = row
            new_slug = slug.replace("best-crm-", "website-creation-for-")
            rows.append([industry, pain_point, new_slug])

with open(input_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)
    
print("Updated CSV successfully")
