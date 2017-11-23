function test_newblock(level, last_pow){
	var miner_id = rnd_array(test_miners);
	var miner = test_miners[miner_id];
	return make_block_pow(miner, max_target, miner_id + test_id_offset, level, last_pow)
}

function test_newblock_random(){
	var level = rnd_array(blocks) + 1;
	var previous = blocks[level][rnd_array(blocks[level])];
	add_block(test_newblock(level, previous.pow));
}

// Creates some blocks
function test_blocks(){
	var genesis = make_block_pow('DEDIS', max_target, 11, 0, 0);
    add_block(genesis);
//	window.setInterval(test_newblock_random, 500);
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
