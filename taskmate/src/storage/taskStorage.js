import AsyncStorage from '@react-native-async-storage/async-storage';
const TASKS_KEY = 'TASKMATE_TASKS';

export async function  saveTasks(tasks){
    try {
        await AsyncStorage.setItem(TASKS_KEY,JSON.stringify(tasks));
    } catch (e) {console.error('Failed to save tasks',e);}
};

export async function loadTasks(){
    try {
        const json = await AsyncStorage.getItem(TASKS_KEY);
        return json ? JSON.parse(json) : [];
    }
    catch{
        console.error('Failed to load tasks');
        return [];
    }
};