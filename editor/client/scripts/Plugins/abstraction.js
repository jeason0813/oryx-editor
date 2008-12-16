// TODO+// I18N, ++/**+ * Copyright (c) 2008, Artem Polyvyanyy+ *+ * Permission is hereby granted, free of charge, to any person obtaining a+ * copy of this software and associated documentation files (the "Software"),+ * to deal in the Software without restriction, including without limitation+ * the rights to use, copy, modify, merge, publish, distribute, sublicense,+ * and/or sell copies of the Software, and to permit persons to whom the+ * Software is furnished to do so, subject to the following conditions:+ *+ * The above copyright notice and this permission notice shall be included in+ * all copies or substantial portions of the Software.+ *+ * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR+ * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,+ * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE+ * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER+ * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING+ * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER+ * DEALINGS IN THE SOFTWARE.+ **/++if (!ORYX.Plugins) +    ORYX.Plugins = new Object();+	+Ext.namespace("Ext.ux");++Ext.ux.NotificationMgr = {+  positions: []+};++Ext.ux.Notification = Ext.extend(Ext.Window, {+  initComponent: function(){+    Ext.apply(this, {+      iconCls: this.iconCls || 'x-icon-information',+      cls: 'x-notification',+      width: 200,+      autoHeight: true,+      plain: false,+      draggable: false,+      bodyStyle: this.bodyStyle || 'text-align:center'+    });+    if(this.autoDestroy) {+      this.task = new Ext.util.DelayedTask(this.hide, this);+    } else {+      this.closable = true;+    }+    Ext.ux.Notification.superclass.initComponent.call(this);+  },+  setMessage: function(msg){+    this.body.update(msg);+  },+  setTitle: function(title, iconCls){+    Ext.ux.Notification.superclass.setTitle.call(this, title, iconCls||this.iconCls);+  },+  onRender:function(ct, position) {+    Ext.ux.Notification.superclass.onRender.call(this, ct, position);+  },+  onDestroy: function(){+    Ext.ux.NotificationMgr.positions.remove(this.pos);+    Ext.ux.Notification.superclass.onDestroy.call(this);+  },+  cancelHiding: function(){+    this.addClass('fixed');+    if(this.autoDestroy) {+      this.task.cancel();+    }+  },+  afterShow: function(){+    Ext.ux.Notification.superclass.afterShow.call(this);+    Ext.fly(this.body.dom).on('click', this.cancelHiding, this);+    if(this.autoDestroy) {+      this.task.delay(this.hideDelay || 5000);+     }+  },+  animShow: function(){+    this.pos = 0;+    while(Ext.ux.NotificationMgr.positions.indexOf(this.pos)>-1)+      this.pos++;+    Ext.ux.NotificationMgr.positions.push(this.pos);+    this.setSize(200,100);+    this.el.alignTo(document, "br-br", [ -20, -20-((this.getSize().height+10)*this.pos) ]);+    this.el.slideIn('b', {+      duration: 1,+      callback: this.afterShow,+      scope: this+    });+  },+  animHide: function(){+       Ext.ux.NotificationMgr.positions.remove(this.pos);+    this.el.ghost("b", {+      duration: 1,+      remove: true+    });+  },++  focus: Ext.emptyFn ++}); ++Ext.namespace("ORYX.Plugins");++/*************************************************************+ * ABSTRACTION PLUGIN+ *************************************************************/++ORYX.Plugins.Abstraction = Clazz.extend({+	+	facade		: undefined,+	candidate	: undefined,+	rdf			: undefined,+	active		: false,+      +	construct: function(facade) {+		this.facade = facade;++		this.facade.offer({+			'name': 'Abstraction mode',+			'description': 'Abstraction mode',+			'functionality': this.toggleAbstractionMode.bind(this),+			'group': 'Abstraction',+			'icon': ORYX.PATH + "images/wrench.png",+			'index': 1,+			'minShape': 0,+			'maxShape': 0});+	},+	+	toggleAbstractionMode: function(){+		// update status+		this.active = !this.active;+		+		// show status notification+		var ntitle	= (this.active) ? 'Enabled' : 'Disabled';+		var ntext	= (this.active) ? 'Abstraction mode is enabled' : 'Abstraction mode is disabled';+		this.showNotification(ntitle,ntext);+		+		// register/unregister events+		if (this.active) {+			this.callback = this.doMouseUp.bind(this)+			this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEUP, this.callback);+		}+		else {+			this.facade.unregisterOnEvent(ORYX.CONFIG.EVENT_MOUSEUP, this.callback);+			this.callback = undefined;+			+			this.hideOverlays();+			+			if (this.hasShape(this.candidate)) this.hideOverlayOnShape(this.candidate);+			this.candidate = undefined;+		}+	},+	+	doMouseUp: function(event, shape){+		if (this.candidate == shape) {+			// time to abstract+			// TODO+			this.showNotification('INFO','It is time to abstract component');+		}+        else if (this.isAbstractionTarget(shape)) {+			// select abstraction candidate+			if (this.hasShape(this.candidate)) this.hideOverlayOnShape(this.candidate);+			this.candidate = shape;+			this.showOverlayOnShape(this.candidate, {fill: "green"});+			+			// retrieve abstraction fragment from server+			this.showNotification('INFO','Request abstraction component from server');+			this.requestAbstractionComponent(shape);+			// TODO+			+			// visualize fragment in editor+			// TODO+        }+    },+	+	isAbstractionTarget: function(shape){+        return (shape.getStencil().id().search(/#(Task)$/) > -1) || (shape.getStencil().id().search(/#(CollapsedSubprocess)$/) > -1);+    },+	+	showOverlayOnShape: function(shape, attributes, node){+        this.hideOverlayOnShape(shape);+        +        this.facade.raiseEvent({+            type: ORYX.CONFIG.EVENT_OVERLAY_SHOW,+            id: "st." + shape.resourceId,+            shapes: [shape],+            attributes: attributes,+            node: (node ? node : null),+            nodePosition: shape instanceof ORYX.Core.Edge ? "END" : "SE"+        });+    },+    +    hideOverlayOnShape: function(shape){+        this.facade.raiseEvent({+            type: ORYX.CONFIG.EVENT_OVERLAY_HIDE,+            id: "st." + shape.resourceId+        });+    },+	+	showNotification: function(ntitle,ntext){+        new Ext.ux.Notification({+            title: ntitle,+            html: ntext,+            iconCls: 'error',+            hideDelay:  1000,+            bodyStyle: {'text-align':'left'}+        }).show(document); +    },+	+	doRequestAbstractionComponent: function(options){+        new Ajax.Request(ORYX.CONFIG.ABSTRACTION, {+            method: 'POST',+            asynchronous: false,+            parameters: {+                erdf: this.facade.getERDF(),+                shape_id: options.task.resourceId+            },+            onSuccess: options.onSuccess+        });+    },+	+	requestAbstractionComponent: function(shape){+        this.doRequestAbstractionComponent({+			task : shape,+			onSuccess: this.successOnRequestAbstractionComponent.bind(this)+        });+    },+	+	successOnRequestAbstractionComponent: function(request){+		//this.showNotification('Response', request.responseText);+		+		this.hideOverlays();+		var o = request.responseText.evalJSON();+				+		if (o instanceof Array && o.length > 0) {+			for (var i=0; i<o.length; i++) {+				var s = this.facade.getCanvas().getChildShapeByResourceId(o[i]);+				+				if (s) {+					//this.showNotification('Object', o[i]);+					this.facade.raiseEvent({+						type: ORYX.CONFIG.EVENT_OVERLAY_SHOW,+						id: "st." + s.resourceId,+						shapes: [s],+						attributes: {stroke: 'red'}+					})+				}+			}+		}+	},+	+	hasShape: function(shape){+		if(!this.isDefined(shape)) return false;+		return true;+  		//return !!this.facade.getCanvas().getChildShapeByResourceId(shape.resourceId);+	},+	+	isDefined: function(variable){+		return (typeof(variable) == 'undefined') ? false : true;+	},+	+	/* TODO this should be a general oryx helper method!! */+    generateRDF: function(){+        // Force to set all resource IDs+        var serializedDOM = DataManager.serializeDOM(this.facade);+        +        //get current DOM content+        var serializedDOM = DataManager.__persistDOM(this.facade);+        //add namespaces+        serializedDOM = '<?xml version="1.0" encoding="utf-8"?>' ++        '<html xmlns="http://www.w3.org/1999/xhtml" ' ++        'xmlns:b3mn="http://b3mn.org/2007/b3mn" ' ++        'xmlns:ext="http://b3mn.org/2007/ext" ' ++        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' ++        'xmlns:atom="http://b3mn.org/2007/atom+xhtml">' ++        '<head profile="http://purl.org/NET/erdf/profile">' ++        '<link rel="schema.dc" href="http://purl.org/dc/elements/1.1/" />' ++        '<link rel="schema.dcTerms" href="http://purl.org/dc/terms/ " />' ++        '<link rel="schema.b3mn" href="http://b3mn.org" />' ++        '<link rel="schema.oryx" href="http://oryx-editor.org/" />' ++        '<link rel="schema.raziel" href="http://raziel.org/" />' ++        '<base href="' ++        location.href.split("?")[0] ++        '" />' ++        '</head><body>' ++        serializedDOM ++        '</body></html>';+        +        //convert to RDF+        var parser = new DOMParser();+        var parsedDOM = parser.parseFromString(serializedDOM, "text/xml");+        var xsltPath = ORYX.PATH + "lib/extract-rdf.xsl";+        var xsltProcessor = new XSLTProcessor();+        var xslRef = document.implementation.createDocument("", "", null);+        xslRef.async = false;+        xslRef.load(xsltPath);+        xsltProcessor.importStylesheet(xslRef);+        try {+            var new_rdf = xsltProcessor.transformToDocument(parsedDOM);+            var serialized_rdf = (new XMLSerializer()).serializeToString(new_rdf);+            +            // Firefox 2 to 3 problem?!+            serialized_rdf = !serialized_rdf.startsWith("<?xml") ? "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serialized_rdf : serialized_rdf;+        } +        catch (error) {+            this.facade.raiseEvent({+                type: ORYX.CONFIG.EVENT_LOADING_DISABLE+            });+            Ext.Msg.alert("Oryx (rdf)", error);+        }+        +        this.rdf = serialized_rdf;+    },+    +    getRDF: function(){+        if (this.rdf == undefined) {+            this.generateRDF();+        }+        +        return this.rdf;+    },+	+	hideOverlays: function(){+        var els = this.facade.getCanvas().getChildShapes(true);+        for (i = 0; i < els.size(); i++) {+			if (els[i].resourceId != this.candidate.resourceId)+				this.hideOverlayOnShape(els[i]);+		}+	}+});