/**
 * MODULE Helpers
 *
 */
export class MODULE {
  static ID = "foundry-module-sets";

  static get TITLE() {
    return this.localize("title");
  }

  static localize(stringId, data = {}) {
    return foundry.utils.isEmpty(data ?? {})
      ? game.i18n.localize(`${this.ID}.${stringId}`)
      : game.i18n.format(`${this.ID}.${stringId}`, data);
  }

  static setting = (...args) => {
    // Are we registering a new setting
    if (args[0].toLowerCase() == "register") {
      // Register New Setting
      let setting = args[1]; // This is the name of the setting
      let value = args[2]; // This is the settings of the setting
      let settingDefaults = {
        name: this.localize(`settings.${setting}.name`),
        hint: this.localize(`settings.${setting}.hint`),
        scope: "client",
        config: true,
      };
      let newSetting = foundry.utils.mergeObject(settingDefaults, value, {
        inplace: false,
      });
      game.settings.register(this.ID, setting, newSetting);

      return newSetting;
    } else {
      let setting = args[0];
      // If only one value is passed in, get setting
      if (typeof args[1] == "undefined") {
        try {
          return game.settings.get(this.ID, setting);
        } catch {
          MODULE.error(`${setting} is not a registered game setting`);
          return undefined;
        }
      } else {
        // If two values are passed in, then set setting
        return game.settings.set(this.ID, setting, args[1]);
      }
    }
  };
}


class FMSPresetsDialog extends FormApplication {
  constructor(packages) {
    super();
  }

  static get defaultOptions() {
    return {
			...super.defaultOptions,
      title: MODULE.localize('dialog-presets-title'),
			template: `./modules/${MODULE.ID}/templates/presets.hbs`,
      id: `${MODULE.ID}-presets`,
			classes: ['dialog'],
			resizable: true,
			width: $(window).width() > 400 ? 400 : $(window).width() - 100,    
		}
  }

  getData() {
    return {
      DIALOG: {
        ID: MODULE.ID,
        TITLE: MODULE.title,
      },
      presets: comunityPresets
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    const showModules = (event) => {
      const presetKey = event.target.closest('li').dataset.preset;
      const preset = comunityPresets[presetKey];
      Dialog.prompt({
				id: `${MODULE.ID}-activate-preset`,
				title: MODULE.TITLE,
        resizable: true,
				content: `<p style="margin-top: 0px;">
        ${MODULE.localize('modules-in-preset', {name: preset.name})}
        </p>
				<textarea readonly rows="${preset.modules.length <= 15 ? preset.modules.length + 2 : 15}" style="margin-bottom: 0.5rem;">${preset.modules.filter((module) => {
					return (game.modules.get(module.id) ?? false) != false;
				}).map(module => {
					return module.title;
				}).join('\n')}</textarea>`
			});
    }

    const adcitveModules = (event) => {
      const presetKey = event.target.closest('li').dataset.preset;
      const preset = comunityPresets[presetKey];
      
      const worldModules = game.settings.get('core', ModuleManagement.CONFIG_SETTING)
      preset.modules.forEach(({id}) => {
        if (worldModules[id] != null) {
          worldModules[id] = true;
        }
      });
      Dialog.confirm({
				id: `${MODULE.ID}-activate-preset`,
				title: MODULE.TITLE,
        resizable: true,
				content: `<p style="margin-top: 0px;">
        ${MODULE.localize('activate-modules-list', {name: preset.name})}
        </p>
				<textarea readonly rows="${preset.modules.length <= 15 ? preset.modules.length + 2 : 15}" style="margin-bottom: 0.5rem;">${preset.modules.filter((module) => {
					return (game.modules.get(module.id) ?? false) != false;
				}).map(module => {
					return module.title;
				}).join('\n')}</textarea>`,
        yes: () => {
          game.settings.set('core', ModuleManagement.CONFIG_SETTING, worldModules).then((response) => {
            SettingsConfig.reloadConfirm({world: true});
          });
        },
				no: (elemDialog) => {
					return false;
				}
			});
      
      
    }
    html[0].querySelectorAll(`#${MODULE.ID}-presets-list li`).forEach(item => {
      item.querySelector('button[data-action="fms-info"]').addEventListener('click', showModules);
    });
    html[0].querySelectorAll(`#${MODULE.ID}-presets-list li`).forEach(item => {
      item.querySelector('button[data-action="fms-activate"]').addEventListener('click', adcitveModules);
    });
  }
}


/**
 * UI elements
 */
Hooks.on("renderModuleManagement", (app, elem, options) => {
  console.debug('comunityPresets', comunityPresets);

  if (game.user.isGM) {
    const moduleManagementWindow = elem[0];
    const submitButton = moduleManagementWindow.querySelector(
      'button[type="submit"]'
    );
    submitButton.insertAdjacentHTML(
      "beforebegin",
      `<button type="button" name="${MODULE.ID}-pick-preset" data-tooltip="${MODULE.localize("pick-preset")}">
      <i class="fa-regular fa-list-check"></i>
      </button>`
    );
    moduleManagementWindow
      .querySelector(`footer button[name="${MODULE.ID}-pick-preset"]`)
      .addEventListener("click", async (event) => {
        new FMSPresetsDialog().render(true);
      });
  }
});