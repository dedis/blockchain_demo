function test_newblock(level, last_pow) {
  for (var i = 0; i < 5; i++) {
    var miner_id = rnd_array(test_miners);
    var first = true;
    if (level < blocks.length) {
      for (var j = 0; j < blocks[level].length; j++) {
        if (blocks[level][j].miner_id == miner_id + test_id_offset) {
          first = false;
        }
      }
      if (!first) {
        continue;
      }
    }
    var miner = test_miners[miner_id];
    var target = previous_target_find(level, miner_id + test_id_offset);
    var block = make_block_pow(miner, target, miner_id + test_id_offset, level, last_pow);
    if (block != null && block.pow != -1) {
      return block;
    }
  }
  return null;
}

function test_newblock_random() {
  var level = rnd_array(blocks) + 1;
  var previous = blocks[level][rnd_array(blocks[level])];
  add_block(test_newblock(level, previous.pow));
}

// Creates some blocks
function test_blocks() {
  var genesis = make_block_pow('DEDIS', max_target, 11, 0, 0);
  add_block(genesis);
  //	window.setInterval(test_newblock_random, 500);
  //	for (var b = 0; b < 10; b++){
  //		test_newblock(miners);
  //	}
}

function test_lfsr() {
  var lfsr = [0, 0, 0];
  for (var i = 0; i < 10; i++) {
    do_lfsr(lfsr);
    console.log(JSON.stringify(lfsr))
  }
  var b = make_block('DEDIS', 0, 0, 0, 395)
  console.log(calc_pow(b));
  console.log(verify_pow(b));
}
