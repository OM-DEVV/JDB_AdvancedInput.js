/*:
 * @pluginname JDB_AdvancedInput
 * @author AI & OM-Devv
 * @target MZ
 * @version 5.3.0
 * @url 
 *
 * @help
 * JDB_AdvancedInput.js
 * Version 5.3.0
 *
 * This plugin provides a robust system for binding keyboard keys and mouse
 * buttons to various in-game actions.
 *
 * --- WHAT'S NEW (v5.3.0) ---
 * Added a new Action Type: "Toggle Auto-Move Forward".
 * This is a complete overhaul of the previous "Move Forward" feature.
 *
 * How "Toggle Auto-Move Forward" Works:
 * - Bind a key to this action (use the "Triggered" condition).
 * - Pressing the key once will cause the player to walk forward continuously
 *   and smoothly.
 * - Pressing the key again will stop the auto-movement.
 * - Pressing ANY other movement key (Up, Down, Left, Right) or clicking to
 *   move on the map will instantly cancel the auto-move and give you back
 *   manual control. This provides a seamless and intuitive experience.
 *
 * --- SETUP ---
 * 1. To use the new auto-move, create a keybind and select
 *    "Toggle Auto-Move Forward" as the Action Type.
 * 2. Configure other bindings in the "Initial Key Binds" and
 *    "Initial Mouse Binds" parameter lists.
 * 3. Use Plugin Commands to modify bindings during the game.
 *
 *
 * @param overwriteDefault
 * @text Overwrite Default Keys
 * @desc If ON, your initial bindings can replace default keys like 'ok' or 'cancel'.
 * @type boolean
 * @default true
 *
 * @param initialKeyBinds
 * @text Initial Key Binds
 * @desc The list of keyboard bindings loaded at the start of a new game.
 * @type struct<ActionBind>[]
 * @default []
 *
 * @param initialMouseBinds
 * @text Initial Mouse Binds
 * @desc The list of mouse bindings loaded at the start of a new game.
 * @type struct<MouseActionBind>[]
 * @default []
 *
 * @command assignKey
 * @text Assign Key
 * @desc Assigns an action to a keyboard key. This change is saved with the game.
 * @arg keyName
 * @text Key Name
 * @type string
 * @default q
 * @arg overwrite
 * @text Overwrite
 * @type boolean
 * @default true
 * @arg action
 * @text Action
 * @type struct<Action>
 *
 * @command removeKey
 * @text Remove Key
 * @desc Removes a custom binding from a keyboard key.
 * @arg keyName
 * @text Key Name
 * @type string
 * @default q
 * @arg restoreDefault
 * @text Restore Default
 * @type boolean
 * @default true
 *
 * @command assignMouse
 * @text Assign Mouse
 * @desc Assigns an action to a mouse button. This change is saved with the game.
 * @arg mouseButton
 * @text Mouse Button
 * @type select
 * @option Left @value left
 * @option Middle @value middle
 * @option Right @value right
 * @default left
 * @arg overwrite
 * @text Overwrite
 * @type boolean
 * @default true
 * @arg action
 * @text Action
 * @type struct<Action>
 *
 * @command removeMouse
 * @text Remove Mouse
 * @desc Removes a custom binding from a mouse button.
 * @arg mouseButton
 * @text Mouse Button
 * @type select
 * @option Left @value left
 * @option Middle @value middle
 * @option Right @value right
 * @default left
 */

/*~struct~ActionBind:
 * @param keyName
 * @text Keyboard Key Name
 * @desc The key to bind (e.g., 'q', 'f5', 'numpad1').
 * @type string
 *
 * @param action
 * @text Action
 * @desc The action this key will perform.
 * @type struct<Action>
 */

/*~struct~MouseActionBind:
 * @param mouseButton
 * @text Mouse Button
 * @type select
 * @option Left @value left
 * @option Middle @value middle
 * @option Right @value right
 * @default left
 *
 * @param action
 * @text Action
 * @desc The action this button will perform.
 * @type struct<Action>
 */

/*~struct~Action:
 * @param triggerCondition
 * @text Trigger Condition
 * @desc The trigger condition for the action. For "Toggle Auto-Move", use "Triggered".
 * @type select
 * @option Triggered (on press) @value isTriggered
 * @option Pressed (on hold) @value isPressed
 * @option Repeated (hold to repeat) @value isRepeated
 * @default isTriggered
 *
 * @param actionType
 * @text Action Type
 * @type select
 * @option Common Event @value commonEvent
 * @option Map Event @value mapEvent
 * @option Script Call @value scriptCall
 * @option Toggle Auto-Move Forward @value toggleMoveForward
 *
 * @param commonEventId
 * @text Common Event ID
 * @type common_event
 * @default 0
 *
 * @param isParallel
 * @text Common Event - Is Parallel?
 * @type boolean
 * @default false
 *
 * @param mapEventId
 * @text Map Event ID
 * @type number
 * @min -1
 * @default 0
 *
 * @param scriptCall
 * @text Script Call
 * @type multiline_string
 */

