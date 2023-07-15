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
const comunityPresets = [
  {
    key: "laaru-modules",
    name: "Laaru Modules",
    modules: [
      {
          "id": "autoanimations",
          "title": "Automated Animations"
      },
      {
          "id": "babele",
          "title": "Babele"
      },
      {
          "id": "dnd5e-animations",
          "title": "D&D5e Animations"
      },
      {
          "id": "dfreds-convenient-effects",
          "title": "DFreds Convenient Effects"
      },
      {
          "id": "dice-so-nice",
          "title": "Dice So Nice!"
      },
      {
          "id": "dice-calculator",
          "title": "Dice Tray"
      },
      {
          "id": "drag-ruler",
          "title": "Drag Ruler"
      },
      {
          "id": "dae",
          "title": "Dynamic effects using Active Effects"
      },
      {
          "id": "healthEstimate",
          "title": "Health Estimate"
      },
      {
          "id": "jb2a_patreon",
          "title": "JB2A - Patreon Complete Collection"
      },
      {
          "id": "lessfog",
          "title": "Less Fog"
      },
      {
          "id": "colorsettings",
          "title": "lib - Color Settings"
      },
      {
          "id": "lib-wrapper",
          "title": "libWrapper"
      },
      {
          "id": "socketlib",
          "title": "socketlib"
      },
      {
          "id": "token-action-hud-core",
          "title": "Token Action HUD Core"
      },
      {
          "id": "lordudice",
          "title": "Lordu's Custom Dice for Dice So Nice"
      },
      {
          "id": "midi-qol",
          "title": "Midi QOL"
      },
      {
          "id": "mobile-sheet",
          "title": "Mobile Sheet"
      },
      {
          "id": "module-credits",
          "title": "Module Management+"
      },
      {
          "id": "monks-active-tiles",
          "title": "Monk's Active Tile Triggers"
      },
      {
          "id": "monks-combat-details",
          "title": "Monk's Combat Details"
      },
      {
          "id": "monks-combat-marker",
          "title": "Monk's Combat Marker"
      },
      {
          "id": "monks-little-details",
          "title": "Monk's Little Details"
      },
      {
          "id": "monks-tokenbar",
          "title": "Monk's TokenBar"
      },
      {
          "id": "popout",
          "title": "PopOut!"
      },
      {
          "id": "quick-insert",
          "title": "Quick Insert - Search Widget"
      },
      {
          "id": "ru-ru",
          "title": "❄️ Russian Translation | Русский перевод"
      },
      {
          "id": "sequencer",
          "title": "Sequencer"
      },
      {
          "id": "show-secrets",
          "title": "Show Secrets"
      },
      {
          "id": "laaru-dnd5-hw",
          "title": "🧙‍♂️🐲⚔️ Заклинания, Чудовища и Классы / Spells, Monsters & Classes"
      },
      {
          "id": "tidy5e-sheet",
          "title": "Tidy5e Sheet"
      },
      {
          "id": "tile-scroll",
          "title": "Tile Scroll"
      },
      {
          "id": "token-action-hud-dnd5e",
          "title": "Token Action HUD D&D 5e"
      },
      {
          "id": "tokenmagic",
          "title": "Token Magic FX"
      },
      {
          "id": "minimal-ui",
          "title": "Minimal UI"
      },
      {
          "id": "tidy-ui_game-settings",
          "title": "Tidy UI - Game Settings"
      }
  ],
  },
  {
    key: "fa-modules",
    name: "FA Maps",
    modules: [
      {
        id: "fa-battlemaps",
        title: "Forgotten Adventures Battlemaps",
      },
    ],
  },
];

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