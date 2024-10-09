import {dirname} from 'path';
import {fileURLToPath} from 'url';

export const getDirName = (importMetaUrl) => {
    return dirname(fileURLToPath(importMetaUrl));
}