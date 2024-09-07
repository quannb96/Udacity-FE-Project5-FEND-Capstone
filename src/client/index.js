import {generateAction} from './js/formHandler';
import './styles/main.scss';

document.getElementById('form-submit').addEventListener('click', generateAction)

export { generateAction };