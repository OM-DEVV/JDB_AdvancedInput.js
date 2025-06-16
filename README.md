================================================================================
 JDB_AdvancedInput.js - Plugin Documentation
================================================================================
 Version: 5.3.0
 Author: AI & OM-Devv
 Target: RPG Maker MZ
--------------------------------------------------------------------------------

CONTENTS
--------------------------------------------------------------------------------
1. Introduction
2. Key Features
3. Installation
4. Quick Start: Setting up Auto-Move
5. Detailed Configuration (Plugin Parameters)
   - 5.1 Main Parameters
   - 5.2 The Action Struct
6. Plugin Commands (For Eventing)
   - 6.1 Assign Key
   - 6.2 Remove Key
   - 6.3 Assign Mouse
   - 6.4 Remove Mouse
7. Developer API (For Scripting)
   - 7.1 Accessing the API
   - 7.2 API Functions & Examples
8. Changelog

--------------------------------------------------------------------------------
 1. INTRODUCTION
--------------------------------------------------------------------------------

JDB_AdvancedInput is a powerful and flexible input management system for RPG
Maker MZ. It allows developers to create custom key and mouse button bindings
that can trigger a wide variety of in-game actions, from calling common events
to running custom scripts.

The plugin is designed to be user-friendly for beginners through the Plugin
Manager, while also providing a robust API for advanced users and other
plugin developers. It correctly intercepts and consumes input, preventing
conflicts with the game's default control scheme.

--------------------------------------------------------------------------------
 2. KEY FEATURES
--------------------------------------------------------------------------------

*   Create custom bindings for nearly any keyboard key or mouse button.
*   Actions include: calling common events, starting map events, running custom
    JavaScript, and toggling a smooth auto-move feature.
*   Intuitive "Toggle Auto-Move Forward" feature for continuous, smooth player
    movement that is automatically cancelled by any manual input.
*   Bindings can be configured initially in the Plugin Manager and dynamically
    changed during the game via Plugin Commands.
*   All custom bindings are saved and loaded with the game's save file.
*   Exposes a clean, simple API for other plugins to interact with.

--------------------------------------------------------------------------------
 3. INSTALLATION
--------------------------------------------------------------------------------

1.  Save the `JDB_AdvancedInput.js` file into your project's `js/plugins`
    directory.
2.  Open the Plugin Manager in the RPG Maker MZ editor.
3.  Add a new plugin and select `JDB_AdvancedInput` from the list.
4.  Configure the parameters as needed and click "OK".
5.  Make sure the plugin is turned ON.

--------------------------------------------------------------------------------
 4. QUICK START: SETTING UP AUTO-MOVE
--------------------------------------------------------------------------------

This guide will help you bind the 'W' key to toggle automatic forward movement.

1.  In the Plugin Manager, double-click on `JDB_AdvancedInput`.
2.  Find the "Initial Key Binds" parameter and double-click it to open the list.
3.  Double-click on an empty row to add a new binding. A new window will pop up.
4.  Set the "Keyboard Key Name" parameter to `w`.
5.  Click the "Action" parameter to configure what the key does.
    - Set "Trigger Condition" to `Triggered (on press)`.
    - Set "Action Type" to `Toggle Auto-Move Forward`.
    - The other parameters in this section are not needed for this action.
6.  Click "OK" on all open windows to save your changes.
7.  Playtest the game. Pressing 'W' will now make your character walk forward
    smoothly. Pressing 'W' again, or any arrow key, will stop the movement.

--------------------------------------------------------------------------------
 5. DETAILED CONFIGURATION (PLUGIN PARAMETERS)
--------------------------------------------------------------------------------

--- 5.1 Main Parameters ---

*   Overwrite Default Keys
    If ON, your custom bindings can take precedence over the engine's default
    keys (like 'z' for 'ok' or 'x' for 'cancel'). If OFF, default keys
    cannot be overwritten.

*   Initial Key Binds
    A list of all keyboard bindings that will be active at the start of a
    new game. Bindings added via Plugin Commands later will be layered on top
    of these.

*   Initial Mouse Binds
    A list of all mouse button bindings that will be active at the start of a
    new game.


--- 5.2 The Action Struct ---

The `Action` struct defines what a key or mouse button does when pressed.

*   Trigger Condition
    Determines how the input is registered.
    - Triggered (on press): Fires once when the key is first pressed down.
      (RECOMMENDED for most actions, especially toggles and common events).
    - Pressed (on hold): Fires every single frame the key is held down. This
      can be performance-intensive and is for special use cases only.
    - Repeated (hold to repeat): Fires once on press, then fires repeatedly
      after a short delay if the key is held. Similar to typing in a text editor.

