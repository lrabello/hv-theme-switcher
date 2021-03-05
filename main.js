/*
 * HV Project Switch plugin
 */


const {Rectangle, Ellipse, Color, Text, Path, Group, Artboard, SymbolInstance, RepeatGrid,
    Polygon, Line, ImageFill } = require("scenegraph");
const application = require("application");
    
const themeV1 = require('./theme-switcher-v1.3.1');
const themeV3 = require('./theme-switcher-v3.4.0');

const PLUGIN_ID = "fda3b272";
const DESIGN_SYSTEM_VERSION_1 = 'v1.3.1';
const DESIGN_SYSTEM_VERSION_3 = 'v3.0.0'; 

const DAWN_THEME = 1;
const WICKED_THEME = 2; 

let panel;
let shouldSetDefaultSystemVersion = false;

function create() {

    const PRE_HTML = `<style>
        .row { align-items: center; }
        label span { margin-left: 1px; width: 100%; }
        select, .object-selection { margin-left: 1px; width: 165px; margin-bottom:15px; }
        .theme-margin { margin-right: 8px; }
        .simple-title { font-size: 1vh; margin-bottom: 10px; }
        .button { width: 80px; border: 1px solid transparent;  border-radius: 2px;}
        .theme-selection label { margin: 10px auto; font-size: 1vh; }
        .button img { border-radius: 2px; }
        .selected { width: 80px; border: 1px solid #414141; }
        .label-selected, #objects { color: #3F3F3F; }
        img.dawn, img.wicked { width: 78px; }
        </style>
    `;

    const divPre = document.createElement("div");
    divPre.innerHTML = PRE_HTML;

    const POS_HTML = `
    <div class="object-selection">
        <label class="row simple-title">Select your object / group / artboard</label>
        <label id="objects" class="objects"></label>
    </div>
    `;

    const divPos = document.createElement("div");
    divPos.innerHTML = POS_HTML;

    // Themes
    const themesWrapper = document.createElement("div");
    const themesLabel = document.createElement("label");
    themesLabel.classList.add("row");
    themesLabel.classList.add("simple-title");
    themesLabel.innerHTML = "Themes:";

    const themesButtons = document.createElement("div");
    themesButtons.classList.add("theme-selection");
    themesButtons.classList.add("row");

    // -- Dawn
    const dawnButtonWrapper = document.createElement("span");
    dawnButtonWrapper.classList.add("column");
    dawnButtonWrapper.classList.add("theme-margin");
    const dawnButton = document.createElement("div");
    dawnButton.id = "dawn-button";
    dawnButton.classList.add("button");
    dawnButton.innerHTML = '<img class="dawn" src="images/dawnimg.png"/>';
    const dawnLabel = document.createElement('label');
    dawnLabel.id = "dawn-label";
    dawnLabel.innerHTML = "Dawn";
    dawnButtonWrapper.appendChild(dawnButton);
    dawnButtonWrapper.appendChild(dawnLabel);

    // -- Wicked
    const wickedButtonWrapper = document.createElement("span");
    wickedButtonWrapper.classList.add("column");
    const wickedButton = document.createElement("div");
    wickedButton.id = "wicked-button";
    wickedButton.classList.add("button");
    wickedButton.innerHTML = '<img class="wicked" src="images/wickedimg.png"/>';
    const wickedLabel = document.createElement('label');
    wickedLabel.id = "wicked-label";
    wickedLabel.innerHTML = "Wicked";
    wickedButtonWrapper.appendChild(wickedButton);
    wickedButtonWrapper.appendChild(wickedLabel);

    themesButtons.appendChild(dawnButtonWrapper);
    themesButtons.appendChild(wickedButtonWrapper);

    themesWrapper.appendChild(themesLabel);
    themesWrapper.appendChild(themesButtons);

    // Select
    const labelWrapper = document.createElement("label");
    const label = document.createElement("span");
    label.textContent = "Your DS Version";
    label.setAttribute('title', 'This plugin only works with DS versions 1.x or 3.x');
    
    const select = document.createElement("select");
    select.id="theme-select";
    
    const options = [
        [DESIGN_SYSTEM_VERSION_3, "3.x.x"],
        [DESIGN_SYSTEM_VERSION_1, "1.x.x"],
    ].map(([val, text]) => {
        const el = document.createElement("option");
        el.setAttribute("value", val);
        el.textContent = text;
        return el;
    });
    
    options.forEach(opt => select.appendChild(opt));
    select.value = DESIGN_SYSTEM_VERSION_3;
    labelWrapper.appendChild(label);
    labelWrapper.appendChild(select);

    // Panel

    panel = document.createElement("div");
    panel.appendChild(divPre)
    panel.appendChild(labelWrapper);
    panel.appendChild(divPos);
    panel.appendChild(themesWrapper);

    return panel;
}