var $jdbInputData = null;
var JDB_AdvancedInput = window.JDB_AdvancedInput || {};

(() => {
    'use strict';

    const pluginName = "JDB_AdvancedInput";
    const params = PluginManager.parameters(pluginName);

    // --- Static Data ---
    const KeyCodes = {
        keyboard: { a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, '0':48, '1':49, '2':50, '3':51, '4':52, '5':53, '6':54, '7':55, '8':56, '9':57, backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, left:37, up:38, right:39, down:40, insert:45, delete:46, numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, numpad6:102, numpad7:103, numpad8:104, numpad9:105, f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123, ';':186, '=':187, ',':188, '-':189, '.':190, '/':191, '`':192, '[':219, '\\':220, ']':221, "'":222, arrowleft:37, arrowup:38, arrowright:39, arrowdown:40 },
        mouse: { left: "left", right: "right", middle: "middle" }
    };
    const _originalKeyMapper = { ...Input.keyMapper };

    function parseActionFromJSON(actionString) {
        if (!actionString) return null;
        try {
            const action = JSON.parse(actionString);
            return {
                trigger: action.triggerCondition, 
                type: action.actionType, 
                isParallel: action.isParallel === 'true', 
                commonEventId: Number(action.commonEventId || 0), 
                mapEventId: Number(action.mapEventId || 0),
                scriptCall: action.scriptCall,
            };
        } catch (e) {
            console.error(`${pluginName}: Failed to parse action JSON.`, e);
            return null;
        }
    }

    class JDB_InputData {
        constructor() { this.keyBinds = {}; this.mouseBinds = {}; }
    }

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $jdbInputData = new JDB_InputData();
        JDB_InputManager.setupInitialBinds();
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.jdbInputData = $jdbInputData;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $jdbInputData = contents.jdbInputData || new JDB_InputData();
        JDB_InputManager.applyBindsToKeyMapper();
    };

    class JDB_InputManager {
        static setupInitialBinds() {
            const keyBinds = JSON.parse(params.initialKeyBinds || "[]");
            for (const bindString of keyBinds) {
                const bind = JSON.parse(bindString);
                const action = parseActionFromJSON(bind.action);
                if (action) this.assignKey(bind.keyName, action, params.overwriteDefault === 'true');
            }
            const mouseBinds = JSON.parse(params.initialMouseBinds || "[]");
            for (const bindString of mouseBinds) {
                const bind = JSON.parse(bindString);
                const action = parseActionFromJSON(bind.action);
                if (action) this.assignMouse(bind.mouseButton, action, true);
            }
        }

        static applyBindsToKeyMapper() {
            Input.keyMapper = { ..._originalKeyMapper };
            for (const keyName in $jdbInputData.keyBinds) {
                const keyCode = KeyCodes.keyboard[keyName];
                if (keyCode) Input.keyMapper[keyCode] = keyName;
            }
        }

        static assignKey(keyName, actionObject, overwrite) { keyName = keyName.toLowerCase(); const keyCode = KeyCodes.keyboard[keyName]; if (!keyCode) { console.warn(`${pluginName}: Unknown key "${keyName}".`); return; } if ($jdbInputData.keyBinds[keyName] && !overwrite) return; if (_originalKeyMapper[keyCode] && !overwrite) return; $jdbInputData.keyBinds[keyName] = actionObject; Input.keyMapper[keyCode] = keyName; }
        static removeKey(keyName, restoreDefault) { keyName = keyName.toLowerCase(); delete $jdbInputData.keyBinds[keyName]; const keyCode = KeyCodes.keyboard[keyName]; if (keyCode) { if (restoreDefault && _originalKeyMapper[keyCode]) Input.keyMapper[keyCode] = _originalKeyMapper[keyCode]; else delete Input.keyMapper[keyCode]; } }
        static assignMouse(button, actionObject, overwrite) { if ($jdbInputData.mouseBinds[button] && !overwrite) return; $jdbInputData.mouseBinds[button] = actionObject; }
        static removeMouse(button) { delete $jdbInputData.mouseBinds[button]; }

        static executeAction(action) {
            if (!action) return;
            Input.clear(); TouchInput.clear();
            switch (action.type) {
                case 'commonEvent': if (action.commonEventId > 0) { action.isParallel ? $gameMap.requestParallelCommonEvent(action.commonEventId) : $gameTemp.reserveCommonEvent(action.commonEventId); } break;
                case 'mapEvent': const event = action.mapEventId > 0 ? $gameMap.event(action.mapEventId) : $gamePlayer; if (event) event.start(); break;
                case 'scriptCall': try { const a=$gameActors, p=$gameParty, s=$gameSwitches, v=$gameVariables; eval(action.scriptCall); } catch (e) { console.error(`${pluginName}: Script call error.`, e); } break;
                case 'toggleMoveForward': $gamePlayer.toggleAutoMoveForward(); break;
            }
        }
    }

    TouchInput._middlePressed = false;
    const _TouchInput_onMouseDown = TouchInput._onMouseDown;
    TouchInput._onMouseDown = function(event) { _TouchInput_onMouseDown.call(this, event); if (event.button === 1) this._middlePressed = true; };
    const _TouchInput_onMouseUp = TouchInput._onMouseUp;
    TouchInput._onMouseUp = function(event) { _TouchInput_onMouseUp.call(this, event); if (event.button === 1) this._middlePressed = false; };
    TouchInput.isMiddlePressed = function() { return this._middlePressed; };
    Game_Map.prototype.requestParallelCommonEvent = function(commonEventId) { const commonEvent = new Game_CommonEvent(commonEventId); if (commonEvent.isParallel()) { this._commonEvents.push(commonEvent); } else { const interp = new Game_Interpreter(); interp.setup(commonEvent.list()); (this._interpreters = this._interpreters || []).push(interp); } };
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) { _Game_Map_update.call(this, sceneActive); if (this._interpreters) { for (let i = this._interpreters.length - 1; i >= 0; i--) { const interp = this._interpreters[i]; if (!interp.isRunning()) this._interpreters.splice(i, 1); else interp.update(); } } };

    // --- Add state to Game_CharacterBase ---
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._isAutoMovingForward = false;
    };

    // --- Add toggle function to Game_Player ---
    Game_Player.prototype.toggleAutoMoveForward = function() {
        if (!this._isAutoMovingForward && !this.canMove()) {
            return; // Don't activate if player can't move (in menu, event, etc.)
        }
        this._isAutoMovingForward = !this._isAutoMovingForward;
    };

    // --- Core Movement Logic ---
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        if (sceneActive && this._isAutoMovingForward && this.canMove()) {
            // Check for any manual input that should override the auto-move.
            // This includes arrow keys and map clicks.
            if (this.getInputDirection() > 0 || $gameTemp.isDestinationValid()) {
                this._isAutoMovingForward = false; // Cancel auto-move
            }
        }

        // Call the original update function, which processes manual input.
        _Game_Player_update.call(this, sceneActive);

        // After manual input is processed, if we are still set to auto-move
        // and not currently moving, execute our auto-move.
        if (sceneActive && this._isAutoMovingForward && !this.isMoving() && this.canMove()) {
            this.moveStraight(this.direction());
        }
    };

    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        const canProcessInput = this.isActive() && !$gameMap.isEventRunning() && !$gameMessage.isBusy();
        if (canProcessInput) this.processJdbInput();
    };

    Scene_Map.prototype.processJdbInput = function() {
        for (const keyName in $jdbInputData.keyBinds) {
            const bind = $jdbInputData.keyBinds[keyName];
            if (Input[bind.trigger](keyName)) {
                JDB_InputManager.executeAction(bind);
                return;
            }
        }
        for (const button in $jdbInputData.mouseBinds) {
            const bind = $jdbInputData.mouseBinds[button];
            let pressed = false;
            switch(button) {
                case 'left': pressed = TouchInput[bind.trigger](); break;
                case 'right': pressed = (bind.trigger === 'isTriggered') ? TouchInput.isCancelled() : TouchInput.isRightPressed(); break;
                case 'middle': pressed = TouchInput.isMiddlePressed(); break;
            }
            if (pressed) {
                JDB_InputManager.executeAction(bind);
                return;
            }
        }
    };

    const API = { assignKey(keyName, actionObject, overwrite = true) { JDB_InputManager.assignKey(keyName, actionObject, overwrite); }, removeKey(keyName, restoreDefault = true) { JDB_InputManager.removeKey(keyName, restoreDefault); }, assignMouse(button, actionObject, overwrite = true) { JDB_InputManager.assignMouse(button, actionObject, overwrite); }, removeMouse(button) { JDB_InputManager.removeMouse(button); } };
    JDB_AdvancedInput.API = API;
    function register(command, func) { PluginManager.registerCommand(pluginName, command, func); }
    register("assignKey", args => { const action = parseActionFromJSON(args.action); if (action) API.assignKey(args.keyName, action, args.overwrite === 'true'); });
    register("removeKey", args => API.removeKey(args.keyName, args.restoreDefault === 'true'));
    register("assignMouse", args => { const action = parseActionFromJSON(args.action); if (action) API.assignMouse(args.mouseButton, action, args.overwrite === 'true'); });
    register("removeMouse", args => API.removeMouse(args.mouseButton));
})();