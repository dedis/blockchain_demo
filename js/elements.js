function add_html_new(){
// Create a custom element.
// ------------------------

    joint.shapes.htmlnew = {};
    joint.shapes.htmlnew.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'htmlnew.Element',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

// Create a custom view for that element that displays an htmlnew div above it.
// -------------------------------------------------------------------------

    joint.shapes.htmlnew.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            'Label: <input type="text" id="label"/><br>',
            'Miner-ID: <input type="text" id="miner_id"/><br>',
            'Block-#: <input type="text" id="block_cnt"/><br>',
            'Last PoW: <input type="text" id="last_pow"/><br>',
            'PoW: <input type="text" id="pow"/><br>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());
            var t = this;
            ['#label', '#miner_id', '#block_cnt', '#last_pow', '#pow'].forEach(function(el){
//            ['#miner_id'].forEach(function(el){
				t.$box.find(el).on('mousedown click', function(evt) {
    	            evt.stopPropagation();
        	    });
            	// This is an example of reacting on the input change and storing the input data in the cell model.
	            t.$box.find(el).on('change', _.bind(function(evt) {
//    	        	alert("changed" + $(evt.target).val())
    	        	t.model.set(el.slice(1, el.length), $(evt.target).val());
    	        	if (el == "#pow"){
    	        		console.log("New block:" + JSON.stringify(t.model));
    	        		var block = make_block(t.model.get("label"),
    	        			parseInt(t.model.get("miner_id")),
    	        			parseInt(t.model.get("block_cnt")),
    	        			parseInt(t.model.get("last_pow")),
    	        			parseInt(t.model.get("pow")));
    	        		add_block(block)
    	        	}
        	    }, t));
            })
            // Prevent paper from handling pointerdown.
            this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            console.log("init done")
            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {
            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the htmlnew with a data stored in the cell model.
            var block = this.model.get('block')
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });
}

function add_html(){
// Create a custom element.
// ------------------------

    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'html.Element',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------

    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="delete">x</button>',
            '<label></label><br>',
            '<div id="data" style="text-align:right">',
            'Miner-ID: <span id="miner-id">xx</span><br>',
            'Block-#: <span id="block-cnt">xx</span><br>',
            'Last PoW: <span id="last-pow">xx</span><br>',
            'PoW: <span id="pow">xx</span><br>',
            '</div>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());
            // Prevent paper from handling pointerdown.
            this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {
            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the HTML with a data stored in the cell model.
            var block = this.model.get('block')
            this.$box.find('label').text(block.label);
            this.$box.find('#miner-id').text(leftpad(block.miner_id, 2));
            this.$box.find('#block-cnt').text(leftpad(block.block_cnt, 2));
            this.$box.find('#last-pow').text(leftpad(block.last_pow, 3));
            this.$box.find('#pow').text(leftpad(block.pow, 3));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });
}
