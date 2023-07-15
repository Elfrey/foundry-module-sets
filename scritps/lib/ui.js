import { MODULE } from './module';

Hooks.on('renderModuleManagement', (app, elem, options) => {
    console.debug('app', app);
    console.debug('elem', elem);
    console.debug('options', options);
    if (game.user.isGM) {
        const submitButton = elem[0].querySelector('button[type="submit"]');
        console.debug('MODULE', MODULE);
        submitButton.insertAdjacentHTML('beforebegin', `<button type="button" name="rollback" data-tooltip="${MODULE.localize('pick-preset')}">
					<i class="fa-regular fa-rotate-left"></i>
				</button>`);
    }   
});  