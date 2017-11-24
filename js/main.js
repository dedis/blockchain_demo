test_miners = ['DEDIS', 'Rivest', 'Shamir', 'Adleman'];
test_id_offset = 16;
max_target = 2;

function init_paper() {
  graph = new joint.dia.Graph;

  paper = new joint.dia.Paper({
    el: $('#myholder'),
    width: 10000,
    height: 10000,
    model: graph,
    gridSize: 1
  });

  input = new joint.shapes.htmlnew.Element({
    size: {
      width: 170,
      height: 120
    },
    position: {
      x: 100,
      y: 100
    }
  });
  graph.addCells([input])
}

function leftpad(v, n) {
  var va = "" + v;
  while (va.length < n) {
    va = "0" + va;
  }
  return va
}

function is_in_chain(block, last) {
  var pointer = last;
  console.log("Checking last:", last.block_cnt, last.miner_id);
  for (var b = last.block_cnt; b >= 0; b--) {
    for (var c = 0; c < blocks[b].length; c++) {
      if (pointer.last_pow == blocks[b][c].pow) {
        pointer = blocks[b][c];
        if (block.block_cnt == b && block.miner_id == pointer.miner_id &&
          block.last_pow == pointer.last_pow && block.pow == pointer.pow) {
          return true;
        }
        break;
      }
    }
  }
  return false;
}

function is_longest(block) {
  console.log("Checking longest for:", block.block_cnt, block.miner_id)
  if (block.block_cnt == blocks.length - 1) {
    return true;
  }
  var last_row = blocks[blocks.length - 1];
  for (var b = 0; b < last_row.length; b++) {
    if (is_in_chain(block, last_row[b])) {
      return true;
    }
  }
  return false;
}

function previous_block(block) {
  // Search connecting block if counter > 0
  var previous = {};
  if (block.block_cnt > 0 &&
    block.block_cnt <= blocks.length) {
    // console.log("Searching", JSON.stringify(block))
    blocks[block.block_cnt - 1].forEach(function(e) {
      // console.log("Testing", JSON.stringify(e))
      if ((e.pow == block.last_pow) &&
        (e.block_cnt + 1 == block.block_cnt)) {
        // console.log("Found previous")
        previous = e;
        // console.log("Found previous:", previous.label, previous.miner_id)
      }
    })
  }

  if (previous.label) {
    //		console.log("Found previous", JSON.stringify(previous))
  }
  return previous
}

function previous_target(block) {
  return previous_target_find(block.block_cnt, block.miner_id, block)
}

function previous_target_find(block_cnt, miner_id, block) {
  if (block_cnt > blocks.length) {
    return -1;
  }
  var target = max_target;
  // console.log("block.miner_id:", block.miner_id)
  blocks.forEach(function(index) {
    var found = false;
    index.forEach(function(b) {
      // console.log("b.miner_id:", b.miner_id)
      if (b.miner_id == miner_id) {
        found = true;
        // console.log("found same miner_id")
        if (block != undefined) {
          block.label = b.label;
        }
      }
    })
    if (found) {
      target--;
    }
    // console.log("target is", target);
  })
  if (target >= 0) {
    return target;
  }
  return 0;
}

function make_block_pow(label, target, miner_id, block_cnt, last_pow) {
  var block = make_block(label, target, miner_id, block_cnt, last_pow, 0)
  block.pow = calc_pow(block, target)
  if (!verify_pow(block, target)) {
    return null;
  }
  return block;
}

function make_block(label, target, miner_id, block_cnt, last_pow, pow) {
  var block = {
    label: label,
    target: target,
    miner_id: miner_id,
    block_cnt: block_cnt,
    last_pow: last_pow,
    pow: pow
  }

  return block
}

blocks = [];

function add_block(block) {
  // console.log("Adding block: ", JSON.stringify(block))
  if (block.block_cnt > blocks.length || !block.block_cnt) {
    block.block_cnt = blocks.length;
  }
  var previous = previous_block(block);
  // console.log("previous:", JSON.stringify(previous));
  if (block.block_cnt > 0 && previous.pow === undefined) {
    alert("Non-linkable block!");
    return;
  }
  var target = previous_target(block);
  if (!verify_pow(block, target)) {
    if (!block.pow || block.pow == " ") {
      block.pow = calc_pow(block, target)
    } else {
      alert("PoW not correct for:" + JSON.stringify(block));
      return;
    }
  }
  block.target = target;
  var el1 = new joint.shapes.html.Element({
    size: {
      width: 170,
      height: 120
    },
    block: block,
    position: {
      x: block.block_cnt * 200,
      y: 0
    }
  });
  block.element = el1;
  if (blocks.length <= block.block_cnt) {
    blocks.push([])
  }
  blocks[block.block_cnt].push(block);
  graph.addCells([el1])

  if (block.block_cnt > 0) {
    var l = new joint.dia.Link({
      source: {
        id: previous.element.id
      },
      target: {
        id: el1.id
      },
      attrs: {
        '.connection': {
          'stroke-width': 5,
          stroke: '#34495E'
        }
      }
    });
    graph.addCells([l]);
  }

  update_blocks();
}

function update_blocks(block) {
  var x = 100;
  blocks.forEach(function(bs) {
    //		console.log("Searching counter")
    // shuffle blocks
    for (var i = 0; i < bs.length; i++) {
      var a = rnd_array(bs);
      var b = rnd_array(bs);
      var c = bs[a];
      bs[a] = bs[b];
      bs[b] = c;
    }
    var y = 100;
    bs.forEach(function(b) {
      b.element.position(x + 1, y);
      b.element.position(x, y);
      //			console.log("Set block", JSON.stringify(b), "to", b.element.position)
      y += 120;
    })
    x += 200;
  })
  input.position(x, 100);
}

function do_lfsr(lfsr) {
  var n = lfsr[0] + 5 * lfsr[1] + lfsr[2] + 1;
  lfsr[0] = lfsr[1] || 0;
  lfsr[1] = lfsr[2] || 0;
  lfsr[2] = (n % 10) || 0;
}

function calc_pow(block, target) {
  var lfsr = [block.miner_id % 10, block.block_cnt % 10, block.last_pow % 10];
  var i;
  for (i = 0; i < 10; i++) {
    do_lfsr(lfsr);
    if (lfsr[2] <= target) {
      break;
    }
    //		console.log(JSON.stringify(lfsr));
  }
  if (i == 10) {
    return -1;
  }
  return lfsr[0] * 100 + lfsr[1] * 10 + lfsr[2];
}

function verify_pow(block, target) {
  return calc_pow(block, target) == block.pow;
}

function rnd_array(a) {
  return Math.floor(Math.random() * a.length)
}

function seed_rand() {
  for (var i = 0; i < (new Date().getMilliseconds()) % 1000; i++) {
    Math.random();
  }
}

function start_dedis() {
  var genesis = make_block_pow('DEDIS', max_target, test_id_offset, 0, 0);
  add_block(genesis);
}

add_html();
add_html_new();
init_paper();
seed_rand();
test_id_offset = Math.floor(Math.random() * 100) + 1
