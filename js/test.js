test_miners = ['Ismail', 'Linus', 'DEDIS'];

function test_newblock(){
	var miner_id = rnd_array(test_miners) + 1;
	var miner = test_miners[miner_id - 1];
	var level = rnd_array(blocks);
	var previous = blocks[level][rnd_array(blocks[level])];
//	console.log("Previous:", miner, level, JSON.stringify(previous));
	var block = make_block_pow(miner, miner_id, level + 1, previous.pow)
	add_block(block);
	return true;
}

// Creates some blocks
function test_blocks(){
	var genesis = make_block_pow('DEDIS', 11, 0, 0);
    add_block(genesis);
	window.setInterval(test_newblock, 500);
//	for (var b = 0; b < 10; b++){
//		test_newblock(miners);
//	}
}

function test_lfsr(){
	var lfsr = [0, 0, 0];
	for (var i=0; i<10; i++){
		do_lfsr(lfsr);
		console.log(JSON.stringify(lfsr))
	}
	var b = make_block('DEDIS', 0, 0, 0, 395)
	console.log(calc_pow(b));
	console.log(verify_pow(b));
}