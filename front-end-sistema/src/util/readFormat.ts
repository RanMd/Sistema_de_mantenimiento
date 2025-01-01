import { read, utils } from 'xlsx';

const readData = async (file: File): Promise<unknown[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result;

            const workbook = read(arrayBuffer, { type: 'binary' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const data = utils.sheet_to_json(sheet);

            resolve(data);
        }
        reader.onerror = (error) => reject(error);

        reader.readAsArrayBuffer(file);
    })
}

export default readData;