let canvas, ctx;

const width = 700;
const height = 700;

let instances = [];

{
    canvas = document.getElementById("scene");
    ctx = canvas.getContext("2d");

    targets_count = document.getElementById("targets")
    targets_count.addEventListener("change", loadEnv, false);
    loadEnv()

    setInterval("update()", 150);
}

function loadEnv(){
    instances = []
    targets_count = document.getElementById("targets")
    instances.push(new Targets(targets_count.value));
    instances.push(new Robot());
}

function Pos(x, y){
    this.x = x;
    this.y = y;
}

function Robot(){
    this.targets = [new Pos(350, 350), new Pos(450, 350)]
    this.current_target_idx = 0

    this.position = new Pos(350, 0)

    delta_x = (this.targets[this.current_target_idx].x  - this.position.x) / 100
    delta_y = (this.targets[this.current_target_idx].y - this.position.y) / 100
    this.delta = new Pos(delta_x, delta_y)

    this.size = 15
}

Robot.prototype.draw = function(){
    ctx.fillStyle = "#08bd50";
    if (this.targets[this.current_target_idx].x - this.position.x <= this.delta.x &&
        this.targets[this.current_target_idx].y - this.position.y <= this.delta.y) {
        this.current_target_idx++
        console.log(this.targets.length - 1, this.current_target_idx)
        if (this.current_target_idx == this.targets.length) {
            this.current_target_idx = 0
            this.targets = [new Pos(350, 0)]
        }
        delta_x = (this.targets[this.current_target_idx].x  - this.position.x) / 100
        delta_y = (this.targets[this.current_target_idx].y - this.position.y) / 100
        this.delta = new Pos(delta_x, delta_y)
    }
    this.position.x = this.position.x + this.delta.x;
    this.position.y = this.position.y + this.delta.y;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
};

function Targets(count){
    this.targets = []
    this.size = 15
    for (let idx = 0; idx < count; idx++) {
        x = Math.random() * width;
        y = Math.random() * height;
        this.targets.push(new Pos(x, y))
    }
}

Targets.prototype.draw = function(){
    ctx.fillStyle = "#000000";
    this.targets.forEach(target => {
        ctx.fillRect(target.x, target.y, this.size, this.size)
    })
}

function update()
{
    ctx.clearRect(0, 0, width, height);
    instances.forEach(instance => {
        instance.draw();
    });
}