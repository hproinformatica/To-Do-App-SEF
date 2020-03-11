import { AsyncStorage } from 'react-native';
import { delayedAlert } from 'hpro-rn';

const THEME_KEY = 'THEMEID';

// Por definição, sempre que campos de tabelas forem utilizados no projeto mobile
// eles serão referenciadas diretamente pelo seus nomes.
class ThemeClass {
    constructor(id) {
        this.id = id;
    }
}

export async function saveTheme(id) {

    const Theme = new ThemeClass(id);
    
    try {
        await AsyncStorage.setItem(THEME_KEY, JSON.stringify(Theme));
    } catch (error) {
        delayedAlert('Erro', error.message);
    }
}

export async function loadTheme() {
    try {
        const Theme = await AsyncStorage.getItem(THEME_KEY);

        if (!Theme) {
            return null;
        }
        return JSON.parse(Theme);

    } catch (error) {
        delayedAlert('Erro', error.message);
    }
}

export async function clearTheme() {
    try {
        await AsyncStorage.removeItem(THEME_KEY);
    } catch (error) {
        delayedAlert('Erro', error.message);
    }
}