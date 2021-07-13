//helpful utility functions

function br() {
    let rand = Math.random();
    if (rand >= 0.5) {
        return 1;
    }
    else {
        return 0;
    }
}

function reset() {
    RAM = [
        [0, 0, 0, 0, 0, 0],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()],
        [br(), br(), br(), br(), br(), br()]
    ];

    MAR = [br(), br(), br(), br(), br(), br()];
    MDR = [br(), br(), br(), br(), br(), br()];
    IR = [br(), br(), br(), br(), br(), br()];
    PC = [0, 0, 1, 0, 0, 0];
    update_display();
}

function clear_rom_prime(){
    let confirmation = prompt("Are you sure you want to delete your program? If yes, type \"clear ROM\" into the box below, if not hit \"Cancel\".");
    if(confirmation.toLowerCase() == "clear rom"){
        clear_rom();
    }
}

function clear_rom() {
    ROM = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ]
    update_hash();
    reset();
}


function run() {
    if(running == false){
        running = true;
        document.getElementById("run_button").innerHTML = ">>>";
        step();
    }
    else{
        speed = speed * 2;
    }
}

function stop() {
    running = false;
    speed = 1;
    document.getElementById("run_button").innerHTML = "Run";
}

function compress_rom(){
    let result_arr = [];
    let mapping = [0,1,2,3,4,5,6,7];
    for(w in ROM){
        result_arr.push(mapping[six_bit_to_int([0,0,0].concat(ROM[w].slice(0,4)))]);
        result_arr.push(mapping[six_bit_to_int([0,0,0].concat(ROM[w].slice(3,7)))]);
    }
    return result_arr.join("");
}

function uncompress_rom(compressed){
    let result = [];
    let mapping = [[0,0,0], [0,0,1], [0,1,0], [0,1,1], [1,0,0], [1,0,1], [1,1,0], [1,1,1]];
    let j = 0;
    for(i = 0; i < 56; i++){
        result[i] = mapping[compressed[j]].concat(mapping[compressed[j+1]]);
        j = j + 2;
    }
    return result;
}

function update_hash() {
    location.hash = compress_rom();
}

function load_from_hash() {
    if(location.hash.length != 113){
        update_hash();
    }
    let c = location.hash.substring(1);
    ROM = uncompress_rom(c).map((x) => x);
    update_display();
}

function update_display() {
    update_reg_display();
    update_ram_display();
    update_io_display();
    update_rom_display();
    highlight_memory();
}

function get_arg(instr) {
    return [0, 0, 0].concat(instr.slice(0, 3));
}

function int_to_six_bit(n) {
    let neg = false;
    if (n < 0) {
        neg = true;
        n = n * -1;
    }
    n = n % 64; //wrap overflow
    let six_bit = [0, 0, 0, 0, 0, 0];
    let mapping = [32, 16, 8, 4, 2, 1];
    for (i = 0; i < 6; i++) {
        if (n - mapping[i] >= 0) {
            six_bit[i] = 1;
            n = n - mapping[i];
        }
    }
    if (neg) {
        for (i = 0; i < 6; i++) {
            six_bit[i] = six_bit[i] == 0 ? 1 : 0;
        }
        return add_six_bit(six_bit, [0, 0, 0, 0, 0, 1]);
    }
    else {
        return six_bit;
    }
}

function six_bit_to_int(arr) {
    return arr[5] + 2 * arr[4] + 4 * arr[3] + 8 * arr[2] + 16 * arr[1] + 32 * arr[0];
}

function add_six_bit(A, B) {
    return int_to_six_bit((six_bit_to_int(A) + six_bit_to_int(B)) % 64);
}

function not_six_bit(A) {
    let result = [0, 0, 0, 0, 0, 0];
    for (i = 0; i < 6; i++) {
        result[i] = A[i] == 0 ? 1 : 0;
    }
    return result;
}

function shift_left_six_bit(A) {
    let result = [0, 0, 0, 0, 0, 0];
    result[0] = A[3];
    result[1] = A[4];
    result[2] = A[5];
    result[3] = 0;
    result[4] = 0;
    result[5] = 0;
    return result;
}

