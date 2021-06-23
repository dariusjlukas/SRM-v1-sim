var RAM = [
    [0,0,0,0,0,0],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()],
    [br(),br(),br(),br(),br(),br()]
];

var MAR = [br(),br(),br(),br(),br(),br()];
var MDR = [br(),br(),br(),br(),br(),br()];
var IR = [br(),br(),br(),br(),br(),br()];
var PC = [0,0,1,0,0,0];

var running = false;
var speed = 1;


function step(){
    //Load instruction into IR
    let PC_int = six_bit_to_int(PC);
    if(PC_int >= 8){
        IR = ROM[PC_int-8].map((x) => x);
    }
    else{
        IR = RAM[PC_int].map((x) => x);
    }
    
    //Increment PC
    if(PC_int < 63){
        PC_int++
    }
    else{
        PC_int = 0;
    }
    PC = int_to_six_bit(PC_int).map((x) => x);

    //Decode instruction and execute
    switch(six_bit_to_int([0,0,0].concat(IR.slice(3,7)))) {
        case 0:
            console.log("ADD");
            MAR = (get_arg(IR)).map((x) => x);
            MDR = (add_six_bit(RAM[1], RAM[2])).map((x) => x);
            //WRITE
            write();
        break;
        case 1:
            console.log("BEZ");
            MAR = (get_arg(IR)).map((x) => x);
            //READ
            MDR = (RAM[six_bit_to_int(MAR)]).map((x) => x);
            if(six_bit_to_int(MDR) == 0){
                PC = RAM[3].map((x) => x);
            }
        break;
        case 2:
            console.log("BGE");
            MAR = (get_arg(IR)).map((x) => x);
            //READ
            MDR = (RAM[six_bit_to_int(MAR)]).map((x) => x);
            if(six_bit_to_int(MDR) >= 32){
                PC = RAM[3].map((x) => x);
            }
        break;
        case 3:
            console.log("MV");
            MAR = (RAM[3]).map((x) => x);
            //READ
            if(six_bit_to_int(MAR) < 8){
                MDR = (RAM[six_bit_to_int(MAR)]).map((x) => x);
            }
            else{
                MDR = (ROM[six_bit_to_int(MAR)-8]).map((x) => x);
            }
            
            MAR = (get_arg(IR)).map((x) => x);
            //WRITE
            write();
        break;
        case 4:
            console.log("SOA");
            MAR = [0,0,0,0,0,1].map((x) => x);
            MDR = (or_six_bit(shift_left_six_bit(RAM[1]), get_arg(IR))).map((x) => x);
            //WRITE
            write();
        break;
        case 5:
            console.log("SOD");
            MAR = [0,0,0,0,1,1].map((x) => x);
            MDR = (or_six_bit(shift_left_six_bit(RAM[3]), get_arg(IR))).map((x) => x);
            //WRITE
            write();
        break;
        case 6:
            console.log("LAI");
            MAR = [0,0,0,0,0,1].map((x) => x);
            MDR = (get_arg(IR)).map((x) => x);
            //WRITE
            write();
        break;
        case 7:
            console.log("LDI");
            MAR = [0,0,0,0,1,1].map((x) => x);
            MDR = (get_arg(IR)).map((x) => x);
            //WRITE
            write();
        break;
        default:
            console.log("Decoding Error!");
    }

    //ensure RAM address zero = 0
    RAM[0] = [0,0,0,0,0,0];

    update_display();

    if(running){
        setTimeout(step, 1000/speed);
    }
}

function on_page_load(){

    let register_table = document.getElementById("register_display");
    let RAM_table = document.getElementById("ram_display");
    let ROM_table = document.getElementById("rom_display");
    let ROM_table_2 = document.getElementById("rom_display_2");
    {
        let r = document.createElement("TR");
        r.setAttribute("id", "MAR");
        register_table.appendChild(r);
        {
            let d = document.createElement("TH");
            let t = document.createTextNode("MAR");
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "MAR_bit_" + b);
            d.bit = b;
            let t = document.createTextNode(MAR[5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }
    {
        let r = document.createElement("TR");
        r.setAttribute("id", "MDR");
        register_table.appendChild(r);
        {
            let d = document.createElement("TH");
            let t = document.createTextNode("MDR");
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "MDR_bit_" + b);
            d.bit = b;
            let t = document.createTextNode(MDR[5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }
    {
        let r = document.createElement("TR");
        r.setAttribute("id", "IR");
        register_table.appendChild(r);
        {
            let d = document.createElement("TH");
            let t = document.createTextNode("IR");
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "IR_bit_" + b);
            d.bit = b;
            let t = document.createTextNode(IR[5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }
    {
        let r = document.createElement("TR");
        r.setAttribute("id", "PC");
        register_table.appendChild(r);
        {
            let d = document.createElement("TH");
            let t = document.createTextNode("PC");
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "PC_bit_" + b);
            d.bit = b;
            let t = document.createTextNode(PC[5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }

    for(w in RAM){
        let mem_addr = parseInt(w);
        let r = document.createElement("TR");
        r.setAttribute("id", "mem_addr_"+mem_addr);
        RAM_table.appendChild(r);

        {
            let d = document.createElement("TH");
            let t = document.createTextNode("x" + mem_addr);
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "word_" + mem_addr + "_bit_" + b);
            d.w = w;
            d.bit = b;
            let t = document.createTextNode(RAM[w][5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }


    for(w in ROM){
        let mem_addr = parseInt(w)+8;
        let r = document.createElement("TR");
        r.setAttribute("id", "mem_addr_"+mem_addr);
        ROM_table.appendChild(r);

        if(w >= (ROM.length/2 - 1)){
            ROM_table = ROM_table_2;
        }

        {
            let d = document.createElement("TH");
            let t = document.createTextNode("x" + mem_addr);
            d.appendChild(t);
            r.appendChild(d);
        }
        for(b = 5; b >= 0; b--){
            let d = document.createElement("TD");
            d.setAttribute("id", "word_" + mem_addr + "_bit_" + b);
            d.w = w;
            d.bit = b;
            d.onclick = function(){
                ROM[this.w][5-this.bit] = ROM[this.w][5-this.bit] == 0 ? 1 : 0;
                this.innerHTML = ROM[this.w][5-this.bit];
                update_hash();
                highlight_memory();
            }
            let t = document.createTextNode(ROM[w][5-b]);
            d.appendChild(t);
            r.appendChild(d);
        }
    }

    load_from_hash();
    highlight_memory();
}