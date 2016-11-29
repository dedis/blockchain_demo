function init_paper(){
    graph = new joint.dia.Graph;

    paper = new joint.dia.Paper({
        el: $('#myholder'),
        width: 10000,
        height: 10000,
        model: graph,
        gridSize: 1
    });

    input = new joint.shapes.htmlnew.Element({
		size: { width: 170, height: 100 },
        position: { x: 100,
    	    y: 100}
    });
	graph.addCells([input])
}

function leftpad(v, n){
	var va = "" + v;
	while (va.length < n){
		va = "0" + va;
	}
	return va
}

function previous_block(block){
	// Search connecting block if counter > 0
	var previous = {};
	if (block.block_cnt > 0){
//		console.log("Searching", JSON.stringify(block))
		blocks[block.block_cnt - 1].forEach(function(e){
//			console.log("Testing", JSON.stringify(e))
			if (( e.pow == block.last_pow ) &&
				(e.block_cnt + 1 == block.block_cnt)){
//				console.log("Found previous")
				previous = e;
//				console.log("Found previous:", previous.label, previous.miner_id)
			}
		})
	}

	if (previous.label){
//		console.log("Found previous", JSON.stringify(previous))
	}
	return previous
}

function make_block_pow(label, miner_id, block_cnt, last_pow){
	var block = make_block(label, miner_id, block_cnt, last_pow, 0)
	block.pow = calc_pow(block)
	return block;
}

function make_block(label, miner_id, block_cnt, last_pow, pow){
	var block = {
		label: label,
        miner_id: miner_id,
        block_cnt: block_cnt,
        last_pow: last_pow,
        pow: pow
	}

	return block
}

blocks = [];

function add_block(block){
	console.log("Adding block: ", JSON.stringify(block))
	if (block.block_cnt > blocks.length || block.block_cnt == 0){
		block.block_cnt = blocks.length;
	}
	var previous = previous_block(block);
	if (block.block_cnt > 0 && !previous.pow){
		alert("Non-linkable block!");
		return;
	}
	if (!verify_pow(block)){
		alert("PoW not correct for:" + JSON.stringify(block));
		return;
	}
    var el1 = new joint.shapes.html.Element({
        size: { width: 170, height: 100 },
        block: block,
        position: { x: block.block_cnt * 200,
        			y: 0}
    });
    block.element = el1;
    if (blocks.length <= block.block_cnt){
		blocks.push([])
    }
    blocks[block.block_cnt].push(block);
    graph.addCells([el1])

	if (block.block_cnt > 0){
	    var l = new joint.dia.Link({
       		source: { id: previous.element.id },
   		    target: { id: el1.id },
       		attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
   		});
	   	graph.addCells([l]);
	}

    update_blocks();
}

function update_blocks(block){
	var x = 100;
	blocks.forEach(function(bs){
//		console.log("Searching counter")
		// shuffle blocks
		for (var i = 0; i < bs.length; i++){
			var a = rnd_array(bs);
			var b = rnd_array(bs);
			var c = bs[a];
			bs[a] = bs[b];
			bs[b] = c;
		}
		var y = 100;
		bs.forEach(function(b){
			b.element.position(x, y);
//			console.log("Set block", JSON.stringify(b), "to", b.element.position)
			y += 120;
		})
		x += 200;
	})
	input.position(x, 100);
}

function do_lfsr(lfsr){
	var n = lfsr[0] + 5 * lfsr[1] + lfsr[2] + 1;
	lfsr[0] = lfsr[1] || 0;
	lfsr[1] = lfsr[2] || 0;
	lfsr[2] = ( n % 10 ) || 0;
}

function calc_pow(block){
	var lfsr = [block.miner_id % 10, block.block_cnt % 10, block.last_pow % 10];
	do_lfsr(lfsr);
	while (lfsr[2] != 5 && lfsr[2] != 9){
//		console.log(JSON.stringify(lfsr));
		do_lfsr(lfsr);
	}
	return lfsr[0] * 100 + lfsr[1] * 10 + lfsr[2];
}

function verify_pow(block){
	return calc_pow(block) == block.pow;
}

function rnd_array(a){
	return Math.floor(Math.random()*a.length)
}

add_html();
add_html_new();