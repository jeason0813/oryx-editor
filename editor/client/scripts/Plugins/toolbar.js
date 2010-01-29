/** * Copyright (c) 2006 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner * * Permission is hereby granted, free of charge, to any person obtaining a * copy of this software and associated documentation files (the "Software"), * to deal in the Software without restriction, including without limitation * the rights to use, copy, modify, merge, publish, distribute, sublicense, * and/or sell copies of the Software, and to permit persons to whom the * Software is furnished to do so, subject to the following conditions: * * The above copyright notice and this permission notice shall be included in * all copies or substantial portions of the Software. * * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER * DEALINGS IN THE SOFTWARE. **/if(!ORYX.Plugins) {	ORYX.Plugins = new Object();}ORYX.Plugins.Toolbar = Clazz.extend({	facade: undefined,	plugs:	[],	construct: function(facade, ownPluginData) {		this.facade = facade;				this.groupIndex = new Hash();		ownPluginData.properties.each((function(value){			if(value.group && value.index != undefined) {				this.groupIndex[value.group] = value.index			}		}).bind(this));				Ext.QuickTips.init();		this.buttons = [];        this.facade.registerOnEvent(ORYX.CONFIG.EVENT_BUTTON_UPDATE, this.onButtonUpdate.bind(this));	},        /**     * Can be used to manipulate the state of a button.     * @example     * this.facade.raiseEvent({     *   type: ORYX.CONFIG.EVENT_BUTTON_UPDATE,     *   id: this.buttonId, // have to be generated before and set in the offer method     *   pressed: true     * });     * @param {Object} event     */    onButtonUpdate: function(event){        var plug = this.buttons.find(function(plug){            return plug.id === event.id;        });                if(event.pressed !== undefined){            if (plug.buttonInstances[0].isVisible)            	plug.buttonInstances[0].toggle(event.pressed);            else            	plug.buttonInstances[1].toggle(event.pressed);        }    },	registryChanged: function(pluginsData) {    			var newPlugs = $A(pluginsData).findAll(function(value){			return !this.plugs.include( value )		}.bind(this));		if(newPlugs.length<1)			return;		        // Sort plugins by toolbarGroup		newPlugs = newPlugs.sortBy((function(value) {					return (value.toolbarGroup ===  undefined ? ORYX.I18N.toolbarGroups.others.position : value.toolbarGroup.position )		}).bind(this));        // Sort plugins by group and index		this.buttons = [];		var plugs = [];		for (var i = 0 ; i < newPlugs.length ; ) {			var thisGroup = newPlugs[i].toolbarGroup; 			var thisGroupsPlugs = new Array(newPlugs[i++]);			while (i < newPlugs.length && newPlugs[i].toolbarGroup == thisGroup) {				thisGroupsPlugs.push(newPlugs[i++]);			}			thisGroupsPlugs = thisGroupsPlugs.sortBy((function(value) {				return ((this.groupIndex[value.group] != undefined ? this.groupIndex[value.group] : "~" ) +					(value.group + value.index)).toLowerCase();			}).bind(this));			thisGroupsPlugs.each((function(value) {				plugs.push(value);			}));		}    			ORYX.Log.trace("Creating a toolbar.");		if(!this.toolbar){//			this.toolbar = new Ext.ux.SlicedToolbar({			this.toolbar = new Ext.ux.DynamicToolbar({				height: 24			});			var region = this.facade.addToRegion("north", this.toolbar, "Toolbar");			}		                var buttonIndex = 0;                // add buttons		plugs.each((function(value) {			if(!value.name) {return}			this.plugs.push(value);						// insert all unknown toolbar groups to "other" dropdown			if (value.toolbarGroup === undefined) {				value.toolbarGroup = ORYX.I18N.toolbarGroups.others;			}						value.dropDownGroupIcon = ORYX.PATH + "images/" + value.toolbarGroup.icon;						//find right position in toolbar			while (buttonIndex < this.toolbar.items.length &&					(	!(this.toolbar.items.itemAt(buttonIndex).isVisible) ||						!(this.toolbar.items.itemAt(buttonIndex).toolbarGroup) ||						!(value.toolbarGroup.position < this.toolbar.items.itemAt(buttonIndex).toolbarGroup.position))) {				buttonIndex++;			}						if (buttonIndex > 0 &&					!(this.toolbar.items.itemAt(buttonIndex-1).toolbarGroup)) {				buttonIndex--;			}				                        // If an drop down group icon is provided, a split button should be used            if(value.dropDownGroupIcon){                var toolbarGroupButton = undefined;                                //search for toolbarGroupButton in already existing buttons                if (this.toolbar.toolbarGroups.length > 0){                	for (var i=0 ; i < this.toolbar.toolbarGroups.length ; i++)                		if (value.dropDownGroupIcon == this.toolbar.toolbarGroups[i].icon) {                			toolbarGroupButton = this.toolbar.toolbarGroups[i];                		}                }                                // Create a new split button if this is the first plugin using it                 if(toolbarGroupButton === undefined){                    toolbarGroupButton = new Ext.Toolbar.SplitButton({                        cls: "x-btn-icon", //show icon only                        icon: value.dropDownGroupIcon,                        description: '',                        toolbarGroup: value.toolbarGroup,                        menu: new Ext.ux.ToolbarMenu({                            items: [] // items are added later on                        }),                        listeners: {                        	click: function(button, event){	                            // The "normal" button should behave like the arrow button                    				//for as long as it has no other handler assigned to it by a menu item		                        if (!this.handler)  {                      				if(!button.menu.isVisible() && !button.ignoreNextClick){		                                button.showMenu();		                            } else {		                                button.hideMenu();		                            }		                        }                        	}                        }                    });                                        this.toolbar.toolbarGroups.push(toolbarGroupButton);                    this.toolbar.insertButton(buttonIndex++,new Ext.Toolbar.Separator());                    this.toolbar.insertItem(buttonIndex++, toolbarGroupButton);                }                                // General config button which will be used either to create a normal button                // or a check button (if toggling is enabled)                var buttonCfg = {                    icon: value.icon,                    text: value.name,                    itemId: value.id,                    group: value.group,                    toolbarGroup: value.toolbarGroup,                    toolbarGroupButton: toolbarGroupButton,                    handler: value.toggle ? undefined : value.functionality,                    checkHandler: value.toggle ? value.functionality : undefined,                    listeners: {                        render: function(item){                            // After rendering, a tool tip should be added to component                            if (value.description) {                                new Ext.ToolTip({                                    target: item.getEl(),                                    title: value.description                                })                            }                        },                		click: function(button, event){                            // The menu button should update the menu, that it's been clicked                            if(!button.ignoreNextClick){                            	toolbarGroupButton.icon = this.icon;                        		toolbarGroupButton.handler = (value.toggle ? undefined : value.functionality);                        		var element = toolbarGroupButton.getEl();                        		while (element.first(null,false)) {                        			element = element.first(null,false);                        			if (element.hasClass("x-btn-left"))                        				element = element.next(null,false);;                        		}                        		element.setStyle("background-image", "url("+this.icon+")");                            }                        }                    }                }                                // Create buttons depending on toggle                if(value.toggle) {                    var button = new Ext.menu.CheckItem(buttonCfg);                } else {                    var button = new Ext.menu.Item(buttonCfg);                }                                               //insert menu seperator if new group begins                if (toolbarGroupButton.menu.items.length > 0 &&                 		value.group !== toolbarGroupButton.menu.items.last().group) {                	toolbarGroupButton.menu.add("-");					this.toolbar.insertButton(buttonIndex,new Ext.Toolbar.Separator());					this.toolbar.items.itemAt(buttonIndex++).setVisible(false);                }                toolbarGroupButton.menu.add(button);                var invButton = new Ext.Toolbar.Button({                    icon:           value.icon,         // icons can also be specified inline                    cls:            'x-btn-icon',       // Class who shows only the icon                    itemId:         value.id,        			tooltip:        value.description,  // Set the tooltip                    tooltipType:    'title',            // Tooltip will be shown as in the html-title attribute                    group:			value.group,                    toolbarGroup:		value.toolbarGroup,                    handler:        value.toggle ? null : value.functionality,  // Handler for mouse click                    enableToggle:   value.toggle, // Option for enabling toggling                    toggleHandler:  (value.toggle ? value.functionality : null), // Handler for toggle (Parameters: button, active)                	listeners: {                		click: function(button, event){		                    // The menu button should update the menu, that it's been clicked		                    if(!button.ignoreNextClick){		                    	toolbarGroupButton.icon = this.icon;		                		toolbarGroupButton.handler = (value.toggle ? undefined : value.functionality);		                		var element = toolbarGroupButton.getEl();		                		while (element.first(null,false)) {		                			element = element.first(null,false);		                			if (element.hasClass("x-btn-left"))		                				element = element.next(null,false);;		                		}		                		element.setStyle("background-image", "url("+this.icon+")");		                    }                		}                	}                });				this.toolbar.insertButton(buttonIndex,invButton);				this.toolbar.items.itemAt(buttonIndex++).setVisible(false);            } else { // create normal, simple button            	if (this.toolbar instanceof Ext.ux.DynamicToolbar)            		ORYX.Log.error("dynamic toolbar created normal button instance for "+value.name);                            	var button = this.createButton(value);                                // Add separator if new group has begun				    if (this.toolbar.items.length > 0 &&			    		button.group != this.toolbar.items.itemAt(buttonIndex-1).group) {					this.toolbar.insertButton(buttonIndex++,new Ext.Toolbar.Separator());								    }                                this.toolbar.insertButton(buttonIndex++,button);                button.getEl().onclick = function() {this.blur()}            }			value['buttonInstances'] = new Array(button,invButton);			this.buttons.push(value);		}).bind(this));		this.enableButtons([]);        		//sort toolbarGroups by descending priority		this.toolbar.toolbarGroups = this.toolbar.toolbarGroups.sortBy(function(toolbarGroupButton) {				return toolbarGroupButton.toolbarGroup.priority			}.bind(this));		this.toolbar.toolbarGroups = this.toolbar.toolbarGroups.reverse();				//force reload of toolbar		this.toolbar.collapseGroups(this.buttons);		this.toolbar.expandGroups(this.buttons);		window.addEventListener("resize", function(event){this.toolbar.expandToolbar()}.bind(this), false);		//      this.toolbar.calcSlices();//		window.addEventListener("resize", function(event){this.toolbar.calcSlices()}.bind(this), false);	},		onSelectionChanged: function(event) {		this.enableButtons(event.elements);	},	enableButtons: function(elements) {		// Show the Buttons		this.buttons.each((function(value){			value.buttonInstances[0].enable();			value.buttonInstances[1].enable();									// If there is less elements than minShapes			if(value.minShape && value.minShape > elements.length) {				value.buttonInstances[0].disable();				value.buttonInstances[1].disable();			}			// If there is more elements than minShapes			if(value.maxShape && value.maxShape < elements.length) {				value.buttonInstances[0].disable();				value.buttonInstances[1].disable();			}			// If the plugin is not enabled				if(value.isEnabled && !value.isEnabled()) {				value.buttonInstances[0].disable();				value.buttonInstances[1].disable();			}		}).bind(this));			},		createButton: function(value) {		return new Ext.Toolbar.Button({            icon:           value.icon,         // icons can also be specified inline            cls:            'x-btn-icon',       // Class who shows only the icon            itemId:         value.id,			tooltip:        value.description,  // Set the tooltip            tooltipType:    'title',            // Tooltip will be shown as in the html-title attribute            group:			value.group,            toolbarGroup:		value.toolbarGroup,            handler:        value.toggle ? null : value.functionality,  // Handler for mouse click            enableToggle:   value.toggle, // Option for enabling toggling            toggleHandler:  value.toggle ? value.functionality : null // Handler for toggle (Parameters: button, active)        }); 	},});Ext.ns("Ext.ux");Ext.ux.ToolbarMenu = Ext.extend(Ext.menu.Menu, {	expanded: false,	lastClicked: -1, //stores the index of the last clicked button	    initComponent: function(){	    Ext.apply(this, {});	    Ext.ux.ToolbarMenu.superclass.initComponent.apply(this, arguments);	},		addSeparator: function(){		return this.addItem(new Ext.menu.Separator());	}});Ext.ux.DynamicToolbar = Ext.extend(Ext.Toolbar, {	toolbarGroups: [],	thisIconWidth: Number.MAX_VALUE, //stores the actual width of visible tb icons	nextIconWidth: 1, //stores the required width of expanding an additional group, compared to thisIconWidth    defaultIconWidth: 22,    defaultIconSpacing: 3, // spacing due to <td> structure left/right of each icon        initComponent: function(){        Ext.apply(this, {});        Ext.ux.DynamicToolbar.superclass.initComponent.apply(this, arguments);    },        onRender: function(){        Ext.ux.DynamicToolbar.superclass.onRender.apply(this, arguments);    },        onResize: function(){        Ext.ux.DynamicToolbar.superclass.onResize.apply(this, arguments);    },	/**	 * checks whether there is anything to resize, then calls appropriate functions	 */	expandToolbar: function() {		var toolbarWidth = this.getEl().getWidth();				// return if toolbar  rebuild is running or would have no effect		if (!this.thisIconWidth ||			!this.nextIconWidth ||			(toolbarWidth >= this.thisIconWidth &&			toolbarWidth <= this.nextIconWidth))			return;				// stop listen to resize events		this.thisIconWidth = undefined;		this.nextIconWidth = undefined;				this.collapseGroups(this.toolbarGroups);		this.expandGroups(this.toolbarGroups);	},        /**     * goes through the priority-sorted groups and expands them if there is enough space left     * (i.e. hides the drop-down button and shows the groups toolbar buttons)     */    expandGroups: function(){    	var getWidth = function(object){    		//local function to return the width - bit more compact & intuitive...    		return object.getEl().getWidth();    	};    	var getLength = function(toolbarGroupButton){    		//local function to return the menu length - bit more compact & intuitive...    		return toolbarGroupButton.menu.items.length;    	};    	var minGroupLength = getLength(this.toolbarGroups[0]); // stores the shortest group (short by number of icons in it)        var toolbarWidth = getWidth(this);		var visibleIconsLength = (getWidth(this.toolbarGroups[0]) + getWidth(this.items.itemAt(0)) + this.defaultIconSpacing)									* this.toolbarGroups.length;		for (var i=0 ; i < this.toolbarGroups.length ; i++) {    		var toolbarGroupButton = this.toolbarGroups[i];    		if (toolbarWidth < (visibleIconsLength - getWidth(toolbarGroupButton) + getLength(toolbarGroupButton) * this.defaultIconWidth)) {    			// group cannot be expanded for there is not enough space left        		if (minGroupLength > getLength(toolbarGroupButton))        			minGroupLength = getLength(toolbarGroupButton);    			continue;    		}    		visibleIconsLength -= getWidth(toolbarGroupButton);    		toolbarGroupButton.setVisible(false);    		var toolbarGroupButtonIndex = this.items.indexOf(toolbarGroupButton);    		for (var j=1 ; j <= getLength(toolbarGroupButton) ; j++ ) {    			var item = this.items.itemAt(toolbarGroupButtonIndex + j);    			item.setVisible(true);    			visibleIconsLength += getWidth(item) + this.defaultIconSpacing;    		}    		toolbarGroupButton.menu.expanded = true;    		this.toolbarGroups[i] = toolbarGroupButton;    	}    	    	this.thisIconWidth = visibleIconsLength;    	//now estimate size of icons if smallest closed group would be expanded    	this.nextIconWidth = visibleIconsLength + minGroupLength * this.defaultIconWidth;    },        /**     * collapses each group (i.e. the according buttons are hidden and the drop-down button is shown again     */    collapseGroups: function() {    	for (var i=0 ; i < this.toolbarGroups.length ; i++) {    		var toolbarGroupButton = this.toolbarGroups[i];    		if (toolbarGroupButton.menu.expanded == false)    			continue;    		var toolbarGroupButtonIndex = this.items.indexOf(toolbarGroupButton);    		for (var j=1 ; j<= toolbarGroupButton.menu.items.length ; j++ ) {    			this.items.itemAt(toolbarGroupButtonIndex + j).setVisible(false);    		}    		toolbarGroupButton.setVisible(true);    		toolbarGroupButton.menu.expanded = false;    		this.toolbarGroups[i] = toolbarGroupButton;    	}    }});Ext.ux.SlicedToolbar = Ext.extend(Ext.Toolbar, {    currentSlice: 0,    iconStandardWidth: 22, //22 px         initComponent: function(){        Ext.apply(this, {        });        Ext.ux.SlicedToolbar.superclass.initComponent.apply(this, arguments);    },        onRender: function(){        Ext.ux.SlicedToolbar.superclass.onRender.apply(this, arguments);    },        onResize: function(){        Ext.ux.SlicedToolbar.superclass.onResize.apply(this, arguments);    },        calcSlices: function(){        var slice = 0;        this.sliceMap = {};        var sliceWidth = 0;        var toolbarWidth = this.getEl().getWidth();        this.items.getRange().each(function(item, index){            //Remove all next and prev buttons            if (item.helperItem) {                item.destroy();                return;            }                        var itemWidth = item.getEl().getWidth();                        if(sliceWidth + itemWidth + 5 * this.iconStandardWidth > toolbarWidth){                var itemIndex = this.items.indexOf(item);                                this.insertSlicingButton("next", slice, itemIndex);                                if (slice !== 0) {                    this.insertSlicingButton("prev", slice, itemIndex);                }                                this.insertSlicingSeperator(slice, itemIndex);                slice += 1;                sliceWidth = 0;            }                        this.sliceMap[item.id] = slice;            sliceWidth += itemWidth;        }.bind(this));                // Add prev button at the end        if(slice > 0){            this.insertSlicingSeperator(slice, this.items.getCount()+1);            this.insertSlicingButton("prev", slice, this.items.getCount()+1);            var spacer = new Ext.Toolbar.Spacer();            this.insertSlicedHelperButton(spacer, slice, this.items.getCount()+1);            Ext.get(spacer.id).setWidth(this.iconStandardWidth);        }                this.maxSlice = slice;                // Update view        this.setCurrentSlice(this.currentSlice);    },        insertSlicedButton: function(button, slice, index){        this.insertButton(index, button);        this.sliceMap[button.id] = slice;    },        insertSlicedHelperButton: function(button, slice, index){        button.helperItem = true;        this.insertSlicedButton(button, slice, index);    },        insertSlicingSeperator: function(slice, index){        // Align right        this.insertSlicedHelperButton(new Ext.Toolbar.Fill(), slice, index);    },        // type => next or prev    insertSlicingButton: function(type, slice, index){        var nextHandler = function(){this.setCurrentSlice(this.currentSlice+1)}.bind(this);        var prevHandler = function(){this.setCurrentSlice(this.currentSlice-1)}.bind(this);                var button = new Ext.Toolbar.Button({            cls: "x-btn-icon",            icon: ORYX.CONFIG.ROOT_PATH + "images/toolbar_"+type+".png",            handler: (type === "next") ? nextHandler : prevHandler        });                this.insertSlicedHelperButton(button, slice, index);    },        setCurrentSlice: function(slice){        if(slice > this.maxSlice || slice < 0) return;                this.currentSlice = slice;        this.items.getRange().each(function(item){            item.setVisible(slice === this.sliceMap[item.id]);        }.bind(this));    }});