function show(event) {
    // create panel the first time it's shown
    if (!panel) {
        panel = create();
        //document.getElementById('v-number').setAttribute("value", true);';
        event.node.appendChild(panel);
    }

}
  
let dawnButton;
let dawnLabel;
let wickedButton;
let wickedLabel;
let themeSelect;

function update(selection, root) {

    const objectElement = document.getElementById('objects');
    const objectQuantity = selection.items.length;

    // show how many objects/artboards are selected
    switch (objectQuantity) {
        case 0:
            objectElement.innerHTML = `No object selected`;

            if (dawnButton) {
                dawnButton.classList.remove('selected');
                dawnLabel.classList.remove('label-selected');

            }
            if (wickedButton) {
                wickedButton.classList.remove('selected');
                wickedLabel.classList.remove('label-selected');

            }

            break;
        case 1:
            objectElement.innerHTML = `${objectQuantity} object selected`;
            break;
        default:
            objectElement.innerHTML = `${objectQuantity} objects selected`;
    }


    //const designSystemVersion = getCurrentDesignSystemVersion(root);
    /*if (!designSystemVersion) {
        setCurrentDesignSystemVersion(root, DESIGN_SYSTEM_VERSION_3);
    }*/

    if (!dawnButton) {
        dawnButton = document.getElementById('dawn-button');
        dawnLabel = document.getElementById('dawn-label');

        dawnButton.addEventListener("click", (e) => {
            application.editDocument({ editLabel : 'Dawn Theme'}, (selection, root) => {
                switchTheme(root, selection, WICKED_THEME, DAWN_THEME);
                dawnButton.classList.add('selected');
                dawnLabel.classList.add('label-selected');


                if (wickedButton) {
                    wickedButton.classList.remove('selected'); 
                    wickedLabel.classList.remove('label-selected');
                }
            });
        });
    }

    if (!wickedButton) {
        wickedButton = document.getElementById('wicked-button');
        wickedLabel = document.getElementById('wicked-label');

        wickedButton.addEventListener("click", (e) => {
            application.editDocument({ editLabel : 'Wicked Theme' }, (selection, root) => {
                switchTheme(root, selection, DAWN_THEME, WICKED_THEME);
                wickedButton.classList.add('selected');
                wickedLabel.classList.add('label-selected');

                if (dawnButton) {
                    dawnButton.classList.remove('selected');
                    dawnLabel.classList.remove('label-selected');

                }
            });
        });
    }
    if (!themeSelect) {
        themeSelect = document.getElementById('theme-select');
        themeSelect.addEventListener("change", (e) => {
            application.editDocument({ editLabel : 'DS Version' }, (selection, root) => {
                switchDesignVersion(root, selection, e.target.value);
            });
        });
    }        

}

function switchDesignVersion(sceneNode, selection, versionTo){
    // Apply it...
    console.log("Switching HV design system");

    setCurrentDesignSystemVersion(sceneNode, versionTo);
    const currentTheme = Number(getCurrentTheme(sceneNode));
    const themesArray = getThemesArray(versionTo);

    for (let index = 0; index < selection.items.length; index++) {
        const item = selection.items[index];
        processItem(themesArray, item, currentTheme, currentTheme);
    }
    
}

function switchTheme(sceneNode, selection, sourceIdx, destinationIdx){
    // Apply it...
    console.log("Switching HV theme");

    // TODO: Find out current design system version
    setCurrentTheme(sceneNode, `${destinationIdx}`);
    const currentDesignSystemVersion = getCurrentDesignSystemVersion(sceneNode) || DESIGN_SYSTEM_VERSION_3;
    const themesArray = getThemesArray(currentDesignSystemVersion)

    for (let index = 0; index < selection.items.length; index++) {
        const item = selection.items[index];
        processItem(themesArray, item, sourceIdx, destinationIdx);
    }
}

function setCurrentDesignSystemVersion(sceneNode, designSystemVersion) {
    sceneNode.sharedPluginData.setItem(PLUGIN_ID, "design-system-current-version", designSystemVersion);
}

function setCurrentTheme(sceneNode, theme) {
    sceneNode.sharedPluginData.setItem(PLUGIN_ID, "design-system-theme", theme);
}

function getCurrentDesignSystemVersion(sceneNode) {
    return sceneNode.sharedPluginData.getItem(PLUGIN_ID, "design-system-current-version");
}

function getCurrentTheme(sceneNode) {
    return sceneNode.sharedPluginData.getItem(PLUGIN_ID, "design-system-theme");
}