*   Action Type
    The main function to be performed.
    - Common Event: Calls a Common Event from the database.
      * Requires: `Common Event ID`, `Common Event - Is Parallel?`
    - Map Event: Starts an event on the current map. Can also be used to
      trigger the Player's touch event.
      * Requires: `Map Event ID`
    - Script Call: Executes a custom piece of JavaScript code.
      * Requires: `Script Call`
    - Toggle Auto-Move Forward: Toggles the smooth, continuous forward
      movement for the player.

*   Common Event ID
    The ID of the common event to run if `Action Type` is `Common Event`.

*   Common Event - Is Parallel?
    If ON, the common event will run in parallel, not interrupting player
    movement. If OFF, the game will pause while the event runs.

*   Map Event ID
    The ID of the map event to start. Use `0` for the event the player is
    standing on, or `-1` for the player character itself.

*   Script Call
    The JavaScript code to run. You can use shortcuts like `s` for
    $gameSwitches and `v` for $gameVariables.
    Example: `s.setValue(10, !s.value(10));` (Toggles switch 10)

--------------------------------------------------------------------------------
 6. PLUGIN COMMANDS (FOR EVENTING)
--------------------------------------------------------------------------------

You can change bindings during the game using Plugin Commands in your events.
These changes are stored in the save file.

--- 6.1 Assign Key ---
Assigns or re-assigns an action to a keyboard key.

*   Key Name: The key to bind (e.g., `q`, `f5`, `numpad1`). Must be lowercase.
*   Overwrite: If a binding already exists, should this new one replace it?
*   Action: The `Action` struct defining what the key does (see section 5.2).

--- 6.2 Remove Key ---
Removes a custom binding from a key.

*   Key Name: The key to unbind (e.g., `q`).
*   Restore Default: If this key had a default engine function (like 'ok'),
    should that function be restored? Recommended to keep this ON.

--- 6.3 Assign Mouse ---
Assigns or re-assigns an action to a mouse button.

*   Mouse Button: `left`, `middle`, or `right`.
*   Overwrite: If a binding already exists, should this new one replace it?
*   Action: The `Action` struct defining what the button does.

--- 6.4 Remove Mouse ---
Removes a custom binding from a mouse button.

*   Mouse Button: `left`, `middle`, or `right`.

--------------------------------------------------------------------------------
 7. DEVELOPER API (FOR SCRIPTING)
--------------------------------------------------------------------------------

--- 7.1 Accessing the API ---

The plugin provides a global API object for use in script calls or other plugins.
Access it via: `JDB_AdvancedInput.API`

--- 7.2 API Functions & Examples ---

All API functions apply their changes immediately.

*   assignKey(keyName, actionObject, overwrite = true)
    Assigns an action to a key.
    - keyName (string): The key name (e.g. 'h').
    - actionObject (object): An object defining the action.
    - overwrite (boolean): Optional, defaults to true.

    *Example 1: Assign 'h' to use a potion (Common Event 5)*
    ```javascript
    const key = 'h';
    const action = {
        trigger: 'isTriggered',
        type: 'commonEvent',
        commonEventId: 5,
        isParallel: false
    };
    JDB_AdvancedInput.API.assignKey(key, action);
    ```

*   removeKey(keyName, restoreDefault = true)
    Removes a binding from a key.
    - keyName (string): The key to remove.
    - restoreDefault (boolean): Optional, defaults to true.

    *Example 2: Remove the custom binding from 'h'*
    ```javascript
    JDB_AdvancedInput.API.removeKey('h');
    ```

*   assignMouse(button, actionObject, overwrite = true)
    Assigns an action to a mouse button.
    - button (string): 'left', 'middle', or 'right'.
    - actionObject (object): An object defining the action.
    - overwrite (boolean): Optional, defaults to true.

    *Example 3: Assign Right Mouse Button to toggle a light switch (Switch 20)*
    ```javascript
    const action = {
        trigger: 'isTriggered',
        type: 'scriptCall',
        scriptCall: "$gameSwitches.setValue(20, !$gameSwitches.value(20));"
    };
    JDB_AdvancedInput.API.assignMouse('right', action);
    ```

*   removeMouse(button)
    Removes a binding from a mouse button.
    - button (string): 'left', 'middle', or 'right'.

    *Example 4: Remove custom binding from the right mouse button*
    ```javascript
    JDB_AdvancedInput.API.removeMouse('right');
    ```

--------------------------------------------------------------------------------
 8. CHANGELOG
--------------------------------------------------------------------------------

*   v5.3.0 (Current)
    - Public release
