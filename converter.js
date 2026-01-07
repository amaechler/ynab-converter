function parseCSVLine(line) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        if (char === '"' && inQuotes && nextChar === '"') {
            currentField += '"';
            i++;
        }
        else if (char === '"') {
            inQuotes = !inQuotes;
        }
        else if (char === ',' && !inQuotes) {
            fields.push(currentField);
            currentField = '';
        }
        else {
            currentField += char;
        }
    }
    fields.push(currentField);
    return fields;
}
function convertDateToYNAB(date) {
    const parts = date.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${month}/${day}/${year}`;
    }
    return date;
}
function flipAmount(amount) {
    amount = amount.trim();
    if (amount.startsWith('-')) {
        return amount.substring(1);
    }
    else {
        return '-' + amount;
    }
}
function escapeCSVField(field) {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
}
export function convertToYNAB(csvContent) {
    const lines = csvContent.split('\n');
    const output = ['Date,Payee,Memo,Amount'];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '')
            continue;
        const fields = parseCSVLine(line);
        if (fields.length < 6)
            continue;
        const transaction = {
            transactionDate: fields[0],
            postDate: fields[1],
            type: fields[2],
            details: fields[3],
            amount: fields[4],
            currency: fields[5],
        };
        const ynabTransaction = {
            date: convertDateToYNAB(transaction.transactionDate),
            payee: transaction.details,
            memo: transaction.type,
            amount: flipAmount(transaction.amount),
        };
        const outputLine = [
            escapeCSVField(ynabTransaction.date),
            escapeCSVField(ynabTransaction.payee),
            escapeCSVField(ynabTransaction.memo),
            escapeCSVField(ynabTransaction.amount),
        ].join(',');
        output.push(outputLine);
    }
    return output.join('\n');
}
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFile');
    const convertBtn = document.getElementById('convertBtn');
    const status = document.getElementById('status');
    const fileName = document.getElementById('fileName');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) {
            fileName.textContent = file.name;
        }
        else {
            fileName.textContent = '';
        }
    });
    convertBtn.addEventListener('click', () => {
        const file = fileInput.files?.[0];
        if (!file) {
            status.textContent = 'Please select a CSV file';
            status.className = 'status error';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result;
                const converted = convertToYNAB(content);
                const outputFilename = file.name.replace(/\.csv$/i, '_ynab.csv');
                downloadFile(converted, outputFilename);
                status.textContent = `Successfully converted! Downloaded as ${outputFilename}`;
                status.className = 'status success';
            }
            catch (error) {
                status.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                status.className = 'status error';
            }
        };
        reader.onerror = () => {
            status.textContent = 'Error reading file';
            status.className = 'status error';
        };
        reader.readAsText(file);
    });
});