function or_six_bit(A, B) {
    let result = [0, 0, 0, 0, 0, 0];
    for (i = 0; i < 6; i++) {
        if (A[i] == 1 || B[i] == 1) {
            result[i] = 1;
        }
    }
    return result;
}

function write() {
    RAM[six_bit_to_int(MAR)] = MDR.map((x) => x);
}

update_ram_display = function () {
    for (w = 0; w < 8; w++) {
        for (b = 5; b >= 0; b--) {
            let target_id = "word_" + w + "_bit_" + b;
            document.getElementById(target_id).innerHTML = RAM[w][5 - b];
        }
    }
}

update_io_display = function() {
    //update output display
    document.getElementById("out1_display").innerHTML = six_bit_to_int(RAM[4]);
    document.getElementById("out2_display").innerHTML = six_bit_to_int(RAM[5]);
    document.getElementById("out3_display").innerHTML = six_bit_to_int(RAM[6]);
    document.getElementById("out4_display").innerHTML = six_bit_to_int(RAM[7]);

    //update input display
    for (i = 1; i < 5; i++){
        for(b = 5; b >= 0; b--) {
            let target_id = "in" + i + "_bit" + b;
            document.getElementById(target_id).innerHTML = ROM[i+51][5-b];
        }
    }
}

update_rom_display = function () {
    for (w = 0; w < 56; w++) {
        let mem_addr = parseInt(w)+8;
        for (b = 5; b >= 0; b--) {
            let target_id = "word_" + mem_addr + "_bit_" + b;
            document.getElementById(target_id).innerHTML = ROM[w][5 - b];
        }
    }
}

function update_reg_display() {
    for (b = 5; b >= 0; b--) {
        let target_MAR = "MAR_bit_" + b;
        let target_MDR = "MDR_bit_" + b;
        let target_IR = "IR_bit_" + b;
        let target_PC = "PC_bit_" + b;
        document.getElementById(target_MAR).innerHTML = MAR[5 - b];
        document.getElementById(target_MDR).innerHTML = MDR[5 - b];
        document.getElementById(target_IR).innerHTML = IR[5 - b];
        document.getElementById(target_PC).innerHTML = PC[5 - b];
    }
}

function highlight_memory() {
    for (w = 0; w < 8; w++) {
        let mem_addr = parseInt(w);
        for (b = 5; b >= 0; b--) {
            let target = "word_" + mem_addr + "_bit_" + b;
            document.getElementById(target).className = RAM[w][5 - b] == 0 ? "zero" : "one";
        }
    }

    for (w in ROM) {
        let mem_addr = parseInt(w) + 8;
        for (b = 5; b >= 0; b--) {
            let target = "word_" + mem_addr + "_bit_" + b;
            document.getElementById(target).className = ROM[w][5 - b] == 0 ? "zero" : "one";
        }
    }

    //MAR
    for (b = 5; b >= 0; b--) {
        let target = "MAR_bit_" + b;
        document.getElementById(target).className = MAR[5 - b] == 0 ? "zero" : "one";
    }

    //MDR
    for (b = 5; b >= 0; b--) {
        let target = "MDR_bit_" + b;
        document.getElementById(target).className = MDR[5 - b] == 0 ? "zero" : "one";
    }

    //IR
    for (b = 5; b >= 0; b--) {
        let target = "IR_bit_" + b;
        document.getElementById(target).className = IR[5 - b] == 0 ? "zero" : "one";
    }

    //PC
    for (b = 5; b >= 0; b--) {
        let target = "PC_bit_" + b;
        document.getElementById(target).className = PC[5 - b] == 0 ? "zero" : "one";
    }


    let PC_int = PC[5] + 2 * PC[4] + 4 * PC[3] + 8 * PC[2] + 16 * PC[1] + 32 * PC[0];
    for (b = 5; b >= 0; b--) {
        let target = "word_" + PC_int + "_bit_" + b;
        document.getElementById(target).className = "pc_selected";
    }
}