function getThemesArray(designSystemVersion) {
    switch (designSystemVersion) {
        case DESIGN_SYSTEM_VERSION_3:
            return themeV3;
        case DESIGN_SYSTEM_VERSION_1:
            return themeV1;
        default:
            return DESIGN_SYSTEM_VERSION_3;
    }
}

function processItem(themesArray, item, sourceIdx, destinationIdx){

    if ( item instanceof Text){

        //console.log("Found text... " )

        var styles = item.styleRanges;

        styles.map( styleRange => 
            replaceColor(themesArray, styleRange, "fill", sourceIdx, destinationIdx) 
        )
        try {
            item.styleRanges = styles;            
        } catch (error) {
            console.log("Error applying text style...");
        }
    }
    else if (item instanceof Rectangle || item instanceof Ellipse || 
	    item instanceof Path || item instanceof Polygon || item instanceof Line ){

        //console.log( "Found Rectangle or Ellipse");
        replaceColor(themesArray, item,"fill",sourceIdx, destinationIdx);
        replaceColor(themesArray, item,"stroke",sourceIdx, destinationIdx);
        replaceColor(themesArray, item,"shadow.color",sourceIdx, destinationIdx);
    }
    else if( item instanceof Artboard || item instanceof Group ){
        // go one level down
        if( item instanceof Artboard ){
            replaceColor(themesArray, item,"fill",sourceIdx, destinationIdx);
        }

        // Skipping some conditions here...
        if ( item instanceof Group && item.mask ){
            // continue
        }
        else{
            //console.log("Going one level down...")
            item.children.forEach(function(e,i){
                //console.log("Here..." + e + i)
                processItem(themesArray, e, sourceIdx, destinationIdx)
            })

        }


    }
    else if( item instanceof SymbolInstance ){

	    console.log("Found symbol. We can't edit it...");

    }
    else if( item instanceof RepeatGrid ){

	// This one belongs to a different edit context... 

    }
    else{
        // Other elements
        console.log("Unknown element: " + typeof item)
    }

}

function replaceColor(themesArray, elem, property,  sourceIdx, destinationIdx){

    try {

        // Let's check if it's a multi-level property
        var value;
        const arrLocation=property.split(".");
        //console.log(arrLocation, elem[arrLocation[0]]);
        
        if( arrLocation.length == 1 ){
            value = elem[arrLocation[0]];
        }
        else if ( arrLocation.length == 2 && elem[arrLocation[0]] != null ){
            value = elem[arrLocation[0]][arrLocation[1]];
            //console.log('tem shadow')
            //console.log(arrLocation, elem[arrLocation[0]], value);
        }
        else{
            console.log("Invalid property defined: " + property);
        }


        if( value && !(value instanceof ImageFill)){
            
            /* let colorValue = value.toHex(1); 
            if (arrLocation[0] === 'shadow' && elem[arrLocation[0]] ) {
                colorValue = value.toRgba();
                console.log('shadow ->', value, colorValue, arrLocation[0], elem[arrLocation[0]], getEquivalentColor(themesArray, colorValue, sourceIdx, destinationIdx));
            } */

            //elem[arrLocation[0]] && console.log(colorValue);
            var c = getEquivalentColor(themesArray, value.toHex(1), sourceIdx, destinationIdx);
            if (c){
                // Transforming
                //console.log("Changing color: from " + value.toHex(1) + " to " + c)

                const splittedColor = c.split('|');
                const [hexColor, opacity] = splittedColor.length > 1 ? splittedColor : [splittedColor[0], null];
                if (opacity) {
                    value = new Color(hexColor, opacity);
                    console.log('opacity', opacity)
                } else {
                    value = new Color(hexColor); 
                }
                               
                if( arrLocation.length == 1 ){
                    elem[arrLocation[0]] = value;
                }
                else if ( arrLocation.length == 2 ){
                    var obj = elem[arrLocation[0]];
                    obj[arrLocation[1]] = value;

                    elem[arrLocation[0]] = obj;
                }
            }
        }
    } 
    catch (error) {
	    console.log("Error: " + error);
    }   

}


function getEquivalentColor(themesArray, color, sourceIdx, destinationIdx){

    const found = themesArray.map( o => o[sourceIdx]).findIndex(element => element === color);
    //console.log("Searching for color: "+ color);

    if( found >= 0 ){
        //console.log("Found "+ themesArray[found][0] + " color " + color + " in position " + found + ". Returning " + themesArray[found][destinationIdx])
        //console.log(themesArray[found])
	    return themesArray[found][destinationIdx];
    }

    return null;

}

module.exports = {
    panels: {
        themeSwitcherPanel: {
            show,
            update
        }
    }
};